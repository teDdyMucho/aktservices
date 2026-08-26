"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MessageCircle, Send, X } from "lucide-react";
import { Akt3DLogo } from "@/components/ui/akt-3d-logo";
import { GLSLHills } from "@/components/ui/glsl-hills";
import HeroPanels from "@/components/HeroPanels";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import Nav from "@/components/Nav";
import { useEffect, useRef, useState } from "react";
import { partnerCases } from "@/lib/partner-cases";

const aiQuestions = [
  "Need a VA?",
  "Need SEO help?",
  "Automate leads?",
  "Build voice AI?",
  "Setup GHL?",
];

type Message = { role: "user" | "assistant"; content: string; html?: string };

const WELCOME: Message = {
  role: "assistant",
  content: "Hi! I'm AKT's AI. Ask me anything about automation, voice AI, GHL builds, VA teams, or our work.",
};

const partners = partnerCases.map((p) => ({
  title: p.title,
  logo: p.logo,
  slug: p.slug,
}));

function renderContent(content: string) {
  return content.split("\n").map((line, i) => {
    const isBullet = line.startsWith("• ") || line.startsWith("- ");
    const text = isBullet ? line.slice(2) : line;
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return (
      <span key={i} className={`block${isBullet ? " flex gap-1" : ""}`}>
        {isBullet && <span>•</span>}
        <span>
          {parts.map((part, j) => {
            if (part.startsWith("**") && part.endsWith("**"))
              return <strong key={j}>{part.slice(2, -2)}</strong>;
            if (part.startsWith("*") && part.endsWith("*"))
              return <em key={j}>{part.slice(1, -1)}</em>;
            return <span key={j}>{part}</span>;
          })}
        </span>
      </span>
    );
  });
}

