"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Megaphone } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { GhlPlansModal } from "@/components/GhlAffiliate";
import { SERVICES_OFFERED } from "@/lib/services-offered";
import type { MarketingAd } from "@/lib/types/admin";

/**
 * Homepage hero panels — three matching cards under the AKT logo:
 *
 *   1. GoHighLevel  → opens the affiliate plans/offers picker (GhlPlansModal)
 *   2. Our Services → /services, cycles through everything in SERVICES_OFFERED
 *   3. Marketing Ads → /marketing, previews the latest uploaded ad images
 *
 * Desktop renders a wide 3-column grid (~1180px, cards ~32vh tall) with a
 * label + curly arrow above each — the panels ARE the hero, the logo sits
 * smaller behind them; mobile renders a compact 3-up row under the header.
 */

// Desktop card height — big enough to be the hero itself.
const CARD_H = "clamp(200px, 32vh, 320px)";
const ROTATE_MS = 2400;

const CURLY_ARROW = (
  <svg width="70" height="44" viewBox="0 0 70 52" fill="none" aria-hidden="true" className="mt-1">
    <path
      d="M10 8 C 2 24, 26 18, 24 30 C 22 40, 44 30, 42 44"
      stroke="#0ABFA3" strokeWidth="2.5" strokeLinecap="round" fill="none"
    />
    <path
      d="M34 38 L43 47 L50 36"
      stroke="#0ABFA3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
    />
  </svg>
);

