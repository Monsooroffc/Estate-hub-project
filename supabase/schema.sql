-- ============================================================
-- EASTATE HUB — Supabase Schema
-- Run this ONCE in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- PROPERTIES ----------
create table if not exists public.properties (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text not null default '',
  location      text not null,
  property_type text not null default 'residential',
  price         bigint not null default 0,
  area          bigint not null default 0,
  features      text[] not null default '{}',
  status        text not null default 'available',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------- PROPERTY IMAGES / VIDEOS ----------
create table if not exists public.property_images (
  id          uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  image_url   text not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.property_videos (
  id          uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  video_url   text not null,
  created_at  timestamptz not null default now()
);

-- ---------- ENQUIRIES ----------
create table if not exists public.enquiries (
  id          uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete set null,
  name        text not null,
  phone       text not null,
  email       text not null,
  budget      bigint,
  message     text not null default '',
  status      text not null default 'NEW',
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------- LEADS ----------
create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),

-- ---------- updated_at auto-touch triggers ----------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_properties_updated on public.properties;
create trigger trg_properties_updated before update on public.properties
  for each row execute function public.set_updated_at();

drop trigger if exists trg_enquiries_updated on public.enquiries;
create trigger trg_enquiries_updated before update on public.enquiries
  for each row execute function public.set_updated_at();

drop trigger if exists trg_leads_updated on public.leads;
create trigger trg_leads_updated before update on public.leads
  for each row execute function public.set_updated_at();

-- ---------- Indexes ----------
create index if not exists idx_property_images_property on public.property_images(property_id);
create index if not exists idx_property_videos_property on public.property_videos(property_id);
create index if not exists idx_enquiries_property      on public.enquiries(property_id);
create index if not exists idx_leads_property          on public.leads(property_id);
create index if not exists idx_leads_enquiry           on public.leads(enquiry_id);

-- ============================================================
-- Row Level Security
-- NOTE: The app currently uses its own admin login (not Supabase
-- Auth), so policies are permissive for the anon key. When you
-- later move admin auth to Supabase Auth, restrict the write
-- policies to authenticated users and keep public SELECT only
-- on properties + public INSERT only on enquiries.
-- ============================================================
alter table public.properties      enable row level security;
alter table public.property_images enable row level security;
alter table public.property_videos enable row level security;
alter table public.enquiries       enable row level security;
alter table public.leads           enable row level security;

create policy "properties_select" on public.properties for select using (true);
create policy "properties_insert" on public.properties for insert with check (true);
create policy "properties_update" on public.properties for update using (true) with check (true);
create policy "properties_delete" on public.properties for delete using (true);

create policy "images_select" on public.property_images for select using (true);
create policy "images_insert" on public.property_images for insert with check (true);
create policy "images_update" on public.property_images for update using (true) with check (true);
create policy "images_delete" on public.property_images for delete using (true);

create policy "videos_select" on public.property_videos for select using (true);
create policy "videos_insert" on public.property_videos for insert with check (true);
create policy "videos_update" on public.property_videos for update using (true) with check (true);
create policy "videos_delete" on public.property_videos for delete using (true);

create policy "enquiries_select" on public.enquiries for select using (true);
create policy "enquiries_insert" on public.enquiries for insert with check (true);
create policy "enquiries_update" on public.enquiries for update using (true) with check (true);
create policy "enquiries_delete" on public.enquiries for delete using (true);

create policy "leads_select" on public.leads for select using (true);
create policy "leads_insert" on public.leads for insert with check (true);
create policy "leads_update" on public.leads for update using (true) with check (true);
create policy "leads_delete" on public.leads for delete using (true);

  enquiry_id    uuid references public.enquiries(id) on delete set null,
  property_id   uuid references public.properties(id) on delete set null,
  name          text not null,
  phone         text not null,
  email         text not null,
  budget        bigint,
  priority      text not null default 'COLD',
  status        text not null default 'NEW',
  notes         text not null default '',
  next_followup timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
