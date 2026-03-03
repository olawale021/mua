import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
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
    let productsJson: string;
    try {
      const products = await getRecommendationProducts();
      productsJson = JSON.stringify(products, null, 2);
    } catch {
      // If Sephora API fails, use AI-only recommendations
      productsJson = JSON.stringify({
        note: "Sephora API unavailable. Please provide general product recommendations based on popular brands available at Sephora, including specific shade names.",
      });
    }

    const analysisJson = JSON.stringify(analysis, null, 2);
    const prompt = getRecommendationPrompt(analysisJson, productsJson);

    // Choose provider
    const provider =
      request.nextUrl.searchParams.get("provider") || "openai";

    const model =
      provider === "openai"
        ? openai.chat("gpt-4o")
        : anthropic("claude-sonnet-4-20250514");

    const { object: recommendations } = await generateObject({
      model,
      schema: recommendationResultSchema,
      prompt,
    });

    // Post-process: ensure Sephora URLs have the correct skuId for shade selection
    for (const cat of recommendations.recommendations) {
      for (const product of cat.products) {
        if (product.skuId && product.productId) {
          // Build a clean Sephora URL with the shade's skuId
          const slug = product.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/-+$/, "");
          product.sephoraUrl = `https://www.sephora.com/product/${slug}-${product.productId}?skuId=${product.skuId}`;
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
