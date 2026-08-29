-- Run in Supabase SQL Editor if the wishes table already exists.
-- Tracks successful wish submissions per IP so submitWish() can throttle spam.

create table if not exists public.wish_rate_limits (
  id         bigserial   primary key,
  ip         text        not null,
  created_at timestamptz not null default now()
);

create index if not exists wish_rate_limits_ip_created_idx
  on public.wish_rate_limits (ip, created_at desc);

comment on table public.wish_rate_limits is 'One row per successful wish submission, keyed by IP — read/written only over the direct DATABASE_URL connection from submitWish().';

alter table public.wish_rate_limits enable row level security;
-- No policies: this table is never queried through supabase-js (anon/authenticated),
-- only through the server-only DATABASE_URL connection in src/app/actions/wishes.ts.
