import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, CheckCircle } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { partnerCases } from "@/lib/partner-cases";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const DEDICATED_PAGES = ["proto-financial", "southland-roofing", "lucky7-distribution", "digitalflo", "kda-innovations", "kinnobot", "october-marketing", "branding561", "accelereight", "dadstudio", "build-one", "easydrive-canada", "linked"];

export function generateStaticParams() {
  return partnerCases
    .filter((item) => !DEDICATED_PAGES.includes(item.slug))
    .map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = partnerCases.find((partner) => partner.slug === slug);

  if (!item) {
    return {
      title: "Partner Case Study | AKT",
    };
  }

  return {
    title: `${item.title} | AKT Partner Case Study`,
    description: item.summary,
  };
}

export default async function PartnerCasePage({ params }: PageProps) {
  const { slug } = await params;
  const item = partnerCases.find((partner) => partner.slug === slug);

  if (!item) notFound();

  return (
    <>
      <Nav />
      <main className="bg-black pt-16 text-white">
        <section className="border-b border-white/10 bg-[#101113] py-20">
          <div className="mx-auto max-w-7xl px-6">
            <Link
              href="/partners"
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white/55 transition-colors hover:text-[#7fffee]"
            >
              <ArrowLeft size={16} />
              Back to partners
            </Link>

            <div className="max-w-4xl">
              <p className="mb-4 inline-flex rounded-full border border-[#0abfa3]/40 bg-[#073B34] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#7fffee]">
                {item.tag}
              </p>
              <h1 className="font-syne text-4xl font-extrabold tracking-normal text-white sm:text-6xl">
                {item.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/62">
                {item.summary}
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 lg:grid-cols-3">
            {[
              { label: "Industry", value: item.industry },
              { label: "Location", value: item.location },
              { label: "Result", value: item.metric },
            ].map((metric) => (
              <div
                key={metric.label}
                className="rounded-card border border-white/10 bg-[#101113] p-6"
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">
                  {metric.label}
                </p>
                <p className="mt-3 font-syne text-2xl font-bold text-white">
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 lg:grid-cols-3">
            {[
              { label: "Challenge", text: item.challenge },
              { label: "Solution", text: item.solution },
              { label: "Result", text: item.result },
            ].map((block) => (
              <div
                key={block.label}
                className="rounded-card border border-white/10 bg-[#101113] p-7"
              >
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#7fffee]">
                  {block.label}
                </p>
                <p className="text-sm leading-7 text-white/62">{block.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 bg-[#101113] py-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-syne text-2xl font-bold text-white">
                Tools and systems used
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {item.tools.map((tool) => (
                  <span
                    key={tool}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-sm font-semibold text-white/65"
                  >
                    <CheckCircle size={14} className="text-[#0abfa3]" />
                    {tool}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-[#0abfa3]"
            >
              Build Something Similar
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
