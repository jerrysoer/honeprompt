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
    criteria: `Score the product description on these dimensions (each 0-100):

1. **Benefit Orientation (30%)** — Does the description lead with customer benefits rather than listing features? Are technical specs translated into outcomes the reader cares about? Deduct heavily if the description reads like a spec sheet.

2. **Readability & Scannability (20%)** — Are paragraphs short (2-3 sentences max)? Is the language clear and jargon-free? Does it flow naturally when read aloud? Is it within the 80-150 word target range?

3. **Emotional Resonance (20%)** — Does the description use sensory or emotional language that helps the reader picture themselves using the product? Does it connect to a real pain point or desire?

4. **CTA Effectiveness (15%)** — Does the description end with a clear, compelling call-to-action? Is the CTA specific to the product (not generic "buy now")? Does it create urgency without being pushy?

5. **Audience Fit (15%)** — Does the tone and vocabulary match the target audience? Would this description feel natural on the appropriate platform (e-commerce listing, SaaS landing page, etc.)?

Penalize: buzzwords ("revolutionary", "game-changing", "cutting-edge"), walls of text, feature dumps without benefit framing, generic CTAs, descriptions that could apply to any product.`,
  },
  failureReportSize: 3,
  targetScore: 90,
};

export default config;
