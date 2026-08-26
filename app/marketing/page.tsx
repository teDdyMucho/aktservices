import DashboardShell from "@/components/DashboardShell";
import MarketingGallery from "@/components/MarketingGallery";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  FOLDER_COLUMNS,
  MARKETING_COLUMNS,
  rowToAd,
  rowToFolder,
  type FolderRow,
  type MarketingRow,
} from "@/lib/marketing";
import type { MarketingAd, MarketingFolder } from "@/lib/types/admin";

// Always render fresh so admin uploads show without a redeploy.
export const dynamic = "force-dynamic";

type Data = {
  folders: MarketingFolder[];
  adsByFolder: Record<string, MarketingAd[]>;
  loose: MarketingAd[];
};

// Published folders + published ads (RLS enforces both for the anon key).
async function getData(): Promise<Data> {
  try {
    const supabase = await createSupabaseServerClient();
    const [{ data: folderRows }, { data: adRows }] = await Promise.all([
      supabase.from("marketing_folders").select(FOLDER_COLUMNS).eq("published", true).order("created_at", { ascending: false }),
      supabase.from("marketing_ads").select(MARKETING_COLUMNS).eq("published", true).order("created_at", { ascending: false }),
    ]);

    const ads = ((adRows ?? []) as MarketingRow[]).map(rowToAd);
    const adsByFolder: Record<string, MarketingAd[]> = {};
    const loose: MarketingAd[] = [];
    for (const a of ads) {
      if (!a.folderId) loose.push(a);
      else if (a.folderSlug) (adsByFolder[a.folderId] ??= []).push(a); // folder is published
      // ads in an unpublished folder are skipped entirely
    }

    const folders = ((folderRows ?? []) as FolderRow[]).map((f) => rowToFolder(f, adsByFolder[f.id]?.length ?? 0));
    return { folders, adsByFolder, loose };
  } catch {
    return { folders: [], adsByFolder: {}, loose: [] };
  }
}

export default async function MarketingPage() {
  const data = await getData();

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
                AI voice agents, automation, and virtual assistant services. Open a collection to
                browse everything inside.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-black py-16">
          <div className="mx-auto max-w-7xl px-6">
            <MarketingGallery folders={data.folders} adsByFolder={data.adsByFolder} loose={data.loose} />
          </div>
        </section>
      </main>
    </DashboardShell>
  );
}
