// js/main.js - Main Application Logic & Utilities

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  whatsappNumber: '918077775729',
  whatsappNumber2: '916396021214',
  instagramHandle: '@vardannaturals',
  googleReviewLink: 'YOUR_GOOGLE_REVIEW_LINK', // Update this
  companyName: 'Vardan Naturals',
  companyTagline: 'from nature, with care'
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

const utils = {
  // Format price
  formatPrice(price) {
    if (typeof price === 'number') {
      return `₹${price.toFixed(0)}`;
    }
    return price;
  },

  // Format phone number
  formatPhoneNumber(number) {
    return number.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3 $4');
  },

  // Smooth scroll to section
  scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  },

  // Scroll to top
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  },

  // Debounce function for performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

// ============================================
// WHATSAPP FUNCTIONS
// ============================================

// Single product order via WhatsApp
function orderOnWhatsApp(productName, price, variant = '') {
  let message = `Hi ${CONFIG.companyName}! 👋\n\n`;
  message += `I would like to order:\n`;
  message += `📦 Product: ${productName}\n`;
  message += `💰 Price: ${price}\n`;

  if (variant) {
    message += `🎨 Variant: ${variant}\n`;
  }

  message += `\nPlease confirm availability and delivery details. Thank you!`;

  const whatsappURL = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, '_blank');
}

// ============================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ============================================

function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      // Skip if it's just "#"
      if (href === '#') return;

      e.preventDefault();
      const targetId = href.substring(1);
      utils.scrollToSection(targetId);
    });
  });
}

// ============================================
// PAGE LOAD ANIMATIONS
// ============================================

function initAnimations() {
  // Intersection Observer for fade-in animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe elements for animation
  const animateElements = document.querySelectorAll('.product-item, .category, .cert-badge, .stat');
  animateElements.forEach(el => {
    observer.observe(el);
  });
}

// Add animation styles
function addAnimationStyles() {
  if (!document.getElementById('animation-styles')) {
    const style = document.createElement('style');
    style.id = 'animation-styles';
    style.textContent = `
            .product-item,
            .category,
            .cert-badge,
            .stat {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }

            .product-item.animate-in,
            .category.animate-in,
            .cert-badge.animate-in,
            .stat.animate-in {
                opacity: 1;
                transform: translateY(0);
            }

            @media (prefers-reduced-motion: reduce) {
                .product-item,
                .category,
                .cert-badge,
                .stat {
                    opacity: 1;
                    transform: none;
                }
            }
        `;
    document.head.appendChild(style);
  }
}

// ============================================
// SCROLL TO TOP BUTTON
// ============================================

function initScrollToTopButton() {
  // Create button
  const scrollBtn = document.createElement('button');
  scrollBtn.id = 'scrollToTop';
  scrollBtn.innerHTML = '↑';
  scrollBtn.setAttribute('aria-label', 'Scroll to top');
  scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #2c5f2d;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s;
        z-index: 998;
        box-shadow: 0 4px 12px rgba(44, 95, 45, 0.3);
    `;

  document.body.appendChild(scrollBtn);

  // Show/hide button on scroll
  const toggleScrollButton = utils.debounce(() => {
    if (window.pageYOffset > 300) {
      scrollBtn.style.opacity = '1';
      scrollBtn.style.visibility = 'visible';
    } else {
      scrollBtn.style.opacity = '0';
      scrollBtn.style.visibility = 'hidden';
    }
  }, 100);

  window.addEventListener('scroll', toggleScrollButton);

  // Click handler
  scrollBtn.addEventListener('click', utils.scrollToTop);

  // Hover effect
  scrollBtn.addEventListener('mouseenter', () => {
    scrollBtn.style.background = '#1a3a1b';
    scrollBtn.style.transform = 'scale(1.1)';
  });

  scrollBtn.addEventListener('mouseleave', () => {
    scrollBtn.style.background = '#2c5f2d';
    scrollBtn.style.transform = 'scale(1)';
  });
}

// ============================================
// LOADING SCREEN
// ============================================

function initLoadingScreen() {
  // Create loading screen
  const loader = document.createElement('div');
  loader.id = 'pageLoader';
  loader.innerHTML = `
        <div style="text-align: center;">
            <div style="width: 50px; height: 50px; border: 4px solid #e8e5e0; border-top: 4px solid #2c5f2d; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
            <p style="color: #2c5f2d; font-size: 1.1rem; font-weight: 600;">${CONFIG.companyName}</p>
            <p style="color: #6a6a6a; font-size: 0.9rem; font-style: italic;">${CONFIG.companyTagline}</p>
        </div>
    `;
  loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #faf9f7;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.3s ease;
    `;

  // Add spinner animation
  const style = document.createElement('style');
  style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
  document.head.appendChild(style);

  document.body.insertBefore(loader, document.body.firstChild);

  // Remove loading screen when page loads
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.remove();
      }, 300);
    }, 500);
  });
}

