---
name: optimize-prompt
description: |
  Run /honeprompt:optimize-prompt <path> to optimize a prompt file. Iteratively
  improves the prompt using mutation strategies and LLM-as-judge scoring.
  Use when the user wants to improve, optimize, test, or iterate on a prompt.
argument-hint: "<path-to-prompt-file> [--criteria \"...\"] [--iterations N] [--tests <path>]"
---

# Optimize Prompt

Load and execute the `prompt-optimization` skill from this plugin.

## Usage

```
/honeprompt:optimize-prompt <path> [options]
```

### Options

- `--criteria "<text>"` — Custom scoring criteria for the LLM judge
- `--iterations <n>` — Maximum iterations (default: 15)
- `--tests <path>` — Path to existing test-cases.json

### Examples

```
/honeprompt:optimize-prompt src/prompts/classifier.md
/honeprompt:optimize-prompt prompt.md --iterations 10
/honeprompt:optimize-prompt system-prompt.md --criteria "Score on: JSON accuracy, edge case handling, response brevity"
/honeprompt:optimize-prompt prompt.md --tests ./my-test-cases.json
```

## What It Does

1. Reads the target prompt file
2. Generates (or loads) diverse test cases
3. Scores the prompt baseline via LLM-as-judge
4. Runs an iterative mutation loop: mutate → re-score → keep or revert
5. Writes the improved prompt back to the file
6. Outputs a summary with before/after scores and kept mutations

Run `/honeprompt:prompt-diff` after to see the full diff of changes.
