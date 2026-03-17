import { baselineScore, finalScore, totalCostUsd } from "../data/run-data";

export function DemoHero() {
  return (
    <header className="text-center py-12 sm:py-16 px-4">
      <div className="inline-block rounded-full bg-accent-light px-3 py-1 text-xs font-medium text-accent mb-4">
        Interactive Demo
      </div>
      <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-4">
        Watch a prompt optimize itself
      </h1>
      <p className="text-lg text-text-muted max-w-2xl mx-auto mb-8">
        A real optimization run using the{" "}
        <span className="font-mono text-accent">linkedin-hooks</span> template.
        5 iterations, 10 test cases, scored by an LLM judge.
      </p>

      {/* Stats row */}
      <div className="flex items-center justify-center gap-6 sm:gap-10 text-center">
        <div>
          <div className="font-heading text-3xl font-bold">
            {baselineScore} → {finalScore}
          </div>
          <div className="text-sm text-text-muted">Score</div>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <div className="font-heading text-3xl font-bold">
            +{finalScore - baselineScore}
          </div>
          <div className="text-sm text-text-muted">Improvement</div>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <div className="font-heading text-3xl font-bold">
            ${totalCostUsd.toFixed(2)}
          </div>
          <div className="text-sm text-text-muted">Total Cost</div>
        </div>
      </div>
    </header>
  );
}
