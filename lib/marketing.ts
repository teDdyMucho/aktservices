import type { MarketingAd, MarketingFolder, MarketingMediaType } from "@/lib/types/admin";

/** Public Storage bucket that holds uploaded ad images/videos. */
export const MARKETING_BUCKET = "marketing-ads";

/** Reserved slug for the pseudo-collection of ads that aren't in any folder. */
export const OTHER_SLUG = "other";

/** Raw shape of a public.marketing_ads row (with the folder join). */
export type MarketingRow = {
  id: string;
  title: string;
  description: string;
  media_url: string;
  media_type: MarketingMediaType;
  storage_path: string;
  published: boolean;
  folder_id: string | null;
  folder?: { slug: string; name: string } | { slug: string; name: string }[] | null;
  created_at: string;
  updated_at: string;
};

/** Select list for ads — includes the folder's slug/name via the FK join. */
export const MARKETING_COLUMNS =
  "id, title, description, media_url, media_type, storage_path, published, folder_id, folder:marketing_folders(slug, name), created_at, updated_at";

export function rowToAd(r: MarketingRow): MarketingAd {
  const f = Array.isArray(r.folder) ? r.folder[0] ?? null : r.folder ?? null;
  return {
    id: r.id,
    title: r.title,
    description: r.description ?? "",
    mediaUrl: r.media_url,
    mediaType: r.media_type,
    storagePath: r.storage_path,
    published: r.published,
    folderId: r.folder_id ?? null,
    folderSlug: f?.slug ?? null,
    folderName: f?.name ?? null,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

/** Raw shape of a public.marketing_folders row. */
export type FolderRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  cover_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export const FOLDER_COLUMNS = "id, slug, name, description, cover_url, published, created_at, updated_at";

export function rowToFolder(r: FolderRow, adCount = 0): MarketingFolder {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description ?? "",
    coverUrl: r.cover_url ?? null,
    published: r.published,
    adCount,
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

/**
 * Pick a cover for a folder: explicit cover_url, else the newest image inside,
 * else the newest video (the viewer renders a poster-less <video>).
 */
export function pickCover(folder: MarketingFolder, ads: MarketingAd[]): { url: string; type: MarketingMediaType } | null {
  if (folder.coverUrl) return { url: folder.coverUrl, type: "image" };
  const img = ads.find((a) => a.mediaType === "image");
  if (img) return { url: img.mediaUrl, type: "image" };
  const vid = ads.find((a) => a.mediaType === "video");
  if (vid) return { url: vid.mediaUrl, type: "video" };
  return null;
}
