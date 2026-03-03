export interface SkinTone {
  monkScale: number;
  description: string;
  hexColor: string;
}

export interface Undertone {
  category: "warm" | "cool" | "neutral" | "olive";
  confidence: number;
  indicators: string[];
}

export interface SkinType {
  primary: "oily" | "dry" | "combination" | "normal";
  concerns: string[];
}

export interface FaceShape {
  shape:
    | "oval"
    | "round"
    | "square"
    | "heart"
    | "oblong"
    | "diamond"
    | "rectangle";
  characteristics: string[];
}

export interface SkinAnalysis {
  skinTone: SkinTone;
  undertone: Undertone;
  skinType: SkinType;
  faceShape: FaceShape;
  lightingQuality: "good" | "moderate" | "poor";
  overallConfidence: "high" | "medium" | "low";
}

export type ProductCategory =
  | "foundation"
  | "concealer"
  | "blush"
  | "lipstick"
  | "eyeshadow"
  | "bronzer"
  | "highlighter";

export interface ProductRecommendation {
  rank: number;
  name: string;
  brand: string;
  shade: string;
  skuId: string;
  price: string;
  imageUrl: string;
  whyItWorks: string;
  sephoraUrl: string;
  productId: string;
  rating: number;
  reviews: number;
}

export interface CategoryRecommendation {
  category: ProductCategory;
  products: ProductRecommendation[];
  applicationTips: string;
}

export interface RecommendationResult {
  recommendations: CategoryRecommendation[];
}

export interface ShadeInfo {
  name: string;
  skuId: string;
}

export interface SephoraProduct {
  productId: string;
  name: string;
  brand: string;
  price: string;
  imageUrl: string;
  url: string;
  rating: number;
  reviews: number;
  shades: ShadeInfo[];
}
