create extension if not exists "pgcrypto";

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  external_id text not null,
  title text not null,
  url text not null,
  image_url text,
  category text,
  price numeric not null,
  original_price numeric,
  rating numeric default 0,
  review_count integer default 0,
  sold_count integer default 0,
  stock_count integer default 0,
  shop_name text,
  shop_url text,
  uploaded_at timestamptz,
  scraped_at timestamptz default now()
);

create table if not exists product_snapshots (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  search_keyword text,
  price numeric not null,
  rating numeric default 0,
  review_count integer default 0,
  sold_count integer default 0,
  stock_count integer default 0,
  views_estimate integer default 0,
  revenue_estimate numeric default 0,
  rank_position integer,
  captured_at timestamptz default now()
);

create table if not exists stores (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  external_id text not null,
  name text not null,
  url text not null,
  rating numeric default 0,
  follower_count integer default 0,
  product_count integer default 0
);

create table if not exists store_snapshots (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id) on delete cascade,
  estimated_sales integer default 0,
  estimated_revenue numeric default 0,
  views_estimate integer default 0,
  product_count integer default 0,
  rating numeric default 0,
  captured_at timestamptz default now()
);

create table if not exists trend_scores (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  hype_score numeric default 0,
  profit_score numeric default 0,
  risk_score numeric default 0,
  final_score numeric default 0,
  signal text not null,
  reasons text[] default '{}',
  calculated_at timestamptz default now()
);

create table if not exists watchlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  product_id uuid references products(id) on delete cascade,
  notes text,
  created_at timestamptz default now()
);

create table if not exists export_jobs (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  status text not null default 'pending',
  requested_by uuid,
  file_path text,
  created_at timestamptz default now(),
  completed_at timestamptz
);

alter publication supabase_realtime add table product_snapshots;
alter publication supabase_realtime add table trend_scores;
alter publication supabase_realtime add table export_jobs;
