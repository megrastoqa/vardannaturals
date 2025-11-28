/**
 * Unified cart.js for Vardan Naturals
 * - Uses centralized prices via getPrice(name, variant) if available (prices.js)
 * - Backwards compatible with older addToCart signature and localStorage key 'vardanCart'
 * - Exposes same functions used across your site: loadCart(), renderCartPage(), addToCart(...)
 * - Auto-binds .add-to-cart-btn buttons and supports data-variant-selector & option[data-price]
 * - Safe: degrades to data-price attributes when centralized pricing is not present
 *
 * Author: ChatGPT (tailored for your project)
 * Last updated: 2025
 */

  // ===============================
  // Configuration
  // ===============================
const STORAGE_KEY = 'vardanCart'; // keep old key for compatibility
const WHATSAPP_NUMBER = '918077775729'; // change if needed

// ===============================
// Internal state
// ===============================
let cart = [];

// ===============================
// Utilities
// ===============================

/**
 * Parse a price expression like "₹499" or "499" to a number.
 * Returns NaN if it cannot parse.
 */
function parsePriceToNumber(priceText) {
  if (priceText === undefined || priceText === null) return NaN;
  try {
    // Remove all non-digit/decimal characters
    const cleaned = String(priceText).replace(/[^\d.]/g, '');
    return parseFloat(cleaned);
  } catch (e) {
    return NaN;
  }
}

/**
 * Format numeric price to display text (₹ integer, no decimals)
 */
function formatPriceText(n) {
  if (isNaN(n)) return '₹0';
  return `₹${Math.round(n)}`;
}

/**
 * Safe wrapper around centralized getPrice(name, variant)
 * Expected getPrice to return numeric price or null/undefined if not found.
 */
function safeGetPrice(name, variant) {
  try {
    if (typeof getPrice === 'function') {
      const p = getPrice(name, variant);
      // Accept numbers (including 0). Treat other returns as 'not found'
      if (p === null || p === undefined || isNaN(Number(p))) return null;
      return Number(p);
    }
  } catch (err) {
    console.warn('getPrice() threw error:', err);
  }
  return null;
}

// ===============================
// Storage / Load / Save
// ===============================
function loadCart() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      cart = JSON.parse(saved) || [];
    } catch (err) {
      console.warn('Failed to parse cart from storage, resetting', err);
      cart = [];
    }
  } else {
    cart = [];
  }

  // Ensure items have expected fields (backwards compatible)
  cart = cart.map(item => ({
    name: item.name || '',
    variant: item.variant || (item.variant === '' ? '' : 'default'),
    priceText: item.priceText || item.price || item.priceText || (item.price ? formatPriceText(parsePriceToNumber(item.price)) : '₹0'),
    // also keep numeric price if present as price (legacy)
    price: (item.price && !isNaN(Number(item.price))) ? Number(item.price) : parsePriceToNumber(item.priceText || item.priceText),
    image: item.image || 'images/placeholder.jpg',
    quantity: Number(item.quantity || 1),
    addedAt: item.addedAt || new Date().toISOString()
  }));

  // Immediately sync prices if centralized pricing exists
  syncCartPrices();

  updateCartCount();
  return cart;
}

function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (err) {
    console.warn('Failed to save cart', err);
  }
  updateCartCount();
}

// ===============================
// Price Syncing
// ===============================
/**
 * Replace each item's priceText (and numeric price) with the current price from getPrice()
 * If getPrice returns null, we keep existing priceText
 */
function syncCartPrices() {
  if (typeof getPrice !== 'function') return; // nothing to do

  let updated = false;

  cart = cart.map(item => {
    const currentNumeric = safeGetPrice(item.name, item.variant);
    if (currentNumeric !== null) {
      const newPriceText = formatPriceText(currentNumeric);
      if (item.priceText !== newPriceText) {
        updated = true;
        return {
          ...item,
          priceText: newPriceText,
          price: currentNumeric
        };
      } else {
        // still ensure numeric price is set
        return { ...item, price: currentNumeric };
      }
    }
    return item;
  });

  if (updated) {
    saveCart();
    console.log('✅ Cart prices synced with centralized pricing');
  }
}

