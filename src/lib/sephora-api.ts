import { SephoraProduct, ProductCategory, ShadeInfo } from "@/types";
import { getCached, setCache } from "@/lib/cache";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "";
const RAPIDAPI_HOST =
  process.env.RAPIDAPI_HOST || "real-time-sephora-api.p.rapidapi.com";
const BASE_URL = `https://${RAPIDAPI_HOST}`;

async function fetchSephora(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<unknown> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, value)
  );

  const cacheKey = url.toString();
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  // Throttle: slower for product-details (rate-limited harder), faster for searches
  const delay = endpoint === "/product-details" ? 1200 : 500;
  await new Promise((r) => setTimeout(r, delay));

  // Retry up to 3 times for flaky 500s
  for (let attempt = 1; attempt <= 3; attempt++) {
    const response = await fetch(url.toString(), {
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setCache(cacheKey, data);
      return data;
    }

    if (response.status === 429) {
      // Rate limit — wait and retry
      console.log(`[Sephora] 429 on ${endpoint} ${params.keyword || params.productId || ""}, waiting 1s (attempt ${attempt})`);
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }

    if (response.status === 500 && attempt < 3) {
      // Server error — retry after brief pause
      console.log(`[Sephora] 500 on ${endpoint} ${params.keyword || params.productId || ""}, retrying (attempt ${attempt})`);
      await new Promise((r) => setTimeout(r, 500));
      continue;
    }

    throw new Error(
      `Sephora API is temporarily unavailable (${response.status}). Please try again later.`
    );
  }

  throw new Error("Sephora API failed after 3 retries.");
}

const CATEGORY_CONFIG: Record<ProductCategory, { keyword: string; categoryId: string }> = {
  foundation: { keyword: "foundation", categoryId: "cat130058" },   // Face
  concealer:  { keyword: "concealer", categoryId: "cat130058" },    // Face
  blush:      { keyword: "blush", categoryId: "cat1650031" },       // Cheek
  lipstick:   { keyword: "lipstick", categoryId: "cat180010" },     // Lip
  eyeshadow:  { keyword: "eyeshadow", categoryId: "cat130054" },    // Eye
  bronzer:    { keyword: "bronzer", categoryId: "cat1650031" },      // Cheek
  highlighter:{ keyword: "luminizer", categoryId: "cat1650031" },    // Cheek
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
  categoryId: string,
  limit = 6
): Promise<SephoraProduct[]> {
  const data = await fetchSephora("/search-by-keyword", {
    keyword,
    pageSize: String(limit),
    sortBy: "BEST_SELLING",
    categoryId,
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
  const { keyword, categoryId } = CATEGORY_CONFIG[category];
  return searchProducts(keyword, categoryId, limit);
}

/** Enrich products with real shade names from product details (sequential to avoid rate limits) */
async function enrichWithShades(
  products: SephoraProduct[]
): Promise<SephoraProduct[]> {
  const enriched: SephoraProduct[] = [];
  for (const p of products) {
    const shades = await fetchShades(p.productId);
    enriched.push({ ...p, shades });
  }
  return enriched;
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

  const productsByCategory = {} as Record<ProductCategory, SephoraProduct[]>;

  // Step 1: Search each category sequentially to respect per-second rate limit
  for (const cat of categories) {
    try {
      productsByCategory[cat] = await getProductsByCategory(cat, 3);
    } catch (err) {
      console.warn(`[Sephora] Skipping ${cat}:`, err);
      productsByCategory[cat] = [];
    }
  }

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

  // Step 2: Fetch real shades only for shade-critical categories
  const shadeCategories: ProductCategory[] = [
    "foundation",
    "concealer",
    "blush",
    "lipstick",
    "bronzer",
  ];

  for (const cat of shadeCategories) {
    if (productsByCategory[cat]?.length > 0) {
      productsByCategory[cat] = await enrichWithShades(productsByCategory[cat]);
    }
  }

  return productsByCategory;
}
