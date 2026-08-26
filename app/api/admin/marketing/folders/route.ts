import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { FOLDER_COLUMNS, OTHER_SLUG, rowToFolder, type FolderRow } from "@/lib/marketing";
import { slugify } from "@/lib/blog";
import type { MarketingFolderInput } from "@/lib/types/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/admin/marketing/folders — every folder with its ad count. Admin-only. */
export async function GET() {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const admin = createSupabaseAdminClient();
  const [{ data: folders, error }, { data: ads }] = await Promise.all([
    admin.from("marketing_folders").select(FOLDER_COLUMNS).order("created_at", { ascending: false }),
    admin.from("marketing_ads").select("folder_id"),
  ]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const counts = new Map<string, number>();
  for (const a of (ads ?? []) as { folder_id: string | null }[]) {
    if (a.folder_id) counts.set(a.folder_id, (counts.get(a.folder_id) ?? 0) + 1);
  }

  return NextResponse.json({
    folders: (folders as FolderRow[]).map((f) => rowToFolder(f, counts.get(f.id) ?? 0)),
    unsortedCount: ((ads ?? []) as { folder_id: string | null }[]).filter((a) => !a.folder_id).length,
  });
}

/** POST /api/admin/marketing/folders — create a folder. Admin-only. */
export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const body = (await request.json().catch(() => ({}))) as Partial<MarketingFolderInput>;
  const name = body.name?.trim();
  if (!name) return NextResponse.json({ error: "Folder name is required." }, { status: 400 });

  const admin = createSupabaseAdminClient();
  const base = slugify(name) || "folder";

  // Find a free slug: base, base-2, base-3 …
  const { data: existing } = await admin
    .from("marketing_folders")
    .select("slug")
    .like("slug", `${base}%`);
  const taken = new Set((existing ?? []).map((r: { slug: string }) => r.slug));
  taken.add(OTHER_SLUG); // reserved for the public "More ads" pseudo-collection
  let slug = base;
  for (let i = 2; taken.has(slug); i++) slug = `${base}-${i}`;

  const { data, error } = await admin
    .from("marketing_folders")
    .insert({
      slug,
      name,
      description: body.description?.trim() ?? "",
      published: body.published ?? true,
    })
    .select(FOLDER_COLUMNS)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ folder: rowToFolder(data as FolderRow, 0) });
}
