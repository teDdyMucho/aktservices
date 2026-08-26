"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import AdMediaTile from "@/components/AdMediaTile";
import type { MarketingAd } from "@/lib/types/admin";

export default function MarketingAdGrid({ ads }: { ads: MarketingAd[] }) {
  const [active, setActive] = useState<MarketingAd | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ads.map((ad, i) => (
          <motion.article
            key={ad.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.04 }}
            className="neon-ring group flex flex-col"
          >
            <div className="flex flex-1 flex-col overflow-hidden rounded-[10px] bg-[#101113]">
              <AdMediaTile ad={ad} onOpenImage={() => setActive(ad)} />
              {/* Titles belong to the collection, not each ad — only show a description if one was written. */}
              {ad.description && (
                <p className="px-4 py-3 text-[13px] font-dm leading-relaxed text-muted">{ad.description}</p>
              )}
            </div>
          </motion.article>
        ))}
      </div>

      {/* Image lightbox */}
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
              <img src={active.mediaUrl} alt={active.title} className="max-h-[80vh] w-auto max-w-full rounded-lg object-contain shadow-2xl shadow-black/60" />
              {active.description && (
                <figcaption className="mt-4 max-w-xl text-center text-[13px] font-dm text-white/60">{active.description}</figcaption>
              )}
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
