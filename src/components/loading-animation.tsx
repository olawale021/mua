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
  "Tip: Your undertone matters more than depth for shade matching",
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
    <div className="flex flex-col items-center gap-10 text-center">
      {/* Orbital animation */}
      <div className="relative h-36 w-36">
        {/* Outer ring */}
        <div className="absolute inset-0 animate-rotate-slow rounded-full border border-border/40" />
        {/* Middle ring — reverse */}
        <div
          className="absolute inset-4 rounded-full border border-copper/30"
          style={{ animation: "rotate-slow 15s linear infinite reverse" }}
        />
        {/* Inner ring */}
        <div
          className="absolute inset-8 rounded-full border border-primary/20"
          style={{ animation: "rotate-slow 10s linear infinite" }}
        />
        {/* Center pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse-ring rounded-full bg-primary/20" />
            <div className="h-10 w-10 rounded-full bg-primary/10 backdrop-blur-sm" />
          </div>
        </div>
        {/* Orbiting dot */}
        <div className="absolute inset-0 animate-rotate-slow">
          <div className="absolute top-0 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-copper shadow-sm shadow-copper/50" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="font-display text-2xl font-bold italic tracking-editorial">
          Analyzing Your Beauty Profile
        </h2>
        <p className="h-5 text-sm text-muted-foreground transition-all duration-500">
          {BEAUTY_TIPS[tipIndex]}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="h-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-copper to-primary transition-all duration-500 ease-out"
            style={{ width: `${Math.min(progress, 95)}%` }}
          />
        </div>
        <p className="mt-2 label-caps text-muted-foreground/60">
          {Math.min(Math.round(progress), 95)}%
        </p>
      </div>
    </div>
  );
}
