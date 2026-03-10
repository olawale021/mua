import type { Metadata } from "next";
import { Playfair_Display, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MUA — AI Beauty Advisor",
  description:
    "Get personalized makeup recommendations powered by AI. Take a selfie, get your skin analyzed, and discover your perfect products.",
  keywords: ["makeup", "beauty", "AI", "skin analysis", "shade matching"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${outfit.variable} ${jetbrains.variable} font-sans antialiased grain-overlay`}
      >
        <div className="relative min-h-screen">
          <header className="sticky top-0 z-50 glass border-b border-border/30">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
              <a href="/" className="group flex items-center gap-3">
                <span className="font-display text-2xl font-bold italic tracking-editorial text-primary transition-colors group-hover:text-accent">
                  MUA
                </span>
              </a>
              <nav className="flex items-center gap-6">
                <a
                  href="/analyze"
                  className="label-caps text-muted-foreground transition-colors hover:text-foreground"
                >
                  Analyze
                </a>
              </nav>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
