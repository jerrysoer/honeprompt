"use client";

import { useState } from "react";
import type { IterationResult } from "promptloop";
import { StrategyBadge } from "./StrategyBadge";
import { StatusBadge } from "./StatusBadge";
import { ScoreBar } from "./ScoreBar";

function ImageThumbnail({ url }: { url: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt="Generated"
        className="h-12 w-12 rounded-lg object-cover cursor-pointer border border-border hover:border-accent transition-colors"
        onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
      />
      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setExpanded(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Generated (full)" className="max-h-[80vh] max-w-[80vw] rounded-2xl" />
        </div>
      )}
    </>
  );
}

export function IterationRow({ iteration }: { iteration: IterationResult }) {
  const [expanded, setExpanded] = useState(false);
  const isBaseline = iteration.iteration === 0;

  return (
    <>
      <tr
        className="cursor-pointer border-b border-border/60 hover:bg-surface-alt/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-3 py-3 text-sm font-mono text-text-muted">
          {iteration.iteration}
        </td>
        <td className="px-3 py-3">
          {isBaseline ? (
            <span className="text-sm text-text-muted italic">baseline</span>
          ) : (
            <StrategyBadge strategy={iteration.mutation!.strategy} />
          )}
        </td>
        <td className="hidden sm:table-cell max-w-xs truncate px-3 py-3 text-sm text-text-muted">
          {isBaseline ? "\u2014" : iteration.mutation!.description}
        </td>
        <td className="px-3 py-3">
          <ScoreBar value={Math.round(iteration.scores.average)} />
        </td>
        <td className="px-3 py-3">
          {isBaseline ? (
            <span className="text-sm text-text-muted">\u2014</span>
          ) : (
            <StatusBadge kept={iteration.kept} />
          )}
        </td>
        <td className="hidden sm:table-cell px-3 py-3 text-right text-sm font-mono text-text-muted">
          ${iteration.costUsd.toFixed(3)}
        </td>
        <td className="w-6 px-1 py-3 text-xs text-text-muted">
          {expanded ? "\u25B2" : "\u25BC"}
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-border/60">
          <td colSpan={7} className="bg-surface-alt/50 px-4 py-4">
            {/* Show description on mobile (hidden in table) */}
            {!isBaseline && (
              <p className="sm:hidden text-sm text-text-muted mb-3">
                {iteration.mutation!.description}
              </p>
            )}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Per-test-case scores
              </h4>
              <div className="grid gap-2">
                {iteration.scores.scores.map((score) => (
                  <div
                    key={score.testCaseId}
                    className="rounded-xl border border-border bg-surface p-3"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {score.imageUrl && (
                          <ImageThumbnail url={score.imageUrl} />
                        )}
                        <span className="text-sm font-mono font-medium">
                          {score.testCaseId}
                        </span>
                      </div>
                      <ScoreBar value={score.value} />
                    </div>
                    {score.dimensions && (
                      <div className="mt-1 mb-1 flex flex-wrap gap-2">
                        {Object.entries(score.dimensions).map(([dim, val]) => (
                          <span
                            key={dim}
                            className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-mono ${
                              val >= 80 ? "bg-kept-light text-kept" : val >= 60 ? "bg-amber-500/10 text-amber-600" : "bg-reverted-light text-reverted"
                            }`}
                          >
                            {dim}: {val}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs leading-relaxed text-text-muted">
                      {score.reasoning}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
