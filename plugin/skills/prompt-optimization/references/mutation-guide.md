# Mutation Strategy Guide

Detailed reference for each mutation strategy. The optimizer should consult this when choosing and applying mutations.

## Strategy: `sharpen`

**When to use:** Output is vague, generic, or lacks specificity. The prompt uses soft language like "be helpful", "try to", "consider".

**How to apply:**
- Replace vague instructions with precise ones: "be concise" → "respond in 3 sentences or fewer"
- Add measurable constraints: "be accurate" → "cite specific numbers, dates, or facts from the input"
- Remove hedge words: "try to", "if possible", "consider" → direct imperatives
- Specify exact formats: "respond clearly" → "respond with a numbered list of 3-5 items"

**Common mistakes:**
- Over-sharpening: making instructions so rigid they break on edge cases
- Sharpening the wrong part: the vagueness may be intentional flexibility

**Example:**
Before: "You are a helpful assistant that summarizes articles."
After: "You are an article summarizer. For each article, produce a 3-sentence summary: (1) the main finding or argument, (2) the key supporting evidence, (3) why it matters. Never exceed 100 words."

---

## Strategy: `add_example`

**When to use:** The model misunderstands the desired output format, tone, or style. Showing is more effective than telling.

**How to apply:**
- Add 1-2 concrete input/output examples that demonstrate the exact desired behavior
- Place examples AFTER the instructions, before any closing constraints
- Use examples that cover the specific failure mode observed
- Format clearly: "Example input: ... Example output: ..."

**Common mistakes:**
- Adding too many examples (clutters the prompt, increases cost)
- Adding examples that are too similar to each other
- Examples that conflict with the instructions

**Example addition:**
```
Example:
Input: "The Fed raised rates by 25 basis points, marking the 10th consecutive hike."
Output: "The Federal Reserve continued its tightening cycle with a 25bp rate increase, its 10th straight hike, signaling persistent inflation concerns despite market expectations of a pause."
```

---

## Strategy: `remove`

**When to use:** The prompt contains contradictory instructions, redundant rules, or confusing caveats that hurt performance.

**How to apply:**
- Identify instructions that contradict each other and remove the less important one
- Remove redundant rules that say the same thing in different words
- Remove overly cautious hedging that makes the model indecisive
- Remove instructions that are never relevant to the test cases

**Common mistakes:**
- Removing instructions that seem redundant but actually handle edge cases
- Removing too much at once (violates one-change-per-iteration rule)

**Signs to look for:**
- "Do X, but also consider not doing X in some cases" → contradiction
- "Be concise. Keep responses short. Do not be verbose." → redundancy
- "If the user asks about Y, but only if Z, unless W..." → over-specification

---

## Strategy: `restructure`

**When to use:** Important instructions are buried in the middle or end of the prompt. The model ignores constraints because they appear after less important content.

**How to apply:**
- Move critical constraints to the TOP of the prompt (primacy effect)
- Group related instructions together
- Add clear section headers (##) for different instruction categories
- Put output format requirements near the end (recency effect)
- Move identity/role at the very top, constraints next, format at the bottom

**Common mistakes:**
- Restructuring when the issue is content, not organization
- Breaking the logical flow of instructions

**Optimal structure:**
1. Role/identity (who you are)
2. Critical constraints (what you MUST and MUST NOT do)
3. Task description (what to do)
4. Context/background (domain knowledge)
5. Examples (if any)
6. Output format (how to respond)

---

## Strategy: `constrain`

**When to use:** The model produces output that goes off-track, includes unwanted content, or fails to stay within boundaries.

**How to apply:**
- Add explicit "DO NOT" rules for observed failure modes
- Add format constraints: max length, required sections, forbidden content
- Add negative examples: "Do NOT respond like this: ..."
- Add scope limits: "Only discuss X. If asked about Y, redirect to X."

**Common mistakes:**
- Adding too many constraints at once (pick the most impactful one)
- Constraints that are too broad ("never be creative" when you just need format discipline)

**Example:**
Before: "Summarize the article."
After: "Summarize the article. Do NOT include your opinion or analysis. Do NOT speculate beyond what the article states. Stick to facts from the source text only."

---

## Strategy: `expand`

**When to use:** The prompt is too terse or under-specified. The model needs more guidance, context, or sub-steps to perform well.

**How to apply:**
- Break a single instruction into explicit sub-steps
- Add domain context the model needs but may not have
- Specify what "good" looks like in more detail
- Add handling for specific input types the prompt does not cover

**Common mistakes:**
- Expanding too much (bloating the prompt, increasing cost)
- Expanding parts that already work well
- Adding information the model already knows (e.g., common knowledge)

**Example:**
Before: "Classify the sentiment of this review."
After: "Classify the sentiment of this review as one of: POSITIVE, NEGATIVE, MIXED, or NEUTRAL. Classification rules: POSITIVE = overall recommends or praises the product. NEGATIVE = overall criticizes or discourages purchase. MIXED = contains both significant praise and criticism. NEUTRAL = factual description without strong sentiment."

---

## Strategy Selection Heuristics

When multiple strategies seem applicable, use these tiebreakers:

1. **Check history first.** If `sharpen` was reverted in the last 2 iterations, do not try `sharpen` again. Try a different approach.
2. **Prefer high-success strategies.** If `constrain` has been kept 3/4 times but `expand` has been kept 0/2 times, prefer `constrain`.
3. **Start surgical, go broader.** In early iterations, prefer `sharpen` and `constrain` (targeted). In later iterations when targeted changes stop working, try `restructure` or `add_example` (structural).
4. **Match failure severity.** If the lowest-scoring test case is 20/100, the issue is fundamental — consider `restructure` or `expand`. If it is 55/100, the issue is refinement — consider `sharpen` or `constrain`.
