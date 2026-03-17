/**
 * Fire-and-forget analytics tracking via Supabase REST API.
 * Uses the anon key + RLS INSERT policy — no SDK needed.
 *
 * Events: run_started, run_completed, template_viewed, template_started,
 *         share_clicked, export_clicked
 */

type AnalyticsEvent =
  | "run_started"
  | "run_completed"
  | "template_viewed"
  | "template_started"
  | "share_clicked"
  | "export_clicked";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getBrowserSessionId(): string {
  if (typeof window === "undefined") return "server";
  let id = sessionStorage.getItem("hp_sid");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("hp_sid", id);
  }
  return id;
}

export function track(
  event: AnalyticsEvent,
  properties: Record<string, unknown> = {},
): void {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;

  const body = {
    event,
    properties,
    session_id: getBrowserSessionId(),
  };

  // Fire-and-forget — don't await, don't block UI
  fetch(`${SUPABASE_URL}/rest/v1/hp_analytics_events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(body),
  }).catch(() => {
    // Silently ignore tracking failures — never degrade UX
  });
}
