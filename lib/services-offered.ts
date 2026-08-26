import {
  BarChart3,
  Bot,
  GitBranch,
  Globe,
  Layers,
  Mail,
  MessageSquare,
  Phone,
  Shield,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Single source of truth for "what AKT offers".
 *
 * - `app/services/page.tsx` renders the full cards from this list.
 * - `components/HeroPanels.tsx` (homepage "Our Services" panel) cycles through
 *   the `short` labels so the panel always reflects the current catalog.
 *
 * Add / remove a service here and both surfaces update together.
 */
export type ServiceOffered = {
  icon: LucideIcon;
  title: string;
  desc: string;
  tags: string[];
  /** Two-line compact label for the homepage panel: [big, small]. */
  short: [string, string];
};

export const SERVICES_OFFERED: ServiceOffered[] = [
  {
    icon: GitBranch,
    title: "GoHighLevel CRM Automation",
    desc: "Full GHL setup — pipelines, AI agents, follow-up sequences, sub-account management, and ongoing CRM maintenance. Built for 8 of our 10 partners.",
    tags: ["GHL Pipelines", "AI Agents", "Sequences", "CRM Management"],
    short: ["GHL", "CRM BUILDS"],
  },
  {
    icon: Zap,
    title: "n8n Workflow Automation",
    desc: "Self-hosted n8n replacing Zapier — complex multi-step workflows, API connections, conditional logic. 70%+ cost cut vs. Zapier.",
    tags: ["Zapier Migration", "Custom Pipelines", "API Integration", "Zero Downtime"],
    short: ["n8n", "WORKFLOWS"],
  },
  {
    icon: Phone,
    title: "Retell AI Voice Agents",
    desc: "24/7 AI voice agents for inbound and outbound calls. Sub-600ms response, appointment booking, hot-buyer escalation, 31+ language support.",
    tags: ["Inbound Calls", "Outbound Calling", "Appointment Booking", "31+ Languages"],
    short: ["VOICE", "AI AGENTS"],
  },
  {
    icon: MessageSquare,
    title: "Custom AI Chatbots",
    desc: "Website chat and SMS AI agents built from scratch — trained on your scripts and FAQs. Cheaper and more controllable than Closebot.",
    tags: ["Web Chat", "SMS AI", "Lead Qualification", "Custom Training"],
    short: ["CHAT", "BOTS"],
  },
  {
    icon: Bot,
    title: "AI as Your Workforce",
    desc: "We deploy AI agents as active team members — answering calls, replying to leads, posting content, tracking tasks, and reporting metrics 24/7.",
    tags: ["24/7 Operations", "AI Employees", "Lead Response", "Content Creation"],
    short: ["AI", "WORKFORCE"],
  },
  {
    icon: Layers,
    title: "Full System Integration",
    desc: "We connect every tool into one seamless pipeline. Voice data flows into GHL. Lead scraper outputs trigger email sequences. Zero manual handoffs.",
    tags: ["Tool Connection", "End-to-End Pipeline", "n8n Backbone", "Zero Handoffs"],
    short: ["SYSTEM", "INTEGRATION"],
  },
  {
    icon: BarChart3,
    title: "Business Analytics Dashboards",
    desc: "Custom dashboards showing subscriptions, revenue, profit margins, and pipeline health — updated in real time via automated n8n data pulls.",
    tags: ["Live Metrics", "Revenue Tracking", "Real-Time Data", "Custom Reports"],
    short: ["DATA", "DASHBOARDS"],
  },
  {
    icon: Mail,
    title: "Outbound Email & Lead Scraping",
    desc: "AI-qualified lead scraping, personalized email generation, multi-touch sequences, and behavioral triggers. Self-filling pipeline, fully automated.",
    tags: ["Lead Scraping", "AI Personalization", "Email Sequences", "Behavior Triggers"],
    short: ["LEAD", "SCRAPING"],
  },
  {
    icon: Users,
    title: "Elite Filipino Virtual Assistants",
    desc: "Vetted, managed Philippine-based VAs for email operations, back-office, admin, and sales. AKT ran a full VA department contributing $6M+ for Proto Financial.",
    tags: ["VA Operations", "Email Ops", "Back-Office", "Sales Support"],
    short: ["VA", "TEAMS"],
  },
  {
    icon: Shield,
    title: "Ongoing Maintenance & Support",
    desc: "Post-launch n8n monitoring, error resolution, prompt optimization, and system expansion. No support queue — priority AKT response.",
    tags: ["Workflow Monitoring", "Prompt Updates", "System Expansion", "Priority Support"],
    short: ["24/7", "SUPPORT"],
  },
  {
    icon: Wrench,
    title: "AI Content Creation Platforms",
    desc: "Custom platforms with Veo 3, Kling, HeyGen, HiggsField, Banana Nano — all from one interface. Built for Branding561's content team.",
    tags: ["Veo 3", "Kling", "HeyGen", "AI Video & Image"],
    short: ["AI", "CONTENT"],
  },
  {
    icon: Globe,
    title: "SEO Automation & AI Blogging",
    desc: "Daily AI-generated SEO-optimized blog posts published automatically to your site. Compounding organic visibility without a content team.",
    tags: ["AI Blog Posts", "SEO Optimization", "Daily Publishing", "Organic Growth"],
    short: ["SEO", "AUTOMATION"],
  },
];
