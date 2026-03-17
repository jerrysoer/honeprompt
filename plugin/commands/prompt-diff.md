---
name: prompt-diff
description: |
  Run /honeprompt:prompt-diff to see the diff between the original and optimized
  prompt after a HonePrompt optimization run. Shows green/red diff with strategy
  annotations. Use when the user asks to see changes, review the diff, or
  understand what the optimizer changed.
---

# Prompt Diff

Show a formatted diff between the original and optimized prompt after an optimization run.

## Usage

```
/honeprompt:prompt-diff [directory]
```

If no directory is specified, looks for `.honeprompt/history.jsonl` in the current directory.

## What It Does

1. Read `.honeprompt/history.jsonl` from the current (or specified) directory
2. Extract the baseline prompt (iteration 0) and the final optimized prompt
3. Display a line-by-line diff:
   - Green (`+`) for added lines
   - Red (`-`) for removed lines
   - Gray for unchanged lines
4. Annotate with mutation strategies that were kept
5. Show the score improvement summary

## Output Format

```
--- Original prompt
+++ Optimized prompt (score: 62 -> 84, +22)

  You are an article summarizer.
- Be helpful and concise.
+ Produce exactly 3 sentences: (1) main finding, (2) key evidence, (3) why it matters.
+ Never exceed 100 words.
  ...

Mutations kept:
 1. sharpen    "Tightened output format to 3 sentences"
 2. constrain  "Added 100-word limit"
```

## Error Cases

- If no `.honeprompt/history.jsonl` exists: "No optimization history found. Run `/honeprompt:optimize-prompt` first."
- If history has only a baseline (iteration 0): "Only baseline found — no optimization was performed."

## How to Read the History

Read `.honeprompt/history.jsonl`. Each line is a JSON object with:
- `iteration`: 0 for baseline, 1+ for mutations
- `mutation`: `null` for baseline, `{strategy, description, newPrompt}` for mutations
- `scores`: `{average, lowest[]}`
- `kept`: boolean

To reconstruct the final prompt: find the last iteration where `kept: true` and use its `mutation.newPrompt`. If only baseline exists, use the original prompt.
