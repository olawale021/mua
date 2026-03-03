import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-6">
        {/* Gradient mesh background */}
        <div className="mesh-gradient pointer-events-none absolute inset-0" />

        {/* Decorative floating orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float absolute -top-20 right-[15%] h-72 w-72 rounded-full bg-blush/40 blur-3xl" />
          <div className="animate-float delay-300 absolute bottom-[10%] left-[10%] h-56 w-56 rounded-full bg-copper/20 blur-3xl" />
          <div className="animate-float delay-600 absolute top-[30%] left-[60%] h-40 w-40 rounded-full bg-champagne/50 blur-2xl" />
        </div>

        {/* Decorative lines */}
        <div className="pointer-events-none absolute left-8 top-1/4 hidden h-32 w-px bg-gradient-to-b from-transparent via-border to-transparent lg:block" />
        <div className="pointer-events-none absolute right-8 bottom-1/3 hidden h-24 w-px bg-gradient-to-b from-transparent via-copper/30 to-transparent lg:block" />

        <div className="relative z-10 mx-auto w-full max-w-4xl">
          {/* Eyebrow label */}
          <div className="animate-fade-up mb-6 flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-copper/50" />
            <span className="label-caps text-copper">AI-Powered Beauty</span>
            <div className="h-px w-8 bg-copper/50" />
          </div>

          {/* Main heading — editorial serif */}
          <h1 className="animate-fade-up delay-100 text-balance text-center font-display text-5xl font-bold italic leading-[1.1] tracking-editorial sm:text-6xl md:text-7xl lg:text-8xl">
            Your Skin,{" "}
            <span className="not-italic text-primary">Decoded</span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-up delay-200 mx-auto mt-6 max-w-lg text-center text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Snap a selfie. Our AI analyzes your skin tone, undertone, and face
            shape — then matches you with your perfect Sephora products.
          </p>

          {/* CTA */}
          <div className="animate-fade-up delay-300 mt-10 flex justify-center">
            <Link
              href="/analyze"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:shadow-editorial-hover"
            >
              <span className="relative z-10">Begin Analysis</span>
              <svg
                className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
              <div className="absolute inset-0 bg-accent/20 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          </div>

          {/* Editorial divider */}
          <div className="animate-fade-up delay-400 mx-auto mt-16 flex items-center gap-4">
            <div className="editorial-line h-px flex-1" />
            <span className="label-caps text-muted-foreground/60">How It Works</span>
            <div className="editorial-line h-px flex-1" />
          </div>

          {/* Feature cards — staggered reveal */}
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="animate-fade-up delay-500 group rounded-2xl border border-border/40 bg-card/60 p-6 shadow-editorial backdrop-blur-sm transition-all hover:shadow-editorial-hover hover:-translate-y-1">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blush/60 text-lg">
                01
              </div>
              <h3 className="mb-1.5 font-display text-lg font-semibold italic">
                Capture
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Take a selfie or upload a photo using your front camera
              </p>
            </div>
            <div className="animate-fade-up delay-600 group rounded-2xl border border-border/40 bg-card/60 p-6 shadow-editorial backdrop-blur-sm transition-all hover:shadow-editorial-hover hover:-translate-y-1">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-champagne/60 text-lg">
                02
              </div>
              <h3 className="mb-1.5 font-display text-lg font-semibold italic">
                Analyze
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                AI detects your skin tone, undertone, face shape & skin type
              </p>
            </div>
            <div className="animate-fade-up delay-700 group rounded-2xl border border-border/40 bg-card/60 p-6 shadow-editorial backdrop-blur-sm transition-all hover:shadow-editorial-hover hover:-translate-y-1">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-copper/15 text-lg">
                03
              </div>
              <h3 className="mb-1.5 font-display text-lg font-semibold italic">
                Discover
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Get ranked Sephora picks with perfect shade matching
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
