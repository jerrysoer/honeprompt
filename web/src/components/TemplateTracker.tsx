"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics/track";

export function TemplateTracker({ templateId }: { templateId: string }) {
  const tracked = useRef(false);
  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true;
      track("template_viewed", { templateId });
    }
  }, [templateId]);
  return null;
}
