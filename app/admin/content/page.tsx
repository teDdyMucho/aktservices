import Link from "next/link";
import { ArrowUpRight, FileText, Handshake, Lock, Megaphone, Newspaper } from "lucide-react";

export const metadata = { title: "Admin · Content | AKT" };

export default function AdminContentPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="accent-bar mb-3 text-[12px] font-dm font-semibold uppercase tracking-widest text-muted">
          Content
        </p>
        <h2
          className="font-syne text-body"
          style={{ fontSize: "clamp(26px, 3vw, 34px)", fontWeight: 800, letterSpacing: "-0.02em" }}
        >
          Content management
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] font-dm leading-relaxed text-muted">
          Manage what shows on the public site. Blog posts and marketing ads are
          editable here and publish without a redeploy.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Blog — live */}
        <Link
          href="/admin/content/blog"
          className="glow-card group relative flex flex-col rounded-card border border-border bg-surface p-6 transition-all duration-200 hover:shadow-card"
        >
          <div className="mb-4 flex items-start justify-between">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-lg"
              style={{ background: "#073B34" }}
            >
              <Newspaper size={20} style={{ color: "#0ABFA3" }} strokeWidth={1.75} />
            </div>
            <ArrowUpRight size={18} className="text-muted transition-colors group-hover:text-primary" />
          </div>
          <h3
            className="font-syne text-body text-[16px] font-bold transition-colors group-hover:text-primary"
            style={{ letterSpacing: "-0.01em" }}
          >
            Blog posts
          </h3>
          <p className="mt-2 text-[13px] font-dm leading-relaxed text-muted">
            Create, edit, publish, and delete posts shown on <span className="text-primary">/blog</span>.
          </p>
        </Link>

        {/* Marketing ads — live */}
        <Link
          href="/admin/content/marketing"
          className="glow-card group relative flex flex-col rounded-card border border-border bg-surface p-6 transition-all duration-200 hover:shadow-card"
        >
          <div className="mb-4 flex items-start justify-between">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-lg"
              style={{ background: "#073B34" }}
            >
              <Megaphone size={20} style={{ color: "#0ABFA3" }} strokeWidth={1.75} />
            </div>
            <ArrowUpRight size={18} className="text-muted transition-colors group-hover:text-primary" />
          </div>
          <h3
            className="font-syne text-body text-[16px] font-bold transition-colors group-hover:text-primary"
            style={{ letterSpacing: "-0.01em" }}
          >
            Marketing ads
          </h3>
          <p className="mt-2 text-[13px] font-dm leading-relaxed text-muted">
            Upload images and videos shown on <span className="text-primary">/marketing</span> and the homepage panel.
          </p>
        </Link>

        {/* Partners — code-managed */}
        <CodeManaged
          icon={Handshake}
          title="Partner case studies"
          detail="Currently defined in lib/partner-cases.ts with dedicated per-partner pages and images. Editing here is a future phase."
        />
        {/* AI tools catalog — code-managed */}
        <CodeManaged
          icon={FileText}
          title="AI tools catalog"
          detail="Currently a static array in app/ai-tools/page.tsx. Editing here is a future phase."
        />
      </div>
    </div>
  );
}

function CodeManaged({
  icon: Icon,
  title,
  detail,
}: {
  icon: typeof FileText;
  title: string;
  detail: string;
}) {
  return (
    <div className="relative flex flex-col rounded-card border border-border bg-surface/60 p-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/5">
          <Icon size={20} className="text-muted" strokeWidth={1.75} />
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-dm font-semibold text-muted">
          <Lock size={10} /> Code-managed
        </span>
      </div>
      <h3 className="font-syne text-[16px] font-bold text-body/70" style={{ letterSpacing: "-0.01em" }}>
        {title}
      </h3>
      <p className="mt-2 text-[13px] font-dm leading-relaxed text-muted">{detail}</p>
    </div>
  );
}
