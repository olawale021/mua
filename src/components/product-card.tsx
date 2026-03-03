"use client";

import { ProductRecommendation } from "@/types";

interface ProductCardProps {
  product: ProductRecommendation;
}

const RANK_LABELS: Record<number, string> = {
  1: "Best Match",
  2: "Runner-up",
  3: "Great Pick",
  4: "Solid Choice",
  5: "Worth Trying",
};

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-px">
        {Array.from({ length: fullStars }).map((_, i) => (
          <span key={`full-${i}`} className="text-[11px] text-copper">&#9733;</span>
        ))}
        {hasHalf && <span className="text-[11px] text-copper/50">&#9733;</span>}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <span key={`empty-${i}`} className="text-[11px] text-muted-foreground/20">&#9733;</span>
        ))}
      </div>
      <span className="text-[11px] text-muted-foreground">
        {rating.toFixed(1)}
      </span>
      {reviews > 0 && (
        <span className="text-[11px] text-muted-foreground/60">
          ({reviews.toLocaleString()})
        </span>
      )}
    </div>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const isTopPick = product.rank === 1;

  return (
    <div
      className={`group overflow-hidden rounded-xl border transition-all hover:-translate-y-0.5 ${
        isTopPick
          ? "border-primary/30 bg-card/80 shadow-editorial"
          : "border-border/30 bg-card/60 hover:shadow-editorial"
      }`}
    >
      <div className="flex gap-4 p-4">
        {/* Rank */}
        <div className="flex flex-col items-center pt-1">
          <div
            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
              isTopPick
                ? "bg-primary text-primary-foreground"
                : "border border-border/50 text-muted-foreground"
            }`}
          >
            {product.rank}
          </div>
          {isTopPick && (
            <span className="mt-1 text-[8px] font-bold uppercase tracking-wider text-primary">
              Top
            </span>
          )}
        </div>

        {/* Product Image */}
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted/50">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2">
            <p className="label-caps text-muted-foreground">
              {product.brand}
            </p>
            {isTopPick && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                {RANK_LABELS[1]}
              </span>
            )}
          </div>
          <p className="text-sm font-semibold leading-tight">
            {product.name}
          </p>
          <StarRating rating={product.rating || 0} reviews={product.reviews || 0} />
          <div className="flex items-center gap-2">
            {product.shade && product.shade !== "N/A" && (
              <span className="rounded-full border border-border/40 bg-muted/40 px-2.5 py-0.5 text-[11px] text-muted-foreground">
                {product.shade}
              </span>
            )}
            {product.price && (
              <span className="font-display text-sm font-semibold text-primary">
                {product.price.startsWith("$")
                  ? product.price
                  : `$${product.price}`}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Why It Works */}
      {product.whyItWorks && (
        <div className="border-t border-border/20 bg-muted/20 px-4 py-3">
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground/80">
              {isTopPick ? "Why it's #1: " : `#${product.rank} — `}
            </span>
            {product.whyItWorks}
          </p>
        </div>
      )}

      {/* Sephora Link */}
      {product.sephoraUrl && (
        <div className="border-t border-border/20 px-4 py-2.5">
          <a
            href={product.sephoraUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-copper"
          >
            View on Sephora
            <svg
              className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
