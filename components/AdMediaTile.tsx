"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Film, ImageIcon, Play, X } from "lucide-react";
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
 * - Videos show a cover-cropped thumbnail + play button. Pressing play:
 *     · LANDSCAPE video → opens a big "full view" player overlay sized to the
 *       video's own aspect ratio (not the browser's fullscreen), with native
 *       controls. Esc / ✕ / backdrop closes it.
 *     · PORTRAIT video  → opens native FULLSCREEN (letterboxed via the global
 *       `video:fullscreen { object-fit: contain }` rule). Leaving fullscreen
 *       stops playback and returns the tile to its thumbnail.
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
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const portrait = dims ? dims.h > dims.w : false;

  // Portrait videos: reset the tile when they leave native fullscreen.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onFsChange = () => {
      const stillFs = document.fullscreenElement === v || v.webkitDisplayingFullscreen === true;
      if (stillFs) return;
      v.pause();
      v.currentTime = 0;
      v.controls = false;
      v.muted = true;
    };
    document.addEventListener("fullscreenchange", onFsChange);
    v.addEventListener("webkitendfullscreen", onFsChange); // iOS Safari
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      v.removeEventListener("webkitendfullscreen", onFsChange);
    };
  }, []);

  // Esc closes the full-view player.
  useEffect(() => {
    if (!viewerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setViewerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewerOpen]);

  const onPlayClick = async () => {
    const v = videoRef.current;
    if (!v) return;
    const isPortrait = dims ? dims.h > dims.w : v.videoWidth && v.videoHeight ? v.videoHeight > v.videoWidth : false;

    if (!isPortrait) {
      // Landscape → big full-view player (own aspect ratio, not browser fullscreen)
      setViewerOpen(true);
      return;
    }

    // Portrait → native fullscreen on the tile's own <video>
    v.controls = true;
    v.muted = false;
    try {
      if (v.requestFullscreen) await v.requestFullscreen();
      else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen();
    } catch {
      v.controls = false;
      v.muted = true;
      setViewerOpen(true); // fullscreen refused — use the full-view player instead
      return;
    }
    try {
      await v.play();
    } catch {
      // Autoplay with sound blocked — native controls are visible, user can press play.
    }
  };

  const ratio = dims ? dims.w / dims.h : 16 / 9;

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
            onLoadedMetadata={(e) => {
              const v = e.currentTarget;
              if (v.videoWidth && v.videoHeight) setDims({ w: v.videoWidth, h: v.videoHeight });
            }}
          />
          <button
            type="button"
            onClick={onPlayClick}
            aria-label={portrait ? `Play ${ad.title} fullscreen` : `Play ${ad.title}`}
            className="group/play absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/35"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-black shadow-[0_0_24px_rgba(10,191,163,0.55)] transition-transform group-hover/play:scale-110">
              <Play size={22} className="ml-0.5" fill="currentColor" />
            </span>
          </button>

          {/* Full-view player (landscape) — portaled so card overflow/transform can't clip it */}
          {typeof document !== "undefined" &&
            createPortal(
              <AnimatePresence>
                {viewerOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 p-3 backdrop-blur-sm sm:p-6"
                    onClick={() => setViewerOpen(false)}
                  >
                    <button
                      onClick={() => setViewerOpen(false)}
                      aria-label="Close"
                      className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white/80 transition-colors hover:text-white"
                    >
                      <X size={18} />
                    </button>
                    <motion.div
                      initial={{ scale: 0.96, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.96, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      onClick={(e) => e.stopPropagation()}
                      className="overflow-hidden rounded-xl bg-black shadow-2xl shadow-black/70 ring-1 ring-white/10"
                      style={{
                        aspectRatio: `${ratio}`,
                        width: `min(94vw, calc(86vh * ${ratio}))`,
                      }}
                    >
                      <video
                        src={ad.mediaUrl}
                        className="h-full w-full object-contain"
                        controls
                        autoPlay
                        playsInline
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>,
              document.body,
            )}
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
