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
    criteria: `Score the YouTube title 0-100 on:
- Click-worthiness (35%): Does it create enough curiosity to earn a click? Would you click this in a sea of thumbnails?
- Accuracy (25%): Does it honestly represent the likely content? No misleading promises or bait-and-switch?
- Conciseness (20%): Is it under 60 characters? Does every word pull its weight?
- Searchability (20%): Would someone searching for this topic find this title? Does it contain natural search terms?

Penalize heavily for: exceeding 60 characters, ALL CAPS words, excessive punctuation (!!!, ???), misleading claims, generic/vague phrasing like "You Wont Believe" or "SHOCKING".`,
  },
  failureReportSize: 3,
  targetScore: 90,
};

export default config;
