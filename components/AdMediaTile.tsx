"use client";

import { useEffect, useRef } from "react";
import { Film, ImageIcon, Play } from "lucide-react";
import type { MarketingAd } from "@/lib/types/admin";

type FsVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
  webkitDisplayingFullscreen?: boolean;
};

/**
 * One fixed-size (16:9) media tile used by every ad grid.
 *
 * - The media is absolutely positioned so a portrait file can never stretch
 *   the tile — every card in a grid is the same size.
 * - Videos show a cover-cropped thumbnail + play button; pressing play always
 *   opens the video FULLSCREEN (native controls, letterboxed via the global
 *   `video:fullscreen { object-fit: contain }` rule). Leaving fullscreen stops
 *   playback and returns the tile to its thumbnail state.
 * - Images call `onOpenImage` (e.g. a lightbox) when clicked, if provided.
 */
export default function AdMediaTile({
  ad,
  onOpenImage,
  className = "",
}: {
  ad: MarketingAd;
  onOpenImage?: () => void;
  className?: string;
}) {
  const videoRef = useRef<FsVideo | null>(null);

  // Reset the video when it leaves fullscreen.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const reset = () => {
      const stillFs =
        document.fullscreenElement === v || v.webkitDisplayingFullscreen === true;
      if (stillFs) return;
      v.pause();
      v.currentTime = 0;
      v.controls = false;
      v.muted = true;
    };
    document.addEventListener("fullscreenchange", reset);
    v.addEventListener("webkitendfullscreen", reset); // iOS Safari
    return () => {
      document.removeEventListener("fullscreenchange", reset);
      v.removeEventListener("webkitendfullscreen", reset);
    };
  }, []);

  const playFullscreen = async () => {
    const v = videoRef.current;
    if (!v) return;
    v.controls = true;
    v.muted = false;
    try {
      if (v.requestFullscreen) await v.requestFullscreen();
      else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen();
    } catch {
      // Fullscreen refused (rare) — fall through and play inline with controls.
    }
    try {
      await v.play();
    } catch {
      // Autoplay blocked without sound — user can press the native play button.
    }
  };

  return (
    <div className={`relative aspect-video w-full overflow-hidden bg-black ${className}`}>
      {ad.mediaType === "video" ? (
        <>
          <video
            ref={videoRef}
            src={ad.mediaUrl}
            className="absolute inset-0 h-full w-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
          {/* Play overlay — the ONLY way to start playback, and it goes fullscreen */}
          <button
            type="button"
            onClick={playFullscreen}
            aria-label={`Play ${ad.title} fullscreen`}
            className="group/play absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/35"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-black shadow-[0_0_24px_rgba(10,191,163,0.55)] transition-transform group-hover/play:scale-110">
              <Play size={22} className="ml-0.5" fill="currentColor" />
            </span>
          </button>
        </>
      ) : onOpenImage ? (
        <button
          type="button"
          onClick={onOpenImage}
          aria-label={`Open ${ad.title}`}
          className="absolute inset-0 block cursor-zoom-in"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ad.mediaUrl} alt={ad.title} loading="lazy" className="h-full w-full object-cover" />
        </button>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={ad.mediaUrl} alt={ad.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      )}

      <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-dm font-semibold uppercase tracking-wider text-white/80 backdrop-blur">
        {ad.mediaType === "video" ? <Film size={10} /> : <ImageIcon size={10} />}
        {ad.mediaType}
      </span>
    </div>
  );
}
