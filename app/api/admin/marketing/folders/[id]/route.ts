import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { FOLDER_COLUMNS, MARKETING_BUCKET, rowToFolder, type FolderRow } from "@/lib/marketing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/** PATCH /api/admin/marketing/folders/:id — rename / describe / publish. Admin-only. */
export async function PATCH(request: Request, { params }: Params) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as {
    name?: string;
    description?: string;
    published?: boolean;
    coverUrl?: string | null;
  };

  const patch: Record<string, unknown> = {};
  if (typeof body.name === "string") {
    if (!body.name.trim()) return NextResponse.json({ error: "Folder name is required." }, { status: 400 });
    patch.name = body.name.trim();
  }
  if (typeof body.description === "string") patch.description = body.description.trim();
  if (typeof body.published === "boolean") patch.published = body.published;
  if (body.coverUrl !== undefined) patch.cover_url = body.coverUrl || null;
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("marketing_folders")
    .update(patch)
    .eq("id", id)
    .select(FOLDER_COLUMNS)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const { count } = await admin
    .from("marketing_ads")
    .select("id", { count: "exact", head: true })
    .eq("folder_id", id);

  return NextResponse.json({ folder: rowToFolder(data as FolderRow, count ?? 0) });
}

/**
 * DELETE /api/admin/marketing/folders/:id — delete the folder AND every ad
 * inside it (rows cascade; files are removed from Storage first). Admin-only.
 */
export async function DELETE(_request: Request, { params }: Params) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const admin = createSupabaseAdminClient();

  const { data: folder } = await admin.from("marketing_folders").select("id").eq("id", id).maybeSingle();
  if (!folder) return NextResponse.json({ error: "Folder not found." }, { status: 404 });

  const { data: ads } = await admin.from("marketing_ads").select("storage_path").eq("folder_id", id);
  const paths = ((ads ?? []) as { storage_path: string }[]).map((a) => a.storage_path).filter(Boolean);
  if (paths.length) {
    // Best-effort — rows are removed regardless.
    await admin.storage.from(MARKETING_BUCKET).remove(paths).catch(() => null);
  }

  const { error } = await admin.from("marketing_folders").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true, removedAds: paths.length });
}
