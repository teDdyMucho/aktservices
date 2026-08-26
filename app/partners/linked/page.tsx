import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, CheckCircle } from "lucide-react";

const SITE_URL = "https://aktservices.org";

export const metadata: Metadata = {
  title: "LINKED: Shopify, GoHighLevel & Customer Automation Ecosystem | AKT",
  description:
    "How AKT built and maintains LINKED's automation layer — Shopify-to-GoHighLevel sync with product-specific tagging, abandoned-checkout recovery, total-spend segmentation, 5+ pipeline workflows for 100+ opportunities, English/Spanish webinar operations for 1,640 contacts, Google Sheets reporting, and an n8n BoldSign integration.",
  keywords: [
    "Shopify GoHighLevel integration",
    "Shopify to GHL contact sync tagging",
    "abandoned checkout recovery GoHighLevel",
    "ecommerce CRM automation agency",
    "n8n Shopify automation",
    "BoldSign n8n integration",
    "webinar automation GoHighLevel English Spanish",
    "customer total spend segmentation tags",
    "GoHighLevel pipeline automation ecommerce",
    "Google Sheets order reporting automation",
    "permanent jewelry training business automation",
    "Zapier to n8n migration ecommerce",
  ],
  alternates: { canonical: `${SITE_URL}/partners/linked` },
  openGraph: {
    title: "LINKED: Connecting Shopify, GoHighLevel & Customer Automation | AKT Case Study",
    description:
      "Product-specific tagging, Shopify→GHL sync, abandoned-cart recovery, spend segmentation, pipeline automation, bilingual webinars, reporting & BoldSign — built and maintained by AKT.",
    type: "article",
    url: `${SITE_URL}/partners/linked`,
    publishedTime: "2026-08-27T00:00:00Z",
    modifiedTime: "2026-08-27T00:00:00Z",
    siteName: "AKT Virtual Assistance Services",
  },
  twitter: {
    card: "summary_large_image",
    title: "LINKED: Shopify + GoHighLevel Automation Ecosystem | AKT",
    description: "Ecommerce purchases, CRM tagging, abandoned carts, webinars, pipelines, reporting and e-signing — one coordinated system.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${SITE_URL}/partners/linked#article`,
      headline: "Connecting LINKED's Shopify, GoHighLevel & Customer Automation Ecosystem",
      description:
        "AKT built and maintained the automation layer connecting ecommerce purchases, CRM tagging, abandoned carts, student onboarding, webinars, pipelines, reporting, and document workflows.",
      datePublished: "2026-08-27",
      dateModified: "2026-08-27",
      author: { "@type": "Organization", name: "AKT Virtual Assistance Services", url: SITE_URL },
      publisher: {
        "@type": "Organization",
        name: "AKT Virtual Assistance Services",
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/image/akt_logo.png` },
      },
      mainEntityOfPage: `${SITE_URL}/partners/linked`,
      about: {
        "@type": "Organization",
        name: "LINKED Permanent Jewelry Training",
        description: "LINKED sells permanent jewelry training programs, kits and products through Shopify, with student programs and bilingual webinars.",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How are Shopify purchases synced to GoHighLevel?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Each Shopify product is mapped to GoHighLevel tags — including warranty, extended warranty, student, and individual product tags. On purchase, the contact is created or updated in GHL, the correct tags are applied, and the matching automation is triggered, so classification and routing happen without manual tagging.",
          },
        },
        {
          "@type": "Question",
          name: "How does abandoned checkout recovery work?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "AKT built detection for abandoned checkouts, tagging, wait logic, entry into a GoHighLevel recovery pipeline, and the follow-up workflows that bring the customer back to complete the purchase.",
          },
        },
        {
          "@type": "Question",
          name: "What do the webinar operations include?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "AKT maintains LINKED's English and Spanish webinar campaigns — 1,640 contacts processed — including timezone settings, Gmail and Zapier connections, and SMS flows.",
          },
        },
        {
          "@type": "Question",
          name: "Why was BoldSign integrated through n8n instead of Zapier?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Zapier could not support LINKED's required BoldSign template flow, so AKT designed an n8n API-based integration that handles the document-signing workflow reliably.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Portfolio", item: `${SITE_URL}/partners` },
        { "@type": "ListItem", position: 3, name: "LINKED Case Study", item: `${SITE_URL}/partners/linked` },
      ],
    },
  ],
};

const delivered = [
  {
    number: "01",
    title: "Product-specific tagging",
    subtitle: "Shopify products → GHL tags",
    description:
      "Mapped every Shopify product to GoHighLevel tags — including warranty, extended warranty, student, and individual product tags — so each purchase classifies the customer automatically.",
    tools: ["Shopify", "GoHighLevel"],
  },
  {
    number: "02",
    title: "Shopify to GHL sync",
    subtitle: "Contacts · Tags · Triggers",
    description:
      "Created or updated contacts in GoHighLevel on every order, applied the right tags, and triggered the correct automations — no manual data entry between platforms.",
    tools: ["Shopify", "GoHighLevel", "n8n", "Zapier"],
  },
  {
    number: "03",
    title: "Abandoned checkout recovery",
    subtitle: "Detection · Wait logic · Recovery pipeline",
    description:
      "Built abandoned-checkout detection, tagging, wait logic, GoHighLevel pipeline entry, and the recovery workflows that bring customers back to complete their purchase.",
    tools: ["Shopify", "GoHighLevel"],
  },
  {
    number: "04",
    title: "Total-spend segmentation",
    subtitle: "Value-based automation",
    description:
      "Created customer-spend logic and tag triggers so high-value customers can be segmented and routed into value-based automations automatically.",
    tools: ["GoHighLevel", "n8n"],
  },
  {
    number: "05",
    title: "Pipeline automation",
    subtitle: "5+ workflows · 100+ opportunities",
    description:
      "Added 5+ GoHighLevel workflows and solved processing for pipelines carrying 100+ opportunities, keeping stage movement and follow-up reliable at volume.",
    tools: ["GoHighLevel"],
  },
  {
    number: "06",
    title: "Webinar operations",
    subtitle: "English + Spanish · 1,640 contacts",
    description:
      "Maintained English and Spanish webinar campaigns, timezone settings, Gmail/Zapier connections, and SMS flows — 1,640 webinar contacts processed.",
    tools: ["GoHighLevel", "Gmail", "Zapier", "SMS"],
  },
  {
    number: "07",
    title: "Reporting & backups",
    subtitle: "Google Sheets · Historical re-runs",
    description:
      "Synced paid orders to Google Sheets, re-ran historical executions to backfill records, and created filtered views for reporting and backup.",
    tools: ["Google Sheets", "n8n", "Shopify"],
  },
  {
    number: "08",
    title: "BoldSign integration",
    subtitle: "n8n API approach",
    description:
      "Designed an n8n API-based integration for BoldSign document signing when Zapier could not support the required template flow.",
    tools: ["BoldSign", "n8n"],
  },
];

const faqs = [
  {
    q: "How are Shopify purchases synced to GoHighLevel?",
    a: "Every product maps to GHL tags (warranty, extended warranty, student, product). On purchase the contact is created or updated, the right tags are applied, and the matching automation fires — no manual tagging.",
  },
  {
    q: "How does abandoned checkout recovery work?",
    a: "Detection → tagging → wait logic → entry into a GoHighLevel recovery pipeline → follow-up workflows that bring the customer back to finish the purchase.",
  },
  {
    q: "What do the webinar operations include?",
    a: "English and Spanish campaigns (1,640 contacts processed), timezone settings, Gmail/Zapier connections, and SMS flows — all maintained by AKT.",
  },
  {
    q: "Why was BoldSign integrated through n8n instead of Zapier?",
    a: "Zapier couldn't support the required BoldSign template flow, so AKT built an n8n API integration that handles the document-signing workflow reliably.",
  },
];

export default function LinkedPage() {
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
              <Link href="/partners" className="transition-colors hover:text-white/70">Portfolio</Link>
              <span>/</span>
              <span className="text-white/65">LINKED</span>
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
              Back to portfolio
            </Link>

            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <span className="mb-4 inline-flex rounded-full border border-[#0abfa3]/40 bg-[#073B34] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#7fffee]">
                  Ecommerce · CRM · Automation
                </span>
                <h1 className="font-syne text-[clamp(28px,4vw,48px)] font-extrabold leading-tight tracking-tight text-white">
                  Connecting LINKED&apos;s Shopify, GoHighLevel &amp;{" "}
                  <span style={{ color: "#0ABFA3" }}>Customer Automation</span> Ecosystem
                </h1>
                <p className="mt-6 text-[16px] leading-8 text-white/62">
                  AKT built and maintained the automation layer connecting ecommerce purchases, CRM tagging,
                  abandoned carts, student onboarding, webinars, pipelines, reporting, and document workflows.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="inline-flex items-center rounded-full border border-white/10 px-4 py-1.5 text-[12px] font-semibold text-white/40">
                    Permanent Jewelry Training · Ecommerce
                  </span>
                </div>
              </div>

              <div className="shrink-0">
                <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-[#0d0d0f] p-8 lg:w-[260px]">
                  <Image
                    src="/image/linked.png"
                    alt="LINKED Permanent Jewelry Training logo"
                    width={2172}
                    height={724}
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
                { value: "1,640", label: "Webinar contacts processed", sub: "English + Spanish campaigns" },
                { value: "100+", label: "Pipeline opportunities supported", sub: "Reliable processing at volume" },
                { value: "5+", label: "New GHL automations", sub: "Pipeline & follow-up workflows" },
                { value: "2", label: "Languages", sub: "English + Spanish workflows" },
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
                One customer journey spread across eight different systems
              </h2>
              <div className="mt-6 space-y-4 text-[15px] leading-7 text-white/62">
                <p>
                  LINKED&apos;s customer journey spans Shopify purchases, student programs, webinars, abandoned
                  checkouts, CRM pipelines, SMS, reporting, and document signing. Customer data had to move reliably
                  between platforms without manual tagging, missed workflows, or incorrect follow-up.
                </p>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">Touchpoints to connect</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Shopify purchases",
                  "Student programs",
                  "Webinars (EN/ES)",
                  "Abandoned checkouts",
                  "CRM pipelines",
                  "SMS",
                  "Reporting",
                  "Document signing",
                ].map((t) => (
                  <div key={t} className="rounded-lg border border-white/10 bg-[#101113] px-4 py-3 text-[14px] font-semibold text-white/60">
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What AKT delivered */}
        <section className="border-b border-white/10 bg-[#101113] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#7fffee]">What AKT Delivered</p>
            <h2 className="font-syne text-[clamp(22px,2.5vw,30px)] font-bold tracking-tight text-white">
              Eight pieces of one coordinated automation layer
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
              {delivered.map((d) => (
                <div key={d.number} className="rounded-card border border-white/10 bg-black/30 p-7">
                  <div className="flex items-start gap-5">
                    <p className="shrink-0 font-syne text-[36px] font-extrabold leading-none tracking-tight" style={{ color: "#0ABFA3", opacity: 0.25 }}>
                      {d.number}
                    </p>
                    <div className="min-w-0">
                      <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">{d.subtitle}</div>
                      <h3 className="font-syne text-[18px] font-bold tracking-tight text-white">{d.title}</h3>
                      <p className="mt-3 text-[14px] leading-7 text-white/62">{d.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {d.tools.map((t) => (
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

        {/* Outcome */}
        <section className="border-b border-white/10 py-16">
          <div className="mx-auto max-w-7xl px-6">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#7fffee]">Outcome</p>
            <h2 className="font-syne text-[clamp(22px,2.5vw,30px)] font-bold tracking-tight text-white">
              Purchases, tags, pipelines, and follow-up now work as one system
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                {
                  t: "Connected lifecycle",
                  d: "Purchases, tags, pipelines, and follow-up now work as one coordinated system.",
                },
                {
                  t: "Less manual admin",
                  d: "Customer classification and routing are automated across Shopify and GHL.",
                },
                {
                  t: "More resilient operations",
                  d: "Workflows are monitored, debugged, backed up, and updated as products change.",
                },
              ].map((o) => (
                <div key={o.t} className="rounded-card border border-[#0abfa3]/20 bg-[#062B26]/40 p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <CheckCircle size={16} className="text-[#0abfa3]" />
                    <h3 className="font-syne text-[16px] font-bold text-[#7fffee]">{o.t}</h3>
                  </div>
                  <p className="text-[14px] leading-7 text-white/62">{o.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="border-b border-white/10 bg-[#101113] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#7fffee]">Tech Stack</p>
            <h2 className="mb-10 font-syne text-[clamp(20px,2.5vw,28px)] font-bold tracking-tight text-white">
              The stack behind LINKED&apos;s automation layer
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
              {[
                { name: "Shopify", desc: "Ecommerce & orders" },
                { name: "GoHighLevel", desc: "CRM, tags & pipelines" },
                { name: "n8n", desc: "Automation & API flows" },
                { name: "Zapier", desc: "Legacy connections" },
                { name: "Google Sheets", desc: "Order reporting & backups" },
                { name: "BoldSign", desc: "Document signing" },
                { name: "Gmail", desc: "Webinar email" },
                { name: "Slack", desc: "Team notifications" },
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
              Questions about Shopify + GoHighLevel automation
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
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#7fffee]">Automation · CRM · AI Systems</p>
              <h2 className="font-syne text-[clamp(22px,3vw,34px)] font-bold tracking-tight text-white">
                Ready to connect your store, CRM and follow-up into one system?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-white/62">
                AKT builds and maintains the automation layer between the tools your business already runs on.
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
                  View Portfolio
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
