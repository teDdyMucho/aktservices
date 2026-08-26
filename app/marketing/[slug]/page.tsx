import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Film, ImageIcon } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import MarketingFolderTabs from "@/components/MarketingFolderTabs";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  FOLDER_COLUMNS,
  MARKETING_COLUMNS,
  OTHER_SLUG,
  rowToAd,
  rowToFolder,
  type FolderRow,
  type MarketingRow,
} from "@/lib/marketing";
import type { MarketingAd } from "@/lib/types/admin";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };
type FolderData = { name: string; description: string; ads: MarketingAd[] };

async function getFolder(slug: string): Promise<FolderData | null> {
  try {
    const supabase = await createSupabaseServerClient();

    // Pseudo-collection: every published ad that isn't in a folder.
    if (slug === OTHER_SLUG) {
      const { data: rows } = await supabase
        .from("marketing_ads")
        .select(MARKETING_COLUMNS)
        .is("folder_id", null)
        .eq("published", true)
        .order("created_at", { ascending: false });
      const ads = ((rows ?? []) as MarketingRow[]).map(rowToAd);
      if (!ads.length) return null;
      const { count } = await supabase
        .from("marketing_folders")
        .select("id", { count: "exact", head: true })
        .eq("published", true);
      return { name: count ? "More ads" : "All ads", description: "", ads };
    }

    const { data: row } = await supabase
      .from("marketing_folders")
      .select(FOLDER_COLUMNS)
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (!row) return null;

    const folder = rowToFolder(row as FolderRow);
    const { data: adRows } = await supabase
      .from("marketing_ads")
      .select(MARKETING_COLUMNS)
      .eq("folder_id", folder.id)
      .eq("published", true)
      .order("created_at", { ascending: false });

    return { name: folder.name, description: folder.description, ads: ((adRows ?? []) as MarketingRow[]).map(rowToAd) };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const data = await getFolder(slug);
  if (!data) return { title: "Marketing Ads | AKT" };
  const title = `${data.name} | Marketing Ads — AKT`;
  const description =
    data.description || `${data.ads.length} marketing ${data.ads.length === 1 ? "ad" : "ads"} from AKT Virtual Assistance Services.`;
  const cover = data.ads.find((a) => a.mediaType === "image")?.mediaUrl;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://aktservices.org/marketing/${slug}`,
      type: "website",
      ...(cover ? { images: [{ url: cover }] } : {}),
    },
    alternates: { canonical: `https://aktservices.org/marketing/${slug}` },
  };
}

export default async function MarketingFolderPage({ params }: Params) {
  const { slug } = await params;
  const data = await getFolder(slug);
  if (!data) notFound();

  const { name, description, ads } = data;
  const imageAds = ads.filter((a) => a.mediaType === "image");
  const videoAds = ads.filter((a) => a.mediaType === "video");
  const images = imageAds.length;
  const videos = videoAds.length;

  return (
    <DashboardShell>
      <main>
        {/* Header */}
        <section className="border-b border-border bg-[#101113] py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-6">
            <Link
              href="/marketing"
              className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-dm text-muted transition-colors hover:text-body"
            >
              <ArrowLeft size={14} /> All collections
            </Link>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-3xl">
                <p className="accent-bar mb-3 text-[12px] font-dm font-semibold uppercase tracking-widest text-muted">
                  Marketing Ads
                </p>
                <h1
                  className="font-syne text-body"
                  style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-0.03em" }}
                >
                  {name}
                </h1>
                {description && <p className="mt-3 text-[16px] font-dm leading-relaxed text-muted">{description}</p>}
              </div>
              <div className="flex items-center gap-2 text-[13px] font-dm font-semibold text-muted">
                {images > 0 && (
                  <a
                    href="#images"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 transition-colors hover:border-[#0ABFA3]/50 hover:text-[#0ABFA3]"
                  >
                    <ImageIcon size={13} /> {images} {images === 1 ? "image" : "images"}
                  </a>
                )}
                {videos > 0 && (
                  <a
                    href="#videos"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 transition-colors hover:border-[#0ABFA3]/50 hover:text-[#0ABFA3]"
                  >
                    <Film size={13} /> {videos} {videos === 1 ? "video" : "videos"}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-black py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-6">
            {ads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <h2 className="mb-2 font-syne text-[22px] font-bold text-body">Nothing here yet</h2>
                <p className="max-w-sm font-dm text-[15px] text-muted">This collection is empty for now. Check back soon.</p>
              </div>
            ) : (
              <MarketingFolderTabs imageAds={imageAds} videoAds={videoAds} />
            )}
          </div>
        </section>
      </main>
    </DashboardShell>
  );
}
