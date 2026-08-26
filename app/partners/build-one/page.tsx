import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, CheckCircle } from "lucide-react";

const SITE_URL = "https://aktservices.org";

export const metadata: Metadata = {
  title: "Build One: Operating Dashboard, CRM & AI Lead Qualification | AKT",
  description:
    "How AKT built Build One's connected operating dashboard, GoHighLevel CRM, and 'Oliver' AI lead qualification system — seven dashboard views, a shared Project Scheduler, Bronze–Platinum lead scoring in n8n, and live Xero, Wunderbuild, and Supabase integrations for a design & construction business.",
  keywords: [
    "construction operations dashboard GoHighLevel",
    "AI lead qualification construction company",
    "n8n AI lead scoring GoHighLevel",
    "Xero live financial dashboard integration",
    "Wunderbuild GoHighLevel integration",
    "Supabase project database construction",
    "construction CRM automation agency",
    "builder lead qualification chatbot",
    "GoHighLevel pipeline forecasting dashboard",
    "project scheduler milestones trade scheduling",
    "Bronze Silver Gold Platinum lead scoring",
    "construction company automation Australia",
  ],
  alternates: {
    canonical: `${SITE_URL}/partners/build-one`,
  },
  openGraph: {
    title: "Build One: Connected Operating Dashboard, CRM & AI Lead Qualification | AKT Case Study",
    description:
      "AKT designed and deployed one operating layer for Build One — a seven-view dashboard, GoHighLevel CRM with lead capture and nurture, Oliver AI lead qualification, and live Xero, Wunderbuild, and Supabase integrations.",
    type: "article",
    url: `${SITE_URL}/partners/build-one`,
    publishedTime: "2026-08-27T00:00:00Z",
    modifiedTime: "2026-08-27T00:00:00Z",
    siteName: "AKT Virtual Assistance Services",
  },
  twitter: {
    card: "summary_large_image",
    title: "Build One: Operating Dashboard + CRM + AI Lead Qualification | AKT",
    description:
      "Seven dashboard views, GoHighLevel CRM, Oliver AI scoring leads Bronze to Platinum, and live Xero/Wunderbuild/Supabase data — built by AKT for Build One.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${SITE_URL}/partners/build-one#article`,
      headline:
        "How AKT Built Build One's Connected Operating Dashboard, CRM & AI Lead Qualification System",
      description:
        "Build One needed one operating layer for projects, financial visibility, contacts, lead qualification, pipeline management, and follow-up. AKT designed and deployed a connected system spanning the operating dashboard, GoHighLevel CRM, n8n AI workflows, Xero, Wunderbuild, and a shared Supabase database.",
      datePublished: "2026-08-27",
      dateModified: "2026-08-27",
      author: { "@type": "Organization", name: "AKT Virtual Assistance Services", url: SITE_URL },
      publisher: {
        "@type": "Organization",
        name: "AKT Virtual Assistance Services",
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/image/akt_logo.png` },
      },
      mainEntityOfPage: `${SITE_URL}/partners/build-one`,
      about: {
        "@type": "Organization",
        name: "Build One Design & Construction",
        description:
          "Build One is a design and construction company that needed a single operating layer for projects, financials, contacts, lead qualification, pipeline, and follow-up.",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What does Build One's operating dashboard show?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Seven responsive views covering projects, timelines, meetings, tenders, lead conversion, pipeline forecasting, and business performance — plus a shared Project Scheduler with milestones, trade scheduling, notes, backup/restore, and centralized project data. Xero, GoHighLevel, and Wunderbuild data are viewable inside the dashboard instead of separate systems.",
          },
        },
        {
          "@type": "Question",
          name: "How does Oliver AI lead qualification work?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Oliver is a conversational AI qualification workflow built in n8n and GoHighLevel. It uses project type, budget, timeline, location, readiness, and discovery answers to generate a structured score, lead category (Bronze, Silver, Gold, or Platinum), tags, risk flags, a summary, routing, and a recommended action. Scores and summaries surface directly on the GoHighLevel opportunity card.",
          },
        },
        {
          "@type": "Question",
          name: "What happens to Gold and Platinum leads?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Gold and Platinum opportunities automatically create a high-priority 'Follow up within 24 hours' task and an internal sales notification, triggering prioritized human follow-up. Bronze and Silver leads follow automated SMS and email nurture paths.",
          },
        },
        {
          "@type": "Question",
          name: "Which systems are connected in Build One's stack?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Xero for live revenue, margin, and cash flow; Wunderbuild for client contacts; GoHighLevel for pipeline, contacts, and meetings; and Supabase as the central project database. The site runs on Squarespace with the dashboard deployed on Netlify, and AI workflows run on n8n with OpenAI.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Partners", item: `${SITE_URL}/partners` },
        { "@type": "ListItem", position: 3, name: "Build One Case Study", item: `${SITE_URL}/partners/build-one` },
      ],
    },
  ],
};

const systems = [
  {
    number: "01",
    title: "Operating Dashboard",
    subtitle: "7 views · Project Scheduler · Central project data",
    description:
      "AKT built seven responsive views covering projects, timelines, meetings, tenders, lead conversion, pipeline forecasting, and business performance — one place for operations and sales to see the state of the business. A shared Project Scheduler adds milestones, trade scheduling, notes, and backup/restore on top of centralized project data, so scheduling and project records share one source of truth.",
    features: [
      "Projects, timelines & meetings views",
      "Tenders and lead conversion funnel",
      "Pipeline forecasting",
      "Business performance view",
      "Shared Project Scheduler with milestones",
      "Trade scheduling and project notes",
      "Backup / restore of schedule data",
      "Fully responsive — desktop, tablet, mobile",
    ],
    tools: ["Custom Dashboard", "Supabase", "Netlify"],
  },
  {
    number: "02",
    title: "CRM & Lead Capture",
    subtitle: "GoHighLevel · Website enquiries · Nurture & appointments",
    description:
      "Website enquiries from the Squarespace site flow straight into GoHighLevel. AKT built the sales pipeline, two-stage qualification forms, custom fields, SMS and email nurture sequences, appointment confirmation and reminder workflows, internal notifications, and automated follow-up for qualified opportunities — so every enquiry gets a consistent, structured journey.",
    features: [
      "Website-to-GHL lead capture",
      "Sales pipeline with custom fields",
      "Two-stage qualification forms",
      "SMS & email nurture sequences",
      "Appointment confirmations & reminders",
      "Internal sales notifications",
      "Automated follow-up for qualified opportunities",
      "Contacts and meetings synced to the dashboard",
    ],
    tools: ["GoHighLevel", "Squarespace", "SMS & Email Automation"],
  },
  {
    number: "03",
    title: "Oliver AI Lead Qualification",
    subtitle: "n8n + GHL · Bronze · Silver · Gold · Platinum",
    description:
      "Oliver is a conversational AI qualification workflow built in n8n and GoHighLevel. Using project type, budget, timeline, location, readiness, and discovery answers, it generates a structured score, lead category, tags, risk flags, a summary, routing, and a recommended action. Scores and summaries land directly on the GoHighLevel opportunity card. Bronze and Silver leads follow automated nurture paths; Gold and Platinum leads trigger a high-priority “Follow up within 24 hours” task and an internal sales notification.",
    features: [
      "Conversational AI chatbot (Oliver)",
      "Structured scoring from discovery answers",
      "Bronze / Silver / Gold / Platinum lead bands",
      "Tags, risk flags & AI summary on the opportunity card",
      "Routing and recommended next action",
      "Automated nurture for Bronze & Silver",
      "24-hour priority task for Gold & Platinum",
      "Internal sales alerts for hot leads",
    ],
    tools: ["n8n", "OpenAI", "GoHighLevel"],
  },
  {
    number: "04",
    title: "Live Integrations & Shared Data",
    subtitle: "Xero · Wunderbuild · GoHighLevel · Supabase",
    description:
      "AKT connected Xero for live revenue, margin, and cash flow; Wunderbuild for client contacts; GoHighLevel for pipeline, contacts, and meetings; and Supabase as the central project database shared across the team. Sample data was removed as each live integration came online, so the dashboard reflects real business data instead of separate systems.",
    features: [
      "Xero — live revenue, margin & cash flow",
      "Wunderbuild — client contact integration",
      "GoHighLevel — pipeline, contacts & meetings",
      "Supabase — central project database",
      "Financials surfaced in the operating view",
      "Sample data retired as live feeds went online",
    ],
    tools: ["Xero", "Wunderbuild", "GoHighLevel", "Supabase"],
  },
];

const scope = [
  "Responsive operating dashboard",
  "Project Scheduler & milestones",
  "Lead conversion funnel",
  "Pipeline forecasting",
  "Live Xero financial reporting",
  "Wunderbuild contact integration",
  "Supabase project database",
  "Website-to-GHL lead capture",
  "Two-stage qualification forms",
  "Oliver AI chatbot",
  "AI scoring & summaries",
  "Bronze–Silver–Gold–Platinum routing",
  "SMS & email nurture",
  "Appointment confirmations & reminders",
  "Internal sales notifications",
];

const faqs = [
  {
    q: "What does Build One's operating dashboard show?",
    a: "Seven responsive views — projects, timelines, meetings, tenders, lead conversion, pipeline forecasting, and business performance — plus a shared Project Scheduler with milestones, trade scheduling, notes, and backup/restore. Xero, GoHighLevel, and Wunderbuild data are viewable inside the dashboard instead of separate systems.",
  },
  {
    q: "How does Oliver AI lead qualification work?",
    a: "Oliver is a conversational AI workflow in n8n and GoHighLevel. From project type, budget, timeline, location, readiness, and discovery answers it generates a structured score, a Bronze/Silver/Gold/Platinum category, tags, risk flags, a summary, routing, and a recommended action — all surfaced on the GHL opportunity card.",
  },
  {
    q: "What happens to Gold and Platinum leads?",
    a: "They automatically create a high-priority “Follow up within 24 hours” task and an internal sales notification, so a human follows up fast. Bronze and Silver leads run through automated SMS and email nurture paths instead.",
  },
  {
    q: "Which systems are connected?",
    a: "Xero (live revenue, margin, cash flow), Wunderbuild (client contacts), GoHighLevel (pipeline, contacts, meetings), and Supabase (central project database). The website runs on Squarespace, the dashboard on Netlify, and AI workflows on n8n with OpenAI.",
  },
];

export default function BuildOnePage() {
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
              <span className="text-white/65">Build One</span>
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
                  Construction Operations · CRM · AI Automation
                </span>
                <h1 className="font-syne text-[clamp(28px,4vw,48px)] font-extrabold leading-tight tracking-tight text-white">
                  How AKT Built Build One&apos;s Connected Operating Dashboard, CRM &amp;{" "}
                  <span style={{ color: "#0ABFA3" }}>AI Lead Qualification</span> System
                </h1>
                <p className="mt-6 text-[16px] leading-8 text-white/62">
                  Build One needed one operating layer for projects, financial visibility, contacts, lead
                  qualification, pipeline management, and follow-up. AKT designed and deployed a connected system
                  spanning the operating dashboard, GoHighLevel CRM, n8n AI workflows, Xero, Wunderbuild, and a
                  shared Supabase database.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="inline-flex items-center rounded-full border border-white/10 px-4 py-1.5 text-[12px] font-semibold text-white/40">
                    Design &amp; Construction
                  </span>
                  <span className="inline-flex items-center rounded-full border border-white/10 px-4 py-1.5 text-[12px] font-semibold text-white/40">
                    Australia
                  </span>
                </div>
              </div>

              <div className="shrink-0">
                <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-[#0d0d0f] p-8 lg:w-[260px]">
                  <Image
                    src="/image/buildone.svg"
                    alt="Build One Design & Construction logo"
                    width={220}
                    height={54}
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
                { value: "7", label: "Core dashboard views", sub: "Built for operations and sales" },
                { value: "4", label: "AI lead bands", sub: "Bronze · Silver · Gold · Platinum" },
                { value: "3", label: "Live systems connected", sub: "Xero · GHL · Wunderbuild" },
                { value: "1", label: "Central project database", sub: "Supabase — shared across the team" },
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
                Project, financial and sales data lived in separate systems
              </h2>
              <div className="mt-6 space-y-4 text-[15px] leading-7 text-white/62">
                <p>
                  Build One needed clearer operational visibility and a structured lead journey. Project scheduling,
                  pipeline activity, financial performance, customer contacts, lead scoring, and appointment follow-up
                  all needed to work together without forcing the team to manually reconcile information across
                  multiple tools.
                </p>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">Before AKT</p>
              <div className="space-y-3">
                {[
                  ["Project visibility", "Fragmented across tools and manual updates"],
                  ["Lead qualification", "Required manual review and prioritization"],
                  ["Financial reporting", "Not surfaced in one operating view"],
                  ["Sales follow-up", "Needed consistent routing, reminders and tasks"],
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

        {/* Four Systems */}
        <section className="border-b border-white/10 bg-[#101113] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#7fffee]">The Solution</p>
            <h2 className="font-syne text-[clamp(22px,2.5vw,30px)] font-bold tracking-tight text-white">
              A single operating layer for construction, sales and lead intelligence
            </h2>
            <p className="mt-5 max-w-3xl text-[15px] leading-7 text-white/62">
              Four connected pieces — an operating dashboard, a GoHighLevel CRM with lead capture, the Oliver AI
              qualification workflow, and live integrations sharing one Supabase database.
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
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#7fffee]">The Results</p>
              <h2 className="font-syne text-[clamp(22px,2.5vw,30px)] font-bold tracking-tight text-white">
                A clearer path from enquiry to qualified opportunity — with live operational visibility
              </h2>
              <ul className="mt-6 space-y-3 text-[15px] leading-7 text-white/62">
                {[
                  "Project scheduling, milestones and project records now share one central source of truth.",
                  "Lead scoring and summaries surface directly on the GoHighLevel opportunity card.",
                  "Bronze and Silver leads can follow automated nurture paths, while Gold and Platinum leads trigger prioritized human follow-up.",
                  "Gold and Platinum opportunities automatically create a high-priority “Follow up within 24 hours” task and internal sales notification.",
                  "Xero, GHL and Wunderbuild data can be viewed inside the operating dashboard instead of separate systems.",
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
                  ["Dashboard", "7 connected views"],
                  ["Project data", "Centralized in Supabase"],
                  ["Lead qualification", "AI scored & categorized"],
                  ["Pipeline", "Live from GoHighLevel"],
                  ["Financials", "Live from Xero"],
                  ["Priority leads", "Automated tasks & alerts"],
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

        {/* Full scope */}
        <section className="border-b border-white/10 bg-[#101113] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#7fffee]">Full Scope of Work</p>
            <h2 className="mb-10 font-syne text-[clamp(20px,2.5vw,28px)] font-bold tracking-tight text-white">
              Everything AKT delivered for Build One
            </h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {scope.map((s) => (
                <div key={s} className="flex items-start gap-3">
                  <span className="mt-1 font-bold text-[#0abfa3]">+</span>
                  <span className="text-[14px] leading-6 text-white/70">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="border-b border-white/10 py-16">
          <div className="mx-auto max-w-7xl px-6">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#7fffee]">Technology Stack</p>
            <h2 className="mb-10 font-syne text-[clamp(20px,2.5vw,28px)] font-bold tracking-tight text-white">
              The stack powering Build One&apos;s operating layer
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
              {[
                { name: "GoHighLevel", desc: "CRM, pipeline & meetings" },
                { name: "n8n", desc: "AI workflows & routing" },
                { name: "OpenAI", desc: "Oliver lead qualification" },
                { name: "Xero", desc: "Live financials" },
                { name: "Supabase", desc: "Central project database" },
                { name: "Wunderbuild", desc: "Client contacts" },
                { name: "Squarespace", desc: "Website & enquiries" },
                { name: "Netlify", desc: "Dashboard hosting" },
              ].map((tool) => (
                <div key={tool.name} className="rounded-card border border-white/10 bg-[#101113] p-5 text-center">
                  <p className="font-syne text-[13px] font-bold text-white">{tool.name}</p>
                  <p className="mt-1 text-[11px] text-white/40">{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-b border-white/10 bg-[#101113] py-16">
          <div className="mx-auto max-w-4xl px-6">
            <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[#7fffee]">FAQ</p>
            <h2 className="mb-12 text-center font-syne text-[clamp(20px,2.5vw,28px)] font-bold tracking-tight text-white">
              Questions about construction dashboards, CRM and AI lead qualification
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details key={faq.q} className="group rounded-card border border-white/10 bg-black/30 p-6 open:border-[#0abfa3]/30">
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
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#7fffee]">Build Something Similar</p>
              <h2 className="font-syne text-[clamp(22px,3vw,34px)] font-bold tracking-tight text-white">
                Ready to connect your operations, CRM and AI into one system?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-white/62">
                AKT builds practical automation infrastructure around the tools your team already uses.
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
