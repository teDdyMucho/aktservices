import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  EXT_FOR,
  MARKETING_BUCKET,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  mediaTypeFor,
} from "@/lib/marketing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/admin/marketing/upload-url  { contentType, size }
 *
 * Issues a one-time signed upload URL for the public `marketing-ads` bucket.
 * The admin's browser then PUTs the file straight to Supabase Storage
 * (`storage.from(bucket).uploadToSignedUrl(path, token, file)`), which keeps
 * multi-MB videos out of the serverless request body limit. Admin-only.
 */
export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const body = (await request.json().catch(() => ({}))) as {
    contentType?: string;
    size?: number;
  };

  const contentType = body.contentType ?? "";
  const mediaType = mediaTypeFor(contentType);
  if (!mediaType) {
    return NextResponse.json(
      { error: "Unsupported type. Use JPG, PNG, WebP, GIF, AVIF, MP4, WebM, or MOV." },
      { status: 400 },
    );
  }

  const size = Number(body.size ?? 0);
  const max = mediaType === "video" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (!Number.isFinite(size) || size <= 0) {
    return NextResponse.json({ error: "Invalid file size." }, { status: 400 });
  }
  if (size > max) {
    return NextResponse.json(
      { error: `File is too large (max ${Math.round(max / 1024 / 1024)} MB for ${mediaType}s).` },
      { status: 400 },
    );
  }

  const admin = createSupabaseAdminClient();

  // Make sure the bucket exists (no-op if SQL already created it).
  try {
    await admin.storage.createBucket(MARKETING_BUCKET, { public: true });
  } catch {
    // already exists — ignore
  }

  const ext = EXT_FOR[contentType] ?? "bin";
  const path = `ads/${crypto.randomUUID()}.${ext}`;

  const { data, error } = await admin.storage.from(MARKETING_BUCKET).createSignedUploadUrl(path);
  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Could not create upload URL." }, { status: 500 });
  }

  return NextResponse.json({ path: data.path, token: data.token, mediaType });
}
