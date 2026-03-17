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
    criteria: `Score the customer support reply on these dimensions (each 0-100):

1. **Empathy & Acknowledgment (25%)** — Does the reply acknowledge the customer's specific frustration or concern? Does it validate their experience without being dismissive or robotically apologetic? Deduct if the reply jumps straight to a solution without acknowledging the human impact.

2. **Resolution Clarity (30%)** — Is the resolution (or alternative) clearly stated? Are next steps specific and actionable (not "we will look into it")? If there is a timeline, is it concrete ("5-7 business days" not "soon")? Does the customer know exactly what will happen next?

3. **Tone & Professionalism (20%)** — Is the tone warm but professional? Does it avoid corporate jargon ("per our policy", "please be advised", "we apologize for any inconvenience")? Does it sound like a competent human, not a template? Is the customer addressed by name?

4. **Completeness (15%)** — Does the reply address everything the customer raised? Are edge cases handled (e.g., what happens to the original shipment, what if the workaround does not work)? Does it anticipate obvious follow-up questions?

5. **Conciseness (10%)** — Is the reply within 100-200 words? Is every sentence useful? Are there any filler paragraphs that add words but not value?

Penalize: "per our policy" or similar policy-hiding language, blaming the customer, asking the customer to try things they already tried, generic apologies without specifics ("we apologize for any inconvenience"), replies that do not address the urgency when the customer expressed time pressure, excessive length.`,
  },
  failureReportSize: 3,
  targetScore: 90,
};

export default config;
