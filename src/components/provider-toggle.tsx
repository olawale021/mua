"use client";

export type Provider = "anthropic" | "openai";

interface ProviderToggleProps {
  value: Provider;
  onChange: (provider: Provider) => void;
}

export function ProviderToggle({ value, onChange }: ProviderToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-muted/50 p-1">
      <button
        onClick={() => onChange("anthropic")}
        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
          value === "anthropic"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Claude
      </button>
      <button
        onClick={() => onChange("openai")}
        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
          value === "openai"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        GPT-4o
      </button>
    </div>
  );
}
