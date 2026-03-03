import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MUA - AI Beauty Advisor",
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
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <div className="relative min-h-screen">
          <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
              <a href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <span className="text-sm font-bold text-primary-foreground">
                    M
                  </span>
                </div>
                <span className="text-lg font-semibold tracking-tight">
                  MUA
                </span>
              </a>
              <nav className="flex items-center gap-4 text-sm text-muted-foreground">
                <a href="/analyze" className="transition-colors hover:text-foreground">
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
