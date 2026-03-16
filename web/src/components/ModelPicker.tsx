"use client";

import { useState, useMemo } from "react";
import { MODELS } from "@/lib/models";

interface ModelPickerProps {
  value: string;
  onChange: (modelId: string) => void;
  /** Expose whether the selected model is image-gen */
  onModeChange?: (isImageGen: boolean) => void;
}

type ProviderMode = "max" | "api";

export function ModelPicker({ value, onChange, onModeChange }: ModelPickerProps) {
  const currentModel = MODELS.find((m) => m.id === value);
  const isImageGen = currentModel?.provider === "image-gen";
  const [mode, setMode] = useState<ProviderMode>(
    currentModel?.provider === "claude-cli" ? "max" : "api",
  );

  const filteredModels = useMemo(
    () =>
      MODELS.filter((m) =>
        mode === "max"
          ? m.provider === "claude-cli"
          : m.provider !== "claude-cli",
      ),
    [mode],
  );

  // Split API models into text and image-gen groups
  const textModels = useMemo(
    () => filteredModels.filter((m) => m.provider !== "image-gen"),
    [filteredModels],
  );
  const imageModels = useMemo(
    () => filteredModels.filter((m) => m.provider === "image-gen"),
    [filteredModels],
  );

  const handleModeSwitch = (newMode: ProviderMode) => {
    setMode(newMode);
    const first = MODELS.find((m) =>
      newMode === "max"
        ? m.provider === "claude-cli"
        : m.provider !== "claude-cli",
    );
    if (first) {
      onChange(first.id);
      onModeChange?.(first.provider === "image-gen");
    }
  };

  const handleModelChange = (modelId: string) => {
    onChange(modelId);
    const model = MODELS.find((m) => m.id === modelId);
    onModeChange?.(model?.provider === "image-gen");
  };

  return (
    <div className="space-y-3">
      {/* Provider toggle */}
      <div className="flex rounded-xl border border-border bg-surface-alt p-1">
        <button
          type="button"
          onClick={() => handleModeSwitch("max")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            mode === "max"
              ? "bg-surface text-text shadow-sm"
              : "text-text-muted hover:text-text"
          }`}
        >
          Claude Max
        </button>
        <button
          type="button"
          onClick={() => handleModeSwitch("api")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            mode === "api"
              ? "bg-surface text-text shadow-sm"
              : "text-text-muted hover:text-text"
          }`}
        >
          API Key
        </button>
      </div>

      {/* Subtitle hint */}
      <p className="text-xs text-text-muted">
        {mode === "max"
          ? "Uses your Claude Max subscription \u2014 no API key needed"
          : "Requires ANTHROPIC_API_KEY or OPENAI_API_KEY"}
      </p>

      {/* Model select with optgroup separators in API mode */}
      <select
        value={value}
        onChange={(e) => handleModelChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
      >
        {mode === "api" ? (
          <>
            <optgroup label="Text Models">
              {textModels.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </optgroup>
            {imageModels.length > 0 && (
              <optgroup label="Image Generation">
                {imageModels.map((m) => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </optgroup>
            )}
          </>
        ) : (
          filteredModels.map((m) => (
            <option key={m.id} value={m.id}>{m.label}</option>
          ))
        )}
      </select>

      {/* Image-gen mode hint */}
      {isImageGen && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Image generation mode — test cases should describe the desired image. Scoring evaluates the generated image quality.
        </p>
      )}
    </div>
  );
}
