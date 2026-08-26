"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle,
} from "lucide-react";
import { SERVICES_OFFERED } from "@/lib/services-offered";

/* ─────────────────────────────────────────────
   Full tech-stack
───────────────────────────────────────────── */
const STACK = [
  { src: "/stack/gohighlevel.svg",   name: "GoHighLevel" },
  { src: "/stack/n8n.svg",           name: "n8n" },
  { src: "/stack/retell.svg",        name: "Retell AI" },
  { src: "/stack/anthropic.svg",     name: "Claude AI" },
  { src: "/stack/openai.svg",        name: "OpenAI" },
  { src: "/stack/supabase.svg",      name: "Supabase" },
  { src: "/stack/monday.svg",        name: "Monday.com" },
  { src: "/stack/salesforce.svg",    name: "Salesforce" },
  { src: "/stack/woocommerce.svg",   name: "WooCommerce" },
  { src: "/stack/slack.svg",         name: "Slack" },
  { src: "/stack/zoom.svg",          name: "Zoom" },
  { src: "/stack/x.svg",             name: "X / Twitter" },
  { src: "/stack/react.svg",         name: "React" },
  { src: "/stack/nextdotjs.svg",     name: "Next.js" },
  { src: "/stack/googleworkspace.svg", name: "Google Workspace" },
  { src: "/stack/lovable.svg",       name: "Lovable" },
  { src: "/stack/bolt.svg",          name: "Bolt" },
  { src: "/stack/veo3.svg",          name: "Veo 3" },
  { src: "/stack/kling.svg",         name: "Kling" },
  { src: "/stack/heygen.svg",        name: "HeyGen" },
  { src: "/stack/higgsfield.svg",    name: "HiggsField" },
  { src: "/stack/bananano.svg",      name: "Banana Nano" },
];

/* ─────────────────────────────────────────────
   Spinning orbit ring (full circle, CSS anim)
───────────────────────────────────────────── */
interface OrbitRingProps {
  radius: number;
  cx: number;
  cy: number;
  items: typeof STACK;
  iconSize: number;
  duration: number;   // seconds per full rotation
  clockwise?: boolean;
}

