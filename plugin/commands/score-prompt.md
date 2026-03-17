---
name: score-prompt
description: |
  Run /honeprompt:score-prompt <path> to score a prompt file without modifying it.
  Evaluates prompt quality against test cases and reports per-case scores.
  Use when the user wants to evaluate, test, benchmark, or check a prompt.
argument-hint: "<path-to-prompt-file> [--criteria \"...\"] [--tests <path>]"
---

# Score Prompt

Score a prompt's current quality without optimizing it. Quick sanity check before committing to a full optimization run.

## Usage

```
/honeprompt:score-prompt <path> [options]
```

### Options

- `--criteria "<text>"` — Custom scoring criteria for the LLM judge
- `--tests <path>` — Path to existing test-cases.json

### Examples

```
/honeprompt:score-prompt src/prompts/classifier.md
/honeprompt:score-prompt system-prompt.md --criteria "Score on: accuracy, JSON format compliance"
```

## What It Does

1. Reads the target prompt file
2. Generates (or loads) diverse test cases
3. Scores the prompt against all test cases via LLM-as-judge
4. Reports per-case scores and identifies weakest areas

**No mutations, no file writes.** This is evaluation-only mode.

Load the `prompt-optimization` skill and execute its "Score-Only Mode" section.
