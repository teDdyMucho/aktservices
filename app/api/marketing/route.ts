import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MARKETING_COLUMNS, rowToAd, type MarketingRow } from "@/lib/marketing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/marketing?limit=N[&folder=<slug>] — published ads, newest first. Public.
 * RLS on `marketing_ads` / `marketing_folders` only exposes published rows to
 * the anon key, so ads inside an unpublished folder come back without folder
 * info and are skipped here.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(Number(searchParams.get("limit") ?? 50) || 50, 1), 100);
  const folderSlug = searchParams.get("folder");

  try {
    const supabase = await createSupabaseServerClient();
    let q = supabase
      .from("marketing_ads")
      .select(MARKETING_COLUMNS)
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (folderSlug) {
      const { data: folder } = await supabase
        .from("marketing_folders")
        .select("id")
        .eq("slug", folderSlug)
        .eq("published", true)
        .maybeSingle();
      if (!folder) return NextResponse.json({ ads: [] });
      q = q.eq("folder_id", folder.id);
    }

    const { data, error } = await q;
    if (error) return NextResponse.json({ ads: [] });

    // Hide ads whose folder exists but is unpublished (join returns null then).
    const ads = (data as MarketingRow[]).map(rowToAd).filter((a) => !a.folderId || a.folderSlug);
    return NextResponse.json({ ads });
  } catch {
    return NextResponse.json({ ads: [] });
  }
}
