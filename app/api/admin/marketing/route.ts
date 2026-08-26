import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { MARKETING_BUCKET, MARKETING_COLUMNS, rowToAd, type MarketingRow } from "@/lib/marketing";
import type { MarketingAdInput } from "@/lib/types/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/admin/marketing[?folderId=<uuid>|none] — every ad (incl. unpublished). Admin-only. */
export async function GET(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const folderId = new URL(request.url).searchParams.get("folderId");

  const admin = createSupabaseAdminClient();
  let q = admin.from("marketing_ads").select(MARKETING_COLUMNS).order("created_at", { ascending: false });
  if (folderId === "none") q = q.is("folder_id", null);
  else if (folderId) q = q.eq("folder_id", folderId);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ads: (data as MarketingRow[]).map(rowToAd) });
}

/**
 * POST /api/admin/marketing — create an ad record for a file that was already
 * uploaded to Storage (see /api/admin/marketing/upload-url). Admin-only.
 */
export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const body = (await request.json().catch(() => ({}))) as Partial<MarketingAdInput>;
  if (!body.title?.trim()) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  if (!body.storagePath || !/^ads\/[a-z0-9-]+\.[a-z0-9]+$/i.test(body.storagePath)) {
    return NextResponse.json({ error: "Invalid storage path." }, { status: 400 });
  }
  if (body.mediaType !== "image" && body.mediaType !== "video") {
    return NextResponse.json({ error: "mediaType must be image or video." }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  // Folder must exist when given.
  const folderId = body.folderId || null;
  if (folderId) {
    const { data: folder } = await admin.from("marketing_folders").select("id").eq("id", folderId).maybeSingle();
    if (!folder) return NextResponse.json({ error: "Folder not found." }, { status: 400 });
  }

  // Verify the object actually landed in the bucket before recording it.
  const folder = body.storagePath.split("/")[0];
  const name = body.storagePath.slice(folder.length + 1);
  const { data: listed, error: listErr } = await admin.storage
    .from(MARKETING_BUCKET)
    .list(folder, { search: name, limit: 1 });
  if (listErr || !listed?.some((o) => o.name === name)) {
    return NextResponse.json({ error: "Uploaded file not found in storage." }, { status: 400 });
  }

  const { data: pub } = admin.storage.from(MARKETING_BUCKET).getPublicUrl(body.storagePath);

  const { data, error } = await admin
    .from("marketing_ads")
    .insert({
      title: body.title.trim(),
      description: body.description?.trim() ?? "",
      media_url: pub.publicUrl,
      media_type: body.mediaType,
      storage_path: body.storagePath,
      folder_id: folderId,
      published: body.published ?? true,
    })
    .select(MARKETING_COLUMNS)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ad: rowToAd(data as MarketingRow) });
}
