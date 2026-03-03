"use client";

import { CategoryRecommendation, ProductCategory } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  // Sort recommendations by the defined category order
  const sorted = [...recommendations].sort((a, b) => {
    return (
      CATEGORY_ORDER.indexOf(a.category) -
      CATEGORY_ORDER.indexOf(b.category)
    );
  });

  if (sorted.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No product recommendations available.
      </div>
    );
  }

  const defaultTab = sorted[0]?.category;

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="mb-4 flex w-full flex-wrap justify-start gap-1 bg-transparent">
        {sorted.map((rec) => (
          <TabsTrigger
            key={rec.category}
            value={rec.category}
            className="rounded-full border border-border/50 px-3 py-1.5 text-xs data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {CATEGORY_LABELS[rec.category] || rec.category}
          </TabsTrigger>
        ))}
      </TabsList>

      {sorted.map((rec) => (
        <TabsContent key={rec.category} value={rec.category} className="space-y-4">
          {/* Application Tips */}
          {rec.applicationTips && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-xs font-medium text-primary">
                Application Tip
              </p>
              <p className="mt-1 text-sm text-foreground">
                {rec.applicationTips}
              </p>
            </div>
          )}

          {/* Product Cards — sorted by rank */}
          <div className="space-y-3">
            {[...rec.products]
              .sort((a, b) => (a.rank || 99) - (b.rank || 99))
              .map((product, i) => (
              <ProductCard key={`${product.productId}-${i}`} product={product} />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
