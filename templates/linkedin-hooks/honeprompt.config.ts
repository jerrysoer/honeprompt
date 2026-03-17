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
    criteria: `Score the LinkedIn hook 0-100 on:
- Hook strength (40%): Does it stop the scroll? Create genuine curiosity?
- Specificity (25%): Does it use concrete details, not vague claims?
- Brevity (20%): Is it under 20 words? Every word essential?
- Authenticity (15%): Does it feel real, not clickbait?`,
  },
  failureReportSize: 3,
  targetScore: 90,
};

export default config;
