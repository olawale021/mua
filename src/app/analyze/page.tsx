"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CameraCapture } from "@/components/camera-capture";
import { LoadingAnimation } from "@/components/loading-animation";
import { SkinAnalysis } from "@/types";

type AnalyzeState = "capture" | "analyzing" | "error";

export default function AnalyzePage() {
  const router = useRouter();
  const [state, setState] = useState<AnalyzeState>("capture");
  const [error, setError] = useState<string | null>(null);
  async function handleCapture(imageBase64: string) {
    setState("analyzing");
    setError(null);

    try {
      const analysisRes = await fetch(
        `/api/analyze`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imageBase64 }),
        }
      );

      if (!analysisRes.ok) {
        throw new Error("Skin analysis failed. Please try again.");
      }

      const { photoUrl, ...analysis } = await analysisRes.json() as SkinAnalysis & { photoUrl: string };

      const recommendRes = await fetch(
        `/api/recommend`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ analysis }),
        }
      );

      if (!recommendRes.ok) {
        throw new Error("Product recommendations failed. Please try again.");
      }

      const recommendations = await recommendRes.json();

      sessionStorage.setItem("mua-analysis", JSON.stringify(analysis));
      sessionStorage.setItem(
        "mua-recommendations",
        JSON.stringify(recommendations)
      );
      sessionStorage.setItem("mua-photo", photoUrl);

      router.push("/results");
    } catch (err) {
      console.error("Analysis error:", err);
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
      setState("error");
    }
  }

  if (state === "analyzing") {
    return (
      <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
        <div className="mesh-gradient pointer-events-none absolute inset-0" />
        <div className="relative z-10">
          <LoadingAnimation />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 py-12">
      <div className="mesh-gradient pointer-events-none absolute inset-0" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="animate-fade-up mb-10 text-center">
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="h-px w-6 bg-copper/50" />
            <span className="label-caps text-copper">Step One</span>
            <div className="h-px w-6 bg-copper/50" />
          </div>
          <h1 className="font-display text-3xl font-bold italic tracking-editorial sm:text-4xl">
            Take Your Selfie
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            We&apos;ll analyze your skin tone, undertone, face shape & more
          </p>
        </div>

        {/* Camera */}
        <div className="animate-fade-up delay-100">
          <CameraCapture onCapture={handleCapture} />
        </div>

        {/* Error state */}
        {state === "error" && error && (
          <div className="animate-scale-in mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-center backdrop-blur-sm">
            <p className="text-sm text-destructive">{error}</p>
            <button
              onClick={() => setState("capture")}
              className="mt-3 label-caps text-destructive/80 underline underline-offset-4 transition-colors hover:text-destructive"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
