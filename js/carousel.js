class Carousel {
  constructor(carouselId) {
    this.id = carouselId;
    this.currentSlide = 0;
    this.element = document.getElementById(carouselId);
    this.slides = this.element.querySelectorAll('.carousel-slide');
    this.totalSlides = this.slides.length;
    this.track = this.element.querySelector('.carousel-images');
    this.indicators = this.element.querySelectorAll('.carousel-indicator');
  }

  move(direction) {
    this.currentSlide += direction;

    if (this.currentSlide < 0) {
      this.currentSlide = this.totalSlides - 1;
    } else if (this.currentSlide >= this.totalSlides) {
      this.currentSlide = 0;
    }

    this.update();
  }

  goToSlide(index) {
    this.currentSlide = index;
    this.update();
  }

  update() {
    this.track.style.transform = `translateX(-${this.currentSlide * 100}%)`;

    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentSlide);
    });
  }
}

// Store globally
const carousels = {};

function initCarousels() {
  document.querySelectorAll('.image-carousel').forEach(element => {
    carousels[element.id] = new Carousel(element.id);
  });
}

document.addEventListener('DOMContentLoaded', initCarousels);

// GLOBAL FUNCTIONS to match your HTML
function move(id, direction) {
  carousels[id].move(direction);
}

function goToSlide(id, index) {
  carousels[id].goToSlide(index);
}
