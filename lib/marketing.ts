import type { MarketingAd, MarketingMediaType } from "@/lib/types/admin";

/** Public Storage bucket that holds uploaded ad images/videos. */
export const MARKETING_BUCKET = "marketing-ads";

/** Raw shape of a public.marketing_ads row. */
export type MarketingRow = {
  id: string;
  title: string;
  description: string;
  media_url: string;
  media_type: MarketingMediaType;
  storage_path: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export const MARKETING_COLUMNS =
  "id, title, description, media_url, media_type, storage_path, published, created_at, updated_at";

export function rowToAd(r: MarketingRow): MarketingAd {
  return {
    id: r.id,
    title: r.title,
    description: r.description ?? "",
    mediaUrl: r.media_url,
    mediaType: r.media_type,
    storagePath: r.storage_path,
    published: r.published,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
export const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB

export function mediaTypeFor(contentType: string): MarketingMediaType | null {
  if (IMAGE_TYPES.includes(contentType)) return "image";
  if (VIDEO_TYPES.includes(contentType)) return "video";
  return null;
}

export const EXT_FOR: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};
