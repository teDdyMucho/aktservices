# Admin Dashboard — PRD & Build Tracker

> Living document. Update the **Status** column and check boxes as work
> progresses. Goal: an internal admin dashboard that matches AKT's existing
> dark, futuristic, clean design — same color palette, fonts, and card style as
> the public site.

**Status legend:** ⬜ Not started · 🟡 In progress · ✅ Done · ⏸️ Blocked

---

## 1. Goal

A single authenticated `/admin` area for AKT staff to manage the business behind
the public site. Access is restricted to users whose Supabase profile has
`role = 'admin'`. The UI reuses the existing design system (Tailwind tokens,
Syne/DM Sans, the `glow-card`/`accent-bar` patterns) so it feels native to the
rest of the app.

### Scope (confirmed)

| # | Module          | What it does                                                                 | Status |
|---|-----------------|------------------------------------------------------------------------------|--------|
| 0 | Foundations     | Roles, admin guard, admin shell (sidebar/top bar), 403 screen                | ✅     |
| 1 | Users & access  | List Supabase users, view roles, promote/suspend, see sign-up activity       | ✅     |
| 2 | AI tool usage   | Dashboard of AI tool sessions/metrics — which tools, by whom, how often       | ✅     |
| 3 | Content mgmt    | Manage blog posts, partner case studies, and the AI tools catalog            | 🟡 blog done; partners/tools code-managed |
| 4 | Contact / leads | View & manage contact-form submissions and "Book Call" inquiries             | ✅     |

### Access gating (confirmed)

**Supabase role column.** Add a `profiles` table keyed to `auth.users.id` with a
`role` field. Admin = `role = 'admin'`. Gating enforced both client-side (hide
UI / redirect) and server-side (every admin API route + RLS).

---

## 2. Design system reference (must match)

Pulled from [`tailwind.config.ts`](../tailwind.config.ts) and
[`app/globals.css`](../app/globals.css). **Do not introduce new colors.**

### Colors

| Token         | Hex       | Use                                              |
|---------------|-----------|--------------------------------------------------|
| `background`  | `#050505` | Page background (near-black)                     |
| `surface`     | `#101113` | Cards, panels, nav surfaces                      |
| `primary`/`accent` | `#0ABFA3` | Teal — buttons, active states, accents       |
| `body`/`foreground` | `#F8F9FB` | Primary text                               |
| `muted`       | `#A1A1AA` | Secondary text, labels                           |
| `border`      | `#2C2C2E` | Dividers, card borders                           |
| `nav`         | `#1C1C1E` | Nav background                                   |

**Green tints** (badges, icon chips, callouts): `#062B26`, `#073B34`, `#155E53`.
Accent on dark text/badges: `#7fffe6` / `#7fffee`.

### Type

- **Headings:** Syne — `font-syne`, weights 700–800, tight tracking
  (`letterSpacing: -0.02em` to `-0.03em`).
- **Body / UI:** DM Sans — `font-dm`.
- Section labels: uppercase, `tracking-widest`, `text-muted`, prefixed with the
  `.accent-bar` class (teal bar before label).

### Reusable patterns (already in the codebase)

- `.glow-card` — rotating teal comet border on hover (see `globals.css`).
- `.accent-bar` — teal divider before section labels.
- `rounded-card` (12px), `border-border`, `bg-surface`, `backdrop-blur` panels.
- Card grid: `grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3`.
- Icon chip: `h-11 w-11 rounded-lg` with `background: #062B26 / #073B34` and a
  `lucide-react` icon at `#0ABFA3`.
- Animations: `animate-fade-up`, `framer-motion` for transitions.
- Icons: `lucide-react` only (already a dependency).

### Layout decision

Admin uses its **own shell** (collapsible left sidebar + top bar), **not** the
public `Nav`/`Footer`. Sidebar styled like the nav (`bg-[#1C1C1E]`, teal active
indicator). This keeps the admin visually distinct but on-palette.

---

## 3. Architecture

