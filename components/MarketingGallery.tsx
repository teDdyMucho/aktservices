"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Film, ImageIcon, LayoutGrid, Megaphone, ShieldCheck, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import type { MarketingAd } from "@/lib/types/admin";

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

type Filter = "all" | "image" | "video";

/**
 * Public gallery for /marketing. Everyone sees every published ad; admins
 * additionally get a shortcut to the manager.
 */
export default function MarketingGallery({ ads }: { ads: MarketingAd[] }) {
  const { ready, isAdmin } = useAuth();
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState<MarketingAd | null>(null);

  const shown = filter === "all" ? ads : ads.filter((a) => a.mediaType === filter);
  const images = ads.filter((a) => a.mediaType === "image").length;
  const videos = ads.length - images;

  // Close the lightbox on Escape.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <>
      {/* Toolbar */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-[#101113] p-1">
          {(
            [
              { key: "all", label: "All", count: ads.length, icon: LayoutGrid },
              { key: "image", label: "Images", count: images, icon: ImageIcon },
              { key: "video", label: "Videos", count: videos, icon: Film },
            ] as const
          ).map((t) => {
            const Icon = t.icon;
            const on = filter === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-dm font-semibold transition-colors ${
                  on ? "bg-[#0ABFA3]/15 text-[#0ABFA3]" : "text-muted hover:text-body"
                }`}
              >
                <Icon size={14} />
                {t.label}
                <span className={`text-[11px] ${on ? "text-[#0ABFA3]/70" : "text-muted/60"}`}>{t.count}</span>
              </button>
            );
          })}
        </div>

        {ready && isAdmin && (
          <Link
            href="/admin/content/marketing"
            className="inline-flex items-center gap-1.5 rounded-md border border-[#0ABFA3]/40 px-3.5 py-2 text-[13px] font-dm font-semibold text-[#0ABFA3] transition-colors hover:bg-[#0ABFA3]/10"
          >
            <ShieldCheck size={14} /> Manage ads
          </Link>
        )}
      </div>

      {/* Empty state */}
      {shown.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-[#101113]">
            <Megaphone size={26} style={{ color: "#0ABFA3" }} strokeWidth={1.75} />
          </div>
          <h2 className="mb-2 font-syne text-[22px] font-bold text-body" style={{ letterSpacing: "-0.01em" }}>
            {ads.length === 0 ? "No ads yet" : `No ${filter}s yet`}
          </h2>
          <p className="max-w-sm font-dm text-[15px] text-muted">
            {ads.length === 0
              ? "Ads uploaded in the admin will appear here. Check back soon."
              : "Try another filter to see the rest of the gallery."}
          </p>
        </div>
      )}

      {/* Grid */}
      {shown.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((ad, i) => (
            <motion.article
              key={ad.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.04 }}
              className="glow-card group flex flex-col overflow-hidden rounded-card border border-border bg-[#101113] transition-all duration-200 hover:shadow-card"
            >
              <div className="relative aspect-video overflow-hidden bg-black">
                {ad.mediaType === "video" ? (
                  <video
                    src={ad.mediaUrl}
                    className="h-full w-full object-cover"
                    controls
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <button
                    onClick={() => setActive(ad)}
                    className="block h-full w-full cursor-zoom-in"
                    aria-label={`Open ${ad.title}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ad.mediaUrl}
                      alt={ad.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </button>
                )}
                <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-dm font-semibold uppercase tracking-wider text-white/80 backdrop-blur">
                  {ad.mediaType === "video" ? <Film size={10} /> : <ImageIcon size={10} />}
                  {ad.mediaType}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-syne text-[17px] font-bold text-body" style={{ letterSpacing: "-0.01em" }}>
                  {ad.title}
                </h3>
                {ad.description && (
                  <p className="mt-2 text-[14px] font-dm leading-relaxed text-muted">{ad.description}</p>
                )}
                <p className="mt-auto pt-4 text-[12px] font-dm text-muted/70">
                  {dateFmt.format(new Date(ad.createdAt))}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {/* Lightbox (images) */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <button
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white/80 transition-colors hover:text-white"
            >
              <X size={18} />
            </button>
            <motion.figure
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-full max-w-5xl flex-col items-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={active.mediaUrl}
                alt={active.title}
                className="max-h-[80vh] w-auto max-w-full rounded-lg object-contain shadow-2xl shadow-black/60"
              />
              <figcaption className="mt-4 text-center">
                <p className="font-syne text-[16px] font-bold text-white">{active.title}</p>
                {active.description && (
                  <p className="mt-1 max-w-xl text-[13px] font-dm text-white/60">{active.description}</p>
                )}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
