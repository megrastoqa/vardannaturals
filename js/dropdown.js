// js/dropdown.js - Navigation Dropdown

class Dropdown {
  constructor(element) {
    this.dropdown = element;
    this.toggle = element.querySelector('.dropdown-toggle');
    this.init();
  }

  init() {
    this.toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.dropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!this.dropdown.contains(e.target)) {
        this.dropdown.classList.remove('open');
      }
    });

    // Close on link click
    this.dropdown.querySelectorAll('.dropdown-content a').forEach(link => {
      link.addEventListener('click', () => {
        this.dropdown.classList.remove('open');
      });
    });
  }
}

// Initialize dropdown
document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.querySelector('.dropdown');
  if (dropdown) new Dropdown(dropdown);
});
