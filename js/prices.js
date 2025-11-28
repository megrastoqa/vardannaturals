/**
 * Vardan Naturals - Centralized Price Configuration
 * All product prices in ONE place for easy management
 * Last Updated: 2025
 */

  // ============================================================================
  // PRODUCT PRICES DATABASE
  // ============================================================================

const PRODUCT_PRICES = {
    // ========================================
    // SOAPS
    // ========================================
    "Shea Butter Soap": {
      "100g": 249,
      "55g": 170
    },
    "Triphala Charcoal Soap": {
      "100g": 225,
      "55g": 150
    },
    "Citrus Loofah Soap": {
      "100g": 200,
      "55g": 140
    },
    "Goat Milk Soap": {
      "100g": 275,
      "55g": 190
    },

    // ========================================
    // Bath Salts
    // ========================================
    "Rose Indulgence": {
      "200g": 299,
      "400g": 499
    },
    "Lavender Calm": {
      "200g": 299,
      "400g": 499
    },
    "Green Apple Fresh": {
      "200g": 299,
      "400g": 499
    },
    "Citrus Bliss": {
      "200g": 299,
      "400g": 499
    },

    // ========================================
    // BODY WELLNESS OILS
    // ========================================
    "Mahanarayana Tailam": {
      "100ml": 449,
      "200ml": 799
    },
    "Dashmool Tailam": {
      "100ml": 449,
      "200ml": 799
    },
    "Abhyangam Tailam": {
      "100ml": 449,
      "200ml": 799
    },

    // ========================================
    // HAIR CARE
    // ========================================
    "Keshamrit Hair Oil": {
      "100ml": 499
    },
    "Anti-Dandruff Hair Oil": {
      "100ml": 499
    },

    // ========================================
    // SKIN CARE
    // ========================================
    "Kumkumadi Tailam": {
      "30ml": 699
    },
    "Cocoa Butter Moisturiser": {
      "100ml": 449
    },
    "Rosemary Hydrosol": {
      "100ml": 449
    },
    "Triphala Charcoal Face Wash": {
      "100ml": 499
    },
    "Aloe Vera-Neem-Tea Tree Face Wash": {
      "100ml": 499
    },
    "Aloe Vera Gel": {
      "50g": 249
    },

    // ========================================
    // ESSENTIAL OILS
    // ========================================
    "Jasmine Essential Oil": {
      "10ml": 399
    },
    "Lavender Essential Oil": {
      "10ml": 399
    },
    "Lemongrass Essential Oil": {
      "10ml": 399
    },
    "Green Apple Essential Oil": {
      "10ml": 399
    },
    "Citrus Essential Oil": {
      "10ml": 399
    },

    // ========================================
    // HERBAL TEA
    // ========================================
    "Hibiscus Tea": {
      "10g": 99,
      "20g": 179
    },
    "Chamomile Tea": {
      "10g": 149,
      "20g": 259
    },
    "Lemongrass Tea": {
      "15g": 89,
      "30g": 159
    },
    "Blue Pea Tea": {
      "10g": 179,
      "20g": 299
    },

    // ========================================
    // GUT CARE
    // ========================================
    "Natural Digestive Support": {
      "60g": 145
    },

    // ========================================
    // WELLNESS & SPECIALTY CARE
    // ========================================
    "Belly Bliss Roll-On": {
      "10ml": 399
    },
    "Tranquil Roll-On": {
      "10ml": 399
    },
    "Crack Cream": {
      "30g": 299
    },
    "Rose Lip Balm": {
      "15g": 249
    },
    "Green Apple Bliss Balm": {
      "15g": 249
    },
    "Citrus Bliss Wardrobe Sachet": {
      "100g": 349
    },
    "Lavender Calm Wardrobe Sachet": {
      "100g": 349
    },

    // ========================================
    // WELLNESS TOOLS
    // ========================================
    "Pain Relief Ayurvedic Massage Potli": {
      "default": 299
    },
    "Kansa Wand": {
      "default": 699
    },
    "Double Sided Kansa Wand": {
      "default": 999
    }
  };

// ============================================================================
// SALE CONFIGURATION (Optional - Enable/Disable sales)
// ============================================================================