export default function HeroPanels() {
  const [ghlOpen, setGhlOpen] = useState(false);
  const [svcIdx, setSvcIdx] = useState(0);
  const [adIdx, setAdIdx] = useState(0);
  const [ads, setAds] = useState<MarketingAd[]>([]);

  // Rotate the services label.
  useEffect(() => {
    const id = setInterval(() => setSvcIdx((i) => (i + 1) % SERVICES_OFFERED.length), ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  // Pull the latest published ad images for the marketing panel background.
  useEffect(() => {
    let active = true;
    fetch("/api/marketing?limit=8", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { ads: [] }))
      .then((d: { ads?: MarketingAd[] }) => {
        if (!active) return;
        setAds((d.ads ?? []).filter((a) => a.mediaType === "image"));
      })
      .catch(() => null);
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (ads.length < 2) return;
    const id = setInterval(() => setAdIdx((i) => (i + 1) % ads.length), ROTATE_MS + 800);
    return () => clearInterval(id);
  }, [ads.length]);

  const svc = SERVICES_OFFERED[svcIdx];
  const SvcIcon = svc.icon;
  const ad = ads.length ? ads[adIdx % ads.length] : null;

  return (
    <>
      {/* ── Desktop — row of three panels under the logo ── */}
      <div className="pointer-events-none absolute left-1/2 top-[56%] z-40 hidden w-[min(1180px,calc(100vw-48px))] -translate-x-1/2 -translate-y-1/2 grid-cols-3 items-end gap-6 lg:grid xl:gap-10">
        {/* 1 · GoHighLevel */}
        <PanelColumn eyebrow="Recommended" headline={<>Try GoHighLevel <span className="text-[#7fffee]">now</span></>}>
          <PanelCard
            as="button"
            onClick={() => setGhlOpen(true)}
            ariaLabel="Try GoHighLevel now"
            caption="affiliate offers"
          >
            <div className="flex h-full items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/image/GHL.png"
                alt="GoHighLevel"
                className="h-[45%] max-h-[150px] w-auto drop-shadow-[0_0_22px_rgba(10,191,163,0.55)]"
                style={{ filter: "brightness(0.85) hue-rotate(-30deg) saturate(1.4)" }}
              />
            </div>
          </PanelCard>
        </PanelColumn>

        {/* 2 · Our Services */}
        <PanelColumn eyebrow="Our Services" headline={<>See what <span className="text-[#7fffee]">we offer</span></>}>
          <PanelCard as="link" href="/services" ariaLabel="See our services" caption="aktservices.org">
            <div className="relative flex h-full flex-col items-center justify-center gap-0.5 overflow-hidden px-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={svcIdx}
                  className="flex flex-col items-center gap-0.5"
                  initial={{ y: 56, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -56, opacity: 0 }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="flex items-center gap-2">
                    <SvcIcon size={34} strokeWidth={2.25} style={{ color: "#0ABFA3" }} aria-hidden="true" />
                    <span
                      className="font-syne font-black leading-none"
                      style={{
                        fontSize: "clamp(40px, 4.2vw, 64px)",
                        letterSpacing: "-0.03em",
                        color: "#0ABFA3",
                        textShadow: "0 0 24px rgba(10,191,163,0.9)",
                      }}
                    >
                      {svc.short[0]}
                    </span>
                  </span>
                  <span
                    className="font-syne font-extrabold leading-none text-white"
                    style={{
                      fontSize: "clamp(20px, 2vw, 30px)",
                      letterSpacing: "-0.02em",
                      textShadow: "0 0 12px rgba(255,255,255,0.3)",
                    }}
                  >
                    {svc.short[1]}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </PanelCard>
        </PanelColumn>

        {/* 3 · Marketing Ads */}
        <PanelColumn eyebrow="Marketing" headline={<>Watch our <span className="text-[#7fffee]">ads</span></>}>
          <PanelCard as="link" href="/marketing" ariaLabel="See our marketing ads" caption="images & videos">
            {/* Latest ad image as a dimmed backdrop */}
            <AnimatePresence>
              {ad && (
                <motion.div
                  key={ad.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ad.mediaUrl} alt="" className="h-full w-full object-cover opacity-45" />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#0b2835] via-[#0b2835]/60 to-transparent" />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="relative flex h-full flex-col items-center justify-center gap-0.5">
              <span className="flex items-center gap-2">
                <Megaphone size={36} strokeWidth={2.25} style={{ color: "#0ABFA3" }} aria-hidden="true" />
                <span
                  className="font-syne font-black leading-none"
                  style={{
                    fontSize: "clamp(34px, 3.4vw, 52px)",
                    letterSpacing: "-0.03em",
                    color: "#0ABFA3",
                    textShadow: "0 0 24px rgba(10,191,163,0.9)",
                  }}
                >
                  MARKETING
                </span>
              </span>
              <span
                className="font-syne font-extrabold leading-none text-white"
                style={{ fontSize: "clamp(22px, 2.2vw, 32px)", letterSpacing: "-0.02em", textShadow: "0 0 12px rgba(255,255,255,0.3)" }}
              >
                ADS
              </span>
            </div>
          </PanelCard>
        </PanelColumn>
      </div>

      {/* ── Mobile — compact 3-up row under the header ── */}
      <div className="pointer-events-none absolute inset-x-3 top-[80px] z-40 grid grid-cols-3 gap-2 lg:hidden">
        <motion.div
          className="pointer-events-auto"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <MiniCard as="button" onClick={() => setGhlOpen(true)} ariaLabel="Try GoHighLevel now">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/image/GHL.png"
              alt="GoHighLevel"
              className="h-9 w-auto"
              style={{ filter: "brightness(0.85) hue-rotate(-30deg) saturate(1.4)" }}
            />
          </MiniCard>
        </motion.div>
        <motion.div
          className="pointer-events-auto"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        >
          <MiniCard as="link" href="/services" ariaLabel="See our services">
            <AnimatePresence mode="wait">
              <motion.div
                key={svcIdx}
                className="flex flex-col items-center"
                initial={{ y: 22, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -22, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <span
                  className="font-syne font-black leading-none"
                  style={{ fontSize: "17px", letterSpacing: "-0.03em", color: "#0ABFA3", textShadow: "0 0 14px rgba(10,191,163,0.8)" }}
                >
                  {svc.short[0]}
                </span>
                <span className="font-syne font-extrabold leading-none text-white" style={{ fontSize: "11px", letterSpacing: "-0.02em" }}>
                  {svc.short[1]}
                </span>
              </motion.div>
            </AnimatePresence>
          </MiniCard>
        </motion.div>
        <motion.div
          className="pointer-events-auto"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        >
          <MiniCard as="link" href="/marketing" ariaLabel="See our marketing ads">
            {ad && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ad.mediaUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
                <span className="absolute inset-0 bg-gradient-to-t from-[#0b2835] to-transparent" />
              </>
            )}
            <span className="relative flex flex-col items-center">
              <span className="flex items-center gap-1">
                <Megaphone size={13} style={{ color: "#0ABFA3" }} aria-hidden="true" />
                <span
                  className="font-syne font-black leading-none"
                  style={{ fontSize: "14px", letterSpacing: "-0.03em", color: "#0ABFA3", textShadow: "0 0 14px rgba(10,191,163,0.8)" }}
                >
                  MARKETING
                </span>
              </span>
              <span className="font-syne font-extrabold leading-none text-white" style={{ fontSize: "11px", letterSpacing: "-0.02em" }}>
                ADS
              </span>
            </span>
          </MiniCard>
        </motion.div>
      </div>

      <GhlPlansModal open={ghlOpen} onClose={() => setGhlOpen(false)} />
    </>
  );
}

/* ─────────────────────────── Building blocks ─────────────────────────── */

function PanelColumn({
  eyebrow,
  headline,
  children,
}: {
  eyebrow: string;
  headline: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-1">
      <motion.div
        className="flex flex-col items-center"
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[10px] font-dm font-bold uppercase tracking-[0.22em] text-[#0ABFA3]">
          {eyebrow}
        </span>
        <span
          className="text-center font-syne text-[18px] font-extrabold leading-tight text-white xl:text-[20px]"
          style={{ textShadow: "0 0 14px rgba(10,191,163,0.55)" }}
        >
          {headline}
        </span>
        {CURLY_ARROW}
      </motion.div>
      <div className="w-full">{children}</div>
    </div>
  );
}

type CardTarget =
  | { as: "link"; href: string; onClick?: never }
  | { as: "button"; onClick: () => void; href?: never };

function PanelCard({
  ariaLabel,
  caption,
  children,
  ...target
}: CardTarget & { ariaLabel: string; caption: string; children: ReactNode }) {
  const inner = (
    <>
      {/* Subtle grid background */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#0ABFA3 0.8px, transparent 0.8px), linear-gradient(90deg, #0ABFA3 0.8px, transparent 0.8px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Corner accents */}
      {[
        "top-0 left-0 border-t border-l",
        "top-0 right-0 border-t border-r",
        "bottom-0 left-0 border-b border-l",
        "bottom-0 right-0 border-b border-r",
      ].map((cls) => (
        <span key={cls} className={`pointer-events-none absolute h-6 w-6 border-[#0ABFA3]/70 ${cls}`} />
      ))}

      <div className="relative h-full">{children}</div>

      {/* Scan line */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#0ABFA3]/60 to-transparent"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
      />

      {/* Teal tint */}
      <span className="pointer-events-none absolute inset-0 rounded-2xl bg-[#0ABFA3]/8 mix-blend-color" />

      {/* Bottom caption */}
      <span className="pointer-events-none absolute bottom-3 left-0 right-0 text-center font-dm text-[11px] font-bold uppercase tracking-[0.24em] text-[#0ABFA3]/60">
        {caption}
      </span>
    </>
  );

  const style = {
    width: "100%",
    height: CARD_H,
    background: "linear-gradient(135deg, #0b2835 0%, #0d3040 50%, #0b2835 100%)",
    boxShadow: "0 0 34px rgba(10,191,163,0.45)",
  } as const;
  const cls = "relative block overflow-hidden rounded-2xl text-left";

  return (
    <motion.div
      className="pointer-events-auto relative block w-full cursor-pointer"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {/* Pulsing glow halo */}
      <motion.span
        aria-hidden="true"
        className="absolute -inset-5 rounded-[2.5rem] bg-[#0ABFA3]/25 blur-3xl"
        animate={{ opacity: [0.55, 0.25, 0.55], scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {target.as === "link" ? (
        <Link href={target.href} aria-label={ariaLabel} className={cls} style={style}>
          {inner}
        </Link>
      ) : (
        <button type="button" onClick={target.onClick} aria-label={ariaLabel} className={cls} style={style}>
          {inner}
        </button>
      )}

      {/* ArrowUpRight badge */}
      <span className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#0ABFA3] text-white shadow-[0_0_14px_rgba(10,191,163,0.7)]">
        <ArrowUpRight size={18} strokeWidth={2.5} />
      </span>
    </motion.div>
  );
}

function MiniCard({
  ariaLabel,
  children,
  ...target
}: CardTarget & { ariaLabel: string; children: ReactNode }) {
  const style = {
    height: "64px",
    background: "linear-gradient(135deg, #0b2835 0%, #0d3040 50%, #0b2835 100%)",
    boxShadow: "0 0 14px rgba(10,191,163,0.45)",
  } as const;
  const cls = "relative flex w-full items-center justify-center overflow-hidden rounded-xl";

  const inner = (
    <>
      {children}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#0ABFA3]/60 to-transparent"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
      />
      {[
        "top-0 left-0 border-t border-l",
        "top-0 right-0 border-t border-r",
        "bottom-0 left-0 border-b border-l",
        "bottom-0 right-0 border-b border-r",
      ].map((c) => (
        <span key={c} className={`pointer-events-none absolute h-3 w-3 border-[#0ABFA3]/60 ${c}`} />
      ))}
    </>
  );

  return target.as === "link" ? (
    <Link href={target.href} aria-label={ariaLabel} className={cls} style={style}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={target.onClick} aria-label={ariaLabel} className={cls} style={style}>
      {inner}
    </button>
  );
}
