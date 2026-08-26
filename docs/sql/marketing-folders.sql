-- ============================================================================
-- Marketing Ads: folders (collections) + folder_id on marketing_ads
-- Run AFTER docs/sql/marketing-ads.sql in the Supabase SQL editor. Idempotent.
--
-- A folder groups many ads (e.g. one campaign). Admins upload several files at
-- once into a folder; the public /marketing page lists folders and
-- /marketing/<slug> shows everything inside one.
-- ============================================================================

create table if not exists public.marketing_folders (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  description text not null default '',
  cover_url   text,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists marketing_folders_published_idx
  on public.marketing_folders (published, created_at desc);

create or replace function public.touch_marketing_folders_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists marketing_folders_set_updated_at on public.marketing_folders;
create trigger marketing_folders_set_updated_at
  before update on public.marketing_folders
  for each row execute function public.touch_marketing_folders_updated_at();

alter table public.marketing_folders enable row level security;

drop policy if exists "marketing_folders_select_published" on public.marketing_folders;
create policy "marketing_folders_select_published"
  on public.marketing_folders for select
  using (published = true);

-- Link ads to folders. Deleting a folder deletes the ads inside it (the admin
-- API also removes their files from Storage first).
alter table public.marketing_ads
  add column if not exists folder_id uuid
    references public.marketing_folders(id) on delete cascade;

create index if not exists marketing_ads_folder_idx
  on public.marketing_ads (folder_id, created_at desc);
