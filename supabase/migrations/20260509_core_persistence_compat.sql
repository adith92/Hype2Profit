-- Compatibility patch for projects that already ran the initial 20260507 migration.
-- That migration created export_jobs before the core persistence layer added metadata/file_url.
-- Keep this migration additive and idempotent so it is safe to run on fresh or existing Supabase projects.

alter table if exists public.export_jobs
  add column if not exists file_url text;

alter table if exists public.export_jobs
  add column if not exists metadata jsonb;

alter table if exists public.export_jobs
  add column if not exists completed_at timestamptz;

alter table if exists public.export_jobs
  alter column status set default 'completed';

create index if not exists export_jobs_created_at_idx on public.export_jobs(created_at);
create index if not exists export_jobs_kind_idx on public.export_jobs(kind);
create index if not exists export_jobs_status_idx on public.export_jobs(status);

-- Optional hardening for core persistence tables in case the main migration was partially applied.
create index if not exists extension_scan_sessions_scanned_at_idx on public.extension_scan_sessions(scanned_at);
create index if not exists extension_scan_sessions_marketplace_idx on public.extension_scan_sessions(marketplace);
create index if not exists extension_scan_items_scan_session_idx on public.extension_scan_items(scan_session_id);
create index if not exists watchlist_items_platform_idx on public.watchlist_items(platform);
create index if not exists watchlist_items_status_idx on public.watchlist_items(status);
