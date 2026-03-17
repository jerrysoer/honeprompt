# CLAUDE.md Optimizer Strategy

## Goals
- Generate CLAUDE.md files that make AI assistants immediately productive in a codebase
- Every line should be actionable — no filler, no generic advice
- Structure should follow a consistent pattern: description, commands, architecture, conventions, gotchas

## Constraints
- Never exceed 50 lines
- Never include generic programming advice (e.g., "write clean code")
- Always include runnable commands (build, test, lint, dev)
- Never hallucinate framework-specific details — stick to what the input describes

## Hints
- The best CLAUDE.md files are opinionated about project-specific patterns
- Gotchas section is the highest-value part — things that would trip up an unfamiliar developer
- Use code blocks for commands, not prose descriptions
