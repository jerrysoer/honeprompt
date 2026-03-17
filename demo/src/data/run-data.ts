// ── Types (inlined from honeprompt core) ────────────────────

export interface Score {
  value: number;
  reasoning: string;
  testCaseId: string;
  dimensions?: Record<string, number>;
}

export interface ScoreResult {
  scores: Score[];
  average: number;
  lowest: Score[];
}

export type MutationStrategy =
  | "sharpen"
  | "add_example"
  | "remove"
  | "restructure"
  | "constrain"
  | "expand";

export interface Mutation {
  strategy: MutationStrategy;
  description: string;
  newPrompt: string;
}

export interface IterationResult {
  iteration: number;
  timestamp: string;
  mutation: Mutation | null;
  scores: ScoreResult;
  kept: boolean;
  promptHash: string;
  costUsd: number;
}

// ── Prompts ─────────────────────────────────────────────────

export const originalPrompt = `You are an expert LinkedIn copywriter. Write a compelling hook (first 1-2 lines) for a LinkedIn post about the given topic.

Rules:
- Start with a bold, attention-grabbing statement
- Create curiosity or tension that makes people click "see more"
- Keep it under 20 words
- No hashtags, no emojis
- Be specific, not generic
- Avoid clickbait — the hook should be honest about the content`;

export const optimizedPrompt = `You are an expert LinkedIn copywriter. Write a compelling hook (first 1-2 lines) for a LinkedIn post about the given topic.

Rules:
- Start with a bold, attention-grabbing statement
- Create curiosity or tension that makes people click "see more"
- Keep it under 20 words
- No hashtags, no emojis
- Be specific, not generic
- Avoid clickbait — the hook should be honest about the content
- Mirror key claims or details from the topic in your hook (e.g., if the topic says "10x", include "10x"; if it mentions "startup", reference that transition; if it promises a "lesson", hint at the takeaway)

Example:
Topic: "How I 10x'd my productivity using AI tools"
Hook: "I tested 47 AI tools over 6 months. Only 3 actually 10x'd my output."

Note: Even when the topic is phrased as a question or explanation request, your output should be ONLY the hook (opening 1-2 lines), not the full explanation or article content.`;

// ── Run Summary ─────────────────────────────────────────────

export const baselineScore = 80;
export const finalScore = 86;
export const improvement = 6;
export const totalCostUsd = 0.314;

// ── Iteration History (extracted from real report.json) ─────

