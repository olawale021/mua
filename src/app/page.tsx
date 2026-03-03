import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 text-center">
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-1/4 right-0 h-[600px] w-[600px] rounded-full bg-rose-light/30 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-2xl">
          {/* Logo mark */}
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/25">
              <span className="text-3xl font-bold text-primary-foreground">
                MUA
              </span>
            </div>
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Your AI
            <span className="text-primary"> Beauty </span>
            Advisor
          </h1>

          <p className="mx-auto mb-8 max-w-lg text-lg text-muted-foreground sm:text-xl">
            Take a selfie. Get your skin analyzed. Discover your perfect makeup
            products — all powered by AI.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/analyze">
              <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/25">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
              <div className="mb-3 text-2xl">📸</div>
              <h3 className="mb-1 font-semibold">Snap a Selfie</h3>
              <p className="text-sm text-muted-foreground">
                Use your camera or upload a photo for instant analysis
              </p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
              <div className="mb-3 text-2xl">🔬</div>
              <h3 className="mb-1 font-semibold">AI Skin Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Skin tone, undertone, face shape, and skin type — all detected
                by AI
              </p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
              <div className="mb-3 text-2xl">💄</div>
              <h3 className="mb-1 font-semibold">Perfect Products</h3>
              <p className="text-sm text-muted-foreground">
                Personalized Sephora product picks with shade matching
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
