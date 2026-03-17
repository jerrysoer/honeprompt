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
    criteria: `Score the code review comment 0-100 on:
- Actionability (30%): Does it clearly state what should change and how? Could the author act on this comment without asking follow-up questions?
- Specificity (25%): Does it reference exact lines, variables, or patterns from the code? Or is it vague and generic?
- Constructive tone (25%): Is it respectful and collaborative? Does it critique the code, not the person? Does it use softening language where appropriate?
- Technical accuracy (20%): Is the identified issue real? Is the suggested fix correct? Does the explanation of WHY hold up?

Penalize heavily for: condescending tone ("obviously you should..."), vague advice ("this could be better"), inventing problems that do not exist in the code, missing the actual bug when one is present, suggesting changes without explaining why.`,
  },
  failureReportSize: 3,
  targetScore: 90,
};

export default config;
