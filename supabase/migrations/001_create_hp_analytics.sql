-- HonePrompt Growth Analytics Tables
-- All tables use hp_ prefix to avoid conflicts

-- npm download stats (daily snapshots)
create table hp_npm_downloads (
  id bigint generated always as identity primary key,
  date date not null,
  downloads integer not null default 0,
  created_at timestamptz not null default now(),
  unique(date)
);

-- GitHub traffic views (14-day ephemeral from API)
create table hp_github_traffic (
  id bigint generated always as identity primary key,
  date date not null,
  views integer not null default 0,
  unique_visitors integer not null default 0,
  clones integer not null default 0,
  unique_cloners integer not null default 0,
  created_at timestamptz not null default now(),
  unique(date)
);

-- GitHub referrers (top referrers snapshot)
create table hp_github_referrers (
  id bigint generated always as identity primary key,
  date date not null,
  referrer text not null,
  count integer not null default 0,
  uniques integer not null default 0,
  created_at timestamptz not null default now(),
  unique(date, referrer)
);

-- GitHub repo stats (stars, forks, watchers)
create table hp_github_stats (
  id bigint generated always as identity primary key,
  date date not null,
  stars integer not null default 0,
  forks integer not null default 0,
  watchers integer not null default 0,
  open_issues integer not null default 0,
  created_at timestamptz not null default now(),
  unique(date)
);

-- Web analytics events (fire-and-forget from browser)
create table hp_analytics_events (
  id bigint generated always as identity primary key,
  event text not null,
  properties jsonb not null default '{}',
  session_id text,
  created_at timestamptz not null default now()
);

-- Daily aggregated web metrics
create table hp_analytics_daily (
  id bigint generated always as identity primary key,
  date date not null,
  runs_started integer not null default 0,
  runs_completed integer not null default 0,
  templates_viewed integer not null default 0,
  templates_started integer not null default 0,
  shares integer not null default 0,
  exports integer not null default 0,
  created_at timestamptz not null default now(),
  unique(date)
);

-- Enable RLS on all tables
alter table hp_npm_downloads enable row level security;
alter table hp_github_traffic enable row level security;
alter table hp_github_referrers enable row level security;
alter table hp_github_stats enable row level security;
alter table hp_analytics_events enable row level security;
alter table hp_analytics_daily enable row level security;

-- Allow anonymous INSERT on events table (for browser tracking)
create policy "anon_insert_events" on hp_analytics_events
  for insert to anon with check (true);

-- Service role has full access (for cron scripts and dashboard)
-- (service_role bypasses RLS by default in Supabase)

-- Index for event queries
create index idx_hp_events_event on hp_analytics_events(event);
create index idx_hp_events_created on hp_analytics_events(created_at);
create index idx_hp_daily_date on hp_analytics_daily(date);
