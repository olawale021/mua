/**
 * Real-Time Sephora API — Documentation
 * =======================================
 * Host: real-time-sephora-api.p.rapidapi.com
 * Base URL: https://real-time-sephora-api.p.rapidapi.com
 *
 * Required Headers:
 *   x-rapidapi-key: <your RapidAPI key>
 *   x-rapidapi-host: real-time-sephora-api.p.rapidapi.com
 *
 * -------------------------------------------------------------------
 *
 * GET /search-by-keyword
 * ----------------------
 * Search products by keyword.
 *
 * Query Params:
 *   keyword*     string   Search term (required, min 1 char)
 *   pageSize     number   Items per page (default 60, min 1)
 *   currentPage  number   Page number (default 1, min 1)
 *   categoryId   string   Filter by category (e.g. "cat130054")
 *   sortBy       enum     "BEST_SELLING" | "TOP_RATED" | "PRICE_LOW_TO_HIGH" | "PRICE_HIGH_TO_LOW" | "NEW"
 *   minPrice     number   Minimum price filter ($)
 *   maxPrice     number   Maximum price filter ($)
 *   minRating    number   Minimum rating (1-5)
 *   isNew        string   "true" | "false"
 *
 * Response: Array of product objects
 *   [
 *     {
 *       productId:    string   "P502185"
 *       brandName:    string   "HAUS LABS BY LADY GAGA"
 *       displayName:  string   "Triclone Skin Tech Medium Coverage Foundation..."
 *       productName:  string   (same as displayName)
 *       heroImage:    string   URL — primary product image
 *       image135:     string   URL — 135px thumbnail
 *       image250:     string   URL — 250px image
 *       image450:     string   URL — 450px image
 *       altImage:     string   URL — alternate product image
 *       targetUrl:    string   "/product/triclone-skin-tech-...-P502185?skuId=2597276"
 *       url:          string   Sephora catalog API URL
 *       rating:       string   "3.9715" (string, not number)
 *       reviews:      string   "4840"
 *       moreColors:   number   51 (number of additional shades)
 *       sponsored:    boolean
 *       onSaleData:   string   "NONE" | sale info
 *       currentSku: {
 *         skuId:              string   "2597276"
 *         listPrice:          string   "$52.00" or "$48.00 - $69.00"
 *         imageAltText:       string
 *         isBestseller:       boolean
 *         isNew:              boolean
 *         isOnlineOnly:       boolean
 *         isSephoraExclusive: boolean
 *         isLimitedEdition:   boolean
 *         isAppExclusive:     boolean
 *         isBI:               boolean
 *         isLimitedTimeOffer: boolean
 *       }
 *     }
 *   ]
 *
 * -------------------------------------------------------------------
 *
 * GET /search-by-brand
 * --------------------
 * Search products by brand name.
 *
 * Query Params:
 *   brandName*   string   Brand name (required, e.g. "gucci")
 *   pageSize     string   Items per page (default "60")
 *   currentPage  string   Page number (default "1")
 *   sortBy       enum     "BEST_SELLING" | "TOP_RATED" | "PRICE_LOW_TO_HIGH" | "PRICE_HIGH_TO_LOW" | "NEW"
 *   minPrice     string   Minimum price ($)
 *   maxPrice     string   Maximum price ($)
 *   minRating    string   Minimum rating ("4" or "5")
 *
 * Response: Same array format as /search-by-keyword
 *
 * -------------------------------------------------------------------
 *
 * GET /search-by-category
 * -----------------------
 * Search products by category ID.
 *
 * Query Params:
 *   categoryId*  string   Category ID (required, e.g. "fragrance")
 *   pageSize     string   Items per page (default "60")
 *   currentPage  string   Page number (default "1")
 *   sortBy       enum     "BEST_SELLING" | "TOP_RATED" | "PRICE_LOW_TO_HIGH" | "PRICE_HIGH_TO_LOW" | "NEW"
 *   minPrice     string   Minimum price ($)
 *   maxPrice     string   Maximum price ($)
 *
 * Response: Same array format as /search-by-keyword
 *
 * -------------------------------------------------------------------
 *
 * GET /product-details
 * --------------------
 * Get full product details including all shades/variations.
 *
 * Query Params:
 *   productId*   string   Product ID (required, e.g. "P502185")
 *   skuId        string   Optional specific SKU ID (e.g. "2025633")
 *   language     enum     "en-US" | "en-CA" | "fr-CA" (default "en-US")
 *
 * Response:
 *   {
 *     productId:        string
 *     fullSiteProductUrl: string   Full Sephora URL
 *     parentCategory:   { ... }
 *     currentSku:       { skuId, listPrice, ... }
 *     productDetails: {
 *       shortDescription:  string
 *       longDescription:   string
 *       howToUse:          string
 *       aboutBrand:        string
 *       clinicalResults:   string
 *       ...
 *     }
 *     regularChildSkus: [         Array of all shades/variations
 *       {
 *         skuId:            string   "2597011"
 *         brandName:        string   "HAUS LABS BY LADY GAGA"
 *         displayName:      string   Full product name
 *         productName:      string
 *         variationValue:   string   "590 Deep Neutral"  <-- shade name
 *         variationType:    string   "Color"
 *         variationDesc:    string   Description of variation
 *         listPrice:        string   "$52.00"
 *         size:             string   "1 oz/ 30 mL"
 *         isOutOfStock:     boolean
 *         isNew:            boolean
 *         highlights:       string[] (e.g. ["Vegan", "Clean"])
 *         ingredientDesc:   string   HTML of ingredients
 *         skuImages: {
 *           image250:       string   URL
 *           imageUrl:       string   URL (full size)
 *         }
 *         smallImage:       string   URL — swatch image
 *         targetUrl:        string   Product page path
 *         url:              string   API URL
 *         isReturnable:     boolean
 *       }
 *     ]
 *     ancillarySkus:    [...]       Related/companion products
 *     productVideos:    [...]       Video content
 *   }
 *
 * -------------------------------------------------------------------
 *
 * GET /product-reviews
 * --------------------
 * Get reviews for a product.
 *
 * Query Params:
 *   productId*   string   Product ID (required, e.g. "P458747")
 *   limit        string   Number of reviews (default "6")
 *   offset       string   Pagination offset (default "0")
 *   rating       string   Filter by rating ("1"-"5")
 *   sortBy       enum     "MOST_HELPFUL" | "HIGHEST_RATING" | "LOWEST_RATING" | "OLDEST" | "NEWEST"
 *
 * -------------------------------------------------------------------
 *
 * GET /categories-list
 * --------------------
 * List all root categories on Sephora.com.
 *
 * No params required.
 *
 * Response:
 *   {
 *     success: true,
 *     data: [
 *       {
 *         categoryId:    string   "cat140006"
 *         displayName:   string   "Makeup"
 *         targetUrl:     string   "/shop/makeup-cosmetics"
 *         thumbImage:    string   URL
 *         hasChildCategories: boolean
 *       }
 *     ]
 *   }
 *
 * Known category IDs:
 *   cat1100057  Luxury Beauty
 *   cat140006   Makeup
 *   cat3780034  Clean at Sephora
 *   cat150006   Skincare
 *   cat130038   Hair
 *   cat5000004  Unisex / Genderless
 *   cat130042   Tools & Brushes
 *
 * -------------------------------------------------------------------
 *
 * GET /category-data
 * ------------------
 * Get subcategories and data for a root category.
 *
 * Query Params:
 *   categoryId*  string   Category ID (required, e.g. "cat160006")
 *
 * -------------------------------------------------------------------
 *
 * GET /brands-list
 * ----------------
 * List all brands on Sephora.com.
 *
 * No params required.
 *
 * -------------------------------------------------------------------
 *
 * GET /auto-complete
 * ------------------
 * Get autocomplete suggestions.
 *
 * Query Params:
 *   query*       string   Search query (required, 1-100 chars)
 *   language     enum     "en-US" | "en-CA" | "fr-CA" (default "en-US")
 *
 * -------------------------------------------------------------------
 *
 * GET /store-list
 * ---------------
 * Find Sephora stores near coordinates.
 *
 * Query Params:
 *   latitude*    string   (required)
 *   longitude*   string   (required)
 *   radius*      string   Miles (required)
 *
 * -------------------------------------------------------------------
 *
 * GET /product-availability
 * -------------------------
 * Check product availability at nearby stores.
 *
 * Query Params:
 *   skuId*       string   SKU ID (required)
 *   latitude*    string   (required)
 *   longitude*   string   (required)
 *   radius       string   Miles (default "50")
 *
 * -------------------------------------------------------------------
 *
 * GET /status
 * -----------
 * Health check endpoint. No params.
 */

export {};
