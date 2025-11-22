// Featured Products Carousel

class FeaturedCarousel {
  constructor() {
    // Check if elements exist
    this.track = document.getElementById('featuredCarouselTrack');
    this.prevBtn = document.getElementById('featuredPrevBtn');
    this.nextBtn = document.getElementById('featuredNextBtn');
    this.dotsContainer = document.getElementById('featuredCarouselDots');

    if (!this.track || !this.prevBtn || !this.nextBtn || !this.dotsContainer) {
      console.error('Featured carousel elements not found');
      return;
    }

    this.currentIndex = 0;
    this.cards = this.track.querySelectorAll('.featured-product-card');
    this.totalCards = this.cards.length;

    if (this.totalCards === 0) {
      console.error('No featured product cards found');
      return;
    }

    console.log('Featured carousel initialized with', this.totalCards, 'cards');
    this.init();
  }

  init() {
    this.updateCardsPerView();
    this.createDots();
    this.updateCarousel();

    this.prevBtn.addEventListener('click', () => this.prev());
    this.nextBtn.addEventListener('click', () => this.next());

    window.addEventListener('resize', () => {
      this.updateCardsPerView();
      this.createDots();
      this.updateCarousel();
    });

    // Auto-play (optional)
    this.startAutoPlay();
  }

  updateCardsPerView() {
    const width = window.innerWidth;
    if (width <= 768) {
      this.cardsPerView = 1;
    } else if (width <= 1024) {
      this.cardsPerView = 2;
    } else {
      this.cardsPerView = 3;
    }
    this.maxIndex = Math.max(0, this.totalCards - this.cardsPerView);
    console.log('Cards per view:', this.cardsPerView, 'Max index:', this.maxIndex);
  }

  createDots() {
    this.dotsContainer.innerHTML = '';

    for (let i = 0; i <= this.maxIndex; i++) {
      const dot = document.createElement('div');
      dot.classList.add('featured-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => this.goToSlide(i));
      this.dotsContainer.appendChild(dot);
    }
  }

  updateCarousel() {
    if (this.cards.length === 0) return;

    // Ensure currentIndex is within bounds
    this.currentIndex = Math.max(0, Math.min(this.currentIndex, this.maxIndex));

    const cardWidth = this.cards[0].offsetWidth;
    const gap = 32; // 2rem gap
    const offset = -(this.currentIndex * (cardWidth + gap));

    this.track.style.transform = `translateX(${offset}px)`;

    // Update buttons
    this.prevBtn.disabled = this.currentIndex === 0;
    this.nextBtn.disabled = this.currentIndex >= this.maxIndex;

    // Update dots
    const dots = this.dotsContainer.querySelectorAll('.featured-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarousel();
      this.resetAutoPlay();
    }
  }

  next() {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
      this.updateCarousel();
      this.resetAutoPlay();
    }
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateCarousel();
    this.resetAutoPlay();
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      if (this.currentIndex >= this.maxIndex) {
        this.currentIndex = 0;
      } else {
        this.currentIndex++;
      }
      this.updateCarousel();
    }, 5000); // Auto-advance every 5 seconds
  }

  resetAutoPlay() {
    clearInterval(this.autoPlayInterval);
    this.startAutoPlay();
  }
}

// Initialize featured carousel when DOM is ready
function initFeaturedCarousel() {
  console.log('Initializing featured carousel...');
  new FeaturedCarousel();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFeaturedCarousel);
} else {
  initFeaturedCarousel();
}
