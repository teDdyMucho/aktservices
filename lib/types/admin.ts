/** Shared admin types — no runtime imports, safe for client + server. */

export type AdminRole = "user" | "admin" | "staff";
export type AdminStatus = "active" | "suspended";

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  status: AdminStatus;
  provider: string;
  createdAt: string;
  lastSignInAt: string | null;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  readTime: string;
  imageUrl: string | null;
  url: string | null;
  featured: boolean;
  published: boolean;
  publishedAt: string;
  updatedAt: string;
};

/** Fields the admin form sends when creating/updating a post. */
export type BlogPostInput = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  readTime: string;
  imageUrl?: string | null;
  url?: string | null;
  featured: boolean;
  published: boolean;
  publishedAt?: string;
};

export type MarketingMediaType = "image" | "video";

/** One uploaded marketing ad (image or video) shown on /marketing. */
export type MarketingAd = {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: MarketingMediaType;
  storagePath: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

/** Sent by the admin after the file has been uploaded straight to Storage. */
export type MarketingAdInput = {
  title: string;
  description: string;
  storagePath: string;
  mediaType: MarketingMediaType;
  published?: boolean;
};

export type LeadStatus = "new" | "contacted" | "closed";

export type Lead = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  need: string | null;
  message: string;
  contactTime: string | null;
  status: LeadStatus;
  notes: string;
  createdAt: string;
};

export type UsageSummary = {
  totalSessions: number;
  sessionsToday: number;
  sessions7d: number;
  uniqueUsers: number;
  perTool: { tool: string; count: number }[];
  topUsers: { email: string; count: number }[];
  recent: { tool: string; email: string | null; createdAt: string }[];
};
