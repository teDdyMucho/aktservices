"use client";

import { useEffect, useState } from "react";
import { Film, ImageIcon } from "lucide-react";
import type { MarketingAd } from "@/lib/types/admin";
import MarketingAdGrid from "@/components/MarketingAdGrid";

type Tab = "images" | "videos";

/**
 * Inside a collection, images and videos live on separate tabs. The active tab
 * is mirrored in the URL hash (#images / #videos) so the header pills and
 * shared links land on the right one.
 */
export default function MarketingFolderTabs({ imageAds, videoAds }: { imageAds: MarketingAd[]; videoAds: MarketingAd[] }) {
  const tabs: { key: Tab; label: string; icon: typeof Film; ads: MarketingAd[] }[] = [
    { key: "images", label: "Images", icon: ImageIcon, ads: imageAds },
    { key: "videos", label: "Videos", icon: Film, ads: videoAds },
  ].filter((t) => t.ads.length > 0) as { key: Tab; label: string; icon: typeof Film; ads: MarketingAd[] }[];

  const [tab, setTab] = useState<Tab>(tabs[0]?.key ?? "images");

  // Follow the hash (#images / #videos) on load and when a header pill is clicked.
  useEffect(() => {
    const sync = () => {
      const h = window.location.hash.replace("#", "") as Tab;
      if (tabs.some((t) => t.key === h)) setTab(h);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const select = (key: Tab) => {
    setTab(key);
    history.replaceState(null, "", `#${key}`);
  };

  const active = tabs.find((t) => t.key === tab) ?? tabs[0];
  if (!active) return null;

  return (
    <div>
      {/* Tab bar */}
      <div role="tablist" aria-label="Media type" className="mb-8 flex items-center gap-1 border-b border-border">
        {tabs.map((t) => {
          const Icon = t.icon;
          const on = t.key === active.key;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={on}
              onClick={() => select(t.key)}
              className={`relative -mb-px inline-flex items-center gap-2 px-4 py-3 text-[14px] font-dm font-semibold transition-colors ${
                on ? "text-[#0ABFA3]" : "text-muted hover:text-body"
              }`}
            >
              <Icon size={15} />
              {t.label}
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] ${
                  on ? "bg-[#0ABFA3]/15 text-[#0ABFA3]" : "bg-white/5 text-muted"
                }`}
              >
                {t.ads.length}
              </span>
              <span
                aria-hidden="true"
                className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full transition-colors ${on ? "bg-[#0ABFA3]" : "bg-transparent"}`}
              />
            </button>
          );
        })}
      </div>

      <div role="tabpanel" key={active.key}>
        <MarketingAdGrid ads={active.ads} />
      </div>
    </div>
  );
}
