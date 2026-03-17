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
    criteria: `Score the cold outreach email on these dimensions (each 0-100):

1. **Personalization (30%)** — Does the email reference something specific about the prospect that could not apply to anyone else? Is the opening line clearly tailored (not "I saw your company is growing")? Deduct heavily for generic openings or boilerplate personalization.

2. **Brevity (25%)** — Is the email body under 100 words? Is every sentence earning its place? Are there any filler phrases ("I hope this finds you well", "I wanted to reach out", "I thought you might be interested")? Deduct for every unnecessary word.

3. **CTA Clarity (20%)** — Is there exactly one clear call-to-action? Is the CTA low-commitment (a question, not a demand)? Would the reader know exactly what to do next? Deduct if the CTA is buried, vague, or overly aggressive ("Let me know when you are free for a 30-minute demo").

4. **Human Tone (15%)** — Does the email sound like it was written by a real person to another real person? Is the tone peer-to-peer rather than salesy or deferential? Would this email feel natural in a Gmail inbox? Deduct for corporate speak, exclamation points abuse, or sycophantic language.

5. **Subject Line (10%)** — Is the subject line 6 words or fewer? Is it specific enough to earn an open but not clickbaity? Does it avoid ALL CAPS, excessive punctuation, or spam trigger words?

Penalize: emails over 100 words, "I hope this email finds you well", multiple CTAs, mentioning attachments, subject lines over 6 words, generic personalization ("I love what you are building"), wall-of-text paragraphs.`,
  },
  failureReportSize: 3,
  targetScore: 90,
};

export default config;
