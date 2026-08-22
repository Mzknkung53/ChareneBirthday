-- Run in Supabase SQL Editor if wishes table already exists
alter table public.wishes
  add column if not exists hide_from_live boolean not null default false;

comment on column public.wishes.hide_from_live is 'Sender chose not to have this read on live stream.';

create index if not exists wishes_live_ok_idx on public.wishes (created_at desc) where hide_from_live = false;
