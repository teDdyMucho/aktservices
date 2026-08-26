import { MetadataRoute } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const BASE = "https://aktservices.org";

const partnerSlugs = [
  "proto-financial",
  "southland-roofing",
  "lucky7-distribution",
  "digitalflo",
  "kda-innovations",
  "kinnobot",
  "dadstudio",
  "accelereight",
  "branding561",
  "october-marketing",
];

async function getBlogSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("slug, updated_at")
      .eq("published", true)
      .order("published_at", { ascending: false });

    return (data ?? []).map((r: { slug: string; updated_at: string }) => ({
      slug: r.slug,
      updatedAt: r.updated_at,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await getBlogSlugs();
  const now = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/partners`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/ai-tools`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/ai-tools/design-adjuster`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/marketing`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const partnerRoutes: MetadataRoute.Sitemap = partnerSlugs.map((slug) => ({
    url: `${BASE}/partners/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map(({ slug, updatedAt }) => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...partnerRoutes, ...blogRoutes];
}
