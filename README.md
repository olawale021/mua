# MUA — AI Beauty Advisor

AI-powered makeup recommendation app. Take a selfie, get your skin analyzed (tone, undertone, face shape, skin type), and receive personalized Sephora product recommendations with shade matching.

## Tech Stack

- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS + shadcn/ui
- **Camera:** react-webcam + file upload (HEIC supported)
- **AI:** Vercel AI SDK — supports both Claude (Anthropic) and GPT-4o (OpenAI)
- **Products:** Real-Time Sephora API via RapidAPI
- **Validation:** Zod structured output schemas

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude |
| `OPENAI_API_KEY` | OpenAI API key for GPT-4o |
| `RAPIDAPI_KEY` | RapidAPI key for Sephora API |
| `RAPIDAPI_HOST` | `real-time-sephora-api.p.rapidapi.com` |

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## App Flow

```
Landing Page → Camera/Upload → AI Analysis (loading) → Results (profile + products)
     ↑                                                           |
     └──────────────────── Retake Photo ─────────────────────────┘
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                 # App shell, fonts (Playfair Display + Outfit)
│   ├── page.tsx                   # Landing page
│   ├── globals.css                # Theme, animations, grain overlay
│   ├── analyze/page.tsx           # Camera capture + analysis flow
│   ├── results/page.tsx           # Results display
│   └── api/
│       ├── analyze/route.ts       # AI skin analysis (vision)
│       └── recommend/route.ts     # Product recommendations
├── components/
│   ├── camera-capture.tsx         # Webcam + file upload (HEIC→JPEG)
│   ├── skin-profile.tsx           # Skin analysis card
│   ├── product-card.tsx           # Product recommendation card
│   ├── product-grid.tsx           # Category-tabbed product grid
│   ├── loading-animation.tsx      # Orbital loading animation
│   └── provider-toggle.tsx        # Claude / GPT-4o toggle
├── lib/
│   ├── sephora-api.ts             # Sephora API wrapper + caching
│   ├── analysis-schema.ts         # Zod schemas for AI output
│   └── prompts.ts                 # AI prompt templates
└── types/
    └── index.ts                   # TypeScript interfaces
```

## API Routes

### POST `/api/analyze`

Analyzes a selfie image and returns a structured skin profile.

**Query params:** `?provider=openai|anthropic`

**Request body:**
```json
{
  "image": "data:image/jpeg;base64,..."
}
```

**Response:**
```json
{
  "skinTone": { "monkScale": 5, "description": "Medium with warm golden undertones", "hexColor": "#C49A6C" },
  "undertone": { "category": "warm", "confidence": 0.85, "indicators": ["golden cast", "green veins"] },
  "skinType": { "primary": "combination", "concerns": ["visible pores in T-zone"] },
  "faceShape": { "shape": "oval", "characteristics": ["balanced proportions"] },
  "lightingQuality": "good",
  "overallConfidence": "high",
  "photoUrl": "data:image/jpeg;base64,..."
}
```

The `photoUrl` field returns the server-converted JPEG (handles HEIC→JPEG conversion).

### POST `/api/recommend`

Returns ranked product recommendations based on the skin analysis.

**Query params:** `?provider=openai|anthropic`

**Request body:**
```json
{
  "analysis": { /* skin analysis object from /api/analyze */ }
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "category": "foundation",
      "applicationTips": "Apply with a damp beauty sponge...",
      "products": [
        {
          "rank": 1,
          "name": "Triclone Skin Tech Foundation",
          "brand": "HAUS LABS BY LADY GAGA",
          "shade": "280W Light Medium Warm",
          "skuId": "2597276",
          "price": "$52.00",
          "imageUrl": "https://...",
          "rating": 3.97,
          "reviews": 4840,
          "whyItWorks": "Excellent shade match for Monk Scale 5 with warm undertone...",
          "sephoraUrl": "https://www.sephora.com/product/...-P502185?skuId=2597276",
          "productId": "P502185"
        }
      ]
    }
  ]
}
```

## Sephora API Reference

The app uses the [Real-Time Sephora API](https://rapidapi.com/happyendpoint/api/real-time-sephora-api) on RapidAPI.

**Base URL:** `https://real-time-sephora-api.p.rapidapi.com`

**Required headers:**
```
x-rapidapi-key: <your key>
x-rapidapi-host: real-time-sephora-api.p.rapidapi.com
```

### Endpoints Used by MUA

#### GET `/search-by-keyword`

Search products by keyword.

| Param | Type | Required | Description |
|---|---|---|---|
| `keyword` | string | Yes | Search term |
| `pageSize` | number | No | Items per page (default 60) |
| `currentPage` | number | No | Page number (default 1) |
| `sortBy` | enum | No | `BEST_SELLING`, `TOP_RATED`, `PRICE_LOW_TO_HIGH`, `PRICE_HIGH_TO_LOW`, `NEW` |
| `minPrice` | number | No | Min price filter |
| `maxPrice` | number | No | Max price filter |
| `minRating` | number | No | Min rating (1-5) |

**Response:** Array of product objects:
```json
[
  {
    "productId": "P502185",
    "brandName": "HAUS LABS BY LADY GAGA",
    "displayName": "Triclone Skin Tech Foundation",
    "heroImage": "https://...",
    "targetUrl": "/product/triclone-...-P502185?skuId=2597276",
    "rating": "3.9715",
    "reviews": "4840",
    "currentSku": {
      "skuId": "2597276",
      "listPrice": "$52.00",
      "isBestseller": true
    }
  }
]
```

#### GET `/product-details`

Get full product details including all shade variations.

| Param | Type | Required | Description |
|---|---|---|---|
| `productId` | string | Yes | Product ID (e.g. `P502185`) |
| `skuId` | string | No | Specific SKU ID |

**Response:**
```json
{
  "productId": "P502185",
  "fullSiteProductUrl": "https://www.sephora.com/product/...",
  "regularChildSkus": [
    {
      "skuId": "2597011",
      "variationValue": "590 Deep Neutral",
      "variationType": "Color",
      "listPrice": "$52.00",
      "isOutOfStock": false,
      "skuImages": { "imageUrl": "https://..." }
    }
  ]
}
```

### Other Available Endpoints

| Endpoint | Description |
|---|---|
| `GET /search-by-brand` | Search by brand name |
| `GET /search-by-category` | Search by category ID |
| `GET /product-reviews` | Get product reviews |
| `GET /categories-list` | List all root categories |
| `GET /category-data` | Get subcategory data |
| `GET /brands-list` | List all brands |
| `GET /auto-complete` | Autocomplete suggestions |
| `GET /store-list` | Find nearby stores |
| `GET /product-availability` | Check store stock |
| `GET /status` | Health check |

### API Limits (Free Tier)

- **800 requests/month**
- Each MUA analysis uses ~42 API calls (7 searches + up to 35 product detail fetches for shades)
- ~19 full analyses per month on the free tier

## Deploy

Deploy to Vercel:

```bash
vercel
```

Set environment variables in the Vercel dashboard under Settings > Environment Variables.
