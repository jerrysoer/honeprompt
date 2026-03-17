import type { HonePromptConfig } from "honeprompt";

const config: HonePromptConfig = {
  targetModel: {
    provider: "anthropic",
    model: "claude-sonnet-4-5-20250929",
  },
  optimizerModel: {
    provider: "anthropic",
    model: "claude-sonnet-4-5-20250929",
  },
  judgeModel: {
    provider: "anthropic",
    model: "claude-sonnet-4-5-20250929",
  },
  maxIterations: 25,
  maxCostUsd: 3.0,
  parallelTestCases: 5,
  scoring: {
    mode: "llm-judge",
    criteria: `Score the TikTok hook 0-100 on:
- Hook strength (35%): Does it create an immediate pattern interrupt? Would someone stop mid-scroll?
- Brevity (25%): Can it be spoken in 2-3 seconds? Under 15 words? No filler words?
- Conversational tone (25%): Does it sound like someone TALKING, not writing? Natural spoken cadence?
- Platform awareness (15%): Does it match TikTok energy and niche conventions? Would it feel at home on the FYP?

Penalize heavily for: sounding like a LinkedIn post, using hashtags, using "hey guys" filler, reading like a blog headline, exceeding 15 words.`,
  },
  failureReportSize: 3,
  targetScore: 90,
};

export default config;