const SALE_CONFIG = {
  enabled: false,  // Set to true to activate sale prices
  saleProducts: {
    //Example: Add sale prices here when running promotions
    "Shea Butter Soap": {
      "100g": 199,  // 20% off from 249
      "55g": 136    // 20% off from 170
    },
    "Citrus Bliss": {
      "200g": 249,
      "400g": 459
    },
    "Kumkumadi Tailam": {
      "30ml": 599
    }
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get price for a specific product and variant
 * @param {string} productName - Name of the product
 * @param {string} variant - Variant (e.g., "100g", "10ml")
 * @returns {number|null} - Price as number or null if not found
 */
function getPrice(productName, variant = null) {
  // Check if product exists
  if (!PRODUCT_PRICES[productName]) {
    console.warn(`Product not found: ${productName}`);
    return null;
  }

  const product = PRODUCT_PRICES[productName];

  // Check for sale price first if sales are enabled
  if (SALE_CONFIG.enabled && SALE_CONFIG.saleProducts[productName]) {
    const saleProduct = SALE_CONFIG.saleProducts[productName];
    if (variant && saleProduct[variant]) {
      return saleProduct[variant];
    }
  }

  // Get regular price
  if (variant) {
    if (product[variant] !== undefined) {
      return product[variant];
    } else {
      console.warn(`Variant not found: ${productName} - ${variant}`);
      return null;
    }
  }

  // If no variant specified, return first available variant price
  const firstVariant = Object.keys(product)[0];
  return product[firstVariant];
}

/**
 * Get formatted price with currency symbol
 * @param {string} productName - Name of the product
 * @param {string} variant - Variant (e.g., "100g", "10ml")
 * @returns {string|null} - Formatted price (e.g., "₹249") or null
 */
function getFormattedPrice(productName, variant = null) {
  const price = getPrice(productName, variant);
  return price !== null ? `₹${price}` : null;
}

/**
 * Get all variants and prices for a product
 * @param {string} productName - Name of the product
 * @returns {object|null} - Object with variants as keys and prices as values
 */
function getProductVariants(productName) {
  if (!PRODUCT_PRICES[productName]) {
    console.warn(`Product not found: ${productName}`);
    return null;
  }

  // ALWAYS return regular prices - sale logic is handled elsewhere
  return PRODUCT_PRICES[productName];
}

/**
 * Format price display for products with multiple variants
 * @param {string} productName - Name of the product
 * @returns {string} - Formatted display (e.g., "₹249 (100g) | ₹170 (55g)")
 */
function formatPriceDisplay(productName) {
  const variants = getProductVariants(productName);
  if (!variants) return '';

  const entries = Object.entries(variants);

  if (entries.length === 1) {
    const [variant, price] = entries[0];
    // Handle 'default' variant specially
    if (variant === 'default') {
      return `₹${price}`;
    }
    return `₹${price} (${variant})`;
  }

  return entries.map(([variant, price]) => `₹${price} (${variant})`).join(' | ');
}

/**
 * Check if a product is on sale
 * @param {string} productName - Name of the product
 * @returns {boolean} - True if product is on sale
 */
function isOnSale(productName) {
  return SALE_CONFIG.enabled &&
    SALE_CONFIG.saleProducts.hasOwnProperty(productName);
}

/**
 * Get sale discount percentage
 * @param {string} productName - Name of the product
 * @param {string} variant - Variant
 * @returns {number|null} - Discount percentage or null
 */
function getSaleDiscount(productName, variant) {
  if (!isOnSale(productName)) return null;

  const regularPrice = PRODUCT_PRICES[productName]?.[variant];
  const salePrice = SALE_CONFIG.saleProducts[productName]?.[variant];

  if (!regularPrice || !salePrice) return null;

  const discount = ((regularPrice - salePrice) / regularPrice) * 100;
  return Math.round(discount);
}

/**
 * Get all products (for admin/management purposes)
 * @returns {object} - All products with prices
 */
function getAllProducts() {
  return PRODUCT_PRICES;
}

/**
 * Search products by name (fuzzy search)
 * @param {string} searchTerm - Search term
 * @returns {array} - Array of matching product names
 */
function searchProducts(searchTerm) {
  const term = searchTerm.toLowerCase();
  return Object.keys(PRODUCT_PRICES).filter(name =>
    name.toLowerCase().includes(term)
  );
}

// ============================================================================
// EXPORT FOR USE (Browser global)
// ============================================================================

// Make functions available globally
window.VardanPrices = {
  getPrice,
  getFormattedPrice,
  getProductVariants,
  formatPriceDisplay,
  isOnSale,
  getSaleDiscount,
  getAllProducts,
  searchProducts,
  // Direct access to config (read-only in production)
  PRODUCT_PRICES,
  SALE_CONFIG
};


// Also keep functions in global scope for backward compatibility
window.getPrice = getPrice;
window.getFormattedPrice = getFormattedPrice;
window.getProductVariants = getProductVariants;
window.formatPriceDisplay = formatPriceDisplay;

// ============================================================================
// CONSOLE INFO (for developers)
// ============================================================================

console.log('💰 Vardan Naturals Price System Loaded');
console.log(`📦 Total Products: ${Object.keys(PRODUCT_PRICES).length}`);
console.log('🔧 Use VardanPrices.getPrice(productName, variant) to get prices');
if (SALE_CONFIG.enabled) {
  console.log('🎉 SALE MODE ACTIVE');
}
