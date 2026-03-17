# CLAUDE.md — HonePrompt

Autonomous prompt optimizer using the Karpathy autoresearch pattern. CLI tool + web UI + Claude Code plugin.

## Quick Reference

```bash
npm run build          # Build CLI (tsup)
npm run dev            # Watch mode
npm test               # Vitest
npm run lint           # tsc --noEmit
cd web && npm run build # Build Next.js web UI
```

## Architecture

- `src/core/` — Engine: mutator, scorer, runner, LLM abstraction, history, chart
- `src/cli/` — CLI commands (citty): run, eval, diff, init, estimate, generate-tests
- `web/` — Next.js 16 web UI with SSE streaming, BYOK, shareable runs
- `plugin/` — Claude Code plugin (SKILL.md-based optimizer)

## Model Routing

- **Default: Sonnet** for all tasks
- **Use Opus for:** Writing/editing SKILL.md files (the plugin product), subagent definitions, marketplace submission descriptions
- **Never Opus for:** CLI code, web components, config, README, single-file fixes

## Conventions

- TypeScript strict mode, ESM modules
- No database — all state is local files (history.jsonl, report.json)
- No auth — BYOK (Bring Your Own Key) pattern
- MIT license
- 6 mutation strategies: sharpen, add_example, remove, restructure, constrain, expand
- Scoring: LLM-as-judge (default), programmatic, rubric, hybrid

## Current Work

Phase 1: Claude Code Plugin — first prompt optimization plugin in the ecosystem.
See PRD at `/Users/jsmacair/Desktop/HonePrompt-Phase1-Plugin-PRD.md`.

## Verification Gate

- `npm run build` must pass before committing
- `cd web && npm run build` must pass before committing
- No `any` types unless unavoidable
- No console.log in production code (use consola)