```
/admin                      → dashboard overview (KPI cards)
/admin/users                → Module 1: Users & access
/admin/usage                → Module 2: AI tool usage
/admin/content              → Module 3: Content management
  /admin/content/blog
  /admin/content/partners
  /admin/content/ai-tools
/admin/leads                → Module 4: Contact / leads
```

- Shared layout: `app/admin/layout.tsx` (sidebar + top bar + server-side admin
  guard).
- Data fetching via server components + admin-only API routes under
  `app/api/admin/*`.
- Privileged reads (listing all users, etc.) need the Supabase
  **service-role key** on the server only — never exposed to the browser.

### Auth / role flow

1. `profiles` table: `id (uuid, FK auth.users)`, `role text default 'user'`,
   `created_at`. RLS: users read own row; only service role writes `role`.
2. Trigger: on new `auth.users` row, insert a matching `profiles` row.
3. `lib/auth.tsx` extended (or a new `useRole` helper) to expose `role`.
4. `app/admin/layout.tsx` server guard: read session → look up role → redirect
   non-admins to `/login?redirect=/admin` or a 403 page.
5. Every `app/api/admin/*` route re-checks admin server-side (defense in depth).

---

## 4. Step-by-step build procedure

Work top-to-bottom. Each phase is independently shippable.

