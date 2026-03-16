export interface ModelOption {
  id: string;
  label: string;
  provider: "anthropic" | "openai" | "claude-cli" | "image-gen";
  model: string;
}

export const MODELS: ModelOption[] = [
  // Claude Max (CLI) — flat-rate, no API key needed
  {
    id: "max-sonnet",
    label: "Claude Max — Sonnet",
    provider: "claude-cli",
    model: "sonnet",
  },
  {
    id: "max-opus",
    label: "Claude Max — Opus",
    provider: "claude-cli",
    model: "opus",
  },
  {
    id: "max-haiku",
    label: "Claude Max — Haiku",
    provider: "claude-cli",
    model: "haiku",
  },
  // API providers — per-token billing
  {
    id: "claude-sonnet-4-5",
    label: "Claude Sonnet 4.5",
    provider: "anthropic",
    model: "claude-sonnet-4-5-20250929",
  },
  {
    id: "claude-haiku-4-5",
    label: "Claude Haiku 4.5",
    provider: "anthropic",
    model: "claude-haiku-4-5-20251001",
  },
  {
    id: "claude-opus-4-6",
    label: "Claude Opus 4.6",
    provider: "anthropic",
    model: "claude-opus-4-6",
  },
  {
    id: "gpt-4o",
    label: "GPT-4o",
    provider: "openai",
    model: "gpt-4o",
  },
  // Image generation models
  {
    id: "dall-e-3",
    label: "DALL-E 3",
    provider: "image-gen",
    model: "dall-e-3",
  },
  {
    id: "dall-e-2",
    label: "DALL-E 2",
    provider: "image-gen",
    model: "dall-e-2",
  },
];
