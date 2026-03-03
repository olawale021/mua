"use client";

import { SkinAnalysis } from "@/types";

interface SkinProfileProps {
  analysis: SkinAnalysis;
  photo?: string;
}

const FACE_SHAPE_LABELS: Record<string, string> = {
  oval: "Oval",
  round: "Round",
  square: "Square",
  heart: "Heart",
  oblong: "Oblong",
  diamond: "Diamond",
  rectangle: "Rectangle",
};

export function SkinProfile({ analysis, photo }: SkinProfileProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/40 bg-card/70 shadow-editorial backdrop-blur-sm">
      {/* Top section — photo + tone */}
      <div className="flex items-center gap-5 p-6">
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt="Your photo"
            className="h-24 w-24 rounded-xl border border-border/30 object-cover shadow-sm"
          />
        )}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <div
              className="h-12 w-12 rounded-lg border border-border/30 shadow-sm"
              style={{ backgroundColor: analysis.skinTone.hexColor }}
            />
            <div>
              <p className="font-display text-base font-semibold italic">
                {analysis.skinTone.description}
              </p>
              <p className="text-xs text-muted-foreground">
                Monk Scale {analysis.skinTone.monkScale}/10 &middot;{" "}
                <span className="font-mono text-[10px]">{analysis.skinTone.hexColor}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="editorial-line mx-6" />

      {/* Analysis grid */}
      <div className="grid grid-cols-2 gap-px bg-border/30 sm:grid-cols-4">
        {/* Undertone */}
        <div className="bg-card/70 p-4">
          <p className="label-caps mb-1.5 text-muted-foreground">Undertone</p>
          <p className="font-display text-sm font-semibold capitalize italic">
            {analysis.undertone.category}
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground/70">
            {Math.round(analysis.undertone.confidence * 100)}% confidence
          </p>
        </div>

        {/* Face Shape */}
        <div className="bg-card/70 p-4">
          <p className="label-caps mb-1.5 text-muted-foreground">Face Shape</p>
          <p className="font-display text-sm font-semibold italic">
            {FACE_SHAPE_LABELS[analysis.faceShape.shape] ||
              analysis.faceShape.shape}
          </p>
        </div>

        {/* Skin Type */}
        <div className="bg-card/70 p-4">
          <p className="label-caps mb-1.5 text-muted-foreground">Skin Type</p>
          <p className="font-display text-sm font-semibold capitalize italic">
            {analysis.skinType.primary}
          </p>
        </div>

        {/* Confidence */}
        <div className="bg-card/70 p-4">
          <p className="label-caps mb-1.5 text-muted-foreground">Confidence</p>
          <p className="font-display text-sm font-semibold capitalize italic">
            {analysis.overallConfidence}
          </p>
        </div>
      </div>

      {/* Bottom — concerns & indicators */}
      {(analysis.skinType.concerns.length > 0 ||
        analysis.undertone.indicators.length > 0) && (
        <div className="space-y-4 p-6">
          {analysis.skinType.concerns.length > 0 && (
            <div>
              <p className="label-caps mb-2 text-muted-foreground">
                Skin Concerns
              </p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.skinType.concerns.map((concern) => (
                  <span
                    key={concern}
                    className="rounded-full border border-border/50 bg-muted/50 px-3 py-1 text-xs text-muted-foreground"
                  >
                    {concern}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analysis.undertone.indicators.length > 0 && (
            <div>
              <p className="label-caps mb-2 text-muted-foreground">
                Undertone Indicators
              </p>
              <ul className="space-y-1">
                {analysis.undertone.indicators.map((indicator) => (
                  <li
                    key={indicator}
                    className="flex items-start gap-2 text-xs text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-copper/60" />
                    {indicator}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
