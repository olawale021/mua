"use client";

import { useState } from "react";
import { CategoryRecommendation, ProductCategory } from "@/types";
import { ProductCard } from "@/components/product-card";

interface ProductGridProps {
  recommendations: CategoryRecommendation[];
}

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  foundation: "Foundation",
  concealer: "Concealer",
  blush: "Blush",
  lipstick: "Lips",
  eyeshadow: "Eyes",
  bronzer: "Bronzer",
  highlighter: "Highlight",
};

const CATEGORY_ORDER: ProductCategory[] = [
  "foundation",
  "concealer",
  "blush",
  "lipstick",
  "eyeshadow",
  "bronzer",
  "highlighter",
];

export function ProductGrid({ recommendations }: ProductGridProps) {
  const sorted = [...recommendations].sort((a, b) => {
    return (
      CATEGORY_ORDER.indexOf(a.category) -
      CATEGORY_ORDER.indexOf(b.category)
    );
  });

  const [activeCategory, setActiveCategory] = useState(
    sorted[0]?.category || "foundation"
  );

  if (sorted.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="label-caps text-muted-foreground">
          No product recommendations available
        </p>
      </div>
    );
  }

  const activeRec = sorted.find((r) => r.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Category tabs — custom pill design */}
      <div className="flex flex-wrap gap-2">
        {sorted.map((rec) => (
          <button
            key={rec.category}
            onClick={() => setActiveCategory(rec.category)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
              activeCategory === rec.category
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border border-border/40 bg-card/60 text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {CATEGORY_LABELS[rec.category] || rec.category}
          </button>
        ))}
      </div>

      {/* Active category content */}
      {activeRec && (
        <div className="space-y-4">
          {/* Application Tips */}
          {activeRec.applicationTips && (
            <div className="rounded-xl border border-copper/20 bg-copper/5 p-4 backdrop-blur-sm">
              <p className="label-caps mb-1 text-copper">Application Tip</p>
              <p className="text-sm leading-relaxed text-foreground/80">
                {activeRec.applicationTips}
              </p>
            </div>
          )}

          {/* Product Cards */}
          <div className="space-y-3">
            {[...activeRec.products]
              .sort((a, b) => (a.rank || 99) - (b.rank || 99))
              .map((product, i) => (
                <ProductCard key={`${product.productId}-${i}`} product={product} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
