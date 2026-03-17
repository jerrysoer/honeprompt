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
    criteria: `Score the commit message 0-100 on:
- Format compliance (30%): Does it follow conventional commit format (type(scope): description)? Is the type correct for the change described?
- Conciseness (25%): Is the subject line under 72 characters? Is every word necessary? Does it avoid redundancy?
- Imperative mood (20%): Does it use imperative mood ("add" not "added", "fix" not "fixed")? Does it avoid "This commit..." phrasing?
- Explanatory value (25%): For complex changes, does the body explain WHY not WHAT? For simple changes, does it appropriately omit the body?

Penalize heavily for: past tense ("added", "fixed", "updated"), exceeding 72 chars in subject, wrong commit type, "This commit..." openers, body that merely restates the subject, missing BREAKING CHANGE footer when applicable.`,
  },
  failureReportSize: 3,
  targetScore: 90,
};

export default config;
