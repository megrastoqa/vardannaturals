// js/tabs.js - Product Tab Navigation

class ProductTabs {
  constructor() {
    this.categories = [];
    this.currentCategory = 0;
    this.init();
  }

  init() {
    this.categories = Array.from(document.querySelectorAll('.category'));

    if (this.categories.length === 0) return;

    // Create tab navigation
    this.createTabs();

    // Show first category by default
    this.switchTab(0);

    // Check URL hash for direct category access
    this.checkUrlHash();
  }

  createTabs() {
    const tabContainer = document.createElement('div');
    tabContainer.className = 'product-tabs-container';

    const tabsWrapper = document.createElement('div');
    tabsWrapper.className = 'product-tabs';

    // Add "Show All" button
    const showAllBtn = document.createElement('button');
    showAllBtn.textContent = '📋 Show All';
    showAllBtn.className = 'tab-btn show-all-btn';
    showAllBtn.addEventListener('click', () => this.showAll());
    tabsWrapper.appendChild(showAllBtn);

    // Create tab for each category
    this.categories.forEach((category, index) => {
      const title = category.querySelector('h3').textContent;
      const categoryId = category.id;

      const tab = document.createElement('button');
      tab.textContent = title;
      tab.className = 'tab-btn';
      tab.dataset.index = index;
      tab.dataset.categoryId = categoryId;

      tab.addEventListener('click', () => this.switchTab(index));

      tabsWrapper.appendChild(tab);
    });

    tabContainer.appendChild(tabsWrapper);

    // Insert after section title
    const categoriesSection = document.querySelector('.categories');
    const sectionSubtitle = categoriesSection.querySelector('.section-subtitle');
    sectionSubtitle.after(tabContainer);
  }

  switchTab(index) {
    if (index < 0 || index >= this.categories.length) return;

    this.currentCategory = index;

    // Hide all categories
    this.categories.forEach(cat => cat.classList.remove('active'));

    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(tab => {
      tab.classList.remove('active');
    });

    // Show selected category
    this.categories[index].classList.add('active');

    // Activate selected tab
    const activeTab = document.querySelector(`.tab-btn[data-index="${index}"]`);
    if (activeTab) {
      activeTab.classList.add('active');
    }

    // Update URL hash
    const categoryId = this.categories[index].id;
    history.replaceState(null, null, `#${categoryId}`);

    // Scroll to tabs
    this.scrollToTabs();
  }

  showAll() {
    // Show all categories
    this.categories.forEach(cat => cat.classList.add('active'));

    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(tab => {
      tab.classList.remove('active');
    });

    // Activate "Show All" button
    document.querySelector('.show-all-btn').classList.add('active');

    // Update URL
    history.replaceState(null, null, '#products');

    // Scroll to tabs
    this.scrollToTabs();
  }

  checkUrlHash() {
    const hash = window.location.hash.substring(1);

    if (!hash || hash === 'products') {
      this.switchTab(0);
      return;
    }

    // Find category by ID
    const categoryIndex = this.categories.findIndex(cat => cat.id === hash);

    if (categoryIndex !== -1) {
      this.switchTab(categoryIndex);
    }
  }

  scrollToTabs() {
    const tabsContainer = document.querySelector('.product-tabs-container');
    if (tabsContainer) {
      const offset = 80; // Header height
      const elementPosition = tabsContainer.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}

// Initialize tabs when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.categories')) {
    new ProductTabs();
  }
});

// Handle hash changes (back/forward navigation)
window.addEventListener('hashchange', () => {
  const tabs = window.productTabs;
  if (tabs) {
    tabs.checkUrlHash();
  }
});
