import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, CheckCircle } from "lucide-react";

const SITE_URL = "https://aktservices.org";

export const metadata: Metadata = {
  title: "EasyDrive Canada: AI Finance Qualification & Customer Automation | AKT",
  description:
    "How AKT connected EasyDrive Canada's finance application intake, GoHighLevel CRM, AI qualification with conversation memory, 4-channel follow-up with 10 recovery stages, live vehicle inventory lookup, and calendar-aware appointment booking into one automated customer journey.",
  keywords: [
    "auto finance lead qualification AI",
    "car dealership AI follow-up automation",
    "GoHighLevel auto finance CRM automation",
    "n8n email parsing to CRM",
    "AI SMS follow-up dealership",
    "vehicle inventory AI assistant",
    "AI appointment booking calendar GoHighLevel",
    "finance application parsing automation",
    "multi-channel follow-up SMS call voicemail email",
    "dealership lead automation Canada",
    "OpenAI qualification chatbot conversation memory",
    "auto finance CRM automation agency",
  ],
  alternates: { canonical: `${SITE_URL}/partners/easydrive-canada` },
  openGraph: {
    title: "EasyDrive Canada: AI-Powered Finance Qualification & Customer Automation | AKT Case Study",
    description:
      "Application intake, AI qualification, a 4-channel follow-up engine, live inventory assistant and appointment booking — connected by AKT on n8n, GoHighLevel and OpenAI.",
    type: "article",
    url: `${SITE_URL}/partners/easydrive-canada`,
    publishedTime: "2026-08-27T00:00:00Z",
    modifiedTime: "2026-08-27T00:00:00Z",
    siteName: "AKT Virtual Assistance Services",
  },
  twitter: {
    card: "summary_large_image",
    title: "EasyDrive Canada: AI Finance Qualification + Follow-Up + Booking | AKT",
    description:
      "From raw finance application email to finance-manager handoff — fully automated by AKT.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${SITE_URL}/partners/easydrive-canada#article`,
      headline: "EasyDrive Canada — AI-Powered Finance Qualification & Customer Automation",
      description:
        "AKT connected EasyDrive's finance application intake, GoHighLevel CRM, AI qualification, follow-up, vehicle inventory and appointment booking into one automated customer journey.",
      datePublished: "2026-08-27",
      dateModified: "2026-08-27",
      author: { "@type": "Organization", name: "AKT Virtual Assistance Services", url: SITE_URL },
      publisher: {
        "@type": "Organization",
        name: "AKT Virtual Assistance Services",
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/image/akt_logo.png` },
      },
      mainEntityOfPage: `${SITE_URL}/partners/easydrive-canada`,
      about: {
        "@type": "Organization",
        name: "EasyDrive Canada",
        description: "EasyDrive Canada helps Canadian customers get approved for vehicle financing and matched with the right vehicle.",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How does the application intake work?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "n8n parses EasyDrive Finance and GetGoing application emails, normalizes the applicant data, then finds or creates the matching GoHighLevel contact and updates its custom fields automatically — no manual interpretation and no duplicate records.",
          },
        },
        {
          "@type": "Question",
          name: "How does the AI qualify applicants without repeating questions?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "The qualifier reads the full conversation history (with pagination), identifies what information is still missing, asks only the next relevant question, remembers prior answers, and prepares a structured qualification summary on the opportunity card. Customer messages are kept to short, natural SMS within a 160-character limit with compliance guardrails.",
          },
        },
        {
          "@type": "Question",
          name: "What does the follow-up engine cover?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Coordinated SMS, calls, voicemail and email sequences — four channels — including ten long-term recovery stages for applicants who stop responding, so follow-up no longer depends on staff availability.",
          },
        },
        {
          "@type": "Question",
          name: "Can the AI answer vehicle questions and book appointments?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Yes. The live inventory assistant answers from internal inventory only, matching by make, model, body type and price (up to three vehicle matches) and never invents inventory or financing claims. Appointment booking checks real calendar availability, offers up to three time slots, books the selection, and triggers reminders and internal notifications.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Partners", item: `${SITE_URL}/partners` },
        { "@type": "ListItem", position: 3, name: "EasyDrive Canada Case Study", item: `${SITE_URL}/partners/easydrive-canada` },
      ],
    },
  ],
};

const systems = [
  {
    number: "01",
    title: "Application Intake",
    subtitle: "Email parsing · Data normalization · CRM mapping",
    description:
      "Finance applications arrive as emails from EasyDrive Finance and GetGoing. AKT's n8n workflow parses each email, normalizes the applicant data, and maps it to the correct GoHighLevel contact and custom fields — finding an existing record or creating a new one — so every application becomes a standardized applicant record without manual interpretation or duplicates.",
    features: [
      "Parses EasyDrive Finance & GetGoing emails",
      "Normalizes applicant data into a standard schema",
      "Finds or creates the matching GHL contact",
      "Updates custom fields automatically",
      "No manual interpretation of raw emails",
      "No incomplete or duplicated CRM records",
    ],
    tools: ["n8n", "Gmail", "GoHighLevel", "JavaScript"],
  },
  {
    number: "02",
    title: "AI Qualification",
    subtitle: "Conversation memory · Next-best question · Structured summary",
    description:
      "The AI qualifier identifies what information is still missing, asks the next relevant question, and remembers prior answers — enriched with the full conversation history and pagination — so applicants are never asked the same thing twice. It prepares a structured qualification summary for the finance team, while customer messaging stays short and natural within a 160-character SMS limit and compliance guardrails.",
    features: [
      "Detects missing information",
      "Asks only the next relevant question",
      "Full conversation history with pagination",
      "Remembers prior answers — no repetition",
      "Structured qualification summary on the opportunity card",
      "160-character SMS constraint + compliance guardrails",
    ],
    tools: ["OpenAI", "n8n", "GoHighLevel"],
  },
  {
    number: "03",
    title: "Follow-Up Engine",
    subtitle: "4 channels · 10 long-term recovery stages",
    description:
      "Coordinated SMS, call, voicemail and email sequences run automatically, including ten long-term recovery touchpoints for applicants who go quiet — so follow-up no longer relies on staff availability and non-responsive applicants are recovered instead of lost.",
    features: [
      "SMS, calls, voicemail & email — coordinated",
      "10 long-term recovery stages",
      "Automatic re-engagement of non-responsive applicants",
      "Runs without staff involvement",
      "Hands off to the finance team at the right moment",
    ],
    tools: ["GoHighLevel", "n8n"],
  },
  {
    number: "04",
    title: "Appointment Booking",
    subtitle: "Real calendar availability · Up to 3 slots · Reminders",
    description:
      "Inside the same conversation, the AI checks real calendar availability, offers up to three time slots, books the selected appointment, and triggers reminders and internal notifications — no disconnected manual scheduling step.",
    features: [
      "Live calendar availability check",
      "Offers up to three time slots",
      "Books the selected appointment",
      "Automatic reminders",
      "Internal notifications to the team",
    ],
    tools: ["Calendar APIs", "GoHighLevel", "n8n"],
  },
  {
    number: "05",
    title: "Live Inventory Assistant",
    subtitle: "Internal inventory only · Make / model / body / price",
    description:
      "Vehicle questions are answered from internal inventory only. The assistant matches by make, model, body type and price — returning up to three vehicle matches — and is constrained never to invent inventory or make financing claims, keeping every answer accurate and compliant.",
    features: [
      "Grounded in internal inventory data only",
      "Matches by make, model, body type & price",
      "Up to 3 vehicle matches per query",
      "Never invents inventory or financing claims",
      "Runs inside the AI conversation flow",
    ],
    tools: ["OpenAI", "n8n", "JavaScript"],
  },
];

const scope = [
  "Application parsing",
  "CRM sync",
  "AI qualification",
  "Conversation memory",
  "Inventory lookup",
  "Booking",
  "Reminders",
  "Multi-channel follow-up",
];

const faqs = [
  {
    q: "How does the application intake work?",
    a: "n8n parses EasyDrive Finance and GetGoing application emails, normalizes the data, then finds or creates the matching GoHighLevel contact and updates its custom fields automatically — no manual interpretation, no duplicates.",
  },
  {
    q: "How does the AI qualify applicants without repeating questions?",
    a: "It reads the full conversation history (with pagination), works out what's still missing, asks only the next relevant question, remembers prior answers, and writes a structured qualification summary to the opportunity card. Messages stay short and natural within a 160-character SMS limit with compliance guardrails.",
  },
  {
    q: "What does the follow-up engine cover?",
    a: "Coordinated SMS, calls, voicemail and email — four channels — including ten long-term recovery stages for applicants who stop responding, so follow-up no longer depends on staff availability.",
  },
  {
    q: "Can the AI answer vehicle questions and book appointments?",
    a: "Yes. The inventory assistant answers from internal stock only (make/model/body type/price, up to three matches) and never invents inventory or financing claims. Booking checks real calendar availability, offers up to three slots, books the pick, and fires reminders and internal notifications.",
  },
];

export default function EasyDrivePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />
      <main className="bg-black pt-16 text-white">
        {/* Breadcrumb */}
        <div className="border-b border-white/10 bg-[#0a0a0a]">
          <div className="mx-auto max-w-7xl px-6 py-3">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[12px] font-dm text-white/40">
              <Link href="/" className="transition-colors hover:text-white/70">Home</Link>
              <span>/</span>
              <Link href="/partners" className="transition-colors hover:text-white/70">Partners</Link>
              <span>/</span>
              <span className="text-white/65">EasyDrive Canada</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="border-b border-white/10 bg-[#101113] py-20">
          <div className="mx-auto max-w-7xl px-6">
            <Link
              href="/partners"
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white/45 transition-colors hover:text-[#7fffee]"
            >
              <ArrowLeft size={16} />
              Back to partners
            </Link>

            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <span className="mb-4 inline-flex rounded-full border border-[#0abfa3]/40 bg-[#073B34] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#7fffee]">
                  Auto Finance · AI Qualification · Customer Automation
                </span>
                <h1 className="font-syne text-[clamp(28px,4vw,48px)] font-extrabold leading-tight tracking-tight text-white">
                  EasyDrive Canada: AI-Powered{" "}
                  <span style={{ color: "#0ABFA3" }}>Finance Qualification</span> &amp; Customer Automation
                </h1>
                <p className="mt-6 text-[16px] leading-8 text-white/62">
                  AKT connected EasyDrive&apos;s finance application intake, GoHighLevel CRM, AI qualification,
                  follow-up, vehicle inventory and appointment booking into one automated customer journey — from
                  raw application email to a clean finance-manager handoff.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="inline-flex items-center rounded-full border border-white/10 px-4 py-1.5 text-[12px] font-semibold text-white/40">
                    Auto Finance · Vehicle Sales
                  </span>
                  <span className="inline-flex items-center rounded-full border border-white/10 px-4 py-1.5 text-[12px] font-semibold text-white/40">
                    Canada
                  </span>
                </div>
              </div>

              <div className="shrink-0">
                <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-white p-6 lg:w-[240px]">
                  <Image
                    src="/image/easydrive.svg"
                    alt="EasyDrive Canada logo"
                    width={200}
                    height={106}
                    className="w-full object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Metrics */}
        <section className="border-b border-white/10 py-14">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                { value: "4", label: "Follow-up channels", sub: "SMS · Calls · Voicemail · Email" },
                { value: "10", label: "Long-term follow-up stages", sub: "Recovery touchpoints for quiet applicants" },
                { value: "160", label: "Character SMS limit", sub: "Short, natural, compliant messaging" },
                { value: "3", label: "Vehicle matches max", sub: "Internal inventory only" },
              ].map((m) => (
                <div key={m.label} className="rounded-card border border-white/10 bg-[#101113] p-6">
                  <p className="font-syne text-[clamp(22px,2.6vw,34px)] font-extrabold tracking-tight" style={{ color: "#0ABFA3" }}>
                    {m.value}
                  </p>
                  <p className="mt-1 text-[14px] font-semibold text-white">{m.label}</p>
                  <p className="mt-0.5 text-[12px] text-white/40">{m.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Challenge */}
        <section className="border-b border-white/10 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:grid lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#7fffee]">The Challenge</p>
              <h2 className="font-syne text-[clamp(22px,2.5vw,30px)] font-bold tracking-tight text-white">
                From raw finance applications to a clean, actionable sales process.
              </h2>
              <div className="mt-6 space-y-4 text-[15px] leading-7 text-white/62">
                <p>
                  EasyDrive needed applicant data to be captured accurately, enriched with conversation context,
                  qualified without repetitive questions, followed up automatically, and handed to the finance team
                  at the right moment.
                </p>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">Before AKT</p>
              <div className="space-y-3">
                {[
                  ["Application emails", "Required manual interpretation"],
                  ["CRM records", "Could be incomplete or duplicated"],
                  ["Qualification", "Depended on repeated manual questioning"],
                  ["Follow-up", "Relied heavily on staff availability"],
                  ["Vehicle & booking questions", "Sat outside the conversation flow"],
                ].map(([label, state]) => (
                  <div key={label} className="rounded-lg border border-white/10 bg-[#101113] px-4 py-3">
                    <p className="text-[12px] text-white/40">{label}</p>
                    <p className="mt-0.5 text-[14px] font-semibold text-white/60">{state}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Five Systems */}
        <section className="border-b border-white/10 bg-[#101113] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#7fffee]">The Solution</p>
            <h2 className="font-syne text-[clamp(22px,2.5vw,30px)] font-bold tracking-tight text-white">
              A connected AI + CRM operating layer
            </h2>
            <p className="mt-5 max-w-3xl text-[15px] leading-7 text-white/62">
              Five connected pieces — intake, qualification, follow-up, booking and inventory — running on n8n,
              GoHighLevel and OpenAI as one customer journey.
            </p>

            <div className="mt-14 space-y-8">
              {systems.map((system) => (
                <div key={system.number} className="rounded-card border border-white/10 bg-black/30 p-8 lg:p-10">
                  <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
                    <div className="shrink-0 lg:w-[56px]">
                      <p className="font-syne text-[48px] font-extrabold leading-none tracking-tight" style={{ color: "#0ABFA3", opacity: 0.22 }}>
                        {system.number}
                      </p>
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">{system.subtitle}</div>
                      <h3 className="font-syne text-[clamp(18px,2vw,24px)] font-bold tracking-tight text-white">{system.title}</h3>
                      <p className="mt-4 text-[14px] leading-7 text-white/62">{system.description}</p>
                      <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {system.features.map((f) => (
                          <div key={f} className="flex items-start gap-3">
                            <CheckCircle size={13} className="mt-0.5 shrink-0 text-[#0abfa3]" />
                            <span className="text-[13px] leading-6 text-white/65">{f}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {system.tools.map((t) => (
                          <span key={t} className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold text-white/50">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="border-b border-white/10 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:grid lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#7fffee]">Key Outcomes</p>
              <h2 className="font-syne text-[clamp(22px,2.5vw,30px)] font-bold tracking-tight text-white">
                A cleaner handoff between automation and the finance team
              </h2>
              <ul className="mt-6 space-y-3 text-[15px] leading-7 text-white/62">
                {[
                  "Finance applications converted into standardized applicant records in GoHighLevel.",
                  "AI qualification enriched with full conversation history, pagination and structured summaries.",
                  "Customer messaging constrained to short, natural SMS while preserving compliance guardrails.",
                  "Live inventory and appointment tools routed through the AI instead of disconnected manual steps.",
                  "Internal notifications and opportunity-card summaries give the team faster context for human review.",
                ].map((r) => (
                  <li key={r} className="flex items-start gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0abfa3]" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 lg:mt-0">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">After AKT</p>
              <div className="space-y-3">
                {[
                  ["Application emails", "Parsed into structured CRM data"],
                  ["CRM records", "Found or created; custom fields updated automatically"],
                  ["Qualification", "AI uses conversation history to ask only what's still needed"],
                  ["Follow-up", "Multi-channel, automatic, across defined recovery stages"],
                  ["Vehicle & booking questions", "Inventory lookup and calendar booking inside the AI workflow"],
                ].map(([label, after]) => (
                  <div key={label} className="rounded-lg border border-[#0abfa3]/20 bg-[#062B26]/40 px-4 py-3">
                    <p className="text-[12px] text-white/40">{label}</p>
                    <p className="mt-0.5 text-[14px] font-semibold text-[#7fffee]">{after}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Core scope + Tech Stack */}
        <section className="border-b border-white/10 bg-[#101113] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#7fffee]">Core Scope</p>
            <div className="mb-14 flex flex-wrap gap-2">
              {scope.map((s) => (
                <span key={s} className="rounded-full border border-[#0abfa3]/30 bg-[#062B26]/40 px-4 py-1.5 text-[12px] font-semibold text-[#7fffee]">
                  {s}
                </span>
              ))}
            </div>

            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#7fffee]">Technology Stack</p>
            <h2 className="mb-10 font-syne text-[clamp(20px,2.5vw,28px)] font-bold tracking-tight text-white">
              The stack behind EasyDrive&apos;s customer journey
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {[
                { name: "GoHighLevel", desc: "CRM, contacts & opportunities" },
                { name: "n8n", desc: "Workflow automation backbone" },
                { name: "OpenAI", desc: "Qualification & inventory AI" },
                { name: "Gmail", desc: "Application email intake" },
                { name: "JavaScript", desc: "Parsing & normalization logic" },
                { name: "Calendar APIs", desc: "Live availability & booking" },
              ].map((tool) => (
                <div key={tool.name} className="rounded-card border border-white/10 bg-black/30 p-5 text-center">
                  <p className="font-syne text-[13px] font-bold text-white">{tool.name}</p>
                  <p className="mt-1 text-[11px] text-white/40">{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-b border-white/10 py-16">
          <div className="mx-auto max-w-4xl px-6">
            <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[#7fffee]">FAQ</p>
            <h2 className="mb-12 text-center font-syne text-[clamp(20px,2.5vw,28px)] font-bold tracking-tight text-white">
              Questions about AI finance qualification and dealership automation
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details key={faq.q} className="group rounded-card border border-white/10 bg-[#101113] p-6 open:border-[#0abfa3]/30">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                    <h3 className="font-syne text-[15px] font-bold text-white group-open:text-[#7fffee]">{faq.q}</h3>
                    <span className="mt-0.5 shrink-0 text-white/40 transition-transform duration-200 group-open:rotate-180">▾</span>
                  </summary>
                  <p className="mt-4 text-[14px] leading-7 text-white/62">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="rounded-card border p-12 text-center" style={{ background: "#062B26", borderColor: "#155E53" }}>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#7fffee]">Build a smarter lead-to-sales system</p>
              <h2 className="font-syne text-[clamp(22px,3vw,34px)] font-bold tracking-tight text-white">
                Ready to automate your customer journey from application to appointment?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-white/62">
                AKT designs AI, CRM and automation infrastructure around the way your team actually works.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-md px-7 py-3.5 text-[14px] font-bold text-white transition-colors"
                  style={{ background: "#0ABFA3" }}
                >
                  Book a Free Consultation
                  <ArrowUpRight size={16} />
                </Link>
                <Link
                  href="/partners"
                  className="inline-flex items-center gap-2 rounded-md border border-white/15 px-7 py-3.5 text-[14px] font-semibold text-white/70 transition-colors hover:border-white/30 hover:text-white"
                >
                  View All Partners
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
