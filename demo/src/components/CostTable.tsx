const MODELS = [
  { name: "GPT-4.1-nano", cost: "~$0.02", speed: "Fastest" },
  { name: "GPT-4.1-mini", cost: "~$0.06", speed: "Fast" },
  { name: "Claude Haiku 4.5", cost: "~$0.12", speed: "Fast" },
  { name: "Claude Sonnet 4.5", cost: "~$0.45", speed: "Moderate" },
  { name: "Claude Max (CLI)", cost: "$0", speed: "Included", note: "flat-rate subscription" },
] as const;

export function CostTable() {
  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <h3 className="font-heading text-lg font-semibold">
          How much does this cost?
        </h3>
        <p className="text-sm text-text-muted mt-1">
          5 iterations, 10 test cases = ~115 LLM calls (~64K input + ~17.5K output tokens)
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-surface-alt/50">
              <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Model</th>
              <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-text-muted text-right">Est. Cost / Run</th>
              <th className="hidden sm:table-cell px-4 py-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Speed</th>
            </tr>
          </thead>
          <tbody>
            {MODELS.map((model) => (
              <tr key={model.name} className="border-b border-border/60">
                <td className="px-4 py-2.5 text-sm font-medium">{model.name}</td>
                <td className="px-4 py-2.5 text-sm font-mono text-right">
                  {model.cost}
                  {"note" in model && (
                    <span className="text-text-muted text-xs ml-1">({model.note})</span>
                  )}
                </td>
                <td className="hidden sm:table-cell px-4 py-2.5 text-sm text-text-muted">{model.speed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
