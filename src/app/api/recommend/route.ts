import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { recommendationResultSchema } from "@/lib/analysis-schema";
import { getRecommendationPrompt } from "@/lib/prompts";
import { getRecommendationProducts } from "@/lib/sephora-api";
import { SkinAnalysis } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { analysis }: { analysis: SkinAnalysis } = await request.json();

    if (!analysis) {
      return NextResponse.json(
        { error: "Skin analysis data is required" },
        { status: 400 }
      );
    }

    // Fetch products from Sephora API
    const products = await getRecommendationProducts();
    const productsJson = JSON.stringify(products, null, 2);

    const analysisJson = JSON.stringify(analysis, null, 2);
    const prompt = getRecommendationPrompt(analysisJson, productsJson);

    const model = openai.chat("gpt-4o");

    const { object: recommendations } = await generateObject({
      model,
      schema: recommendationResultSchema,
      prompt,
    });

    // Post-process: use real Sephora URLs from API data + append skuId for shade
    const urlMap = new Map<string, string>();
    for (const category of Object.values(products)) {
      for (const p of category) {
        if (p.productId && p.url) {
          urlMap.set(p.productId, p.url);
        }
      }
    }

    for (const cat of recommendations.recommendations) {
      for (const product of cat.products) {
        const realUrl = urlMap.get(product.productId);
        if (realUrl) {
          // Use real URL, replace skuId if we have a shade-specific one
          if (product.skuId) {
            const base = realUrl.replace(/[?&]skuId=[^&]+/, "");
            product.sephoraUrl = `${base}${base.includes("?") ? "&" : "?"}skuId=${product.skuId}`;
          } else {
            product.sephoraUrl = realUrl;
          }
        }
      }
    }

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Recommend API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Recommendation failed",
      },
      { status: 500 }
    );
  }
}
