import { z } from "zod";

export const skinToneSchema = z.object({
  monkScale: z
    .number()
    .min(1)
    .max(10)
    .describe("Monk Skin Tone Scale value from 1 (lightest) to 10 (darkest)"),
  description: z
    .string()
    .describe("Human-readable description of the skin tone, e.g. 'Light with warm peachy undertones'"),
  hexColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .describe("Approximate hex color code representing the skin tone"),
});

export const undertoneSchema = z.object({
  category: z.enum(["warm", "cool", "neutral", "olive"]),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe("Confidence score from 0 to 1"),
  indicators: z
    .array(z.string())
    .describe("Visual indicators that led to this determination, e.g. 'visible green veins', 'golden cast to skin'"),
});

export const skinTypeSchema = z.object({
  primary: z.enum(["oily", "dry", "combination", "normal"]),
  concerns: z
    .array(z.string())
    .describe("Skin concerns observed, e.g. 'visible pores in T-zone', 'slight dryness around cheeks'"),
});

export const faceShapeSchema = z.object({
  shape: z.enum([
    "oval",
    "round",
    "square",
    "heart",
    "oblong",
    "diamond",
    "rectangle",
  ]),
  characteristics: z
    .array(z.string())
    .describe("Facial characteristics, e.g. 'prominent cheekbones', 'narrow chin'"),
});

export const skinAnalysisSchema = z.object({
  skinTone: skinToneSchema,
  undertone: undertoneSchema,
  skinType: skinTypeSchema,
  faceShape: faceShapeSchema,
  lightingQuality: z
    .enum(["good", "moderate", "poor"])
    .describe("Assessment of the photo lighting quality"),
  overallConfidence: z
    .enum(["high", "medium", "low"])
    .describe("Overall confidence in the analysis accuracy"),
});

export const productRecommendationSchema = z.object({
  rank: z.number().min(1).max(5).describe("Ranking from 1 (best match) to 5"),
  name: z.string(),
  brand: z.string(),
  shade: z.string().describe("Exact shade name from the product's shades list"),
  skuId: z.string().describe("The skuId corresponding to the selected shade"),
  price: z.string(),
  imageUrl: z.string(),
  whyItWorks: z
    .string()
    .describe("Brief explanation of why this product/shade is a good match"),
  sephoraUrl: z.string(),
  productId: z.string(),
  rating: z.number().min(0).max(5).describe("Sephora rating out of 5"),
  reviews: z.number().describe("Number of Sephora reviews"),
});

export const categoryRecommendationSchema = z.object({
  category: z.enum([
    "foundation",
    "concealer",
    "blush",
    "lipstick",
    "eyeshadow",
    "bronzer",
    "highlighter",
  ]),
  products: z.array(productRecommendationSchema).min(1).max(5),
  applicationTips: z
    .string()
    .describe("Face-shape and skin-type specific application advice"),
});

export const recommendationResultSchema = z.object({
  recommendations: z.array(categoryRecommendationSchema),
});

export type SkinAnalysisOutput = z.infer<typeof skinAnalysisSchema>;
export type RecommendationOutput = z.infer<typeof recommendationResultSchema>;
