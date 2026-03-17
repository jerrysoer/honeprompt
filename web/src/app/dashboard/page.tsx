"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";

interface Metrics {
  downloads: Array<{ date: string; downloads: number }>;
  traffic: Array<{ date: string; views: number; unique_visitors: number; clones: number }>;
  referrers: Array<{ referrer: string; count: number; uniques: number }>;
  stats: Array<{ date: string; stars: number; forks: number }>;
  daily: Array<{
    date: string;
    runs_started: number;
    runs_completed: number;
    templates_viewed: number;
    templates_started: number;
  }>;
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 text-center">
      <div className="text-xs text-text-muted mb-1">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

function SimpleChart({
  data,
  dataKey,
  label,
}: {
  data: Array<Record<string, unknown>>;
  dataKey: string;
  label: string;
}) {
  if (data.length === 0) {
    return <p className="text-sm text-text-muted">No data yet</p>;
  }

  const values = data.map((d) => Number(d[dataKey] ?? 0));
  const max = Math.max(...values, 1);

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">{label}</h3>
      <div className="flex items-end gap-1 h-24">
        {data
          .slice()
          .reverse()
          .map((d, i) => {
            const val = Number(d[dataKey] ?? 0);
            const height = (val / max) * 100;
            return (
              <div
                key={i}
                className="flex-1 bg-accent/70 rounded-t hover:bg-accent transition-colors"
                style={{ height: `${Math.max(height, 2)}%` }}
                title={`${String(d.date)}: ${val}`}
              />
            );
          })}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMetrics = useCallback(async (pw: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/dashboard/metrics?password=${encodeURIComponent(pw)}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to load");
      }
      const data = await res.json();
      setMetrics(data);
      setAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Check sessionStorage for saved password
  useEffect(() => {
    const saved = sessionStorage.getItem("hp_dash_pw");
    if (saved) {
      setPassword(saved);
      fetchMetrics(saved);
    }
  }, [fetchMetrics]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("hp_dash_pw", password);
    fetchMetrics(password);
  };

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-sm py-20">
        <h1 className="font-heading text-2xl mb-6 text-center">Dashboard</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Analytics password"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
          />
          {error && (
            <p className="text-sm text-reverted">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-40"
          >
            {loading ? "Loading..." : "View Dashboard"}
          </button>
        </form>
      </div>
    );
  }

  if (!metrics) return null;

  const latestStats = metrics.stats[0];
  const totalDownloads = metrics.downloads.reduce((s, d) => s + d.downloads, 0);
  const totalRuns = metrics.daily.reduce((s, d) => s + d.runs_started, 0);

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-3xl">Dashboard</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Stars" value={latestStats?.stars ?? 0} />
        <MetricCard label="Forks" value={latestStats?.forks ?? 0} />
        <MetricCard label="Downloads (30d)" value={totalDownloads} />
        <MetricCard label="Web Runs (30d)" value={totalRuns} />
      </div>

      {/* Charts */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-4">
          <SimpleChart data={metrics.downloads} dataKey="downloads" label="npm Downloads" />
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <SimpleChart data={metrics.traffic} dataKey="views" label="GitHub Views" />
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <SimpleChart data={metrics.traffic} dataKey="clones" label="GitHub Clones" />
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <SimpleChart data={metrics.daily} dataKey="runs_started" label="Web Runs / Day" />
        </div>
      </div>

      {/* Referrers table */}
      {metrics.referrers.length > 0 && (
        <div>
          <h2 className="font-heading text-xl mb-3">Top Referrers</h2>
          <div className="rounded-xl border border-border bg-surface overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-alt">
                  <th className="text-left px-4 py-2 font-medium">Referrer</th>
                  <th className="text-right px-4 py-2 font-medium">Views</th>
                  <th className="text-right px-4 py-2 font-medium">Uniques</th>
                </tr>
              </thead>
              <tbody>
                {metrics.referrers.map((r) => (
                  <tr key={r.referrer} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-mono">{r.referrer}</td>
                    <td className="px-4 py-2 text-right">{r.count}</td>
                    <td className="px-4 py-2 text-right">{r.uniques}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Template usage */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-4">
          <SimpleChart data={metrics.daily} dataKey="templates_viewed" label="Templates Viewed / Day" />
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <SimpleChart data={metrics.daily} dataKey="templates_started" label="Templates Started / Day" />
        </div>
      </div>
    </div>
  );
}