// ===============================
// Core Cart Actions
// ===============================

/**
 * Unified addToCart interface to support both:
 *  - addToCart(productName, variant, image, variantSelector)  <-- your new signature
 *  - addToCart(productName, priceText, variant, image)        <-- legacy signature
 *
 * Heuristic:
 *  - If second argument looks like a price ("₹" or digits), treat as legacy price signature.
 *  - Else treat as variant signature.
 */
function addToCart(arg1, arg2, arg3, arg4) {
  // Determine signature
  const productName = String(arg1 || '').trim();

  // Detect legacy pattern: second arg is priceText ("₹499" or numeric string)
  const looksLikePrice = (v) => {
    if (v === undefined || v === null) return false;
    const s = String(v);
    return /[₹\d]/.test(s) && /[₹]/.test(s) || /^\d+(\.\d+)?$/.test(s);
  };

  let variant = '';
  let image = '';
  let priceText = null;
  let numericPrice = null;

  if (looksLikePrice(arg2) && (typeof arg3 === 'string' || arg3 === undefined)) {
    // Legacy: addToCart(name, priceText, variant?, image?)
    priceText = String(arg2);
    variant = arg3 || '';
    image = arg4 || '';
    numericPrice = parsePriceToNumber(priceText);
  } else {
    // New: addToCart(name, variant, image, variantSelector?)
    variant = arg2 || '';
    image = arg3 || '';
    // try centralized price first
    const central = safeGetPrice(productName, variant);
    if (central !== null) {
      numericPrice = central;
      priceText = formatPriceText(central);
    } else {
      // fallback: try to read price from DOM using variantSelector (arg4) or data-price on button
      priceText = null;
      if (typeof arg4 === 'string' && arg4.length) {
        const sel = document.querySelector(arg4);
        if (sel) {
          const opt = sel.options[sel.selectedIndex];
          if (opt) {
            const optPrice = opt.getAttribute('data-price') || opt.dataset.price;
            if (optPrice) {
              priceText = optPrice;
              numericPrice = parsePriceToNumber(priceText);
            }
          }
        }
      }
    }
  }

  // If still no priceText, try centralized again with empty variant
  if (!priceText) {
    const central2 = safeGetPrice(productName, '');
    if (central2 !== null) {
      numericPrice = central2;
      priceText = formatPriceText(central2);
    }
  }

  // As final fallback, set price to 0
  if (!priceText) {
    priceText = '₹0';
    if (numericPrice === null || numericPrice === undefined || isNaN(numericPrice)) numericPrice = 0;
  }

  // Find existing item
  const existing = cart.find(it => it.name === productName && it.variant === variant);
  if (existing) {
    existing.quantity = Number(existing.quantity || 0) + 1;
    existing.priceText = priceText;
    existing.price = numericPrice;
  } else {
    cart.push({
      name: productName,
      variant: variant,
      priceText: priceText,
      price: numericPrice,
      image: image || 'images/placeholder.jpg',
      quantity: 1,
      addedAt: new Date().toISOString()
    });
  }

  saveCart();
  showCartNotification(`✓ ${productName} added to cart!`);
}

/**
 * Remove from cart by index
 */
function removeFromCart(index) {
  if (!Number.isInteger(index) || index < 0 || index >= cart.length) return;
  if (!confirm('Remove this item from cart?')) return;
  cart.splice(index, 1);
  saveCart();
  renderCartPage();
  showCartNotification('Item removed from cart');
}

/**
 * Update quantity for an item and re-render
 */
