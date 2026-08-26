import DashboardShell from "@/components/DashboardShell";
import MarketingGallery from "@/components/MarketingGallery";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MARKETING_COLUMNS, rowToAd, type MarketingRow } from "@/lib/marketing";
import type { MarketingAd } from "@/lib/types/admin";

// Always render fresh so admin uploads show without a redeploy.
export const dynamic = "force-dynamic";

// Published ads only (RLS enforces this for the anon key). Returns [] when empty.
async function getAds(): Promise<MarketingAd[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("marketing_ads")
      .select(MARKETING_COLUMNS)
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return (data as MarketingRow[]).map(rowToAd);
  } catch {
    return [];
  }
}

export default async function MarketingPage() {
  const ads = await getAds();

  return (
    <DashboardShell>
      <main>
        {/* Hero */}
        <section className="border-b border-border bg-[#101113] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-2xl">
              <p className="accent-bar mb-4 text-[12px] font-dm font-semibold uppercase tracking-widest text-muted">
                Marketing Ads
              </p>
              <h1
                className="mb-4 font-syne text-body"
                style={{ fontSize: "clamp(32px, 4.5vw, 48px)", fontWeight: 800, letterSpacing: "-0.03em" }}
              >
                See AKT in action
              </h1>
              <p className="text-[16px] font-dm leading-relaxed text-muted">
                Our latest promos, product videos, and campaign creatives — GoHighLevel builds,
                AI voice agents, automation, and virtual assistant services, all in one place.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-black py-16">
          <div className="mx-auto max-w-7xl px-6">
            <MarketingGallery ads={ads} />
          </div>
        </section>
      </main>
    </DashboardShell>
  );
}
