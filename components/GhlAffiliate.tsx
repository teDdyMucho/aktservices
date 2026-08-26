"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Bot,
  Calendar,
  Gift,
  Infinity as InfinityIcon,
  Megaphone,
  Percent,
  Star,
  Tag,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";

export const GHL_URL = "https://www.gohighlevel.com/?fp_ref=akt-virtual-assistant-services14";

const PLANS = [
  {
    name: "Annual",
    desc: "Link to Refer People to the HighLevel Starter OR Unlimited Annual Plans",
    url: "https://gohighlevel.com/annual?fp_ref=akt-virtual-assistant-services14",
    icon: Calendar,
  },
  {
    name: "Upgrade",
    desc: "Link for Existing Customers Who Want to Upgrade to HighLevel Pro",
    url: "https://gohighlevel.com/saasupgrade?fp_ref=akt-virtual-assistant-services14",
    icon: TrendingUp,
  },
  {
    name: "Pro",
    desc: "Link to Refer People to the HighLevel SaaS Pro Plan",
    url: "https://www.gohighlevel.com/protrial?fp_ref=akt-virtual-assistant-services14",
    icon: Star,
  },
  {
    name: "Bootcamp",
    desc: "30 Day Trial HighLevel Bootcamp",
    url: "https://www.gohighlevel.com/highlevel-bootcamp?fp_ref=akt-virtual-assistant-services14",
    icon: Zap,
  },
  {
    name: "AI",
    desc: "2026 Summer of AI Link",
    url: "https://www.gohighlevel.com/ai?fp_ref=akt-virtual-assistant-services14",
    icon: Bot,
  },
  {
    name: "Unlimited",
    desc: "Unlimited Upgrade Form Link",
    url: "https://www.gohighlevel.com/297upgrade?fp_ref=akt-virtual-assistant-services14",
    icon: InfinityIcon,
  },
  {
    name: "Offers",
    desc: "All Upgrades In-app",
    url: "https://app.gohighlevel.com/offers/affiliate-upgrade?fp_ref=akt-virtual-assistant-services14",
    icon: Tag,
  },
  {
    name: "Discount",
    desc: "June New Users Pop Up Promo Discount",
    url: "https://www.gohighlevel.com/ai/june?fp_ref=akt-virtual-assistant-services14",
    icon: Percent,
  },
  {
    name: "Promo",
    desc: "June Upgrade Existing Users Pop Up Promo",
    url: "https://app.gohighlevel.com/summer-promos?fp_ref=akt-virtual-assistant-services14",
    icon: Megaphone,
  },
];

const FREE_PLAN = {
  name: "Free",
  desc: "Free Registration",
  url: "https://www.gohighlevel.com/?fp_ref=akt-virtual-assistant-services14",
  icon: Gift,
};

/**
 * The GoHighLevel plans/offers modal. Exported so other surfaces (e.g. the
 * homepage GHL panel in HeroPanels) can open the exact same picker.
 */