function updateQuantity(index, change) {
  if (!Number.isInteger(index) || index < 0 || index >= cart.length) return;
  cart[index].quantity = Number(cart[index].quantity || 0) + Number(change || 0);

  if (cart[index].quantity <= 0) {
    // remove
    cart.splice(index, 1);
  }
  saveCart();
  renderCartPage();
}

/**
 * Clear entire cart
 */
function clearCart() {
  if (!confirm('Are you sure you want to clear your entire cart?')) return;
  cart = [];
  saveCart();
  renderCartPage();
  showCartNotification('Cart cleared');
}

// ===============================
// Totals & Display helpers
// ===============================
function calculateTotal() {
  return cart.reduce((sum, item) => {
    const num = parsePriceToNumber(item.priceText || item.price);
    const qty = Number(item.quantity || 0);
    return sum + ( (isNaN(num) ? 0 : num) * qty );
  }, 0);
}

function updateCartCount() {
  const totalItems = cart.reduce((s, i) => s + Number(i.quantity || 0), 0);
  const els = document.querySelectorAll('#navCartCount, .cart-count, #cartCount');
  els.forEach(el => { if (el) el.textContent = totalItems; });
}

// ===============================
// Render (keeps old renderCartPage API)
// ===============================
function renderCartPage() {
  // Attempt to support either ID names in your site
  const container = document.getElementById('cartItemsContainer') || document.getElementById('cartItems') || document.getElementById('cartItemsContainer');
  const subtotalEl = document.getElementById('subtotal') || document.getElementById('cartSubtotal') || document.getElementById('subtotalAmount');
  const totalEl = document.getElementById('totalAmount') || document.getElementById('cartTotal') || document.getElementById('cartTotalAmount');

  if (!container) return;

  // Ensure prices are current
  syncCartPrices();

  if (!cart || cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-state">
        <div class="cart-empty-icon">🛍️</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <a href="index.html#products" class="shop-now-btn">🌿 Start Shopping</a>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = '₹0';
    if (totalEl) totalEl.textContent = '₹0';
    // disable checkout button if present
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) checkoutBtn.disabled = true;
    updateCartCount();
    return;
  }

  // Build HTML for items
  const html = cart.map((item, i) => {
    const num = parsePriceToNumber(item.priceText || item.price) || 0;
    const itemTotal = Math.round(num * (Number(item.quantity) || 0));
    return `
      <div class="cart-item">
        <img src="${item.image || 'images/placeholder.jpg'}" alt="${escapeHtml(item.name)}" class="cart-item-image" onerror="this.src='images/placeholder.jpg'">
        <div class="cart-item-details">
          <div class="cart-item-name">${escapeHtml(item.name)}</div>
          ${item.variant ? `<div class="cart-item-variant">${escapeHtml(item.variant)}</div>` : ''}
          <div class="cart-item-price">${escapeHtml(String(item.priceText || formatPriceText(num)))}</div>
          <div class="cart-item-actions">
            <div class="quantity-control">
              <button class="qty-btn" onclick="updateQuantity(${i}, -1)">−</button>
              <span class="qty-display">${Number(item.quantity)}</span>
              <button class="qty-btn" onclick="updateQuantity(${i}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${i})" title="Remove item">🗑️</button>
          </div>
        </div>
        <div class="cart-item-total" style="font-weight:600; color:#2c5f2d; font-size:1.2rem;">
          ₹${itemTotal.toFixed(0)}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;

  // Update totals
  const total = Math.round(calculateTotal());
  if (subtotalEl) subtotalEl.textContent = `₹${total.toFixed(0)}`;
  if (totalEl) totalEl.textContent = `₹${total.toFixed(0)}`;

  // enable checkout
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) checkoutBtn.disabled = false;

  updateCartCount();
}

// Small helper to avoid XSS in inserted innerHTML segments (product names)
function escapeHtml(str) {
  if (!str && str !== 0) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ===============================
// Checkout (WhatsApp) - uses stored canonical prices (synced)
// ===============================
function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  // Sync prices again before sending
  if (typeof syncCartPrices === "function") {
    syncCartPrices();
  }

  const phoneNumber = '918077775729'; // your number

  let message = `🛒 *New Order from Vardan Naturals Website*\n\n`;

  cart.forEach((item, index) => {
    const numericPrice = parseFloat(String(item.priceText || item.price).replace(/[^0-9.]/g, '')) || 0;
    const subtotal = (numericPrice * item.quantity).toFixed(0);

    message += `${index + 1}. *${item.name}*\n`;

    if (item.variant) {
      message += `   Variant: ${item.variant}\n`;
    }

    message += `   Price: ${item.priceText}\n`;
    message += `   Quantity: ${item.quantity}\n`;
    message += `   Subtotal: ₹${subtotal}\n\n`;
  });

  const total = cart.reduce((sum, item) => {
    const num = parseFloat(String(item.priceText || item.price).replace(/[^0-9.]/g, '')) || 0;
    return sum + num * (item.quantity || 0);
  }, 0);

  message += `───────────────\n`;
  message += `*Total Amount: ₹${total.toFixed(0)}*\n\n`;
  message += `Please confirm availability and payment details. Thank you! 🙏`;

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, '_blank');

  setTimeout(() => {
    if (confirm('Order sent! Would you like to clear your cart?')) {
      clearCart();
    }
  }, 1500);
}

// ===============================
// Notifications (single implementation)
// ===============================
function showCartNotification(message) {
  // Remove existing notification if any
  const existing = document.querySelector('.cart-notification');
  if (existing) existing.remove();

  const n = document.createElement('div');
  n.className = 'cart-notification';
  n.textContent = message;
  n.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: #2c5f2d;
    color: white;
    padding: 1rem 1.6rem;
    border-radius: 50px;
    box-shadow: 0 6px 24px rgba(44,95,45,0.4);
    z-index: 10000;
    animation: slideInRight 0.32s ease;
  `;
  document.body.appendChild(n);

  setTimeout(() => {
    n.style.animation = 'slideOutRight 0.28s ease';
    setTimeout(() => n.remove(), 280);
  }, 2800);
}

// Insert notification animations styles if not present
(function ensureNotificationAnimations() {
  if (document.getElementById('cart-animations')) return;
  const style = document.createElement('style');
  style.id = 'cart-animations';
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to   { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to   { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();

// ===============================
// Add-to-cart bindings & helpers (supports data-* attributes and migration)
// ===============================

/**
 * Handle click for .add-to-cart-btn (reads data-* attributes)
 * Supported attributes:
 * - data-name
 * - data-price (display price text)
 * - data-variant
 * - data-image
 * - data-qty
 * - data-variant-selector (CSS selector for <select>)
 * - data-qty-selector (CSS selector for quantity input)
 */
function handleAddToCartClick(e) {
  const btn = e.currentTarget || e.target || this;
  if (!btn) return;

  // read attributes (prefer dataset)
  let name = (btn.dataset.name || btn.getAttribute('data-name') || '').trim();
  let priceText = (btn.dataset.price || btn.getAttribute('data-price') || '').trim();
  let variant = (btn.dataset.variant || btn.getAttribute('data-variant') || '').trim();
  const image = (btn.dataset.image || btn.getAttribute('data-image') || '').trim();

  // quantity support
  let qty = parseInt(btn.dataset.qty || btn.getAttribute('data-qty') || '1', 10) || 1;
  if (btn.dataset.qtySelector) {
    const qEl = document.querySelector(btn.dataset.qtySelector);
    if (qEl) {
      const parsed = parseInt(qEl.value || qEl.getAttribute('value') || '1', 10);
      if (!isNaN(parsed) && parsed > 0) qty = parsed;
    }
  }

  // variant selector support
  if (btn.dataset.variantSelector) {
    console.log('🔍 Has variant selector:', btn.dataset.variantSelector);
    const sel = document.querySelector(btn.dataset.variantSelector);
    if (sel) {
      const selectedOption = sel.options[sel.selectedIndex];
      const optVal = selectedOption ? (selectedOption.value || selectedOption.text) : '';
      variant = optVal || variant;
      // prefer option[data-price] if present
      const optPrice = selectedOption ? selectedOption.getAttribute('data-price') : null;
      if (optPrice) priceText = optPrice;
    }
  }

  if (!name) {
    console.warn('add-to-cart-btn missing data-name', btn);
    return;
  }

  // If priceText is present and looks like a price, use legacy signature (name, priceText, variant, image)
  for (let i = 0; i < qty; i++) {
    if (priceText) {
      addToCart(name, priceText, variant, image);
    } else {
      addToCart(name, variant, image, btn.dataset.variantSelector || null);
    }
  }
}

/**
 * Attach handlers to .add-to-cart-btn buttons (idempotent)
 */
function initGenericAddToCart(root = document) {
  const buttons = root.querySelectorAll('.add-to-cart-btn');
  buttons.forEach(btn => {
    if (!btn.dataset.bound) {
      btn.addEventListener('click', handleAddToCartClick);
      btn.dataset.bound = 'true';
    }
  });
}

/**
 * Migrate inline onclick="addToCart(...)" to data-* to avoid breaking older markup.
 * This is conservative; if it can't parse it leaves element unchanged.
 */
function migrateInlineAddToCart(root = document) {
  const nodes = root.querySelectorAll('[onclick]');
  const regex = /addToCart\s*\(\s*(['"])(.*?)\1\s*,\s*(['"])(.*?)\3\s*(?:,\s*(['"])(.*?)\5\s*(?:,\s*(['"])(.*?)\7\s*)?)?\)/;

  nodes.forEach(node => {
    const val = node.getAttribute('onclick');
    if (!val) return;
    const m = val.match(regex);
    if (!m) return;
    const productName = m[2] || '';
    const priceText = m[4] || '';
    const variant = m[6] || '';
    const image = m[8] || '';

    try {
      node.dataset.name = productName;
      if (priceText) node.dataset.price = priceText;
      if (variant) node.dataset.variant = variant;
      if (image) node.dataset.image = image;
      // remove onclick to prevent double-run
      node.removeAttribute('onclick');
    } catch (err) {
      console.warn('Failed migrating onclick to data-*', err);
    }
  });
}

// ===============================
// Misc helpers
// ===============================
function setupOutsideClickClose() {
  document.addEventListener('click', function (e) {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartIcon = document.querySelector('.cart-icon-container');
    if (!cartSidebar || !cartIcon) return;
    if (cartSidebar.classList.contains('open') && !cartSidebar.contains(e.target) && !cartIcon.contains(e.target)) {
      cartSidebar.classList.remove('open');
    }
  });
}

// ===============================
// Initialization
// ===============================
function initCartSystem() {
  loadCart();
  migrateInlineAddToCart(document);
  initGenericAddToCart(document);
  setupOutsideClickClose();

  // Render cart if the cart page is present
  if (document.getElementById('cartItems') || document.getElementById('cartItemsContainer')) {
    renderCartPage();
  }
}

// Auto init on DOMContentLoaded (cart.html already does loadCart(); renderCartPage(); but this is safe)
document.addEventListener('DOMContentLoaded', initCartSystem);

// ===============================
// Debug / Export
// ===============================
window.cartDebug = {
  viewCart: () => console.table(cart),
  syncPrices: syncCartPrices,
  clearCart,
  getCart: () => cart,
  saveCart
};

// Also expose functions to global scope so inline handlers (onclick) keep working
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.loadCart = loadCart;
window.renderCartPage = renderCartPage;
window.checkoutWhatsApp = checkoutWhatsApp;
window.updateCartCount = updateCartCount;

console.log('🛒 Unified cart.js loaded — centralized price support enabled if prices.js provides getPrice()');
