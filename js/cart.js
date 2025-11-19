// js/cart.updated.js - Cart with variant-select support (generated)
/* Enhanced cart.updated.js supporting:
 - data-variant-selector (CSS selector for select)
 - option[data-price] for variant price
 - generic add-to-cart buttons (.add-to-cart-btn)
 - migration of inline addToCart(...) onclicks
*/

let cart = [];

// Load cart from localStorage
function loadCart() {
  const savedCart = localStorage.getItem('vardanCart');
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
    } catch (e) {
      console.warn('Failed to parse vardanCart', e);
      cart = [];
    }
  }
  updateCartCount();
  return cart;
}

// Save cart to localStorage
function saveCart() {
  try {
    localStorage.setItem('vardanCart', JSON.stringify(cart));
  } catch (e) {
    console.warn('Failed to save cart', e);
  }
  updateCartCount();
}

// Add to Cart (unchanged signature for compatibility)
function addToCart(productName, price, variant = '', imageSrc = '') {
  const numPrice = parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0;

  const existingIndex = cart.findIndex(item =>
    item.name === productName && item.variant === variant
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
    showNotification('Quantity updated in cart!');
  } else {
    cart.push({
      name: productName,
      price: numPrice,
      priceText: price,
      variant: variant,
      quantity: 1,
      image: imageSrc
    });
    showNotification('Added to cart! ✓');
  }

  saveCart();

  // If on cart page, re-render
  if (window.location.pathname.includes('cart.html')) {
    renderCartPage();
  }
}

// Update quantity
function updateQuantity(index, change) {
  if (cart[index]) {
    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
      removeFromCart(index);
    } else {
      saveCart();
      renderCartPage();
    }
  }
}

// Remove from cart
function removeFromCart(index) {
  if (confirm('Remove this item from cart?')) {
    cart.splice(index, 1);
    saveCart();
    renderCartPage();
    showNotification('Item removed');
  }
}

// Clear cart
function clearCart() {
  if (confirm('Clear all items from cart?')) {
    cart = [];
    saveCart();
    renderCartPage();
    showNotification('Cart cleared');
  }
}

// Update cart count in navigation
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countElements = document.querySelectorAll('#navCartCount, #cartCount');
  countElements.forEach(el => {
    if (el) el.textContent = totalItems;
  });
}

// Calculate total
function calculateTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Render cart page
function renderCartPage() {
  const container = document.getElementById('cartItemsContainer');
  const subtotalEl = document.getElementById('subtotal');
  const totalEl = document.getElementById('totalAmount');

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
            <div class="cart-empty-state">
                <div class="cart-empty-icon">🛍️</div>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <a href="index.html#products" class="shop-now-btn">
                    🌿 Start Shopping
                </a>
            </div>
        `;

    if (subtotalEl) subtotalEl.textContent = '₹0';
    if (totalEl) totalEl.textContent = '₹0';

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) checkoutBtn.disabled = true;

    return;
  }

  // Render cart items
  container.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            ${item.image ?
    `<img src="${item.image}" class="cart-item-image" alt="${item.name}">` :
    '<div class="cart-item-image" style="display: flex; align-items: center; justify-content: center; font-size: 3rem;">🌿</div>'
  }
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                ${item.variant ? `<div class="cart-item-variant">Variant: ${item.variant}</div>` : ''}
                <div class="cart-item-price">${item.priceText}</div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="qty-btn" onclick="updateQuantity(${index}, -1)">−</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${index})" title="Remove item">🗑️</button>
                </div>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 1.3rem; font-weight: 600; color: #2c5f2d;">
                    ₹${(item.price * item.quantity).toFixed(0)}
                </div>
                <div style="font-size: 0.85rem; color: #8a8a8a; margin-top: 0.3rem;">
                    ₹${item.price} × ${item.quantity}
                </div>
            </div>
        </div>
    `).join('');

  // Update totals
  const total = calculateTotal();
  if (subtotalEl) subtotalEl.textContent = `₹${total.toFixed(0)}`;
  if (totalEl) totalEl.textContent = `₹${total.toFixed(0)}`;

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) checkoutBtn.disabled = false;
}

