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
    criteria: "Score the output 0-100 on relevance, quality, completeness, and clarity.",
  },
  failureReportSize: 3,
};

export default config;
