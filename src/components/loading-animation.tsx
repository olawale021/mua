"use client";

import { useState, useEffect } from "react";

const BEAUTY_TIPS = [
  "Analyzing your skin tone on the Monk Scale...",
  "Detecting your undertone — warm, cool, or neutral...",
  "Mapping your face shape for contouring advice...",
  "Assessing your skin type and concerns...",
  "Searching for your perfect foundation match...",
  "Finding the best lip colors for your undertone...",
  "Curating blush shades for your skin tone...",
  "Selecting eyeshadow palettes that complement you...",
  "Tip: Always apply foundation in natural light!",
  "Tip: Your undertone matters more than skin depth for shade matching",
];

export function LoadingAnimation() {
  const [tipIndex, setTipIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex((i) => (i + 1) % BEAUTY_TIPS.length);
    }, 3000);
    return () => clearInterval(tipInterval);
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p;
        return p + Math.random() * 8;
      });
    }, 500);
    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      {/* Animated circles */}
      <div className="relative h-32 w-32">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary/20 border-t-primary" style={{ animationDuration: "2s" }} />
        <div className="absolute inset-3 animate-spin rounded-full border-4 border-rose-light/30 border-b-rose-light" style={{ animationDuration: "3s", animationDirection: "reverse" }} />
        <div className="absolute inset-6 animate-spin rounded-full border-4 border-mauve/20 border-t-mauve" style={{ animationDuration: "1.5s" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">✨</span>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Analyzing Your Beauty Profile</h2>
        <p className="h-5 text-sm text-muted-foreground transition-all duration-500">
          {BEAUTY_TIPS[tipIndex]}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${Math.min(progress, 95)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
