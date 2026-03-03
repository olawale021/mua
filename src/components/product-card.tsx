"use client";

import { ProductRecommendation } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <span key={`full-${i}`} className="text-xs text-amber-500">★</span>
        ))}
        {hasHalf && <span className="text-xs text-amber-500/60">★</span>}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <span key={`empty-${i}`} className="text-xs text-muted-foreground/30">★</span>
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {rating.toFixed(1)}
      </span>
      {reviews > 0 && (
        <span className="text-xs text-muted-foreground">
          ({reviews.toLocaleString()})
        </span>
      )}
    </div>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const isTopPick = product.rank === 1;

  return (
    <Card
      className={`overflow-hidden transition-shadow hover:shadow-md ${
        isTopPick ? "border-primary/40 shadow-sm" : ""
      }`}
    >
      <CardContent className="p-0">
        <div className="flex gap-3 p-4">
          {/* Rank indicator */}
          <div className="flex flex-col items-center justify-start gap-1 pt-1">
            <div
              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                isTopPick
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              #{product.rank}
            </div>
          </div>

          {/* Product Image */}
          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl text-muted-foreground">
                💄
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {product.brand}
              </p>
              {isTopPick && (
                <Badge className="text-[10px] px-1.5 py-0">
                  {RANK_LABELS[1]}
                </Badge>
              )}
            </div>
            <p className="text-sm font-semibold leading-tight">
              {product.name}
            </p>
            <StarRating rating={product.rating || 0} reviews={product.reviews || 0} />
            <div className="flex items-center gap-2">
              {product.shade && (
                <Badge variant="secondary" className="text-xs">
                  {product.shade}
                </Badge>
              )}
              {product.price && (
                <span className="text-sm font-medium text-primary">
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
          <div className="border-t border-border/50 bg-muted/30 px-4 py-3">
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">
                {isTopPick ? "Why it's #1: " : `#${product.rank} — `}
              </span>
              {product.whyItWorks}
            </p>
          </div>
        )}

        {/* Sephora Link */}
        {product.sephoraUrl && (
          <div className="border-t border-border/50 px-4 py-2">
            <a
              href={product.sephoraUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-primary hover:underline"
            >
              View on Sephora →
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
