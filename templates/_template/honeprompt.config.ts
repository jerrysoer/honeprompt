import type { HonePromptConfig } from "honeprompt";

// [REPLACE] Customize the config for your template.
// See https://github.com/jerrysoer/honeprompt#configuration for all options.
const config: HonePromptConfig = {
  targetModel: {
    provider: "anthropic", // [REPLACE] "anthropic" | "openai" | "claude-cli"
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
  maxCostUsd: 5.0, // [REPLACE] Adjust based on your template's complexity
  parallelTestCases: 5,
  scoring: {
    mode: "llm-judge",
    criteria: "[REPLACE] Write specific scoring criteria for your template. Be concrete.",
    // [REPLACE] Optional: Use dimensions for multi-criteria scoring
    // dimensions: [
    //   { name: "accuracy", weight: 0.4, criteria: "Factual correctness" },
    //   { name: "tone", weight: 0.3, criteria: "Appropriate tone" },
    //   { name: "format", weight: 0.3, criteria: "Clean formatting" },
    // ],
  },
  failureReportSize: 3,
  targetScore: 90, // [REPLACE] Set your quality bar
};

export default config;