### Phase 0 — Foundations (access + shell) — ✅ DONE
- [x] Create `profiles` table + RLS + new-user trigger — SQL in [`docs/sql/admin-profiles.sql`](./sql/admin-profiles.sql) *(must be run in the Supabase SQL editor)*
- [x] Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local.example` (server-only)
- [x] Seed admin: SQL sets `gwapitos.2025@gmail.com` → `role = 'admin'` *(runs as step 5 of the migration)*
- [x] Extend `lib/auth.tsx` to expose the current user's `role` + `isAdmin`
- [x] Build `app/admin/layout.tsx`: sidebar + top bar + server-side admin guard (`lib/admin.ts` → `checkAdmin()`)
- [x] Add `/admin` 403 / not-authorized state for logged-in non-admins (`components/admin/NotAuthorized.tsx`)
- [x] Show an "Admin" link in `Nav` only when `isAdmin` (desktop + mobile)
- [x] Placeholder pages for `/admin/users|usage|content|leads` so the shell is navigable

> ⚠️ **Manual step remaining:** run [`docs/sql/admin-profiles.sql`](./sql/admin-profiles.sql)
> in Supabase, then set `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`. Until the
> SQL runs, `profiles` doesn't exist and every signed-in user sees "Admins only".

### Phase 1 — Dashboard overview (`/admin`)
- [ ] KPI cards (total users, sessions today, open leads, content counts) using `glow-card`
- [ ] Wire one real metric end-to-end as the pattern reference

### Phase 2 — Users & access (`/admin/users`) — ✅ DONE
- [x] `GET /api/admin/users` (service-role): list users + role + status + last sign-in
- [x] Users table UI (search, role/status badges, loading/empty/error states)
- [x] `POST /api/admin/users/[id]/role` to promote/demote (re-checks admin; blocks self-demote)
- [x] `POST /api/admin/users/[id]/status` suspend/reactivate (also bans/unbans in Supabase Auth; blocks self-suspend)
- [x] Real "Total users" KPI wired into the overview (graceful fallback if service key missing)

> Requires `SUPABASE_SERVICE_ROLE_KEY` in `.env` — without it the Users page
> shows a config error and the overview's user count falls back to "—".

### Phase 3 — AI tool usage (`/admin/usage`) — ✅ DONE
- [x] Source of truth: new `tool_usage` table — SQL in [`docs/sql/tool-usage.sql`](./sql/tool-usage.sql) *(must be run in Supabase)*
- [x] Log a row when a tool runs: `lib/usage.ts` → `logToolUsage()`, hooked into `app/api/design-adjuster` + `app/api/ai-tool` (fail-safe; never breaks the tool)
- [x] `GET /api/admin/usage` aggregation (totals, today, 7d, unique users, per-tool, top users, recent)
- [x] Usage dashboard: KPIs, sessions-by-tool bars, top users, recent activity (loading/empty/error states)
- [x] Real "Sessions today" KPI wired into the overview

> NOTE: the "sessions" numbers shown on the public `/ai-tools` page are still
> the original hard-coded placeholders — those are marketing copy, separate from
> this real internal tracking. Swap them later if desired.
> Requires running [`docs/sql/tool-usage.sql`](./sql/tool-usage.sql) + the service key.

### Phase 4 — Content management (`/admin/content`) — 🟡 BLOG DONE
- [x] Decision: **Supabase-backed**, with the public page falling back to static content (no live-site risk)
- [x] Blog: full CRUD — `blog_posts` SQL ([`docs/sql/blog-posts.sql`](./sql/blog-posts.sql), seeds the 6 current posts), `/api/admin/blog` (+`/[id]`), manager UI + create/edit modal, publish/draft + featured toggles, delete
- [x] Public `/blog` reads published posts from Supabase, falls back to the static list if empty/unconfigured
- [x] Content hub at `/admin/content`; real "Content items" KPI on the overview
- [ ] Partners: still code-managed (`lib/partner-cases.ts` + dedicated per-partner pages/images) — migration is a future phase
- [ ] AI tools catalog: still code-managed (static array in `app/ai-tools/page.tsx`) — future phase

- [x] Cover image upload: `image_url` column + public `blog-images` Storage bucket ([`docs/sql/blog-image.sql`](./sql/blog-image.sql)), `POST /api/admin/blog/upload` (service-role, 5 MB limit, type-checked), editor upload/preview/replace/remove, thumbnails in the admin list, cover images on the public blog cards

- [x] Blog article pages: `app/blog/[slug]/page.tsx` renders the full post (cover, meta, tags, body, CTA), reads Supabase by slug with static fallback + `notFound()` 404 + SEO `generateMetadata`. Added a `content` (body) column ([`docs/sql/blog-content.sql`](./sql/blog-content.sql)) + a Body field in the editor. Static posts extracted to `lib/blog-fallback.ts`.

> Requires running [`docs/sql/blog-posts.sql`](./sql/blog-posts.sql), then
> [`docs/sql/blog-image.sql`](./sql/blog-image.sql) **and**
> [`docs/sql/blog-content.sql`](./sql/blog-content.sql) + the service key.

### Phase 5 — Contact / leads (`/admin/leads`) — ✅ DONE
- [x] Confirmed: the contact form had **no backend** (just local state) — built persistence from scratch
- [x] `leads` table — SQL in [`docs/sql/leads.sql`](./sql/leads.sql) *(must be run in Supabase)*
- [x] Public `POST /api/leads` (validates name/email/message, service-role insert); contact form now submits to it with sending/error states + email fallback
- [x] Admin API: `GET /api/admin/leads`, `PATCH /api/admin/leads/[id]` (status + notes), `DELETE`
- [x] Leads inbox UI: status filter tabs w/ counts, contact details (mailto/tel), message, need badge, internal notes, status segmented control, delete
- [x] Real "Open leads" KPI (status ≠ closed) wired into the overview — all 4 overview KPIs now live

> "Assignment" from the original plan was dropped (no team/seat concept yet);
> status + internal notes cover the workflow. Requires running
> [`docs/sql/leads.sql`](./sql/leads.sql) + the service key for the form to persist.

### Phase 6 — Polish & hardening
- [ ] Empty / loading / error states for every table
- [ ] Mobile responsiveness of the admin shell
- [ ] Confirm RLS + every `/api/admin/*` route rejects non-admins
- [ ] Audit log for sensitive actions (role changes, deletes) — optional

---

## 5. File map (planned)

```
app/admin/layout.tsx                 # sidebar + top bar + admin guard
app/admin/page.tsx                   # overview
app/admin/users/page.tsx
app/admin/usage/page.tsx
app/admin/content/page.tsx (+ blog/ partners/ ai-tools/)
app/admin/leads/page.tsx
app/api/admin/users/route.ts
app/api/admin/users/[id]/role/route.ts
app/api/admin/usage/route.ts
app/api/admin/leads/route.ts
components/admin/Sidebar.tsx
components/admin/StatCard.tsx
components/admin/DataTable.tsx        # shared table primitive
lib/supabase/admin.ts                # service-role client (server-only)
lib/admin.ts                         # requireAdmin() guard helper
```

---

## 6. Open questions / decisions to confirm

- [ ] **Service-role key**: confirm it can be added to the deploy env (Vercel/host). Required for listing all users.
- [ ] **"Sessions" data**: the numbers on `/ai-tools` are placeholders — is real usage tracking in scope now, or show placeholders until Phase 3 lands?
- [ ] **Content storage**: keep blog/partners/tools as code, or migrate to Supabase so the admin can edit without deploys?
- [ ] **Leads**: does a contact-form backend already exist, or do we build persistence from scratch?
- [ ] **Audit log**: needed for v1, or later?

---

## 7. Changelog

| Date       | Change                                               |
|------------|------------------------------------------------------|
| 2026-05-27 | Initial PRD + build tracker created. Scope & gating confirmed. |
| 2026-05-27 | Phase 0 built: `profiles` SQL, role in auth context, `checkAdmin()` guard, admin shell + 403 screen, module placeholders, role-gated Nav link. Pending manual SQL + env step. |
| 2026-05-27 | Phase 2 (Users & access) built: `/api/admin/users` list + role/status routes (service-role, self-protection, auth ban), users table UI, real Total-users KPI. Typecheck + lint clean. |
| 2026-05-27 | Phase 3 (AI tool usage) built: `tool_usage` SQL, `logToolUsage()` hooked into tool routes, `/api/admin/usage` aggregation, usage dashboard UI, real Sessions-today KPI. Typecheck + lint clean. |
| 2026-05-27 | Phase 4 (Content/Blog) built: `blog_posts` SQL + seed, blog CRUD API, content hub + blog manager/editor UI, public `/blog` reads Supabase with static fallback, real Content-items KPI. Partners/AI-tools left code-managed. Typecheck + lint clean. |
| 2026-05-27 | Blog cover images added: `image_url` column + `blog-images` Storage bucket, `/api/admin/blog/upload`, editor upload/preview, admin thumbnails + public card images. Typecheck + lint clean. |
| 2026-05-27 | Phase 5 (Leads) built: `leads` SQL, public `/api/leads` + contact form now persists, admin leads API (list/patch/delete), leads inbox UI, real Open-leads KPI. All 5 modules done. Typecheck + lint clean. |
| 2026-05-27 | Nav header reworked: Book Call removed from header (kept in footer/CTAs), user menu pinned flush-right with a name dropdown for Log out. |
| 2026-05-27 | Blog article pages built (`/blog/[slug]`): `content` body column + editor field, full post page with DB→static fallback + 404 + SEO. Cards are now clickable. Typecheck + lint clean. |
| 2026-08-27 | Marketing Ads module: `marketing_ads` SQL + `marketing-ads` bucket (`docs/sql/marketing-ads.sql`), admin API (list/create/patch/delete + signed upload URL so videos upload browser→Storage directly), `/admin/content/marketing` manager (upload image/video, edit, hide, delete), public `/marketing` gallery + `/api/marketing`, "Marketing" Nav tab, CSP `media-src`. Homepage side badges replaced by three `HeroPanels` (GHL offers · rotating Services · Marketing Ads). |
| 2026-08-27 | Marketing folders + multi-upload: `marketing_folders` table + `folder_id` on ads (`docs/sql/marketing-folders.sql`, run after marketing-ads.sql), folder CRUD API (`/api/admin/marketing/folders[/:id]`, delete cascades ads + files), admin manager reorganised by folder with a multi-file drag-drop uploader (3 concurrent, per-file status/retry, move ads between folders). Public `/marketing` shows one card per collection (unsorted ads grouped under the reserved `other` slug); clicking opens `/marketing/[slug]` — a grid of every ad inside, each with its own inline player (images open a lightbox). |
