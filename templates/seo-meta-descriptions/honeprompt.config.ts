import type { HonePromptConfig } from "honeprompt";

const config: HonePromptConfig = {
  targetModel: { provider: "anthropic", model: "claude-sonnet-4-5-20250929" },
  optimizerModel: { provider: "anthropic", model: "claude-sonnet-4-5-20250929" },
  judgeModel: { provider: "anthropic", model: "claude-sonnet-4-5-20250929" },
  maxIterations: 25,
  maxCostUsd: 3.0,
  parallelTestCases: 5,
  scoring: {
    mode: "llm-judge",
    criteria: `Score the SEO meta description on these dimensions (each 0-100):

1. **Character Length (25%)** — Is the meta description under 160 characters? Count carefully. Score 100 if under 155 (safe zone), 80 if 155-160, 50 if 161-170 (partial truncation risk), 0 if over 170. This is a hard constraint.

2. **Keyword Integration (25%)** — Does the meta description include the target keyword or a natural variant? Is the keyword placed in the first half of the description (before potential truncation)? Deduct if the keyword feels forced, stuffed, or appears more than once.

3. **CTA / Value Proposition (20%)** — Does the description include a reason to click? Is there a clear value proposition (what the reader will get) or a call-to-action (learn, discover, get started, compare)? Deduct if the description merely describes the page without motivating a click.

4. **Specificity & Accuracy (20%)** — Does the meta description accurately reflect the page content? Does it include specific details (numbers, outcomes, differentiators) rather than generic claims? Deduct for vague descriptions that could apply to any similar page.

5. **Voice & Readability (10%)** — Is the description written in active voice? Does it read naturally in a search results snippet? Does it avoid starting with the brand name, using quotation marks, or sounding robotic?

Penalize: descriptions over 160 characters (critical), keyword stuffing (keyword appears 2+ times), starting with the site/brand name, using quotation marks, generic descriptions ("Learn everything about X"), passive voice, descriptions that reveal so much the user has no reason to click through.`,
  },
  failureReportSize: 3,
  targetScore: 90,
};

export default config;
