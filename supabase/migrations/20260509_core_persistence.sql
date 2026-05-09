create table if not exists public.extension_scan_sessions (
  id uuid primary key default gen_random_uuid(),
  marketplace text not null,
  url text not null,
  scanned_at timestamptz not null,
  product_count integer not null default 0,
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.extension_scan_items (
  id uuid primary key default gen_random_uuid(),
  scan_session_id uuid references public.extension_scan_sessions(id) on delete cascade,
  title text,
  price_text text,
  sold_text text,
  rating_text text,
  image_url text,
  shop_name text,
  product_url text,
  confidence_score numeric,
  raw_item jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.watchlist_items (
  id uuid primary key default gen_random_uuid(),
  product_id text,
  product_url text,
  title text,
  platform text,
  notes text,
  priority text default 'medium',
  status text default 'watching',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.export_jobs (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  status text not null default 'completed',
  file_url text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists extension_scan_sessions_scanned_at_idx on public.extension_scan_sessions(scanned_at);
create index if not exists extension_scan_sessions_marketplace_idx on public.extension_scan_sessions(marketplace);
create index if not exists extension_scan_items_scan_session_idx on public.extension_scan_items(scan_session_id);
create index if not exists watchlist_items_platform_idx on public.watchlist_items(platform);
create index if not exists watchlist_items_status_idx on public.watchlist_items(status);
create index if not exists export_jobs_created_at_idx on public.export_jobs(created_at);

-- TODO: apply RLS policy strategy consistently after auth model is finalized for private beta.
