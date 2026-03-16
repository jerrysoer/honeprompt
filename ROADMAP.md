# PromptLoop Roadmap

## Current: v4

### Phase 1: Strategy Documents — "Wire the Brain"
**Status:** In Progress
**Goal:** Make `program.md` the live strategy document that shapes optimizer behavior.

- [x] `strategyDoc` parameter in `generateMutation()` and `MutatorOptions`
- [x] Strategy doc prepended to optimizer system prompt
- [x] `strategyDoc` in `RunOptions`, passed through runner loop
- [x] CLI `--strategy <path>` flag + auto-detect `program.md`
- [x] Starter `program.md` in init templates
- [x] Web: Strategy step in SetupForm (step 2, collapsible)
- [x] Web: API route accepts `strategyDoc`

### Phase 2: Resume + Cross-Run Learning
**Status:** In Progress
**Goal:** Resume stopped runs and accumulate strategy intelligence across runs.

- [x] `rebuildState()` in history.ts for state reconstruction
- [x] `resumeFrom` in `RunOptions` (skip baseline, reconstruct state)
- [x] `strategyStats` in `RunReport`
- [x] CLI `--resume` flag
- [x] Web: "Continue Run" button on completed/cancelled/plateau runs
- [x] Web: API accepts `resumeFrom` with `runId`

### Phase 3: Multimodal Prompt Optimization
**Status:** In Progress
**Goal:** Support image inputs (vision-as-judge) and image generation optimization.

- [x] `images` on `TestCase`, `imageUrl` on `LLMResponse`
- [x] `image-gen` model provider
- [x] Vision content blocks in Anthropic/OpenAI/CLI providers
- [x] `imageGenComplete()` for DALL-E/image generation
- [x] Vision judge scoring (image URL as content block)
- [x] Web: Image thumbnails in IterationRow
- [x] Web: Image-gen model entries in ModelPicker

### Phase 4: Multi-Dimensional Rubrics
**Status:** In Progress
**Goal:** Replace single 0-100 score with rubric dimensions.

- [x] `ScoringDimension` type, `dimensions` on `ScoringConfig` and `Score`
- [x] Rubric-aware judge prompt with per-dimension scoring
- [x] Weighted composite score calculation
- [x] Dimension-aware failure reports in mutator
- [x] Multi-line dimension chart in SVG
- [x] Web: Dimension config in SetupForm
- [x] Web: Per-dimension breakdown in IterationRow

---

## Completed: v3
- Claude Max CLI provider support
- Real-time SSE streaming
- Multi-provider LLM abstraction (Anthropic, OpenAI, Claude CLI)
- Web UI with setup wizard
- Strategy performance tracking
- Plateau detection and early stopping