function OrbitRing({ radius, cx, cy, items, iconSize, duration, clockwise = true }: OrbitRingProps) {
  const [tooltip, setTooltip] = useState<number | null>(null);
  const count = items.length;
  const spinFwd  = clockwise  ? "orbit-cw"  : "orbit-ccw";
  const spinBack = clockwise  ? "orbit-ccw" : "orbit-cw";

  return (
    /* Spinning wrapper — rotates around its own center which is cx,cy */
    <div
      style={{
        position: "absolute",
        left: cx - radius,
        top:  cy - radius,
        width:  radius * 2,
        height: radius * 2,
        animation: `${spinFwd} ${duration}s linear infinite`,
      }}
    >
      {items.map((item, index) => {
        const angle = (index / count) * Math.PI * 2;
        /* position on circumference relative to wrapper */
        const x = radius + Math.cos(angle) * radius - iconSize / 2;
        const y = radius + Math.sin(angle) * radius - iconSize / 2;

        return (
          <div
            key={item.name}
            style={{
              position: "absolute",
              left: x,
              top:  y,
              width:  iconSize,
              height: iconSize,
              /* counter-rotate so icon stays upright */
              animation: `${spinBack} ${duration}s linear infinite`,
              zIndex: 5,
            }}
            onMouseEnter={() => setTooltip(index)}
            onMouseLeave={() => setTooltip(null)}
          >
            <div
              className="rounded-xl flex items-center justify-center"
              style={{
                width: iconSize,
                height: iconSize,
                background: "rgba(10,191,163,0.08)",
                border: `1px solid ${tooltip === index ? "rgba(10,191,163,0.55)" : "rgba(10,191,163,0.22)"}`,
                boxShadow: tooltip === index ? "0 0 18px rgba(10,191,163,0.45)" : "none",
                cursor: "pointer",
                transition: "border 0.15s, box-shadow 0.15s",
                position: "relative",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.name}
                style={{
                  width: iconSize * 0.52,
                  height: iconSize * 0.52,
                  objectFit: "contain",
                  filter: "brightness(0) invert(1)",
                }}
              />
              {tooltip === index && (
                <div
                  className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg px-3 py-1.5 text-[11px] font-semibold text-white pointer-events-none"
                  style={{ background: "#062B26", border: "1px solid rgba(10,191,163,0.3)", zIndex: 30 }}
                >
                  {item.name}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Particle physics engine
───────────────────────────────────────────── */
interface RGB { r: number; g: number; b: number }
interface Vec2 { x: number; y: number }

class Particle {
  pos: Vec2 = { x: 0, y: 0 }
  vel: Vec2 = { x: 0, y: 0 }
  acc: Vec2 = { x: 0, y: 0 }
  target: Vec2 = { x: 0, y: 0 }
  closeEnoughTarget = 80
  maxSpeed = 2.5
  maxForce = 0.12
  particleSize = 2
  isKilled = false
  startColor: RGB = { r: 10, g: 191, b: 163 }
  targetColor: RGB = { r: 10, g: 191, b: 163 }
  colorWeight = 1
  colorBlendRate = 0.022

  move() {
    const dx = this.target.x - this.pos.x
    const dy = this.target.y - this.pos.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const prox = dist < this.closeEnoughTarget ? dist / this.closeEnoughTarget : 1
    const mag = Math.sqrt(dx * dx + dy * dy) || 1
    const desired = { x: (dx / mag) * this.maxSpeed * prox, y: (dy / mag) * this.maxSpeed * prox }
    const sx = desired.x - this.vel.x
    const sy = desired.y - this.vel.y
    const sm = Math.sqrt(sx * sx + sy * sy) || 1
    this.acc.x += (sx / sm) * this.maxForce
    this.acc.y += (sy / sm) * this.maxForce
    this.vel.x += this.acc.x
    this.vel.y += this.acc.y
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    this.acc.x = 0
    this.acc.y = 0
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.colorWeight < 1) this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1)
    const r = Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight)
    const g = Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight)
    const b = Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight)
    ctx.fillStyle = `rgb(${r},${g},${b})`
    ctx.fillRect(this.pos.x, this.pos.y, this.particleSize, this.particleSize)
  }

  kill(W: number, H: number) {
    if (this.isKilled) return
    const cx = W / 2, cy = H / 2
    const angle = Math.random() * Math.PI * 2
    const radius = (W + H) / 2
    this.target.x = cx + Math.cos(angle) * radius
    this.target.y = cy + Math.sin(angle) * radius
    this.startColor = {
      r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
      g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
      b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
    }
    this.targetColor = { r: 0, g: 0, b: 0 }
    this.colorWeight = 0
    this.isKilled = true
  }
}

/* ─────────────────────────────────────────────
   Particle center — logo rendered as particles
───────────────────────────────────────────── */
const CANVAS_SIZE = 150

function ParticleCenter({ cx, cy }: { cx: number; cy: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animRef = useRef<number>(0)
  const idxRef = useRef(0)
  const [displayName, setDisplayName] = useState(STACK[0].name)
  const [nameOpacity, setNameOpacity] = useState(1)

  const switchTo = useCallback((idx: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Fade name
    setNameOpacity(0)
    setTimeout(() => {
      setDisplayName(STACK[idx].name)
      setNameOpacity(1)
    }, 320)

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const off = document.createElement("canvas")
      off.width = CANVAS_SIZE
      off.height = CANVAS_SIZE
      const ctx = off.getContext("2d")!
      const pad = 22
      ctx.drawImage(img, pad, pad, CANVAS_SIZE - pad * 2, CANVAS_SIZE - pad * 2)
      const { data } = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE)

      const coords: Vec2[] = []
      const step = 3
      for (let i = 0; i < data.length; i += step * 4) {
        if (data[i + 3] > 30) {
          coords.push({ x: (i / 4) % CANVAS_SIZE, y: Math.floor(i / 4 / CANVAS_SIZE) })
        }
      }
      // Shuffle for fluid motion
      for (let i = coords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[coords[i], coords[j]] = [coords[j], coords[i]]
      }

      const particles = particlesRef.current
      const teal: RGB = { r: 10, g: 191, b: 163 }
      let pi = 0

      for (const { x, y } of coords) {
        let p: Particle
        if (pi < particles.length) {
          p = particles[pi]
          p.isKilled = false
        } else {
          p = new Particle()
          p.pos.x = CANVAS_SIZE / 2 + (Math.random() - 0.5) * CANVAS_SIZE * 1.4
          p.pos.y = CANVAS_SIZE / 2 + (Math.random() - 0.5) * CANVAS_SIZE * 1.4
          p.maxSpeed = Math.random() * 3 + 1.5
          p.maxForce = p.maxSpeed * 0.055
          p.particleSize = Math.random() < 0.5 ? 1 : 2
          p.colorBlendRate = Math.random() * 0.025 + 0.008
          particles.push(p)
        }
        p.startColor = {
          r: Math.round(p.startColor.r + (p.targetColor.r - p.startColor.r) * p.colorWeight),
          g: Math.round(p.startColor.g + (p.targetColor.g - p.startColor.g) * p.colorWeight),
          b: Math.round(p.startColor.b + (p.targetColor.b - p.startColor.b) * p.colorWeight),
        }
        p.targetColor = teal
        p.colorWeight = 0
        p.target.x = x
        p.target.y = y
        pi++
      }
      for (let i = pi; i < particles.length; i++) particles[i].kill(CANVAS_SIZE, CANVAS_SIZE)
    }
    img.src = STACK[idx].src
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const loop = () => {
      const ctx = canvas.getContext("2d")!
      ctx.fillStyle = "rgba(0,0,0,0.13)"
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

      const particles = particlesRef.current
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.move()
        p.draw(ctx)
        if (p.isKilled && (p.pos.x < -20 || p.pos.x > CANVAS_SIZE + 20 || p.pos.y < -20 || p.pos.y > CANVAS_SIZE + 20)) {
          particles.splice(i, 1)
        }
      }
      animRef.current = requestAnimationFrame(loop)
    }

    switchTo(0)
    animRef.current = requestAnimationFrame(loop)

    const timer = setInterval(() => {
      let next: number
      do { next = Math.floor(Math.random() * STACK.length) }
      while (next === idxRef.current)
      idxRef.current = next
      switchTo(next)
    }, 1800)

    return () => {
      clearInterval(timer)
      cancelAnimationFrame(animRef.current)
    }
  }, [switchTo])

  return (
    <div
      style={{
        position: "absolute",
        left: cx,
        top: cy,
        transform: "translate(-50%, -50%)",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          borderRadius: "50%",
          overflow: "hidden",
          border: "1.5px solid rgba(10,191,163,0.4)",
          boxShadow: "0 0 28px rgba(10,191,163,0.3), 0 0 8px rgba(10,191,163,0.15) inset",
          width: CANVAS_SIZE,
          height: CANVAS_SIZE,
        }}
      >
        <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} style={{ display: "block" }} />
      </div>
      <span
        className="font-syne font-bold text-white text-center"
        style={{
          fontSize: 12,
          letterSpacing: "0.04em",
          opacity: nameOpacity,
          transition: "opacity 0.32s ease",
          whiteSpace: "nowrap",
        }}
      >
        {displayName}
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Full spinning orbit
───────────────────────────────────────────── */
function IntegrationOrbit() {
  const [width, setWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) setWidth(containerRef.current.offsetWidth);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const base     = Math.min(width * 0.92, 640);
  const cx       = base / 2;
  const cy       = base / 2;
  const iconSize = Math.max(32, base * 0.066);

  /* 22 tools across 3 rings at different speeds / directions */
  const ring1 = STACK.slice(0, 5);   // inner
  const ring2 = STACK.slice(5, 13);  // middle
  const ring3 = STACK.slice(13, 22); // outer

  return (
    <div ref={containerRef} className="w-full">
      {/* CSS keyframes injected once */}
      <style>{`
        @keyframes orbit-cw  { to { transform: rotate(360deg);  } }
        @keyframes orbit-ccw { to { transform: rotate(-360deg); } }
      `}</style>

      <div
        className="relative mx-auto"
        style={{ width: base, height: base }}
      >
        {/* Radial center glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: "15%",
            background: "radial-gradient(circle, rgba(10,191,163,0.14) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Dashed circle tracks */}
        <svg className="absolute inset-0 pointer-events-none" width={base} height={base}>
          {[0.175, 0.29, 0.42].map((r) => (
            <circle
              key={r}
              cx={cx} cy={cy}
              r={base * r}
              fill="none"
              stroke="rgba(10,191,163,0.1)"
              strokeWidth="1"
              strokeDasharray="5 8"
            />
          ))}
        </svg>

        {width > 0 && (
          <>
            {/* inner  — clockwise, fastest */}
            <OrbitRing radius={base * 0.175} cx={cx} cy={cy} items={ring1} iconSize={iconSize} duration={60}  clockwise={true}  />
            {/* middle — counter-clockwise, medium */}
            <OrbitRing radius={base * 0.29}  cx={cx} cy={cy} items={ring2} iconSize={iconSize} duration={95}  clockwise={false} />
            {/* outer  — clockwise, slowest */}
            <OrbitRing radius={base * 0.42}  cx={cx} cy={cy} items={ring3} iconSize={iconSize} duration={140} clockwise={true}  />
            <ParticleCenter cx={cx} cy={cy} />
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Services data
───────────────────────────────────────────── */
// Shared with the homepage "Our Services" panel — edit lib/services-offered.ts.
const services = SERVICES_OFFERED;

const proofPoints = [
  { metric: "$6M+", label: "client sales contributed", note: "Proto Financial" },
  { metric: "+467%", label: "increase in calls handled", note: "Digital Flo" },
  { metric: "−78%", label: "cost per acquisition drop", note: "Digital Flo" },
  { metric: "70%+", label: "automation cost cut", note: "KinnoBot — Zapier → n8n" },
  { metric: "3", label: "AI platforms in one build", note: "Southland Roofing" },
  { metric: "5", label: "AI systems per client", note: "Accelereight" },
];

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function ServicesPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">

        {/* ── Hero ── */}
        <section className="py-16 sm:py-24 bg-[#101113] border-b border-border">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="accent-bar inline-block text-[12px] font-dm font-semibold text-muted uppercase tracking-widest mb-5">
              Services
            </p>
            <h1
              className="font-syne text-body mb-6 mx-auto"
              style={{ fontSize: "clamp(38px, 6vw, 68px)", fontWeight: 800, letterSpacing: "-0.03em", maxWidth: "820px" }}
            >
              We integrate tools.
              <br />
              <span style={{ color: "#0ABFA3" }}>We build AI that works for you.</span>
            </h1>
            <p className="font-dm text-muted text-[17px] leading-relaxed max-w-2xl mx-auto mb-10">
              AKT connects the tools your business uses, automates the workflows that slow you down, and deploys AI agents as a real part of your workforce — making your business run 24/7 without extra headcount.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-[14px] font-dm font-semibold text-white"
                style={{ background: "#0ABFA3" }}
              >
                Book a Free Consultation
                <ArrowUpRight size={16} />
              </Link>
              <Link
                href="/partners"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-[14px] font-dm font-semibold border border-white/20 text-white hover:bg-white/5 transition-colors"
              >
                See Partner Results
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Integrations Orbit ── */}
        <section className="py-20 bg-black border-b border-border overflow-hidden">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="accent-bar text-[12px] font-dm font-semibold text-muted uppercase tracking-widest mb-4">
                Integrations
              </p>
              <h2
                className="font-syne text-body mb-4"
                style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, letterSpacing: "-0.02em" }}
              >
                Connect your entire stack.
              </h2>
              <p className="font-dm text-muted text-[15px] leading-relaxed max-w-xl mx-auto">
                AKT builds with the tools that power modern business — and connects them into one seamless workflow.
              </p>
            </div>

            <IntegrationOrbit />

            {/* Tool pills */}
            <div className="mt-12 flex flex-wrap justify-center gap-2">
              {STACK.map((t) => (
                <span
                  key={t.name}
                  className="text-[12px] font-dm font-semibold px-3 py-1.5 rounded-full border border-white/10 bg-[#101113] text-body"
                >
                  {t.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Services Grid ── */}
        <section id="services" className="py-20 bg-[#101113] border-b border-border">
          <div className="max-w-7xl mx-auto px-6">
            <p className="accent-bar text-[12px] font-dm font-semibold text-muted uppercase tracking-widest mb-4">
              What We Build
            </p>
            <h2
              className="font-syne text-body mb-4"
              style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, letterSpacing: "-0.02em" }}
            >
              Everything on the table.
            </h2>
            <p className="font-dm text-muted text-[15px] leading-relaxed mb-12 max-w-2xl">
              From a single GoHighLevel setup to a five-system AI ecosystem — AKT builds, integrates, and maintains it all.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((svc) => {
                const Icon = svc.icon;
                return (
                  <div
                    key={svc.title}
                    className="rounded-card border border-border bg-black p-6 flex flex-col gap-4 hover:border-[#0abfa3]/40 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#062B26] flex items-center justify-center shrink-0">
                      <Icon size={19} style={{ color: "#0ABFA3" }} strokeWidth={1.75} />
                    </div>
                    <div>
                      <h3 className="font-syne text-body text-[16px] font-bold mb-2">{svc.title}</h3>
                      <p className="text-[13px] font-dm text-muted leading-relaxed mb-3">{svc.desc}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {svc.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] font-dm font-semibold px-2.5 py-1 rounded-full border"
                            style={{ background: "#073B34", color: "#0ABFA3", borderColor: "rgba(10,191,163,0.2)" }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Proof Points ── */}
        <section className="py-20 bg-black border-b border-border">
          <div className="max-w-7xl mx-auto px-6">
            <p className="accent-bar text-[12px] font-dm font-semibold text-muted uppercase tracking-widest mb-4">
              Results
            </p>
            <h2
              className="font-syne text-body mb-12"
              style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, letterSpacing: "-0.02em" }}
            >
              Numbers from real builds.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {proofPoints.map((p) => (
                <div key={p.metric} className="rounded-card border border-border bg-[#101113] p-6">
                  <p
                    className="font-syne font-extrabold mb-1"
                    style={{ fontSize: "clamp(32px, 4vw, 46px)", color: "#0ABFA3" }}
                  >
                    {p.metric}
                  </p>
                  <p className="font-dm text-body text-[15px] font-semibold mb-1">{p.label}</p>
                  <p className="text-[12px] font-dm text-muted">{p.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How We Work ── */}
        <section className="py-20 bg-[#101113] border-b border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
              <div>
                <p className="accent-bar text-[12px] font-dm font-semibold text-muted uppercase tracking-widest mb-4">
                  Process
                </p>
                <h2
                  className="font-syne text-body mb-5"
                  style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, letterSpacing: "-0.02em" }}
                >
                  One agency. Complete capability.
                </h2>
                <p className="font-dm text-muted text-[15px] leading-relaxed mb-8">
                  AKT audits your operations, designs your stack, builds every system from scratch, connects all your tools into one pipeline, and maintains everything after launch. Custom-built. Always.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-[14px] font-dm font-semibold text-white"
                  style={{ background: "#0ABFA3" }}
                >
                  Start the Conversation
                  <ArrowUpRight size={16} />
                </Link>
              </div>
              <div className="space-y-3">
                {[
                  { n: "01", t: "Discovery & Systems Audit", d: "We map your tools, workflows, and gaps. Find what to automate and where AI belongs." },
                  { n: "02", t: "Stack Design", d: "We select the right combination of GHL, n8n, Retell AI, Claude — purpose-built for your use case." },
                  { n: "03", t: "Build & Integrate", d: "Every system built and wired together. Lead data flows automatically across every tool." },
                  { n: "04", t: "Deploy AI Workforce", d: "AI agents go live as part of your team — calls, messages, content, analytics — 24/7." },
                  { n: "05", t: "Maintain & Optimize", d: "We watch every workflow post-launch. Errors resolved before they hit operations." },
                ].map((step) => (
                  <div
                    key={step.n}
                    className="flex gap-4 items-start bg-black rounded-card border border-border px-5 py-4 hover:border-[#0abfa3]/30 transition-colors"
                  >
                    <div
                      className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-syne font-bold"
                      style={{ background: "#0ABFA3", color: "white" }}
                    >
                      {step.n}
                    </div>
                    <div>
                      <p className="font-syne text-body text-[15px] font-bold mb-0.5">{step.t}</p>
                      <p className="text-[13px] font-dm text-muted leading-relaxed">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Industries ── */}
        <section className="py-20 bg-black border-b border-border">
          <div className="max-w-7xl mx-auto px-6">
            <p className="accent-bar text-[12px] font-dm font-semibold text-muted uppercase tracking-widest mb-4">
              Industries
            </p>
            <h2
              className="font-syne text-body mb-10"
              style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, letterSpacing: "-0.02em" }}
            >
              10 industries. Real deployments.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {[
                { industry: "Financial Services / MCA", partner: "Proto Financial" },
                { industry: "Roofing & Construction", partner: "Southland Roofing" },
                { industry: "B2B Wholesale Distribution", partner: "Lucky 7 Distribution" },
                { industry: "AI Automation Agencies", partner: "Digital Flo" },
                { industry: "Real Estate", partner: "KDA Innovations" },
                { industry: "Forex / Online Education", partner: "KinnoBot" },
                { industry: "Web3 / Crypto", partner: "DadzStudio" },
                { industry: "Business Acceleration", partner: "Accelereight" },
                { industry: "Marketing Agencies", partner: "Branding561" },
                { industry: "Automotive / Dealerships", partner: "October Marketing" },
              ].map((row) => (
                <div
                  key={row.industry}
                  className="flex items-center justify-between bg-[#101113] rounded-card border border-border px-5 py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle size={14} style={{ color: "#0ABFA3" }} strokeWidth={2} className="shrink-0" />
                    <span className="text-[14px] font-dm font-medium text-body">{row.industry}</span>
                  </div>
                  <span className="text-[12px] font-dm text-muted ml-4 shrink-0">{row.partner}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 bg-[#101113]">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2
              className="font-syne text-body mb-4 mx-auto"
              style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.03em", maxWidth: "640px" }}
            >
              Ready to automate your business?
            </h2>
            <p className="font-dm text-muted text-[16px] leading-relaxed mb-8 max-w-lg mx-auto">
              Book a free consultation. We&apos;ll audit your current tools and show you exactly what AKT can build.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-[14px] font-dm font-semibold text-white"
                style={{ background: "#0ABFA3" }}
              >
                Book a Free Consultation
                <ArrowUpRight size={16} />
              </Link>
              <Link
                href="/partners"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-[14px] font-dm font-semibold border border-white/20 text-white hover:bg-white/5 transition-colors"
              >
                See Partner Results
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
