"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SkinProfile } from "@/components/skin-profile";
import { ProductGrid } from "@/components/product-grid";
import { SkinAnalysis, RecommendationResult } from "@/types";

export default function ResultsPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<SkinAnalysis | null>(null);
  const [recommendations, setRecommendations] =
    useState<RecommendationResult | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);

  useEffect(() => {
    const storedAnalysis = sessionStorage.getItem("mua-analysis");
    const storedRecs = sessionStorage.getItem("mua-recommendations");
    const storedPhoto = sessionStorage.getItem("mua-photo");
    const storedProvider = sessionStorage.getItem("mua-provider");

    if (!storedAnalysis || !storedRecs) {
      router.push("/analyze");
      return;
    }

    setAnalysis(JSON.parse(storedAnalysis));
    setRecommendations(JSON.parse(storedRecs));
    if (storedPhoto) setPhoto(storedPhoto);
    if (storedProvider) setProvider(storedProvider);
  }, [router]);

  if (!analysis || !recommendations) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <div className="text-muted-foreground">Loading results...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Results</h1>
          <p className="text-sm text-muted-foreground">
            Personalized analysis and recommendations
            {provider && (
              <span className="ml-1 text-xs">
                via {provider === "openai" ? "GPT-4o" : "Claude"}
              </span>
            )}
          </p>
        </div>
        <Link href="/analyze">
          <Button variant="outline" size="sm">
            Retake Photo
          </Button>
        </Link>
      </div>

      {/* Skin Profile */}
      <div className="mb-8">
        <SkinProfile analysis={analysis} photo={photo || undefined} />
      </div>

      {/* Product Recommendations */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">
          Recommended Products
        </h2>
        <ProductGrid recommendations={recommendations.recommendations} />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
        <Link href="/analyze" className="flex-1">
          <Button variant="outline" className="w-full">
            Retake Photo
          </Button>
        </Link>
        <Button
          className="flex-1"
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
        </Button>
      </div>
    </div>
  );
}