export function GhlPlansModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.82)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#155E53]/50 bg-[#0b0d10] shadow-2xl shadow-black/60"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#155E53]/40 px-5 py-4">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/image/GHL.png"
                  alt="GoHighLevel"
                  className="h-7 w-auto"
                  style={{ filter: "brightness(0.85) hue-rotate(-30deg) saturate(1.4)" }}
                />
                <div>
                  <p className="font-syne text-[15px] font-bold text-white" style={{ letterSpacing: "-0.01em" }}>
                    GoHighLevel
                  </p>
                  <p className="text-[11px] font-dm text-muted">Choose a plan or offer</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-muted transition-colors hover:text-white"
              >
                <X size={15} />
              </button>
            </div>

            {/* Plan buttons grid */}
            <div className="grid grid-cols-2 gap-2.5 p-5 pb-3 sm:grid-cols-3">
              {PLANS.map((plan) => {
                const Icon = plan.icon;
                return (
                  <div key={plan.name} className="group relative">
                    {/* Tooltip */}
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2.5 w-max max-w-[180px] -translate-x-1/2 rounded-lg border border-[#155E53]/60 bg-[#050608] px-3 py-2 text-center text-[11px] font-dm leading-relaxed text-white/90 opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100">
                      {plan.desc}
                      <span className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[5px] border-x-transparent border-t-[#050608]" />
                    </div>
                    <motion.a
                      href={plan.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 380, damping: 22 }}
                      className="flex flex-col items-center gap-2 rounded-xl border border-[#155E53]/40 bg-[#062B26]/40 px-3 py-4 text-center hover:border-[#0ABFA3]/60 hover:bg-[#0ABFA3]/10"
                    >
                      <Icon size={20} style={{ color: "#0ABFA3" }} />
                      <span className="text-[12px] font-dm font-semibold text-white">{plan.name}</span>
                      <ArrowUpRight size={11} className="text-muted/50" />
                    </motion.a>
                  </div>
                );
              })}
            </div>

            {/* Free — full-width highlight button */}
            <div className="group relative px-5 pb-5">
              {/* Tooltip */}
              <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2.5 w-max max-w-[200px] -translate-x-1/2 rounded-lg border border-[#155E53]/60 bg-[#050608] px-3 py-2 text-center text-[11px] font-dm leading-relaxed text-white/90 opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100">
                {FREE_PLAN.desc}
                <span className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[5px] border-x-transparent border-t-[#050608]" />
              </div>
              <motion.a
                href={FREE_PLAN.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.035 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
                className="relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl border border-[#0ABFA3]/50 bg-gradient-to-r from-[#062B26] via-[#0ABFA3]/15 to-[#062B26] px-5 py-3.5 text-center shadow-[0_0_18px_rgba(10,191,163,0.18)]"
              >
                {/* animated glow sweep */}
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-xl bg-[#0ABFA3]/10"
                  animate={{ opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <FREE_PLAN.icon size={18} style={{ color: "#0ABFA3" }} className="relative shrink-0" />
                <span className="relative font-syne text-[14px] font-bold tracking-wide text-white">
                  {FREE_PLAN.name}
                </span>
                <ArrowUpRight size={14} className="relative text-[#0ABFA3]" />
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function GhlAffiliate() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop — floating right-side badge */}
      <div className="pointer-events-none absolute right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-1 lg:flex xl:right-12">
        {/* Enticing label + curly arrow on top */}
        <motion.div
          className="flex flex-col items-center"
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-[10px] font-dm font-bold uppercase tracking-[0.22em] text-[#0ABFA3]">
            Recommended
          </span>
          <span
            className="text-center font-syne text-[16px] font-extrabold leading-tight text-white"
            style={{ textShadow: "0 0 14px rgba(10,191,163,0.55)" }}
          >
            Try GoHighLevel <span className="text-[#7fffee]">now</span>
          </span>

          {/* curly arrow pointing down at the logo */}
          <svg width="70" height="52" viewBox="0 0 70 52" fill="none" aria-hidden="true" className="mt-1">
            <path
              d="M10 8 C 2 24, 26 18, 24 30 C 22 40, 44 30, 42 44"
              stroke="#0ABFA3" strokeWidth="2.5" strokeLinecap="round" fill="none"
            />
            <path
              d="M34 38 L43 47 L50 36"
              stroke="#0ABFA3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
            />
          </svg>
        </motion.div>

        {/* GHL logo → opens modal */}
        <motion.button
          onClick={() => setOpen(true)}
          aria-label="Try GoHighLevel now"
          className="group pointer-events-auto relative block shrink-0 cursor-pointer"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* pulsing glow halo */}
          <motion.span
            aria-hidden="true"
            className="absolute -inset-4 rounded-[2rem] bg-[#0ABFA3]/25 blur-2xl"
            animate={{ opacity: [0.55, 0.25, 0.55], scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* GHL image */}
          <span className="relative block overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/image/GHL.png"
              alt="GoHighLevel"
              className="relative block h-28 w-auto drop-shadow-[0_0_22px_rgba(10,191,163,0.5)] xl:h-32"
              style={{ filter: "brightness(0.78) hue-rotate(-30deg) saturate(1.4)" }}
            />
            <span className="pointer-events-none absolute inset-0 rounded-xl bg-[#0ABFA3]/20 mix-blend-color" />
          </span>
          {/* external-link cue */}
          <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#0ABFA3] text-white shadow-[0_0_10px_rgba(10,191,163,0.7)]">
            <ArrowUpRight size={13} strokeWidth={2.5} />
          </span>
        </motion.button>
      </div>

      {/* Mobile — top-middle of the body */}
      <div className="pointer-events-none absolute left-1/2 top-[74px] z-40 -translate-x-1/2 lg:hidden">
        <motion.button
          onClick={() => setOpen(true)}
          aria-label="Try GoHighLevel now"
          className="pointer-events-auto flex flex-col items-center cursor-pointer"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* curl arrow pointing up */}
          <svg width="52" height="50" viewBox="0 0 52 50" fill="none" aria-hidden="true" className="drop-shadow-[0_0_8px_rgba(10,191,163,0.45)]">
            <path d="M26 46 C 36 32, 16 28, 26 10" stroke="#0ABFA3" strokeWidth="2.75" strokeLinecap="round" fill="none" />
            <path d="M18 18 L26 8 L34 18" stroke="#0ABFA3" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <span
            className="mt-0.5 whitespace-nowrap font-syne text-[13px] font-extrabold text-white"
            style={{ textShadow: "0 0 12px rgba(10,191,163,0.55)" }}
          >
            Try GoHighLevel <span className="text-[#7fffee]">now</span>
          </span>
        </motion.button>
      </div>

      {/* Plans modal */}
      <GhlPlansModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
