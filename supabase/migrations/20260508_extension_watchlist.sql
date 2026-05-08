create table if not exists public.extension_scan_sessions (
  id uuid primary key default gen_random_uuid(),
  marketplace text not null,
  url text not null,
  scanned_at timestamptz not null,
  created_at timestamptz not null default now(),
  raw_payload jsonb
);

create table if not exists public.extension_scan_items (
  id uuid primary key default gen_random_uuid(),
  scan_session_id uuid not null references public.extension_scan_sessions(id) on delete cascade,
  title text,
  price_text text,
  sold_text text,
  rating_text text,
  image_url text,
  shop_name text,
  product_url text,
  confidence_score numeric(4, 3),
  created_at timestamptz not null default now()
);

create table if not exists public.watchlist_items (
  id uuid primary key default gen_random_uuid(),
  product_id text,
  product_url text,
  title text not null,
  platform text not null,
  notes text,
  priority text not null default 'normal',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists extension_scan_items_session_idx on public.extension_scan_items(scan_session_id);
create index if not exists watchlist_items_status_idx on public.watchlist_items(status);
