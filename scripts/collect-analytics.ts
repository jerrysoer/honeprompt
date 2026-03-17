/**
 * HonePrompt Analytics Collection Script
 *
 * Fetches npm download stats, GitHub traffic, and repo stats,
 * then upserts everything to Supabase. Run daily via GitHub Actions.
 *
 * Required env vars:
 *   SUPABASE_URL              — Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY — Service role key (bypasses RLS)
 *   GH_ANALYTICS_PAT          — GitHub PAT with repo traffic read access
 */

const PACKAGE_NAME = "honeprompt";
const GITHUB_REPO = "jerrysoer/honeprompt";

// ---------------------------------------------------------------------------
// Env + helpers
// ---------------------------------------------------------------------------

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GH_PAT = process.env.GH_ANALYTICS_PAT;

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required env var: ${name}`);
  return val;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

async function supabaseUpsert(table: string, rows: Record<string, unknown>[]): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn(`[supabase] Missing credentials — skipping upsert to ${table}`);
    return;
  }

  const url = `${SUPABASE_URL}/rest/v1/${table}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Prefer": "resolution=merge-duplicates",
    },
    body: JSON.stringify(rows),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase upsert to ${table} failed (${res.status}): ${text}`);
  }

  console.log(`[supabase] Upserted ${rows.length} row(s) to ${table}`);
}

// ---------------------------------------------------------------------------
// npm downloads
// ---------------------------------------------------------------------------

async function collectNpmDownloads(): Promise<void> {
  console.log("[npm] Fetching download stats...");

  const url = `https://api.npmjs.org/downloads/point/last-day/${PACKAGE_NAME}`;
  const res = await fetch(url);

  if (!res.ok) {
    console.warn(`[npm] API returned ${res.status} — skipping npm stats`);
    return;
  }

  const data = (await res.json()) as { downloads: number; start: string; end: string };
  console.log(`[npm] Downloads on ${data.start}: ${data.downloads}`);

  await supabaseUpsert("hp_npm_downloads", [
    {
      date: data.start,
      downloads: data.downloads,
    },
  ]);
}

// ---------------------------------------------------------------------------
// GitHub helpers
// ---------------------------------------------------------------------------

async function ghFetch(path: string): Promise<Response> {
  if (!GH_PAT) throw new Error("GH_ANALYTICS_PAT not set");

  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${GH_PAT}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (res.status === 429) {
    console.warn(`[github] Rate limit hit on ${path} — skipping`);
  }

  return res;
}

// ---------------------------------------------------------------------------
// GitHub traffic (views + clones)
// ---------------------------------------------------------------------------

async function collectGitHubTraffic(): Promise<void> {
  if (!GH_PAT) {
    console.warn("[github] GH_ANALYTICS_PAT not set — skipping GitHub traffic");
    return;
  }

  console.log("[github] Fetching traffic views...");
  const viewsRes = await ghFetch("/traffic/views");
  if (!viewsRes.ok) {
    console.warn(`[github] Views API returned ${viewsRes.status} — skipping`);
    return;
  }
  const viewsData = (await viewsRes.json()) as {
    views: Array<{ timestamp: string; count: number; uniques: number }>;
  };

  console.log("[github] Fetching traffic clones...");
  const clonesRes = await ghFetch("/traffic/clones");
  if (!clonesRes.ok) {
    console.warn(`[github] Clones API returned ${clonesRes.status} — skipping`);
    return;
  }
  const clonesData = (await clonesRes.json()) as {
    clones: Array<{ timestamp: string; count: number; uniques: number }>;
  };

  // Merge by date
  const byDate: Record<
    string,
    { views: number; unique_visitors: number; clones: number; unique_cloners: number }
  > = {};

  for (const v of viewsData.views ?? []) {
    const date = v.timestamp.slice(0, 10);
    byDate[date] = byDate[date] ?? { views: 0, unique_visitors: 0, clones: 0, unique_cloners: 0 };
    byDate[date].views = v.count;
    byDate[date].unique_visitors = v.uniques;
  }

  for (const c of clonesData.clones ?? []) {
    const date = c.timestamp.slice(0, 10);
    byDate[date] = byDate[date] ?? { views: 0, unique_visitors: 0, clones: 0, unique_cloners: 0 };
    byDate[date].clones = c.count;
    byDate[date].unique_cloners = c.uniques;
  }

  const rows = Object.entries(byDate).map(([date, stats]) => ({ date, ...stats }));
  console.log(`[github] Traffic data for ${rows.length} day(s)`);

  if (rows.length > 0) {
    await supabaseUpsert("hp_github_traffic", rows);
  }
}

// ---------------------------------------------------------------------------
// GitHub referrers
// ---------------------------------------------------------------------------

async function collectGitHubReferrers(): Promise<void> {
  if (!GH_PAT) {
    console.warn("[github] GH_ANALYTICS_PAT not set — skipping referrers");
    return;
  }

  console.log("[github] Fetching referrers...");
  const res = await ghFetch("/traffic/popular/referrers");
  if (!res.ok) {
    console.warn(`[github] Referrers API returned ${res.status} — skipping`);
    return;
  }

  const data = (await res.json()) as Array<{
    referrer: string;
    count: number;
    uniques: number;
  }>;

  const date = today();
  const rows = data.map((r) => ({
    date,
    referrer: r.referrer,
    count: r.count,
    uniques: r.uniques,
  }));

  console.log(`[github] ${rows.length} referrer(s)`);

  if (rows.length > 0) {
    await supabaseUpsert("hp_github_referrers", rows);
  }
}

// ---------------------------------------------------------------------------
// GitHub repo stats
// ---------------------------------------------------------------------------

async function collectGitHubRepoStats(): Promise<void> {
  if (!GH_PAT) {
    console.warn("[github] GH_ANALYTICS_PAT not set — skipping repo stats");
    return;
  }

  console.log("[github] Fetching repo stats...");
  const res = await ghFetch("");
  if (!res.ok) {
    console.warn(`[github] Repo API returned ${res.status} — skipping`);
    return;
  }

  const data = (await res.json()) as {
    stargazers_count: number;
    forks_count: number;
    watchers_count: number;
    open_issues_count: number;
  };

  console.log(
    `[github] Stars: ${data.stargazers_count}, Forks: ${data.forks_count}, Watchers: ${data.watchers_count}, Open issues: ${data.open_issues_count}`
  );

  await supabaseUpsert("hp_github_stats", [
    {
      date: today(),
      stars: data.stargazers_count,
      forks: data.forks_count,
      watchers: data.watchers_count,
      open_issues: data.open_issues_count,
    },
  ]);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log(`[collect-analytics] Starting — ${new Date().toISOString()}`);

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn(
      "[collect-analytics] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set — data will not be persisted"
    );
  }

  const tasks: Array<{ name: string; fn: () => Promise<void> }> = [
    { name: "npm downloads", fn: collectNpmDownloads },
    { name: "GitHub traffic", fn: collectGitHubTraffic },
    { name: "GitHub referrers", fn: collectGitHubReferrers },
    { name: "GitHub repo stats", fn: collectGitHubRepoStats },
  ];

  let failed = false;

  for (const task of tasks) {
    try {
      await task.fn();
    } catch (err) {
      console.error(`[collect-analytics] Fatal error in "${task.name}":`, err);
      failed = true;
    }
  }

  console.log(`[collect-analytics] Done — ${new Date().toISOString()}`);

  if (failed) {
    console.error("[collect-analytics] One or more tasks failed.");
    process.exit(1);
  }
}

main();