export default function Home() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [isEmpty, setIsEmpty] = useState(true);
  const [loading, setLoading] = useState(false);
  // Stable id so the webhook/n8n flow can keep this chat's memory.
  const [sessionId] = useState(() =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2),
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (!chatOpen) {
        setQuestionIndex((i) => (i + 1) % aiQuestions.length);
      }
    }, 5200);
    return () => window.clearInterval(interval);
  }, [chatOpen]);

  useEffect(() => {
    if (chatOpen) {
      setTimeout(() => editorRef.current?.focus(), 80);
    }
  }, [chatOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const openChat = () => {
    setMessages([WELCOME]);
    setChatOpen(true);
  };

  const closeChat = () => {
    setChatOpen(false);
    setMessages([WELCOME]);
    if (editorRef.current) editorRef.current.innerHTML = "";
    setIsEmpty(true);
  };

  const sendMessage = async () => {
    const el = editorRef.current;
    const text = el?.innerText?.trim() ?? "";
    if (!text || loading) return;

    const html = el?.innerHTML ?? text;
    const userMsg: Message = { role: "user", content: text, html };
    const next = [...messages, userMsg];
    setMessages(next);
    if (el) el.innerHTML = "";
    setIsEmpty(true);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })), sessionId }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen min-h-[100dvh] overflow-hidden bg-black text-white">
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-track { animation: marquee 28s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
        [contenteditable] b, [contenteditable] strong { font-weight: 700; }
        [contenteditable] i, [contenteditable] em { font-style: italic; }
      `}</style>

      <GLSLHills width="100%" height="100dvh" cameraZ={124} speed={0.42} color="white" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,rgba(10,191,163,0.28),rgba(10,191,163,0.06)_28%,transparent_55%)]" />

      <Nav />

      {/* Three panels — GoHighLevel · Our Services · Marketing Ads */}
      <HeroPanels />

      <div className="pointer-events-none absolute left-1/2 top-[34%] z-20 h-[min(46vw,46vh)] w-[min(46vw,46vh)] lg:top-[27%] lg:h-[min(34vw,34vh)] lg:w-[min(34vw,34vh)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0abfa3]/20 blur-3xl" />
      <Akt3DLogo className="absolute left-1/2 top-[34%] z-30 h-[min(58vw,58vh)] w-[min(68vw,68vh)] -translate-x-1/2 -translate-y-1/2 lg:top-[27%] lg:h-[min(44vw,44vh)] lg:w-[min(52vw,52vh)]" />

      {/* Card — closed: compact · open: chat panel */}
      <section
        className="absolute right-4 z-50 w-[calc(100vw-32px)] transition-all duration-300 sm:right-6"
        style={{
          bottom: "calc(112px + env(safe-area-inset-bottom))",
          maxWidth: chatOpen ? "min(420px, calc(100vw - 32px))" : "min(300px, calc(100vw - 32px))",
        }}
      >
        <div
          className="rounded-xl border border-white/15 bg-black/55 shadow-2xl shadow-[#0abfa3]/10 backdrop-blur-md transition-all duration-300"
          style={{ padding: chatOpen ? "14px" : "16px" }}
        >
          {!chatOpen ? (
            /* ── Collapsed state ── */
            <>
              <p className="font-syne text-[17px] font-bold tracking-normal text-white text-center">
                Talk to Our AIs
              </p>
              <TypewriterEffectSmooth
                key={questionIndex}
                words={[{ text: aiQuestions[questionIndex], className: "text-[#7fffee]" }]}
                className="my-2 min-h-7 justify-center drop-shadow-[0_0_12px_rgba(10,191,163,0.75)] [&_div>div]:text-sm [&_div>div]:font-bold sm:[&_div>div]:text-base"
                cursorClassName="h-5 w-[2px] bg-[#7fffee] shadow-[0_0_12px_rgba(127,255,238,0.9)] sm:h-5"
                duration={0.55}
                delay={0.05}
              />
              <button
                onClick={openChat}
                className="mt-1 w-full inline-flex items-center justify-center gap-2 rounded-md border border-white/15 bg-white px-4 py-2.5 text-sm font-bold text-black transition-colors hover:bg-[#0abfa3]"
              >
                <MessageCircle size={15} />
                Chat
              </button>
            </>
          ) : (
            /* ── Chat panel state ── */
            <>
              {/* Header */}
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#0abfa3] shadow-[0_0_6px_rgba(10,191,163,0.9)]" />
                  <span className="font-syne text-[13px] font-bold text-white">AKT AI</span>
                </div>
                <button
                  onClick={closeChat}
                  className="rounded-md p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Messages */}
              <div className="mb-3 flex h-[min(380px,50vh)] flex-col gap-2 overflow-y-auto pr-0.5 scrollbar-none">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-[88%] rounded-lg px-3 py-2 text-[12px] leading-5 ${
                      m.role === "user"
                        ? "ml-auto bg-white/10 text-white"
                        : "mr-auto bg-[#062B26] text-[#7fffee]"
                    }`}
                  >
                    {m.role === "user" && m.html
                      ? <span dangerouslySetInnerHTML={{ __html: m.html }} />
                      : renderContent(m.content)}
                  </div>
                ))}
                {loading && (
                  <div className="mr-auto flex items-center gap-1.5 rounded-lg bg-[#062B26] px-3 py-2">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="h-1.5 w-1.5 rounded-full bg-[#0abfa3] opacity-60"
                        style={{ animation: `pulse 1.2s ease-in-out ${d * 0.2}s infinite` }}
                      />
                    ))}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex items-end gap-2">
                <div className="relative min-w-0 flex-1">
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={() => {
                      const text = editorRef.current?.innerText?.trim() ?? "";
                      setIsEmpty(text === "");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
                        e.preventDefault();
                        document.execCommand("bold", false);
                      }
                      if ((e.ctrlKey || e.metaKey) && e.key === "i") {
                        e.preventDefault();
                        document.execCommand("italic", false);
                      }
                    }}
                    className="min-h-[34px] max-h-[120px] overflow-y-auto rounded-md border border-white/10 bg-white/5 px-3 py-2 text-[12px] leading-[1.4] text-white outline-none transition-colors focus:border-[#0abfa3]"
                  />
                  {isEmpty && (
                    <span className="pointer-events-none absolute left-3 top-2 select-none text-[12px] text-white/30">
                      Ask about our services…
                    </span>
                  )}
                </div>
                <button
                  onClick={sendMessage}
                  disabled={isEmpty || loading}
                  className="flex shrink-0 items-center justify-center rounded-md px-3 py-2 text-white transition-colors disabled:opacity-40"
                  style={{ background: "#0abfa3" }}
                >
                  <Send size={13} />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Bottom: CTA + Partner strip */}
      <section className="pointer-events-none absolute inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)]">

        {/* CTA row */}
        <div className="pointer-events-auto mb-4 flex flex-wrap justify-center gap-3 px-4 sm:px-6">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/80"
          >
            Book a Consultation
            <ArrowUpRight size={15} />
          </Link>
          <Link
            href="/partners"
            className="inline-flex items-center gap-2 rounded-md border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black"
          >
            Our Work
          </Link>
        </div>

        {/* Partner marquee */}
        <div className="pointer-events-auto border-t border-white/10 bg-black/70 backdrop-blur-sm">
          <p className="pt-3 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
            Trusted Partners
          </p>
          <div className="overflow-hidden py-4">
            <div className="marquee-track flex w-max items-center gap-8 sm:gap-14">
              {[...partners, ...partners].map((p, i) => (
                <Link
                  key={i}
                  href={`/partners/${p.slug}`}
                  className="group flex flex-none items-center gap-3 opacity-55 transition-opacity hover:opacity-100"
                >
                  {p.logo ? (
                    <Image
                      src={p.logo}
                      alt={p.title}
                      width={90}
                      height={45}
                      className="h-[34px] w-auto object-contain brightness-0 invert transition-all duration-200 group-hover:brightness-100 group-hover:invert-0"
                      unoptimized
                    />
                  ) : (
                    <span className="font-syne text-[15px] font-bold text-white/70 transition-colors group-hover:text-[#7fffee]">
                      {p.title}
                    </span>
                  )}
                  {p.logo && (
                    <span className="text-[13px] font-semibold text-white/40 transition-colors group-hover:text-white/70">
                      {p.title}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-black to-transparent" />
    </main>
  );
}
