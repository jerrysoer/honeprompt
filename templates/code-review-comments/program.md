# Code Review Comment Optimization Strategy

## Goals
- Comments should be immediately actionable — the author knows exactly what to change
- Every comment must reference specific code from the input (line numbers, variable names, patterns)
- Tone must be collaborative, never condescending

## Preferred Strategies
- **constrain** — Enforce "consider/might" language, ban condescending phrases, require code examples
- **sharpen** — Add specific patterns for different issue types (bugs vs style vs perf)
- **add_example** — Show good vs bad review comments to calibrate tone

## Avoid
- Never allow condescending phrases: "obviously", "you should know", "clearly", "this is wrong"
- Never produce vague feedback: "this could be better", "consider improving this"
- Never let the prompt generate walls of text — one focused comment per review
- Never critique the person ("you always do this") — always critique the code
- Avoid "restructure" — the prompt structure (identify, suggest, explain) is already sound

## Hints
- The best code reviews teach something — explain the WHY behind the suggestion
- Include a code snippet fix when the change is non-obvious
- Severity calibration matters: security issues demand direct language, style issues use softer framing
- Acknowledge what works before suggesting changes — "Good approach here; one thing to consider..."
- For bugs: show the failing input/output to make the issue concrete
- For performance: quantify the impact when possible ("O(n^2) with this data size means...")
- When code is genuinely fine, say so briefly — do not invent problems to seem thorough
