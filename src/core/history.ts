import { appendFileSync, existsSync, readFileSync } from "node:fs";
import type { IterationResult, MutationStrategy } from "./types.js";
import type { StrategyStats } from "./runner.js";

// ── JSONL History (append-only) ─────────────────────────────

export function appendIteration(
  filePath: string,
  result: IterationResult,
): void {
  const line = JSON.stringify(result) + "\n";
  appendFileSync(filePath, line, "utf-8");
}

export function readHistory(filePath: string): IterationResult[] {
  if (!existsSync(filePath)) return [];

  const content = readFileSync(filePath, "utf-8").trim();
  if (!content) return [];

  return content
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line) as IterationResult);
}

// ── Rebuild run state from history (for resume) ─────────────

export interface RebuiltState {
  bestScore: number;
  bestPrompt: string;
  bestIteration: number;
  consecutiveReverts: number;
  strategyStats: StrategyStats;
  totalCost: number;
}

export function rebuildState(history: IterationResult[]): RebuiltState {
  const strategyStats: StrategyStats = {
    sharpen: { attempts: 0, kept: 0 },
    add_example: { attempts: 0, kept: 0 },
    remove: { attempts: 0, kept: 0 },
    restructure: { attempts: 0, kept: 0 },
    constrain: { attempts: 0, kept: 0 },
    expand: { attempts: 0, kept: 0 },
  };

  let bestScore = 0;
  let bestPrompt = "";
  let bestIteration = 0;
  let consecutiveReverts = 0;
  let totalCost = 0;
  let currentPrompt = "";

  for (const iter of history) {
    totalCost += iter.costUsd;

    if (iter.iteration === 0) {
      // Baseline
      bestScore = iter.scores.average;
      currentPrompt = ""; // We dont have the prompt text in history, caller provides it
      bestIteration = 0;
      continue;
    }

    if (iter.mutation) {
      const strategy = iter.mutation.strategy as MutationStrategy;
      if (strategyStats[strategy]) {
        strategyStats[strategy].attempts++;
      }

      if (iter.kept) {
        consecutiveReverts = 0;
        if (strategyStats[strategy]) {
          strategyStats[strategy].kept++;
        }
        currentPrompt = iter.mutation.newPrompt;
        if (iter.scores.average > bestScore) {
          bestScore = iter.scores.average;
          bestPrompt = iter.mutation.newPrompt;
          bestIteration = iter.iteration;
        }
      } else {
        consecutiveReverts++;
      }
    }
  }

  return {
    bestScore,
    bestPrompt,
    bestIteration,
    consecutiveReverts,
    strategyStats,
    totalCost,
  };
}

// ── Prompt hashing (simple, deterministic) ──────────────────

export function hashPrompt(prompt: string): string {
  let hash = 0;
  for (let i = 0; i < prompt.length; i++) {
    const char = prompt.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36).padStart(7, "0");
}
