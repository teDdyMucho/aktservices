"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  ExternalLink,
  Film,
  Folder,
  FolderOpen,
  FolderPlus,
  ImageIcon,
  Inbox,
  LayoutGrid,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  TriangleAlert,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import type { MarketingAd, MarketingFolder } from "@/lib/types/admin";
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
const titleFromName = (name: string) => name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").trim();

const ACCEPT = [...IMAGE_TYPES, ...VIDEO_TYPES].join(",");
const UPLOAD_CONCURRENCY = 3;

/** "all" | "none" (unsorted) | folder id */
type FolderSel = "all" | "none" | string;

/**
 * Admin manager for /marketing.
 *
 * Ads are organised into folders (collections). Upload many files at once
 * into a folder: each file goes browser → Supabase Storage via a signed upload
 * URL (see /api/admin/marketing/upload-url), then a row is created per file.
 */
export default function MarketingManager() {
  const [ads, setAds] = useState<MarketingAd[]>([]);
  const [folders, setFolders] = useState<MarketingFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sel, setSel] = useState<FolderSel>("all");

  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [folderModal, setFolderModal] = useState<"new" | MarketingFolder | null>(null);
  const [editing, setEditing] = useState<MarketingAd | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ kind: "ad"; ad: MarketingAd } | { kind: "folder"; folder: MarketingFolder } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [r1, r2] = await Promise.all([
        fetch("/api/admin/marketing", { cache: "no-store" }),
        fetch("/api/admin/marketing/folders", { cache: "no-store" }),
      ]);
      const d1 = await r1.json();
      const d2 = await r2.json();
      if (!r1.ok) throw new Error(d1?.error || `Request failed (${r1.status})`);
      if (!r2.ok) throw new Error(d2?.error || `Request failed (${r2.status})`);
      setAds(d1.ads as MarketingAd[]);
      setFolders(d2.folders as MarketingFolder[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Folder counts derived from the loaded ads (stay correct after local edits).
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    let none = 0;
    for (const a of ads) {
      if (a.folderId) m.set(a.folderId, (m.get(a.folderId) ?? 0) + 1);
      else none++;
    }
    return { byFolder: m, unsorted: none };
  }, [ads]);
  const countOf = (f: MarketingFolder) => counts.byFolder.get(f.id) ?? 0;

  const visible = useMemo(() => {
    if (sel === "all") return ads;
    if (sel === "none") return ads.filter((a) => !a.folderId);
    return ads.filter((a) => a.folderId === sel);
  }, [ads, sel]);

  const selFolder = sel !== "all" && sel !== "none" ? folders.find((f) => f.id === sel) ?? null : null;

  /* ── ad actions ── */
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

  const saveAd = async (title: string, description: string, folderId: string | null) => {
    if (!editing) return;
    const res = await fetch(`/api/admin/marketing/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, folderId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Save failed.");
    setAds((prev) => prev.map((a) => (a.id === editing.id ? (data.ad as MarketingAd) : a)));
    setEditing(null);
  };

  /* ── folder actions ── */
  const saveFolder = async (name: string, description: string) => {
    const isNew = folderModal === "new";
    const url = isNew ? "/api/admin/marketing/folders" : `/api/admin/marketing/folders/${(folderModal as MarketingFolder).id}`;
    const res = await fetch(url, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Save failed.");
    const saved = data.folder as MarketingFolder;
    setFolders((prev) => (isNew ? [saved, ...prev] : prev.map((f) => (f.id === saved.id ? saved : f))));
    if (!isNew) {
      setAds((prev) => prev.map((a) => (a.folderId === saved.id ? { ...a, folderName: saved.name, folderSlug: saved.slug } : a)));
    }
    setFolderModal(null);
    if (isNew) setSel(saved.id);
  };

  const toggleFolderPublished = async (folder: MarketingFolder) => {
    setBusyId(folder.id);
    setError("");
    try {
      const res = await fetch(`/api/admin/marketing/folders/${folder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !folder.published }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Update failed.");
      setFolders((prev) => prev.map((f) => (f.id === folder.id ? (data.folder as MarketingFolder) : f)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed.");
    } finally {
      setBusyId(null);
    }
  };

  const confirmRemove = async () => {
    if (!confirm) return;
    const target = confirm;
    setConfirm(null);
    setError("");
    try {
      if (target.kind === "ad") {
        setBusyId(target.ad.id);
        const res = await fetch(`/api/admin/marketing/${target.ad.id}`, { method: "DELETE" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Delete failed.");
        setAds((prev) => prev.filter((a) => a.id !== target.ad.id));
      } else {
        setBusyId(target.folder.id);
        const res = await fetch(`/api/admin/marketing/folders/${target.folder.id}`, { method: "DELETE" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Delete failed.");
        setFolders((prev) => prev.filter((f) => f.id !== target.folder.id));
        setAds((prev) => prev.filter((a) => a.folderId !== target.folder.id));
        if (sel === target.folder.id) setSel("all");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setBusyId(null);
    }
  };

  const publishedAds = ads.filter((a) => a.published).length;

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-6">
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
                : `${folders.length} ${folders.length === 1 ? "folder" : "folders"} · ${ads.length} ${ads.length === 1 ? "ad" : "ads"} · ${publishedAds} live`}
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
              onClick={() => setFolderModal("new")}
              className="inline-flex items-center gap-2 rounded-lg border border-[#0ABFA3]/40 px-4 py-2.5 text-[13px] font-dm font-semibold text-[#0ABFA3] transition-colors hover:bg-[#0ABFA3]/10"
            >
              <FolderPlus size={15} /> New folder
            </button>
            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-dm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "#0ABFA3" }}
            >
              <Plus size={15} /> Upload files
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
              If a table or column is missing, run{" "}
              <span className="font-mono">docs/sql/marketing-ads.sql</span> then{" "}
              <span className="font-mono">docs/sql/marketing-folders.sql</span> in the Supabase SQL editor.
            </p>
          </div>
        </div>
      )}

      {/* Folder tabs */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <FolderChip active={sel === "all"} onClick={() => setSel("all")} icon={LayoutGrid} label="All" count={ads.length} />
        <FolderChip active={sel === "none"} onClick={() => setSel("none")} icon={Inbox} label="Unsorted" count={counts.unsorted} />
        {folders.map((f) => (
          <FolderChip
            key={f.id}
            active={sel === f.id}
            onClick={() => setSel(f.id)}
            icon={sel === f.id ? FolderOpen : Folder}
            label={f.name}
            count={countOf(f)}
            muted={!f.published}
          />
        ))}
      </div>

      {/* Selected folder toolbar */}
      {selFolder && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-card border border-border bg-surface px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate font-syne text-[16px] font-bold text-body">{selFolder.name}</p>
              {!selFolder.published && (
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-dm font-semibold uppercase tracking-wider text-amber-300">
                  Hidden
                </span>
              )}
            </div>
            <p className="mt-0.5 truncate text-[12px] font-dm text-muted">
              /marketing/{selFolder.slug}
              {selFolder.description ? ` · ${selFolder.description}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Link
              href={`/marketing/${selFolder.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-dm font-semibold text-muted transition-colors hover:bg-white/5 hover:text-body"
            >
              Open <ExternalLink size={12} />
            </Link>
            <IconBtn
              title={selFolder.published ? "Hide folder from /marketing" : "Show folder on /marketing"}
              onClick={() => toggleFolderPublished(selFolder)}
              disabled={busyId === selFolder.id}
            >
              {selFolder.published ? <Eye size={14} /> : <EyeOff size={14} />}
            </IconBtn>
            <IconBtn title="Rename / describe" onClick={() => setFolderModal(selFolder)}>
              <Pencil size={14} />
            </IconBtn>
            <IconBtn title="Delete folder and its ads" onClick={() => setConfirm({ kind: "folder", folder: selFolder })} danger>
              <Trash2 size={14} />
            </IconBtn>
          </div>
        </div>
      )}

      {/* Upload */}
      {showUpload && (
        <UploadForm
          key={selFolder?.id ?? "none"}
          folders={folders}
          defaultFolderId={selFolder?.id ?? null}
          uploading={uploading}
          setUploading={setUploading}
          onClose={() => setShowUpload(false)}
          onCreated={(created) => setAds((prev) => [...created, ...prev])}
          onCreateFolder={() => setFolderModal("new")}
        />
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-muted">
          <Loader2 size={22} className="animate-spin" />
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-card border border-dashed border-border bg-surface/40 px-6 py-20 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
            <Upload size={20} className="text-muted" />
          </div>
          <p className="font-syne text-[17px] font-bold text-body">
            {selFolder ? `“${selFolder.name}” is empty` : "No ads here yet"}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-[13px] font-dm text-muted">
            Click <span className="text-body">Upload files</span> to add images or videos — you can drop many at once.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((ad) => (
            <div
              key={ad.id}
              className={`group relative flex flex-col overflow-hidden rounded-card border border-border bg-surface transition-opacity ${
                ad.published ? "" : "opacity-60"
              }`}
            >
              <div className="relative aspect-video bg-black">
                {ad.mediaType === "video" ? (
                  <video src={ad.mediaUrl} className="h-full w-full object-cover" muted playsInline preload="metadata" controls />
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
                  <p className="mt-1 line-clamp-2 text-[13px] font-dm leading-relaxed text-muted">{ad.description}</p>
                )}
                <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                  <span className="flex min-w-0 items-center gap-1.5 text-[11px] font-dm text-muted">
                    {sel === "all" && (
                      <span className="inline-flex max-w-[140px] items-center gap-1 truncate rounded-full bg-white/5 px-2 py-0.5">
                        <Folder size={10} /> {ad.folderName ?? "Unsorted"}
                      </span>
                    )}
                    <span className="truncate">{fmtDate(ad.createdAt)}</span>
                  </span>
                  <div className="flex shrink-0 items-center gap-1">
                    <IconBtn
                      title={ad.published ? "Hide from /marketing" : "Show on /marketing"}
                      onClick={() => togglePublished(ad)}
                      disabled={busyId === ad.id}
                    >
                      {ad.published ? <Eye size={14} /> : <EyeOff size={14} />}
                    </IconBtn>
                    <IconBtn title="Edit / move" onClick={() => setEditing(ad)} disabled={busyId === ad.id}>
                      <Pencil size={14} />
                    </IconBtn>
                    <IconBtn title="Delete" onClick={() => setConfirm({ kind: "ad", ad })} disabled={busyId === ad.id} danger>
                      {busyId === ad.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </IconBtn>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {editing && <EditAdModal ad={editing} folders={folders} onClose={() => setEditing(null)} onSave={saveAd} />}
      {folderModal && (
        <FolderModal
          folder={folderModal === "new" ? null : folderModal}
          onClose={() => setFolderModal(null)}
          onSave={saveFolder}
        />
      )}
      {confirm && (
        <Modal onClose={() => setConfirm(null)}>
          {confirm.kind === "ad" ? (
            <>
              <p className="font-syne text-[18px] font-bold text-body">Delete this ad?</p>
              <p className="mt-2 text-[14px] font-dm text-muted">
                <span className="text-body">{confirm.ad.title}</span> and its file will be removed permanently.
              </p>
            </>
          ) : (
            <>
              <p className="font-syne text-[18px] font-bold text-body">Delete folder “{confirm.folder.name}”?</p>
              <p className="mt-2 text-[14px] font-dm text-muted">
                This removes the folder <span className="text-body">and all {countOf(confirm.folder)} ads inside it</span>,
                including their files. This can’t be undone.
              </p>
            </>
          )}
          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => setConfirm(null)}
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

/* ─────────────────────────── Multi-file upload ─────────────────────────── */

type QueuedFile = {
  key: string;
  file: File;
  title: string;
  preview: string;
  status: "queued" | "uploading" | "done" | "error";
  error?: string;
};

function UploadForm({
  folders,
  defaultFolderId,
  uploading,
  setUploading,
  onClose,
  onCreated,
  onCreateFolder,
}: {
  folders: MarketingFolder[];
  defaultFolderId: string | null;
  uploading: boolean;
  setUploading: (v: boolean) => void;
  onClose: () => void;
  onCreated: (ads: MarketingAd[]) => void;
  onCreateFolder: () => void;
}) {
  const [folderId, setFolderId] = useState<string>(defaultFolderId ?? "");
  const [description, setDescription] = useState("");
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [err, setErr] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Revoke object URLs on unmount.
  useEffect(() => {
    return () => queue.forEach((q) => URL.revokeObjectURL(q.preview));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = (list: FileList | File[] | null) => {
    if (!list) return;
    const rejected: string[] = [];
    const accepted: QueuedFile[] = [];
    Array.from(list).forEach((f) => {
      const mt = mediaTypeFor(f.type);
      if (!mt) return rejected.push(`${f.name}: unsupported type`);
      const max = mt === "video" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
      if (f.size > max) return rejected.push(`${f.name}: over ${Math.round(max / 1024 / 1024)} MB`);
      accepted.push({
        key: `${f.name}-${f.size}-${f.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
        file: f,
        title: titleFromName(f.name) || "Untitled",
        preview: URL.createObjectURL(f),
        status: "queued",
      });
    });
    setQueue((prev) => [...prev, ...accepted]);
    setErr(rejected.length ? `Skipped — ${rejected.join("; ")}` : "");
  };

  const removeItem = (key: string) =>
    setQueue((prev) => {
      const item = prev.find((q) => q.key === key);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((q) => q.key !== key);
    });

  const patch = (key: string, p: Partial<QueuedFile>) =>
    setQueue((prev) => prev.map((q) => (q.key === key ? { ...q, ...p } : q)));

  const uploadOne = async (item: QueuedFile, supabase: ReturnType<typeof createBrowserClient>): Promise<MarketingAd> => {
    const mediaType = mediaTypeFor(item.file.type)!;
    const r1 = await fetch("/api/admin/marketing/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentType: item.file.type, size: item.file.size }),
    });
    const d1 = await r1.json();
    if (!r1.ok) throw new Error(d1?.error || "Could not start upload.");

    const { error: upErr } = await supabase.storage
      .from(MARKETING_BUCKET)
      .uploadToSignedUrl(d1.path, d1.token, item.file, { contentType: item.file.type, upsert: false });
    if (upErr) throw new Error(upErr.message);

    const r2 = await fetch("/api/admin/marketing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: item.title.trim() || titleFromName(item.file.name) || "Untitled",
        description: description.trim(),
        storagePath: d1.path,
        mediaType,
        folderId: folderId || null,
        published: true,
      }),
    });
    const d2 = await r2.json();
    if (!r2.ok) throw new Error(d2?.error || "Could not save the ad.");
    return d2.ad as MarketingAd;
  };

  const submit = async () => {
    const pending = queue.filter((q) => q.status === "queued" || q.status === "error");
    if (!pending.length) return setErr("Add at least one image or video.");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon) return setErr("Supabase isn't configured in this environment.");
    const supabase = createBrowserClient(url, anon);

    setErr("");
    setUploading(true);
    const created: MarketingAd[] = [];
    let failed = 0;

    // Simple worker pool — UPLOAD_CONCURRENCY files in flight at once.
    let cursor = 0;
    const worker = async () => {
      while (cursor < pending.length) {
        const item = pending[cursor++];
        patch(item.key, { status: "uploading", error: undefined });
        try {
          const ad = await uploadOne(item, supabase);
          created.push(ad);
          patch(item.key, { status: "done" });
        } catch (e) {
          failed++;
          patch(item.key, { status: "error", error: e instanceof Error ? e.message : "Upload failed." });
        }
      }
    };
    await Promise.all(Array.from({ length: Math.min(UPLOAD_CONCURRENCY, pending.length) }, worker));

    setUploading(false);
    if (created.length) onCreated(created);
    if (failed) {
      setErr(`${failed} ${failed === 1 ? "file" : "files"} failed — fix and click Upload again to retry them.`);
    } else {
      onClose();
    }
  };

  const doneCount = queue.filter((q) => q.status === "done").length;
  const pendingCount = queue.filter((q) => q.status === "queued" || q.status === "error").length;
  const totalBytes = queue.reduce((n, q) => n + q.file.size, 0);

  return (
    <div className="mb-8 rounded-card border border-[#0ABFA3]/30 bg-surface p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <p className="font-syne text-[17px] font-bold text-body">Upload files</p>
        <button
          onClick={onClose}
          disabled={uploading}
          className="rounded-md p-1.5 text-muted transition-colors hover:bg-white/5 hover:text-body disabled:opacity-40"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>

      {/* Folder + description */}
      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[12px] font-dm font-semibold uppercase tracking-wider text-muted">
            Upload into folder
          </span>
          <div className="flex gap-2">
            <select
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              disabled={uploading}
              className="w-full rounded-lg border border-border bg-black/40 px-3.5 py-2.5 text-[14px] font-dm text-body outline-none transition-colors focus:border-[#0ABFA3] disabled:opacity-60"
            >
              <option value="">Unsorted (no folder)</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                  {f.published ? "" : " (hidden)"}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onCreateFolder}
              disabled={uploading}
              title="New folder"
              className="shrink-0 rounded-lg border border-border px-3 text-muted transition-colors hover:bg-white/5 hover:text-body disabled:opacity-40"
            >
              <FolderPlus size={16} />
            </button>
          </div>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[12px] font-dm font-semibold uppercase tracking-wider text-muted">
            Description <span className="normal-case tracking-normal text-muted/70">(optional, applied to all)</span>
          </span>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={uploading}
            placeholder="Short caption shown under each ad."
            className="w-full rounded-lg border border-border bg-black/40 px-3.5 py-2.5 text-[14px] font-dm text-body outline-none transition-colors focus:border-[#0ABFA3] disabled:opacity-60"
          />
        </label>
      </div>

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`rounded-lg border border-dashed bg-black/40 transition-colors ${
          dragging ? "border-[#0ABFA3] bg-[#0ABFA3]/5" : "border-border"
        }`}
      >
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full flex-col items-center gap-2 px-6 py-8 text-center disabled:opacity-60"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#073B34]">
            <Upload size={20} style={{ color: "#0ABFA3" }} />
          </span>
          <span className="font-dm text-[14px] font-semibold text-body">
            Drop images &amp; videos here, or click to browse — select as many as you like
          </span>
          <span className="font-dm text-[12px] text-muted">
            JPG, PNG, WebP, GIF, AVIF up to {MAX_IMAGE_BYTES / 1024 / 1024} MB · MP4, WebM, MOV up to {MAX_VIDEO_BYTES / 1024 / 1024} MB
          </span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />

        {/* Queue */}
        {queue.length > 0 && (
          <div className="border-t border-border p-3">
            <div className="mb-2 flex items-center justify-between px-1 text-[12px] font-dm text-muted">
              <span>
                {queue.length} {queue.length === 1 ? "file" : "files"} · {fmtSize(totalBytes)}
                {doneCount ? ` · ${doneCount} uploaded` : ""}
              </span>
              {!uploading && (
                <button
                  onClick={() => {
                    queue.forEach((q) => URL.revokeObjectURL(q.preview));
                    setQueue([]);
                  }}
                  className="text-muted hover:text-body"
                >
                  Clear all
                </button>
              )}
            </div>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {queue.map((q) => {
                const mt = mediaTypeFor(q.file.type);
                return (
                  <li
                    key={q.key}
                    className={`flex items-center gap-3 rounded-lg border p-2 ${
                      q.status === "error"
                        ? "border-red-500/40 bg-red-500/5"
                        : q.status === "done"
                          ? "border-[#0ABFA3]/40 bg-[#0ABFA3]/5"
                          : "border-border bg-surface"
                    }`}
                  >
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md bg-black">
                      {mt === "video" ? (
                        <video src={q.preview} className="h-full w-full object-cover" muted playsInline preload="metadata" />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={q.preview} alt="" className="h-full w-full object-cover" />
                      )}
                      <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1 text-[9px] font-dm font-semibold uppercase text-white/80">
                        {mt}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <input
                        value={q.title}
                        onChange={(e) => patch(q.key, { title: e.target.value })}
                        disabled={uploading || q.status === "done"}
                        className="w-full rounded-md border border-transparent bg-transparent px-1.5 py-1 text-[13px] font-dm font-semibold text-body outline-none transition-colors hover:border-border focus:border-[#0ABFA3] disabled:opacity-70"
                      />
                      <p className="truncate px-1.5 text-[11px] font-dm text-muted">
                        {q.status === "error" ? <span className="text-red-300">{q.error}</span> : `${q.file.name} · ${fmtSize(q.file.size)}`}
                      </p>
                    </div>
                    <div className="shrink-0 pr-1">
                      {q.status === "uploading" ? (
                        <Loader2 size={16} className="animate-spin text-[#0ABFA3]" />
                      ) : q.status === "done" ? (
                        <CheckCircle2 size={16} className="text-[#0ABFA3]" />
                      ) : q.status === "error" ? (
                        <XCircle size={16} className="text-red-300" />
                      ) : (
                        <button
                          onClick={() => removeItem(q.key)}
                          disabled={uploading}
                          className="rounded-md p-1 text-muted hover:bg-white/5 hover:text-body"
                          aria-label="Remove"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {err && (
        <p className="mt-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-[13px] font-dm text-red-300">
          <TriangleAlert size={14} className="mt-0.5 shrink-0" /> {err}
        </p>
      )}

      <div className="mt-5 flex items-center justify-end gap-2">
        <button
          onClick={onClose}
          disabled={uploading}
          className="rounded-lg border border-border px-4 py-2.5 text-[13px] font-dm font-semibold text-body transition-colors hover:bg-white/5 disabled:opacity-40"
        >
          {doneCount && !pendingCount ? "Done" : "Cancel"}
        </button>
        <button
          onClick={submit}
          disabled={uploading || pendingCount === 0}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-dm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: "#0ABFA3" }}
        >
          {uploading ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Uploading {doneCount}/{queue.length}…
            </>
          ) : (
            <>
              <Upload size={14} /> Upload {pendingCount || ""} {pendingCount === 1 ? "file" : "files"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────── Modals ─────────────────────────── */

function EditAdModal({
  ad,
  folders,
  onClose,
  onSave,
}: {
  ad: MarketingAd;
  folders: MarketingFolder[];
  onClose: () => void;
  onSave: (title: string, description: string, folderId: string | null) => Promise<void>;
}) {
  const [title, setTitle] = useState(ad.title);
  const [description, setDescription] = useState(ad.description);
  const [folderId, setFolderId] = useState(ad.folderId ?? "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    if (!title.trim()) return setErr("Title is required.");
    setSaving(true);
    setErr("");
    try {
      await onSave(title.trim(), description.trim(), folderId || null);
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
        <Field label="Title">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Folder">
          <select value={folderId} onChange={(e) => setFolderId(e.target.value)} className={inputCls}>
            <option value="">Unsorted (no folder)</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Description">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={`${inputCls} resize-y leading-relaxed`} />
        </Field>
        {err && <p className="text-[13px] font-dm text-red-300">{err}</p>}
      </div>
      <ModalActions onClose={onClose} onSubmit={submit} saving={saving} />
    </Modal>
  );
}

function FolderModal({
  folder,
  onClose,
  onSave,
}: {
  folder: MarketingFolder | null;
  onClose: () => void;
  onSave: (name: string, description: string) => Promise<void>;
}) {
  const [name, setName] = useState(folder?.name ?? "");
  const [description, setDescription] = useState(folder?.description ?? "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    if (!name.trim()) return setErr("Folder name is required.");
    setSaving(true);
    setErr("");
    try {
      await onSave(name.trim(), description.trim());
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <p className="font-syne text-[18px] font-bold text-body">{folder ? "Edit folder" : "New folder"}</p>
      <p className="mt-1 text-[13px] font-dm text-muted">
        A folder groups many ads — one campaign, one client, one month. Visitors open a folder to see everything inside.
      </p>
      <div className="mt-4 flex flex-col gap-4">
        <Field label="Name">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Summer 2026 campaign"
            className={inputCls}
          />
        </Field>
        <Field label="Description (optional)">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={`${inputCls} resize-y leading-relaxed`} />
        </Field>
        {err && <p className="text-[13px] font-dm text-red-300">{err}</p>}
      </div>
      <ModalActions onClose={onClose} onSubmit={submit} saving={saving} label={folder ? "Save" : "Create folder"} />
    </Modal>
  );
}

/* ─────────────────────────── Bits ─────────────────────────── */

const inputCls =
  "w-full rounded-lg border border-border bg-black/40 px-3.5 py-2.5 text-[14px] font-dm text-body outline-none transition-colors focus:border-[#0ABFA3]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-dm font-semibold uppercase tracking-wider text-muted">{label}</span>
      {children}
    </label>
  );
}

function ModalActions({
  onClose,
  onSubmit,
  saving,
  label = "Save",
}: {
  onClose: () => void;
  onSubmit: () => void;
  saving: boolean;
  label?: string;
}) {
  return (
    <div className="mt-6 flex justify-end gap-2">
      <button
        onClick={onClose}
        disabled={saving}
        className="rounded-lg border border-border px-4 py-2 text-[13px] font-dm font-semibold text-body hover:bg-white/5 disabled:opacity-40"
      >
        Cancel
      </button>
      <button
        onClick={onSubmit}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-dm font-semibold text-white disabled:opacity-50"
        style={{ background: "#0ABFA3" }}
      >
        {saving && <Loader2 size={14} className="animate-spin" />} {label}
      </button>
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-card border border-border bg-[#141416] p-6 shadow-2xl shadow-black/60"
      >
        {children}
      </div>
    </div>
  );
}

function FolderChip({
  active,
  onClick,
  icon: Icon,
  label,
  count,
  muted,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Folder;
  label: string;
  count: number;
  muted?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex max-w-[240px] items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-dm font-semibold transition-colors ${
        active
          ? "border-[#0ABFA3]/50 bg-[#0ABFA3]/10 text-[#0ABFA3]"
          : "border-border text-muted hover:bg-white/5 hover:text-body"
      } ${muted ? "opacity-60" : ""}`}
    >
      <Icon size={14} className="shrink-0" />
      <span className="truncate">{label}</span>
      <span className={`text-[11px] ${active ? "text-[#0ABFA3]/70" : "text-muted/60"}`}>{count}</span>
    </button>
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
        danger ? "text-muted hover:bg-red-500/10 hover:text-red-300" : "text-muted hover:bg-white/5 hover:text-body"
      }`}
    >
      {children}
    </button>
  );
}