// ============================================
// HEADER SCROLL EFFECT
// ============================================

function initHeaderScrollEffect() {
  const header = document.querySelector('header');
  if (!header) return;

  const handleScroll = utils.debounce(() => {
    if (window.pageYOffset > 50) {
      header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      header.style.background = '#ffffff';
    } else {
      header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
    }
  }, 50);

  window.addEventListener('scroll', handleScroll);
}

// ============================================
// EXTERNAL LINKS - OPEN IN NEW TAB
// ============================================

function initExternalLinks() {
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    // Skip if it's linking to the same domain
    if (link.hostname === window.location.hostname) return;

    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
}

// ============================================
// IMAGE LAZY LOADING FALLBACK
// ============================================

function initLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  // Fallback for browsers that don't support lazy loading
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports lazy loading
    return;
  }

  // Polyfill for older browsers
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

// ============================================
// CONSOLE BRANDING (Optional)
// ============================================

function consoleBranding() {
  const styles = [
    'color: #2c5f2d',
    'font-size: 20px',
    'font-weight: bold',
    'text-shadow: 2px 2px 4px rgba(0,0,0,0.1)'
  ].join(';');

  console.log(`%c🌿 ${CONFIG.companyName}`, styles);
  console.log(`%c${CONFIG.companyTagline}`, 'color: #6a6a6a; font-style: italic;');
  console.log('%cWebsite built with care 💚', 'color: #2c5f2d;');
}

// ============================================
// FORM VALIDATION (if you have contact forms)
// ============================================

function initFormValidation() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const inputs = form.querySelectorAll('input[required], textarea[required]');
      let isValid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#ff6b6b';
        } else {
          input.style.borderColor = '#e8e5e0';
        }
      });

      if (!isValid) {
        e.preventDefault();
        alert('Please fill in all required fields');
      }
    });
  });
}

// ============================================
// DETECT MOBILE DEVICE
// ============================================

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// ============================================
// COPY TO CLIPBOARD UTILITY
// ============================================

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showNotification('Copied to clipboard!');
    });
  } else {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showNotification('Copied to clipboard!');
  }
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');

  const bgColor = type === 'success' ? '#2c5f2d' : type === 'error' ? '#ff6b6b' : '#2c5f2d';

  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        font-weight: 500;
        max-width: 300px;
    `;

  notification.textContent = message;
  document.body.appendChild(notification);

  // Add animation
  const style = document.createElement('style');
  style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
  if (!document.getElementById('notification-styles')) {
    style.id = 'notification-styles';
    document.head.appendChild(style);
  }

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ============================================
// INITIALIZE EVERYTHING
// ============================================

function init() {
  console.log('🚀 Initializing Vardan Naturals website...');

  // Add loading screen
  initLoadingScreen();

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
}

function initializeApp() {
  console.log('✅ DOM Ready - Initializing app features...');

  // Core functionality
  initSmoothScrolling();
  initHeaderScrollEffect();
  initExternalLinks();

  // UI enhancements
  addAnimationStyles();
  initAnimations();
  initScrollToTopButton();
  initLazyLoading();

  // Forms
  initFormValidation();

  // Branding
  consoleBranding();

  console.log('✅ All features initialized successfully!');
}

// ============================================
// START THE APPLICATION
// ============================================

init();

// ============================================
// EXPORT UTILITIES (if needed)
// ============================================

// Make utilities available globally
window.VardanNaturals = {
  utils,
  orderOnWhatsApp,
  copyToClipboard,
  showNotification,
  isMobile,
  CONFIG
};

console.log('📦 VardanNaturals utilities loaded globally');
