# Commit Message Optimization Strategy

## Goals
- Strict conventional commit format compliance
- Imperative mood, always ("add" not "added")
- Subject lines that communicate the change in under 72 characters
- Bodies that explain WHY, not WHAT

## Preferred Strategies
- **constrain** — Enforce character limits, ban past tense, ban "This commit..." openers
- **sharpen** — Add rules for choosing the correct commit type and when to include a body
- **add_example** — Show good/bad commit message pairs for each type (feat, fix, refactor, etc.)

## Avoid
- Never use past tense in commit messages ("added", "fixed", "updated", "removed")
- Never start with "This commit..."
- Never repeat the subject line content in the body
- Never use "expand" to add unnecessary verbosity — commit messages should be tight
- Avoid "remove" — the prompt is already minimal, removing rules would break format compliance

## Hints
- The commit type is the most common error — guide the model to distinguish feat vs fix vs refactor vs chore
- Scope should match the directory or module affected: feat(auth):, fix(cart):, refactor(api):
- Subject line trick: complete the sentence "If applied, this commit will ___"
- Body is only needed for complex changes — simple renames or doc fixes need no body
- BREAKING CHANGE footer is required when the public API changes, not optional
- "chore" vs "build": chore = tooling/config, build = build system/dependencies
- The WHY test: if the body just restates the diff in English, it adds no value — explain the motivation instead
