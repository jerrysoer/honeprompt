import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANALYTICS_PASSWORD = process.env.ANALYTICS_PASSWORD;

async function supabaseQuery(table: string, params = "") {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return [];

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?${params}&order=date.desc&limit=30`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    },
  );
  if (!res.ok) return [];
  return res.json();
}

export async function GET(request: Request) {
  // Password check
  const { searchParams } = new URL(request.url);
  const password = searchParams.get("password");

  if (!ANALYTICS_PASSWORD || password !== ANALYTICS_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "Analytics not configured" },
      { status: 503 },
    );
  }

  const [downloads, traffic, referrers, stats, daily] = await Promise.all([
    supabaseQuery("hp_npm_downloads"),
    supabaseQuery("hp_github_traffic"),
    supabaseQuery("hp_github_referrers", "select=referrer,count,uniques"),
    supabaseQuery("hp_github_stats"),
    supabaseQuery("hp_analytics_daily"),
  ]);

  return NextResponse.json({
    downloads,
    traffic,
    referrers,
    stats,
    daily,
  });
}
