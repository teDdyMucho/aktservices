"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Film, Folder, ImageIcon, Megaphone, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { OTHER_SLUG, pickCover } from "@/lib/marketing";
import type { MarketingAd, MarketingFolder } from "@/lib/types/admin";

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

type Card = {
  key: string;
  href: string;
  name: string;
  description: string;
  createdAt: string;
  ads: MarketingAd[];
  cover: { url: string; type: "image" | "video" } | null;
};

/**
 * /marketing overview: one card per collection (folder). Clicking a card opens
 * /marketing/<slug>, which lists every ad inside as its own playable card.
 * Ads that aren't in a folder are grouped into a single "More ads" card.
 */
export default function MarketingGallery({
  folders,
  adsByFolder,
  loose,
}: {
  folders: MarketingFolder[];
  adsByFolder: Record<string, MarketingAd[]>;
  loose: MarketingAd[];
}) {
  const { ready, isAdmin } = useAuth();

  const cards: Card[] = folders.map((f) => {
    const ads = adsByFolder[f.id] ?? [];
    return {
      key: f.id,
      href: `/marketing/${f.slug}`,
      name: f.name,
      description: f.description,
      createdAt: f.createdAt,
      ads,
      cover: pickCover(f, ads),
    };
  });
  if (loose.length) {
    cards.push({
      key: "__other",
      href: `/marketing/${OTHER_SLUG}`,
      name: folders.length ? "More ads" : "All ads",
      description: "",
      createdAt: loose[0].createdAt,
      ads: loose,
      cover: pickCover({ coverUrl: null } as MarketingFolder, loose),
    });
  }
  const total = cards.reduce((n, c) => n + c.ads.length, 0);

  return (
    <>
      {/* Toolbar */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] font-dm text-muted">
          {cards.length} {cards.length === 1 ? "collection" : "collections"} · {total} {total === 1 ? "ad" : "ads"}
        </p>
        {ready && isAdmin && (
          <Link
            href="/admin/content/marketing"
            className="inline-flex items-center gap-1.5 rounded-md border border-[#0ABFA3]/40 px-3.5 py-2 text-[13px] font-dm font-semibold text-[#0ABFA3] transition-colors hover:bg-[#0ABFA3]/10"
          >
            <ShieldCheck size={14} /> Manage ads
          </Link>
        )}
      </div>

      {/* Empty */}
      {total === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-[#101113]">
            <Megaphone size={26} style={{ color: "#0ABFA3" }} strokeWidth={1.75} />
          </div>
          <h2 className="mb-2 font-syne text-[22px] font-bold text-body" style={{ letterSpacing: "-0.01em" }}>
            No ads yet
          </h2>
          <p className="max-w-sm font-dm text-[15px] text-muted">Ads uploaded in the admin will appear here. Check back soon.</p>
        </div>
      )}

      {/* Collection cards */}
      {cards.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => {
            const images = c.ads.filter((a) => a.mediaType === "image").length;
            const videos = c.ads.length - images;
            return (
              <motion.div
                key={c.key}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.05 }}
                className="neon-ring h-full"
              >
                <Link
                  href={c.href}
                  className="group flex h-full flex-col overflow-hidden rounded-[10px] bg-[#101113] transition-all duration-200"
                >
                  {/* Cover — not interactive; the whole card is the link */}
                  <div className="relative aspect-video overflow-hidden bg-black">
                    {c.cover ? (
                      c.cover.type === "video" ? (
                        <video
                          src={c.cover.url}
                          className="pointer-events-none h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          muted
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.cover.url}
                          alt={c.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      )
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Folder size={40} className="text-white/15" />
                      </div>
                    )}
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                    <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-dm font-semibold uppercase tracking-wider text-white/80 backdrop-blur">
                      <Folder size={10} /> Collection
                    </span>
                    <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-dm font-semibold text-white/85 backdrop-blur">
                      {images > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <ImageIcon size={11} /> {images}
                        </span>
                      )}
                      {videos > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <Film size={11} /> {videos}
                        </span>
                      )}
                    </span>
                    <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-[#0ABFA3] px-2.5 py-1 text-[11px] font-dm font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                      Open <ArrowUpRight size={11} />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-syne text-[18px] font-bold text-body transition-colors group-hover:text-[#0ABFA3]" style={{ letterSpacing: "-0.01em" }}>
                        {c.name}
                      </h3>
                      <ArrowUpRight size={18} className="mt-0.5 shrink-0 text-muted transition-colors group-hover:text-[#0ABFA3]" />
                    </div>
                    {c.description && <p className="mt-2 line-clamp-2 text-[14px] font-dm leading-relaxed text-muted">{c.description}</p>}
                    <p className="mt-auto pt-4 text-[12px] font-dm text-muted/70">
                      {c.ads.length} {c.ads.length === 1 ? "ad" : "ads"} · {dateFmt.format(new Date(c.createdAt))}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </>
  );
}
