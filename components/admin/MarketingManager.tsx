"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  ExternalLink,
  Film,
  ImageIcon,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  TriangleAlert,
  Upload,
  X,
} from "lucide-react";
import type { MarketingAd } from "@/lib/types/admin";
import {
  IMAGE_TYPES,
  MARKETING_BUCKET,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  VIDEO_TYPES,
  mediaTypeFor,
} from "@/lib/marketing";

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(+d) ? "—" : dateFmt.format(d);
};
const fmtSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;

const ACCEPT = [...IMAGE_TYPES, ...VIDEO_TYPES].join(",");

/**
 * Admin manager for /marketing. Uploads go browser → Supabase Storage using a
 * server-issued signed upload URL (see /api/admin/marketing/upload-url), then
 * the metadata row is created via /api/admin/marketing.
 */
export default function MarketingManager() {
  const [ads, setAds] = useState<MarketingAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MarketingAd | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmAd, setConfirmAd] = useState<MarketingAd | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/marketing", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
      setAds(data.ads as MarketingAd[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load ads.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const togglePublished = async (ad: MarketingAd) => {
    setBusyId(ad.id);
    setError("");
    try {
      const res = await fetch(`/api/admin/marketing/${ad.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !ad.published }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Update failed.");
      setAds((prev) => prev.map((a) => (a.id === ad.id ? (data.ad as MarketingAd) : a)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed.");
    } finally {
      setBusyId(null);
    }
  };

  const saveEdit = async (title: string, description: string) => {
    if (!editing) return;
    const res = await fetch(`/api/admin/marketing/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Save failed.");
    setAds((prev) => prev.map((a) => (a.id === editing.id ? (data.ad as MarketingAd) : a)));
    setEditing(null);
  };

  const confirmRemove = async () => {
    if (!confirmAd) return;
    const ad = confirmAd;
    setConfirmAd(null);
    setBusyId(ad.id);
    setError("");
    try {
      const res = await fetch(`/api/admin/marketing/${ad.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Delete failed.");
      setAds((prev) => prev.filter((a) => a.id !== ad.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setBusyId(null);
    }
  };

  const published = ads.filter((a) => a.published).length;

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/content"
          className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-dm text-muted transition-colors hover:text-body"
        >
          <ArrowLeft size={14} /> Content
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              className="font-syne text-body"
              style={{ fontSize: "clamp(26px, 3vw, 34px)", fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              Marketing ads
            </h2>
            <p className="mt-2 text-[15px] font-dm text-muted">
              {loading
                ? "Loading…"
                : `${ads.length} ${ads.length === 1 ? "ad" : "ads"} · ${published} live on /marketing`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/marketing"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2.5 text-[13px] font-dm font-semibold text-body transition-colors hover:bg-white/5"
            >
              View page <ExternalLink size={13} />
            </Link>
            <button
              onClick={load}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3.5 py-2.5 text-[13px] font-dm font-semibold text-body transition-colors hover:bg-white/5 disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-dm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "#0ABFA3" }}
            >
              <Plus size={15} /> Upload ad
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] font-dm text-red-300">
          <TriangleAlert size={16} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">{error}</p>
            <p className="mt-1 text-red-300/70">
              If the table or bucket is missing, run{" "}
              <span className="font-mono">docs/sql/marketing-ads.sql</span> in the Supabase SQL editor.
            </p>
          </div>
        </div>
      )}

      {/* Upload form */}
      {showForm && (
        <UploadForm
          uploading={uploading}
          setUploading={setUploading}
          onClose={() => setShowForm(false)}
          onCreated={(ad) => {
            setAds((prev) => [ad, ...prev]);
            setShowForm(false);
          }}
        />
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-muted">
          <Loader2 size={22} className="animate-spin" />
        </div>
      ) : ads.length === 0 ? (
        <div className="rounded-card border border-dashed border-border bg-surface/40 px-6 py-20 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
            <Upload size={20} className="text-muted" />
          </div>
          <p className="font-syne text-[17px] font-bold text-body">No ads yet</p>
          <p className="mx-auto mt-2 max-w-sm text-[13px] font-dm text-muted">
            Upload an image or video and it will show on the public Marketing page right away.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className={`group relative flex flex-col overflow-hidden rounded-card border border-border bg-surface transition-opacity ${
                ad.published ? "" : "opacity-60"
              }`}
            >
              <div className="relative aspect-video bg-black">
                {ad.mediaType === "video" ? (
                  <video
                    src={ad.mediaUrl}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                    controls
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ad.mediaUrl} alt={ad.title} className="h-full w-full object-cover" />
                )}
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-dm font-semibold uppercase tracking-wider text-white/80 backdrop-blur">
                  {ad.mediaType === "video" ? <Film size={10} /> : <ImageIcon size={10} />}
                  {ad.mediaType}
                </span>
                {!ad.published && (
                  <span className="absolute right-2 top-2 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-dm font-semibold uppercase tracking-wider text-amber-300">
                    Hidden
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="font-syne text-[15px] font-bold text-body" style={{ letterSpacing: "-0.01em" }}>
                  {ad.title}
                </p>
                {ad.description && (
                  <p className="mt-1 line-clamp-2 text-[13px] font-dm leading-relaxed text-muted">
                    {ad.description}
                  </p>
                )}
                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="text-[11px] font-dm text-muted">{fmtDate(ad.createdAt)}</span>
                  <div className="flex items-center gap-1">
                    <IconBtn
                      title={ad.published ? "Hide from /marketing" : "Show on /marketing"}
                      onClick={() => togglePublished(ad)}
                      disabled={busyId === ad.id}
                    >
                      {ad.published ? <Eye size={14} /> : <EyeOff size={14} />}
                    </IconBtn>
                    <IconBtn title="Edit" onClick={() => setEditing(ad)} disabled={busyId === ad.id}>
                      <Pencil size={14} />
                    </IconBtn>
                    <IconBtn
                      title="Delete"
                      onClick={() => setConfirmAd(ad)}
                      disabled={busyId === ad.id}
                      danger
                    >
                      {busyId === ad.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </IconBtn>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editing && <EditModal ad={editing} onClose={() => setEditing(null)} onSave={saveEdit} />}

      {/* Delete confirm */}
      {confirmAd && (
        <Modal onClose={() => setConfirmAd(null)}>
          <p className="font-syne text-[18px] font-bold text-body">Delete this ad?</p>
          <p className="mt-2 text-[14px] font-dm text-muted">
            <span className="text-body">{confirmAd.title}</span> and its file will be removed permanently.
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => setConfirmAd(null)}
              className="rounded-lg border border-border px-4 py-2 text-[13px] font-dm font-semibold text-body hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              onClick={confirmRemove}
              className="rounded-lg bg-red-500/90 px-4 py-2 text-[13px] font-dm font-semibold text-white hover:bg-red-500"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─────────────────────────── Upload form ─────────────────────────── */

function UploadForm({
  uploading,
  setUploading,
  onClose,
  onCreated,
}: {
  uploading: boolean;
  setUploading: (v: boolean) => void;
  onClose: () => void;
  onCreated: (ad: MarketingAd) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [err, setErr] = useState("");
  const [stage, setStage] = useState<"" | "preparing" | "uploading" | "saving">("");
  const inputRef = useRef<HTMLInputElement>(null);

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);
  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const mediaType = file ? mediaTypeFor(file.type) : null;

  const pick = (f: File | null) => {
    setErr("");
    if (!f) return setFile(null);
    const mt = mediaTypeFor(f.type);
    if (!mt) return setErr("Unsupported type. Use JPG, PNG, WebP, GIF, AVIF, MP4, WebM, or MOV.");
    const max = mt === "video" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (f.size > max) return setErr(`File is too large (max ${Math.round(max / 1024 / 1024)} MB for ${mt}s).`);
    setFile(f);
    if (!title.trim()) setTitle(f.name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " "));
  };

  const submit = async () => {
    if (!file || !mediaType) return setErr("Choose an image or video first.");
    if (!title.trim()) return setErr("Title is required.");
    setErr("");
    setUploading(true);
    try {
      // 1) Ask the server for a signed upload slot.
      setStage("preparing");
      const r1 = await fetch("/api/admin/marketing/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: file.type, size: file.size }),
      });
      const d1 = await r1.json();
      if (!r1.ok) throw new Error(d1?.error || "Could not start upload.");

      // 2) Upload straight to Storage from the browser.
      setStage("uploading");
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!url || !anon) throw new Error("Supabase isn't configured in this environment.");
      const supabase = createBrowserClient(url, anon);
      const { error: upErr } = await supabase.storage
        .from(MARKETING_BUCKET)
        .uploadToSignedUrl(d1.path, d1.token, file, { contentType: file.type, upsert: false });
      if (upErr) throw new Error(upErr.message);

      // 3) Record it.
      setStage("saving");
      const r2 = await fetch("/api/admin/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          storagePath: d1.path,
          mediaType,
          published: true,
        }),
      });
      const d2 = await r2.json();
      if (!r2.ok) throw new Error(d2?.error || "Could not save the ad.");
      onCreated(d2.ad as MarketingAd);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      setStage("");
    }
  };

  return (
    <div className="mb-8 rounded-card border border-[#0ABFA3]/30 bg-surface p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <p className="font-syne text-[17px] font-bold text-body">Upload a new ad</p>
        <button
          onClick={onClose}
          disabled={uploading}
          className="rounded-md p-1.5 text-muted transition-colors hover:bg-white/5 hover:text-body disabled:opacity-40"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Dropzone / preview */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            pick(e.dataTransfer.files?.[0] ?? null);
          }}
          className="relative flex min-h-[220px] flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-black/40 text-center"
        >
          {file && preview ? (
            <>
              {mediaType === "video" ? (
                <video src={preview} className="h-full max-h-[320px] w-full object-contain" controls muted playsInline />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="" className="h-full max-h-[320px] w-full object-contain" />
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-black/70 px-3 py-2 text-[11px] font-dm text-white/80 backdrop-blur">
                <span className="truncate">{file.name} · {fmtSize(file.size)}</span>
                <button
                  onClick={() => inputRef.current?.click()}
                  disabled={uploading}
                  className="shrink-0 rounded-md border border-white/20 px-2 py-1 font-semibold hover:bg-white/10 disabled:opacity-40"
                >
                  Replace
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => inputRef.current?.click()}
              className="flex flex-col items-center gap-3 px-6 py-10"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#073B34]">
                <Upload size={20} style={{ color: "#0ABFA3" }} />
              </span>
              <span className="font-dm text-[14px] font-semibold text-body">
                Drop an image or video, or click to browse
              </span>
              <span className="font-dm text-[12px] text-muted">
                Images up to {MAX_IMAGE_BYTES / 1024 / 1024} MB · Videos up to {MAX_VIDEO_BYTES / 1024 / 1024} MB
              </span>
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => pick(e.target.files?.[0] ?? null)}
          />
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4">
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-dm font-semibold uppercase tracking-wider text-muted">
              Title
            </span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={uploading}
              placeholder="Summer GHL promo"
              className="w-full rounded-lg border border-border bg-black/40 px-3.5 py-2.5 text-[14px] font-dm text-body outline-none transition-colors focus:border-[#0ABFA3] disabled:opacity-60"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-dm font-semibold uppercase tracking-wider text-muted">
              Description <span className="normal-case tracking-normal text-muted/70">(optional)</span>
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={uploading}
              rows={5}
              placeholder="Short caption shown under the ad."
              className="w-full resize-y rounded-lg border border-border bg-black/40 px-3.5 py-2.5 text-[14px] font-dm leading-relaxed text-body outline-none transition-colors focus:border-[#0ABFA3] disabled:opacity-60"
            />
          </label>

          {err && (
            <p className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-[13px] font-dm text-red-300">
              <TriangleAlert size={14} className="mt-0.5 shrink-0" /> {err}
            </p>
          )}

          <div className="mt-auto flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              disabled={uploading}
              className="rounded-lg border border-border px-4 py-2.5 text-[13px] font-dm font-semibold text-body transition-colors hover:bg-white/5 disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={uploading || !file}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-dm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "#0ABFA3" }}
            >
              {uploading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  {stage === "uploading" ? "Uploading…" : stage === "saving" ? "Saving…" : "Preparing…"}
                </>
              ) : (
                <>
                  <Upload size={14} /> Publish ad
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Edit modal ─────────────────────────── */

function EditModal({
  ad,
  onClose,
  onSave,
}: {
  ad: MarketingAd;
  onClose: () => void;
  onSave: (title: string, description: string) => Promise<void>;
}) {
  const [title, setTitle] = useState(ad.title);
  const [description, setDescription] = useState(ad.description);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    if (!title.trim()) return setErr("Title is required.");
    setSaving(true);
    setErr("");
    try {
      await onSave(title.trim(), description.trim());
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <p className="font-syne text-[18px] font-bold text-body">Edit ad</p>
      <div className="mt-4 flex flex-col gap-4">
        <label className="block">
          <span className="mb-1.5 block text-[12px] font-dm font-semibold uppercase tracking-wider text-muted">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-border bg-black/40 px-3.5 py-2.5 text-[14px] font-dm text-body outline-none focus:border-[#0ABFA3]"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[12px] font-dm font-semibold uppercase tracking-wider text-muted">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full resize-y rounded-lg border border-border bg-black/40 px-3.5 py-2.5 text-[14px] font-dm leading-relaxed text-body outline-none focus:border-[#0ABFA3]"
          />
        </label>
        {err && <p className="text-[13px] font-dm text-red-300">{err}</p>}
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={onClose}
          disabled={saving}
          className="rounded-lg border border-border px-4 py-2 text-[13px] font-dm font-semibold text-body hover:bg-white/5 disabled:opacity-40"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-dm font-semibold text-white disabled:opacity-50"
          style={{ background: "#0ABFA3" }}
        >
          {saving && <Loader2 size={14} className="animate-spin" />} Save
        </button>
      </div>
    </Modal>
  );
}

/* ─────────────────────────── Bits ─────────────────────────── */

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-card border border-border bg-[#141416] p-6 shadow-2xl shadow-black/60"
      >
        {children}
      </div>
    </div>
  );
}

function IconBtn({
  children,
  title,
  onClick,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md p-1.5 transition-colors disabled:opacity-40 ${
        danger
          ? "text-muted hover:bg-red-500/10 hover:text-red-300"
          : "text-muted hover:bg-white/5 hover:text-body"
      }`}
    >
      {children}
    </button>
  );
}