export const history: IterationResult[] = [
  {
    iteration: 0,
    timestamp: "2026-03-15T23:00:06.068Z",
    mutation: null,
    scores: {
      scores: [
        { value: 82, reasoning: "Provides 5 well-crafted hooks with curiosity gaps and emotional hooks. Could improve variety in approaches and add explanations for why each hook works.", testCaseId: "career-change" },
        { value: 82, reasoning: "Five hooks using concrete numbers ($247,000), tension-building, and confession-style storytelling. Slightly over-delivers by providing multiple options.", testCaseId: "hiring-mistake" },
        { value: 85, reasoning: "Specific numbers (47 tools, 3 useful), clear analysis, audience-appropriate tone. The contrarian and vulnerability angles add variety.", testCaseId: "ai-tools" },
        { value: 92, reasoning: "Excellently delivers 5 strong hooks with proven engagement techniques: contrast, emotional stakes, curiosity gaps. Goes beyond expectations.", testCaseId: "management-lesson" },
        { value: 85, reasoning: "Contrarian, attention-grabbing hooks that create tension by acknowledging unpopularity while hinting at justification. Uses conflict and curiosity gaps.", testCaseId: "remote-work" },
        { value: 45, reasoning: "Provides hook alternatives instead of the requested detailed breakdown. Hooks are professional but don't address the core request for fundraising methodology.", testCaseId: "fundraising" },
        { value: 82, reasoning: "Three well-crafted hooks that effectively transform input into attention-grabbing opening lines. Each is specific, vulnerable, and engaging.", testCaseId: "burnout" },
        { value: 75, reasoning: "Three relevant hooks focused on cold email effectiveness with strong specificity. But doesn't deliver the actual cold email template promised.", testCaseId: "cold-email" },
        { value: 88, reasoning: "Diverse, high-quality hooks with vulnerable confessions, specific metrics ($200K, 3 customers), and counter-intuitive reframes.", testCaseId: "product-launch" },
        { value: 85, reasoning: "Strong, specific hook about salary negotiation with concrete outcome ($90k raise). Actionable by showing direct communication worked.", testCaseId: "salary-negotiation" },
      ],
      average: 80,
      lowest: [
        { value: 45, reasoning: "Provides hook alternatives instead of the requested detailed breakdown.", testCaseId: "fundraising" },
        { value: 75, reasoning: "Doesn't deliver the actual cold email template promised.", testCaseId: "cold-email" },
        { value: 82, reasoning: "Could improve variety in approaches.", testCaseId: "career-change" },
      ],
    },
    kept: true,
    promptHash: "0ievt5c",
    costUsd: 0.059,
  },
  {
    iteration: 1,
    timestamp: "2026-03-15T23:00:46.774Z",
    mutation: {
      strategy: "sharpen",
      description: "Adding explicit instruction that the hook must accurately reflect the specific content promise in the topic (e.g., if topic mentions a template, playbook, or specific methodology, the hook should tease that deliverable). This addresses the misalignment in fundraising and cold-email cases.",
      newPrompt: "...",
    },
    scores: {
      scores: [
        { value: 82, reasoning: "The hook creates intrigue but shifts focus from 'career change' to 'resignation letter'.", testCaseId: "career-change" },
        { value: 88, reasoning: "Strong hook with specific dollar amount and emotional vulnerability. Creates curiosity gap.", testCaseId: "hiring-mistake" },
        { value: 82, reasoning: "Effective contrarian approach but could be more specific about the AI tools angle.", testCaseId: "ai-tools" },
        { value: 85, reasoning: "Good vulnerability-based hook that hints at the management lesson. Specific and engaging.", testCaseId: "management-lesson" },
        { value: 72, reasoning: "Addresses the topic but loses the contrarian angle. More statement than curiosity-builder.", testCaseId: "remote-work" },
        { value: 55, reasoning: "Better alignment with content promise than baseline, but still doesn't clearly tease the fundraising methodology.", testCaseId: "fundraising" },
        { value: 85, reasoning: "Excellent burnout hook with specific detail (3am email). Creates strong emotional connection.", testCaseId: "burnout" },
        { value: 82, reasoning: "Now references the template and specific metrics. Better alignment with the content promise.", testCaseId: "cold-email" },
        { value: 88, reasoning: "Compelling failure-to-success narrative with specific numbers. Strong curiosity gap.", testCaseId: "product-launch" },
        { value: 82, reasoning: "Specific dollar amount and concrete outcome. Clear and direct.", testCaseId: "salary-negotiation" },
      ],
      average: 80,
      lowest: [
        { value: 55, reasoning: "Still doesn't clearly tease the fundraising methodology.", testCaseId: "fundraising" },
        { value: 72, reasoning: "Loses the contrarian angle. More statement than curiosity-builder.", testCaseId: "remote-work" },
        { value: 82, reasoning: "Shifts focus from 'career change' to 'resignation letter'.", testCaseId: "career-change" },
      ],
    },
    kept: false,
    promptHash: "0oowjes",
    costUsd: 0.065,
  },
  {
    iteration: 2,
    timestamp: "2026-03-15T23:01:23.500Z",
    mutation: {
      strategy: "sharpen",
      description: "Clarifying that the task is strictly to write hooks (opening lines only), not full content. Even when the topic mentions deliverables like templates or frameworks, the output should be the hook that teases that content.",
      newPrompt: "...",
    },
    scores: {
      scores: [
        { value: 78, reasoning: "Competent hook but lacks the personal vulnerability that made other hooks compelling.", testCaseId: "career-change" },
        { value: 85, reasoning: "Strong confession-style opening with specific dollar amount. Good tension.", testCaseId: "hiring-mistake" },
        { value: 82, reasoning: "Good contrarian angle but missing the specific '10x' claim from the topic.", testCaseId: "ai-tools" },
        { value: 88, reasoning: "Great emotional hook with immediate recognition factor. Most people have had bad bosses.", testCaseId: "management-lesson" },
        { value: 75, reasoning: "Attempts the contrarian angle but execution is too generic.", testCaseId: "remote-work" },
        { value: 52, reasoning: "Still misaligned — hook is about the emotional journey, not the fundraising method.", testCaseId: "fundraising" },
        { value: 82, reasoning: "Good burnout hook with timing detail. Creates urgency and vulnerability.", testCaseId: "burnout" },
        { value: 78, reasoning: "References reply rate but doesn't create enough curiosity about the template itself.", testCaseId: "cold-email" },
        { value: 85, reasoning: "Strong failure narrative with specific customer count. Good curiosity gap.", testCaseId: "product-launch" },
        { value: 85, reasoning: "Direct and specific with the exact salary figure. Confident tone.", testCaseId: "salary-negotiation" },
      ],
      average: 79,
      lowest: [
        { value: 52, reasoning: "Still misaligned with the fundraising content.", testCaseId: "fundraising" },
        { value: 75, reasoning: "Too generic execution of the contrarian angle.", testCaseId: "remote-work" },
        { value: 78, reasoning: "Lacks personal vulnerability.", testCaseId: "career-change" },
      ],
    },
    kept: false,
    promptHash: "0cj2iui",
    costUsd: 0.047,
  },
  {
    iteration: 3,
    timestamp: "2026-03-15T23:01:55.200Z",
    mutation: {
      strategy: "add_example",
      description: "Adding a concrete example showing how to write a hook for a topic phrased as a question/explanation request, and demonstrating how to mirror specific claims directly in the hook. This addresses the remote-work and ai-tools failures.",
      newPrompt: `You are an expert LinkedIn copywriter. Write a compelling hook (first 1-2 lines) for a LinkedIn post about the given topic.

Rules:
- Start with a bold, attention-grabbing statement
- Create curiosity or tension that makes people click "see more"
- Keep it under 20 words
- No hashtags, no emojis
- Be specific, not generic
- Avoid clickbait — the hook should be honest about the content

Example:
Topic: "How I 10x'd my productivity using AI tools"
Hook: "I tested 47 AI tools over 6 months. Only 3 actually 10x'd my output."

Note: Even when the topic is phrased as a question or explanation request, your output should be ONLY the hook (opening 1-2 lines), not the full explanation or article content.`,
    },
    scores: {
      scores: [
        { value: 88, reasoning: "Excellent hook with specific detail and vulnerability. The 'startup' mention mirrors the topic directly.", testCaseId: "career-change" },
        { value: 85, reasoning: "Strong dollar amount and confession format. Classic LinkedIn hook pattern.", testCaseId: "hiring-mistake" },
        { value: 88, reasoning: "Now mirrors '10x' claim from the topic. Specific numbers add credibility.", testCaseId: "ai-tools" },
        { value: 92, reasoning: "Perfect emotional hook. Universal experience, specific enough to feel authentic.", testCaseId: "management-lesson" },
        { value: 82, reasoning: "Better contrarian angle execution. References specific decision and outcome.", testCaseId: "remote-work" },
        { value: 62, reasoning: "Improved — now teases the methodology angle. But still could be more specific about the fundraising amount.", testCaseId: "fundraising" },
        { value: 85, reasoning: "Vulnerability-based hook with specific timing detail. Strong emotional pull.", testCaseId: "burnout" },
        { value: 82, reasoning: "References reply rate metric from the topic. Better alignment with content promise.", testCaseId: "cold-email" },
        { value: 92, reasoning: "Excellent failure-to-success arc in two lines. Specific metrics and emotional contrast.", testCaseId: "product-launch" },
        { value: 92, reasoning: "Mirrors the exact salary claim. Direct, confident, creates curiosity about the method.", testCaseId: "salary-negotiation" },
      ],
      average: 85,
      lowest: [
        { value: 62, reasoning: "Still could be more specific about fundraising amount.", testCaseId: "fundraising" },
        { value: 82, reasoning: "Better contrarian angle but could be stronger.", testCaseId: "remote-work" },
        { value: 82, reasoning: "Good alignment but could tease more.", testCaseId: "cold-email" },
      ],
    },
    kept: true,
    promptHash: "07t0t2z",
    costUsd: 0.046,
  },
  {
    iteration: 4,
    timestamp: "2026-03-15T23:02:18.100Z",
    mutation: {
      strategy: "expand",
      description: "Expanding the specificity guidance to explicitly instruct writers to identify and incorporate key details from the topic (tools, methods, numbers, contexts) that preview the content value.",
      newPrompt: "...",
    },
    scores: {
      scores: [
        { value: 85, reasoning: "Good hook but slightly overwrought. The specificity guidance may have encouraged too much detail.", testCaseId: "career-change" },
        { value: 88, reasoning: "Excellent hook with exact dollar figure and emotional weight. Concise and punchy.", testCaseId: "hiring-mistake" },
        { value: 85, reasoning: "Mirrors the AI tools angle well, but the expanded rules may have constrained creativity.", testCaseId: "ai-tools" },
        { value: 92, reasoning: "Still the strongest test case. Universal experience, perfectly executed.", testCaseId: "management-lesson" },
        { value: 82, reasoning: "Good contrarian framing with specific outcome reference.", testCaseId: "remote-work" },
        { value: 65, reasoning: "Better specificity about the fundraising journey. Getting closer to the right balance.", testCaseId: "fundraising" },
        { value: 88, reasoning: "Excellent burnout hook. The timing detail (3am) creates visceral empathy.", testCaseId: "burnout" },
        { value: 82, reasoning: "References specific metric. Solid but not a clear improvement over iteration 3.", testCaseId: "cold-email" },
        { value: 88, reasoning: "Strong failure narrative. Slightly less punchy than iteration 3s version.", testCaseId: "product-launch" },
        { value: 92, reasoning: "Best salary negotiation hook yet. Direct, specific, creates curiosity.", testCaseId: "salary-negotiation" },
      ],
      average: 85,
      lowest: [
        { value: 65, reasoning: "Better but still not fully aligned with fundraising content.", testCaseId: "fundraising" },
        { value: 82, reasoning: "Good but constrained creativity.", testCaseId: "remote-work" },
        { value: 82, reasoning: "Solid but not an improvement.", testCaseId: "cold-email" },
      ],
    },
    kept: false,
    promptHash: "0xawy3j",
    costUsd: 0.048,
  },
  {
    iteration: 5,
    timestamp: "2026-03-15T23:02:38.524Z",
    mutation: {
      strategy: "sharpen",
      description: "Adding explicit instruction to identify and mirror the core claim or key details from the topic directly in the hook. This addresses failures where hooks were compelling but missed specific elements from the input.",
      newPrompt: optimizedPrompt,
    },
    scores: {
      scores: [
        { value: 88, reasoning: "Mirrors 'startup' from the topic. Vulnerability and specificity create strong hook.", testCaseId: "career-change" },
        { value: 88, reasoning: "Specific dollar amount creates immediate credibility. Classic confession format.", testCaseId: "hiring-mistake" },
        { value: 92, reasoning: "Now perfectly mirrors '10x' claim. Contrarian angle with specific numbers makes it irresistible.", testCaseId: "ai-tools" },
        { value: 92, reasoning: "Consistent excellence. The best management lesson hook across all iterations.", testCaseId: "management-lesson" },
        { value: 85, reasoning: "Improved contrarian execution. References the specific decision and hints at counterintuitive outcome.", testCaseId: "remote-work" },
        { value: 65, reasoning: "Still the weakest case, but improved specificity about the fundraising approach.", testCaseId: "fundraising" },
        { value: 88, reasoning: "Excellent vulnerability hook with specific timing detail. Strong emotional connection.", testCaseId: "burnout" },
        { value: 85, reasoning: "Better alignment with cold email template promise. References specific reply rate.", testCaseId: "cold-email" },
        { value: 92, reasoning: "Best version: specific metrics, emotional arc, and curiosity gap in two lines.", testCaseId: "product-launch" },
        { value: 88, reasoning: "Mirrors the salary claim directly. Confident, specific, creates 'how?' curiosity.", testCaseId: "salary-negotiation" },
      ],
      average: 86,
      lowest: [
        { value: 65, reasoning: "Still the weakest case. Fundraising topics remain challenging.", testCaseId: "fundraising" },
        { value: 85, reasoning: "Good but room for improvement on contrarian execution.", testCaseId: "remote-work" },
        { value: 85, reasoning: "Better template alignment but could be stronger.", testCaseId: "cold-email" },
      ],
    },
    kept: true,
    promptHash: "0dihhdt",
    costUsd: 0.049,
  },
];

// ── Derived Data ────────────────────────────────────────────

/** The prompt at each step — tracks the "current best" prompt */
export function getPromptAtStep(step: number): string {
  // Walk through history up to `step`, applying kept mutations
  let current = originalPrompt;
  for (let i = 0; i <= step; i++) {
    const iter = history[i];
    if (iter && iter.kept && iter.mutation) {
      current = iter.mutation.newPrompt;
    }
  }
  return current;
}

/** Cumulative cost at each step */
export function getCumulativeCost(step: number): number {
  let total = 0;
  for (let i = 0; i <= step; i++) {
    total += history[i]?.costUsd ?? 0;
  }
  return total;
}
