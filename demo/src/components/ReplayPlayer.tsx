import { useState, useEffect, useCallback } from "react";
import { history, getPromptAtStep, getCumulativeCost, originalPrompt } from "../data/run-data";
import { IterationRow } from "./IterationRow";
import { ScoreChart } from "./ScoreChart";
import { PromptDiff } from "./PromptDiff";

const MAX_STEP = history.length - 1;
const AUTO_ADVANCE_MS = 3000;

export function ReplayPlayer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [prevStep, setPrevStep] = useState(-1);

  const advance = useCallback(() => {
    setCurrentStep((s) => {
      setPrevStep(s);
      if (s >= MAX_STEP) {
        setIsPlaying(false);
        return s;
      }
      return s + 1;
    });
  }, []);

  const goBack = useCallback(() => {
    setCurrentStep((s) => {
      setPrevStep(s);
      return Math.max(0, s - 1);
    });
  }, []);

  const jumpTo = useCallback((step: number) => {
    setPrevStep(currentStep);
    setCurrentStep(step);
    setIsPlaying(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  // Auto-advance timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(advance, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [isPlaying, advance]);

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "l") advance();
      else if (e.key === "ArrowLeft" || e.key === "h") goBack();
      else if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [advance, goBack]);

  // URL hash sync
  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/step=(\d+)/);
    if (match) {
      const step = Math.min(parseInt(match[1]!, 10), MAX_STEP);
      setCurrentStep(step);
    }
  }, []);

  useEffect(() => {
    window.location.hash = `step=${currentStep}`;
  }, [currentStep]);

  const currentPrompt = getPromptAtStep(currentStep);
  const cumulativeCost = getCumulativeCost(currentStep);
  const visibleHistory = history.slice(0, currentStep + 1);

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            disabled={currentStep === 0}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-muted hover:bg-surface-alt disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous iteration"
          >
            ← Prev
          </button>

          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors min-w-[80px]"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>

          <button
            onClick={advance}
            disabled={currentStep >= MAX_STEP}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-muted hover:bg-surface-alt disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Next iteration"
          >
            Next →
          </button>
        </div>

        {/* Step dots */}
        <div className="flex items-center gap-2">
          {history.map((_, i) => (
            <button
              key={i}
              onClick={() => jumpTo(i)}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? "bg-accent scale-125"
                  : i <= currentStep
                    ? "bg-accent/40"
                    : "bg-border"
              }`}
              aria-label={`Jump to iteration ${i}`}
            />
          ))}
        </div>

        <p className="text-xs text-text-muted">
          Iteration {currentStep} of {MAX_STEP} · ${cumulativeCost.toFixed(3)} spent
          <span className="hidden sm:inline"> · Use arrow keys or space to navigate</span>
        </p>
      </div>

      {/* Chart */}
      <div className="flex justify-center">
        <ScoreChart history={history} visibleCount={currentStep} />
      </div>

      {/* Iteration table */}
      <div className="rounded-2xl border border-border bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-surface-alt/50">
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-text-muted">#</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Strategy</th>
                <th className="hidden sm:table-cell px-3 py-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Description</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Score</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Status</th>
                <th className="hidden sm:table-cell px-3 py-2 text-xs font-semibold uppercase tracking-wider text-text-muted text-right">Cost</th>
                <th className="w-6" />
              </tr>
            </thead>
            <tbody>
              {visibleHistory.map((iter) => (
                <IterationRow
                  key={iter.iteration}
                  iteration={iter}
                  isNew={iter.iteration === currentStep && iter.iteration > prevStep}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prompt diff */}
      <PromptDiff original={originalPrompt} optimized={currentPrompt} />
    </div>
  );
}
