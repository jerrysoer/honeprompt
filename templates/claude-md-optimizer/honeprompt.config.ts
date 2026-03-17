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
  maxCostUsd: 5.0,
  parallelTestCases: 5,
  scoring: {
    mode: "llm-judge",
    criteria: `Score the CLAUDE.md 0-100 on:
- Actionability (30%): Does it contain concrete commands and patterns an AI can immediately use?
- Specificity (25%): Is it tailored to this specific project, not generic advice?
- Completeness (25%): Does it cover build/test/lint commands, architecture, conventions, and gotchas?
- Conciseness (20%): Is it under 50 lines? No fluff or padding?`,
  },
  failureReportSize: 3,
  targetScore: 90,
};

export default config;
