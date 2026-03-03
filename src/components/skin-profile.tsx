"use client";

import { SkinAnalysis } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Your Skin Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Photo + Color Swatch Row */}
        <div className="flex items-center gap-4">
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt="Your photo"
              className="h-20 w-20 rounded-full border-2 border-border object-cover"
            />
          )}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-full border-2 border-border shadow-sm"
                style={{ backgroundColor: analysis.skinTone.hexColor }}
              />
              <div>
                <p className="text-sm font-medium">
                  {analysis.skinTone.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  Monk Scale: {analysis.skinTone.monkScale}/10 &middot;{" "}
                  {analysis.skinTone.hexColor}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Undertone */}
          <div className="rounded-lg border border-border/50 p-3">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Undertone
            </p>
            <Badge variant="secondary" className="capitalize">
              {analysis.undertone.category}
            </Badge>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {Math.round(analysis.undertone.confidence * 100)}% confidence
            </p>
          </div>

          {/* Face Shape */}
          <div className="rounded-lg border border-border/50 p-3">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Face Shape
            </p>
            <Badge variant="secondary">
              {FACE_SHAPE_LABELS[analysis.faceShape.shape] ||
                analysis.faceShape.shape}
            </Badge>
          </div>

          {/* Skin Type */}
          <div className="rounded-lg border border-border/50 p-3">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Skin Type
            </p>
            <Badge variant="secondary" className="capitalize">
              {analysis.skinType.primary}
            </Badge>
          </div>

          {/* Analysis Quality */}
          <div className="rounded-lg border border-border/50 p-3">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Confidence
            </p>
            <Badge
              variant={
                analysis.overallConfidence === "high"
                  ? "default"
                  : "secondary"
              }
              className="capitalize"
            >
              {analysis.overallConfidence}
            </Badge>
          </div>
        </div>

        {/* Skin Concerns */}
        {analysis.skinType.concerns.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Skin Concerns
            </p>
            <div className="flex flex-wrap gap-1.5">
              {analysis.skinType.concerns.map((concern) => (
                <Badge key={concern} variant="outline" className="text-xs">
                  {concern}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Undertone Indicators */}
        {analysis.undertone.indicators.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Undertone Indicators
            </p>
            <ul className="space-y-1">
              {analysis.undertone.indicators.map((indicator) => (
                <li
                  key={indicator}
                  className="text-xs text-muted-foreground"
                >
                  &bull; {indicator}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
