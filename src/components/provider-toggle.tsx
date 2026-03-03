"use client";

export type Provider = "anthropic" | "openai";

interface ProviderToggleProps {
  value: Provider;
  onChange: (provider: Provider) => void;
}

export function ProviderToggle({ value, onChange }: ProviderToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border/40 bg-card/70 p-1 backdrop-blur-sm">
      <button
        onClick={() => onChange("anthropic")}
        className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
          value === "anthropic"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Claude
      </button>
      <button
        onClick={() => onChange("openai")}
        className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
          value === "openai"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        GPT-4o
      </button>
    </div>
  );
}
