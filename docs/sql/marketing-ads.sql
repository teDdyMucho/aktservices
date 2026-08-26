-- ============================================================================
-- Marketing Ads: marketing_ads table + marketing-ads Storage bucket
-- Run once in the Supabase SQL editor. Idempotent.
--
-- Backs the admin Marketing manager (/admin/content/marketing) and the public
-- /marketing page. Published ads are world-readable (anon key) so the public
-- page can render them; all writes go through the service-role key on the
-- server. Files are uploaded straight from the admin's browser to the public
-- `marketing-ads` bucket via a server-issued signed upload URL, so large videos
-- never pass through a serverless function body.
-- ============================================================================

create table if not exists public.marketing_ads (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text not null default '',
  media_url    text not null,
  media_type   text not null check (media_type in ('image', 'video')),
  storage_path text not null,
  published    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists marketing_ads_published_idx
  on public.marketing_ads (published, created_at desc);

-- keep updated_at fresh on every write
create or replace function public.touch_marketing_ads_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists marketing_ads_set_updated_at on public.marketing_ads;
create trigger marketing_ads_set_updated_at
  before update on public.marketing_ads
  for each row execute function public.touch_marketing_ads_updated_at();

-- RLS: anyone may read PUBLISHED ads; writes are service-role only.
alter table public.marketing_ads enable row level security;

drop policy if exists "marketing_ads_select_published" on public.marketing_ads;
create policy "marketing_ads_select_published"
  on public.marketing_ads for select
  using (published = true);

-- Public Storage bucket for the media files (the upload route also creates it
-- on first use, so this is belt-and-braces).
insert into storage.buckets (id, name, public)
values ('marketing-ads', 'marketing-ads', true)
on conflict (id) do nothing;