// Checkout via WhatsApp
function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  const phoneNumber = '918077775729';
  let message = `🛒 *New Order from Vardan Naturals Website*\n\n`;

  cart.forEach((item, index) => {
    message += `${index + 1}. *${item.name}*\n`;
    if (item.variant) message += `   Variant: ${item.variant}\n`;
    message += `   Price: ${item.priceText}\n`;
    message += `   Quantity: ${item.quantity}\n`;
    message += `   Subtotal: ₹${(item.price * item.quantity).toFixed(0)}\n\n`;
  });

  const total = calculateTotal();
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

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: #2c5f2d;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        font-weight: 500;
    `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 2500);
}

/* -------------------------
   Generic add-to-cart enhancements
   ------------------------- */

/**
 * handleAddToCartClick
 * Reads data-* attributes from a clicked button and delegates to addToCart()
 * Supports:
 * - data-name (product name)
 * - data-price (display price text, e.g. "₹499")
 * - data-variant (e.g. "100ml")
 * - data-image (image URL)
 * - data-qty (optional number)
 * - data-variant-selector (optional CSS selector to pick a variant value)
 * - data-qty-selector (optional CSS selector to pick quantity)
 */
function handleAddToCartClick(e) {
  const btn = e.currentTarget || (e.target && e.target.closest && e.target.closest('.add-to-cart-btn')) || e.target;
  if (!btn) return;

  let name = (btn.dataset.name || btn.getAttribute('data-name') || '').trim();
  let priceText = (btn.dataset.price || btn.getAttribute('data-price') || '₹0').trim();
  let variant = (btn.dataset.variant || btn.getAttribute('data-variant') || '').trim();
  const image = (btn.dataset.image || btn.getAttribute('data-image') || '').trim();

  // quantity via data-qty or selector
  let qty = parseInt(btn.dataset.qty || btn.getAttribute('data-qty') || '1', 10) || 1;
  if (btn.dataset.qtySelector) {
    const qEl = document.querySelector(btn.dataset.qtySelector);
    if (qEl) {
      const parsed = parseInt(qEl.value || qEl.getAttribute('value') || '1', 10);
      if (!isNaN(parsed) && parsed > 0) qty = parsed;
    }
  }

  // variant selector support (if you want a select to control variant)
  if (btn.dataset.variantSelector) {
    const sel = document.querySelector(btn.dataset.variantSelector);
    if (sel) {
      const selectedOption = sel.options[sel.selectedIndex];
      variant = selectedOption ? (selectedOption.value || selectedOption.text) : variant;
      // prefer option[data-price] if present
      const optPrice = selectedOption ? selectedOption.getAttribute('data-price') : null;
      if (optPrice) priceText = optPrice;
    }
  }

  if (!name) {
    console.warn('Add to cart: product name missing on button', btn);
  }

  for (let i = 0; i < qty; i++) {
    addToCart(name, priceText, variant, image);
  }
}

/**
 * initGenericAddToCart
 * Attach click listeners to .add-to-cart-btn buttons (idempotent)
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
 * initAddToCartDelegation
 * Optional delegation-based approach (useful for dynamically injected product lists)
 */
function initAddToCartDelegation(container = document) {
  container.addEventListener('click', function (e) {
    const btn = e.target.closest && e.target.closest('.add-to-cart-btn');
    if (!btn) return;
    handleAddToCartClick({ currentTarget: btn });
  });
}

/* -------------------------
   Migration helper: convert inline onclick="addToCart(...)" calls to data-* attributes
   This helps you keep using the HTML as-is and migrate progressively.
   ------------------------- */

/**
 * migrateInlineAddToCart
 * Finds elements with onclick attributes calling addToCart(...) and converts them
 * to data-* attributes, then removes the onclick attribute.
 *
 * Supports patterns like:
 *   addToCart('Name', '₹499', '100ml', 'images/foo.jpg')
 *   addToCart("Name", "₹499", "100ml", "images/foo.jpg")
 *
 * It is conservative — if parsing fails it leaves the element unchanged.
 */
function migrateInlineAddToCart(root = document) {
  const nodes = root.querySelectorAll('[onclick]');
  const regex = /addToCart\s*\(\s*(['"])(.*?)\1\s*,\s*(['"])(.*?)\3\s*(?:,\s*(['"])(.*?)\5\s*(?:,\s*(['"])(.*?)\7\s*)?)?\)/;

  nodes.forEach(node => {
    const onclickValue = node.getAttribute('onclick');
    if (!onclickValue) return;
    const match = onclickValue.match(regex);
    if (!match) return;

    // match groups:
    // match[2] => productName
    // match[4] => price
    // match[6] => variant (optional)
    // match[8] => image (optional)
    const productName = match[2] || '';
    const priceText = match[4] || '';
    const variant = match[6] || '';
    const image = match[8] || '';

    // set data attributes
    try {
      node.dataset.name = productName;
      node.dataset.price = priceText;
      if (variant) node.dataset.variant = variant;
      if (image) node.dataset.image = image;

    } catch (err) {
      console.warn('Failed to migrate onclick to data-* for element', node, err);
    }});
}

// Notification styles (only once)
(function appendNotificationStyles() {
  if (document.getElementById('cart-notification-styles')) return;
  const style = document.createElement('style');
  style.id = 'cart-notification-styles';
  style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
      }
    `;
  document.head.appendChild(style);
})();

// Outside click to close cart (kept simple)
function setupOutsideClickClose() {
  document.addEventListener('click', function (e) {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartIcon = document.querySelector('.cart-icon-container');

    if (!cartSidebar || !cartIcon) return;

    if (cartSidebar.classList.contains('open') &&
      !cartSidebar.contains(e.target) &&
      !cartIcon.contains(e.target)) {
      cartSidebar.classList.remove('open');
    }
  });
}

// Initialize
function initCartSystem() {
  loadCart();
  setupOutsideClickClose();

  // migrate inline onclicks (conservative)
  migrateInlineAddToCart(document);

  // bind add-to-cart buttons
  initGenericAddToCart(document);

  // if dynamic products exist, you can enable delegation:
  // const productsRoot = document.querySelector('#products') || document;
  // initAddToCartDelegation(productsRoot);
}

document.addEventListener('DOMContentLoaded', initCartSystem);
