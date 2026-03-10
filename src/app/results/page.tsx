"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SkinProfile } from "@/components/skin-profile";
import { ProductGrid } from "@/components/product-grid";
import { SkinAnalysis, RecommendationResult } from "@/types";

export default function ResultsPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<SkinAnalysis | null>(null);
  const [recommendations, setRecommendations] =
    useState<RecommendationResult | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    const storedAnalysis = sessionStorage.getItem("mua-analysis");
    const storedRecs = sessionStorage.getItem("mua-recommendations");
    const storedPhoto = sessionStorage.getItem("mua-photo");

    if (!storedAnalysis || !storedRecs) {
      router.push("/analyze");
      return;
    }

    setAnalysis(JSON.parse(storedAnalysis));
    setRecommendations(JSON.parse(storedRecs));
    if (storedPhoto) setPhoto(storedPhoto);
  }, [router]);

  if (!analysis || !recommendations) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="label-caps text-muted-foreground">Loading results...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div className="mesh-gradient pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-10">
        {/* Header */}
        <div className="animate-fade-up mb-10 flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="h-px w-6 bg-copper/50" />
              <span className="label-caps text-copper">Your Results</span>
            </div>
            <h1 className="font-display text-3xl font-bold italic tracking-editorial sm:text-4xl">
              Beauty Profile
            </h1>
          </div>
          <Link
            href="/analyze"
            className="rounded-full border border-border bg-card/80 px-5 py-2.5 text-sm font-medium backdrop-blur-sm transition-all hover:shadow-editorial hover:-translate-y-0.5"
          >
            Retake
          </Link>
        </div>

        {/* Skin Profile */}
        <div className="animate-fade-up delay-100 mb-10">
          <SkinProfile analysis={analysis} photo={photo || undefined} />
        </div>

        {/* Divider */}
        <div className="animate-fade-up delay-200 mb-8 flex items-center gap-4">
          <div className="editorial-line h-px flex-1" />
          <span className="label-caps text-muted-foreground/60">Recommended Products</span>
          <div className="editorial-line h-px flex-1" />
        </div>

        {/* Product Recommendations */}
        <div className="animate-fade-up delay-300 mb-10">
          <ProductGrid recommendations={recommendations.recommendations} />
        </div>

        {/* Footer actions */}
        <div className="animate-fade-up delay-400 flex flex-col gap-3 border-t border-border/40 pt-8 sm:flex-row">
          <Link
            href="/analyze"
            className="flex-1 rounded-full border border-border bg-card/80 py-3.5 text-center text-sm font-medium backdrop-blur-sm transition-all hover:shadow-editorial hover:-translate-y-0.5"
          >
            Retake Photo
          </Link>
          <button
            className="flex-1 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-editorial transition-all hover:shadow-editorial-hover hover:-translate-y-0.5"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "My MUA Beauty Analysis",
                  text: `My skin analysis: ${analysis.skinTone.description}, ${analysis.undertone.category} undertone, ${analysis.faceShape.shape} face shape`,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
          >
            Share Results
          </button>
        </div>
      </div>
    </div>
  );
}
