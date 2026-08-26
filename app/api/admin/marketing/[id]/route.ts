import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { MARKETING_BUCKET, MARKETING_COLUMNS, rowToAd, type MarketingRow } from "@/lib/marketing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/** PATCH /api/admin/marketing/:id — update title / description / published. Admin-only. */
export async function PATCH(request: Request, { params }: Params) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as {
    title?: string;
    description?: string;
    published?: boolean;
    folderId?: string | null;
  };

  const patch: Record<string, unknown> = {};
  if (body.folderId !== undefined) {
    if (body.folderId) {
      const admin = createSupabaseAdminClient();
      const { data: folder } = await admin
        .from("marketing_folders")
        .select("id")
        .eq("id", body.folderId)
        .maybeSingle();
      if (!folder) return NextResponse.json({ error: "Folder not found." }, { status: 400 });
    }
    patch.folder_id = body.folderId || null;
  }
  if (typeof body.title === "string") {
    if (!body.title.trim()) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }
    patch.title = body.title.trim();
  }
  if (typeof body.description === "string") patch.description = body.description.trim();
  if (typeof body.published === "boolean") patch.published = body.published;
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("marketing_ads")
    .update(patch)
    .eq("id", id)
    .select(MARKETING_COLUMNS)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ad: rowToAd(data as MarketingRow) });
}

/** DELETE /api/admin/marketing/:id — remove the row and its file. Admin-only. */
export async function DELETE(_request: Request, { params }: Params) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const admin = createSupabaseAdminClient();

  const { data: row, error: readErr } = await admin
    .from("marketing_ads")
    .select("id, storage_path")
    .eq("id", id)
    .single();
  if (readErr || !row) return NextResponse.json({ error: "Ad not found." }, { status: 404 });

  const { error } = await admin.from("marketing_ads").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Best-effort file cleanup — the row is already gone, so don't fail on this.
  if (row.storage_path) {
    await admin.storage.from(MARKETING_BUCKET).remove([row.storage_path]).catch(() => null);
  }

  return NextResponse.json({ ok: true });
}
