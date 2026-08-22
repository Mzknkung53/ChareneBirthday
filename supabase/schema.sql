-- Charene Birthday — Supabase schema
-- Run in: Supabase Dashboard → SQL Editor
--
-- Before running:
-- 1. Create a Supabase project
-- 2. Authentication → Providers → Email → disable "Enable sign ups"
-- 3. Manually create Charene's user (Authentication → Users → Add user)
-- 4. After running this file, insert Charene into admin_users (see bottom)

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.wishes (
  id            uuid        primary key default gen_random_uuid(),
  display_name  text        not null
                            check (char_length(trim(display_name)) > 0)
                            check (char_length(display_name) <= 32),
  handle        text        check (handle is null or char_length(handle) <= 32),
  message       text        not null
                            check (char_length(trim(message)) > 0)
                            check (char_length(message) <= 400),
  sticker       text,
  media_url     text,
  media_type    text        check (media_type is null or media_type in ('image', 'video')),
  is_hidden     boolean     not null default false,
  created_at    timestamptz not null default now(),

  -- media_url and media_type must appear together
  constraint wishes_media_pair check (
    (media_url is null and media_type is null)
    or (media_url is not null and media_type is not null)
  )
);

comment on table public.wishes is 'Birthday wishes — visible to admins only, not public.';
comment on column public.wishes.is_hidden is 'Charene can hide spam without deleting.';

create index wishes_created_at_idx on public.wishes (created_at desc);
create index wishes_visible_idx on public.wishes (created_at desc) where is_hidden = false;

-- Single-admin allowlist (Charene only — no public registration)
create table public.admin_users (
  user_id     uuid        primary key references auth.users (id) on delete cascade,
  email       text        not null unique,
  created_at  timestamptz not null default now()
);

comment on table public.admin_users is 'Allowlist of users who can read wishes. Add rows manually only.';

-- ---------------------------------------------------------------------------
-- Helpers (for RLS)
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security — wishes
-- ---------------------------------------------------------------------------

alter table public.wishes enable row level security;

-- Public: submit only — cannot read, update, or delete
create policy "Public can submit wishes"
  on public.wishes
  for insert
  to anon, authenticated
  with check (true);

create policy "Admins can read wishes"
  on public.wishes
  for select
  to authenticated
  using (public.is_admin());

create policy "Admins can hide wishes"
  on public.wishes
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete wishes"
  on public.wishes
  for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Row Level Security — admin_users
-- ---------------------------------------------------------------------------

alter table public.admin_users enable row level security;

-- Each admin can confirm their own row (optional, for /charene session check)
create policy "Admins can read own admin row"
  on public.admin_users
  for select
  to authenticated
  using (user_id = auth.uid());

-- No insert/update/delete policies for clients — manage admin_users via SQL Editor only

-- ---------------------------------------------------------------------------
-- Storage — bucket for wish photos / videos
-- ---------------------------------------------------------------------------
-- Create bucket in Dashboard → Storage → New bucket:
--   Name: wish-media
--   Public: OFF (private bucket)
--
-- Then run the policies below.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'wish-media',
  'wish-media',
  false,
  52428800, -- 50 MB
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
)
on conflict (id) do nothing;

-- Anyone can upload into wish-media/<wish-id>/... (path enforced in app)
create policy "Public can upload wish media"
  on storage.objects
  for insert
  to anon, authenticated
  with check (
    bucket_id = 'wish-media'
    and (storage.foldername(name))[1] is not null
  );

-- Only admins can read / list files
create policy "Admins can read wish media"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'wish-media'
    and public.is_admin()
  );

create policy "Admins can delete wish media"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'wish-media'
    and public.is_admin()
  );

-- ---------------------------------------------------------------------------
-- After setup: register Charene as the only admin
-- ---------------------------------------------------------------------------
-- 1. Create user in Authentication → Users (email + password)
-- 2. Copy the user's UUID, then run:
--
-- insert into public.admin_users (user_id, email)
-- values ('<CHARENE_AUTH_USER_UUID>', 'charene@example.com');
