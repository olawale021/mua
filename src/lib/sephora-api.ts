import { SephoraProduct, ProductCategory, ShadeInfo } from "@/types";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "";
const RAPIDAPI_HOST =
  process.env.RAPIDAPI_HOST || "real-time-sephora-api.p.rapidapi.com";
const BASE_URL = `https://${RAPIDAPI_HOST}`;

// Simple in-memory cache
const cache = new Map<string, { data: unknown; expiry: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && entry.expiry > Date.now()) {
    return entry.data as T;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, expiry: Date.now() + CACHE_TTL });
}

async function fetchSephora(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<unknown> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, value)
  );

  const cacheKey = url.toString();
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const response = await fetch(url.toString(), {
    headers: {
      "x-rapidapi-key": RAPIDAPI_KEY,
      "x-rapidapi-host": RAPIDAPI_HOST,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Sephora API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  setCache(cacheKey, data);
  return data;
}

const CATEGORY_KEYWORDS: Record<ProductCategory, string> = {
  foundation: "foundation",
  concealer: "concealer",
  blush: "blush",
  lipstick: "lipstick",
  eyeshadow: "eyeshadow palette",
  bronzer: "bronzer",
  highlighter: "highlighter makeup",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(item: any): SephoraProduct {
  return {
    productId: item.productId || "",
    name: item.displayName || item.productName || "",
    brand: item.brandName || "",
    price: item.currentSku?.listPrice || "",
    imageUrl: item.heroImage || "",
    url: item.targetUrl
      ? `https://www.sephora.com${item.targetUrl}`
      : "",
    rating: parseFloat(item.rating) || 0,
    reviews: parseInt(item.reviews) || 0,
    shades: [],
  };
}

/** Fetch product details and extract real shade names with skuIds */
async function fetchShades(productId: string): Promise<ShadeInfo[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await fetchSephora("/product-details", {
      productId,
    })) as any;

    const skus = data?.regularChildSkus || [];
    return skus
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((s: any) => s.variationValue && !s.isOutOfStock)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((s: any) => ({
        name: s.variationValue as string,
        skuId: s.skuId as string,
      }));
  } catch {
    return [];
  }
}

export async function searchProducts(
  keyword: string,
  limit = 6
): Promise<SephoraProduct[]> {
  const data = await fetchSephora("/search-by-keyword", {
    keyword,
    pageSize: String(limit),
  });

  const products = Array.isArray(data) ? data : [];
  return products.map(mapProduct);
}

export async function getProductDetails(
  productId: string
): Promise<SephoraProduct | null> {
  try {
    const data = await fetchSephora("/product-details", {
      productId,
    });

    if (!data) return null;
    return mapProduct(data);
  } catch (error) {
    console.error("Sephora product detail error:", error);
    return null;
  }
}

export async function getProductsByCategory(
  category: ProductCategory,
  limit = 6
): Promise<SephoraProduct[]> {
  const keyword = CATEGORY_KEYWORDS[category];
  return searchProducts(keyword, limit);
}

/** Enrich products with real shade names from product details */
async function enrichWithShades(
  products: SephoraProduct[]
): Promise<SephoraProduct[]> {
  const results = await Promise.allSettled(
    products.map(async (p) => {
      const shades = await fetchShades(p.productId);
      return { ...p, shades };
    })
  );

  return results.map((r, i) =>
    r.status === "fulfilled" ? r.value : products[i]
  );
}

export async function getRecommendationProducts(): Promise<
  Record<ProductCategory, SephoraProduct[]>
> {
  const categories: ProductCategory[] = [
    "foundation",
    "concealer",
    "blush",
    "lipstick",
    "eyeshadow",
    "bronzer",
    "highlighter",
  ];

  // Step 1: Search for products in each category
  const searchResults = await Promise.all(
    categories.map((cat) => getProductsByCategory(cat, 5))
  );

  const productsByCategory = {} as Record<ProductCategory, SephoraProduct[]>;
  categories.forEach((cat, i) => {
    productsByCategory[cat] = searchResults[i];
  });

  // Check if we got any products at all
  const totalProducts = Object.values(productsByCategory).reduce(
    (sum, products) => sum + products.length,
    0
  );

  if (totalProducts === 0) {
    throw new Error(
      "Sephora product catalog is temporarily unavailable. Please try again in a few minutes."
    );
  }

  // Step 2: Fetch real shades for all products in parallel
  const enrichPromises = categories.map(async (cat) => {
    const enriched = await enrichWithShades(productsByCategory[cat]);
    productsByCategory[cat] = enriched;
  });

  await Promise.allSettled(enrichPromises);

  return productsByCategory;
}
