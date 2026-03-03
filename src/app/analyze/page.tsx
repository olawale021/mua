"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CameraCapture } from "@/components/camera-capture";
import { LoadingAnimation } from "@/components/loading-animation";
import { ProviderToggle, type Provider } from "@/components/provider-toggle";
import { SkinAnalysis } from "@/types";

type AnalyzeState = "capture" | "analyzing" | "error";

export default function AnalyzePage() {
  const router = useRouter();
  const [state, setState] = useState<AnalyzeState>("capture");
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<Provider>("openai");

  async function handleCapture(imageBase64: string) {
    setState("analyzing");
    setError(null);

    try {
      // Step 1: Analyze the skin
      const analysisRes = await fetch(
        `/api/analyze?provider=${provider}`,
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

      // Step 2: Get product recommendations
      const recommendRes = await fetch(
        `/api/recommend?provider=${provider}`,
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

      // Store results — use server-converted JPEG for display
      sessionStorage.setItem("mua-analysis", JSON.stringify(analysis));
      sessionStorage.setItem(
        "mua-recommendations",
        JSON.stringify(recommendations)
      );
      sessionStorage.setItem("mua-photo", photoUrl);
      sessionStorage.setItem("mua-provider", provider);

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
      <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-md flex-col items-center justify-center px-4">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-md flex-col items-center justify-center px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold tracking-tight">
          Take Your Selfie
        </h1>
        <p className="text-sm text-muted-foreground">
          We&apos;ll analyze your skin tone, undertone, face shape, and more
        </p>
      </div>

      <CameraCapture onCapture={handleCapture} />

      {/* Model toggle */}
      <div className="mt-6">
        <ProviderToggle value={provider} onChange={setProvider} />
      </div>

      {state === "error" && error && (
        <div className="mt-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-sm text-destructive">
          {error}
          <button
            onClick={() => setState("capture")}
            className="mt-2 block w-full text-center underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
