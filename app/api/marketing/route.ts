import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MARKETING_COLUMNS, rowToAd, type MarketingRow } from "@/lib/marketing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/marketing?limit=N — published ads, newest first. Public.
 * RLS on `marketing_ads` only exposes published rows to the anon key.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(Number(searchParams.get("limit") ?? 50) || 50, 1), 100);

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("marketing_ads")
      .select(MARKETING_COLUMNS)
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) return NextResponse.json({ ads: [] });
    return NextResponse.json({ ads: (data as MarketingRow[]).map(rowToAd) });
  } catch {
    return NextResponse.json({ ads: [] });
  }
}
