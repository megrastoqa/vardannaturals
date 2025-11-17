# Vardan Naturals - Ayurvedic Wellness Website

A beautiful, responsive website for Vardan Naturals - showcasing a holistic range of Ayurvedic wellness and beauty essentials crafted from pure, natural ingredients.

![Vardan Naturals](images/vardan-naturals-hero-banner.jpg)

## 🌿 About

Vardan Naturals is an e-commerce website featuring premium Ayurvedic products including pain relief solutions, hair care, skincare, artisan soaps, bath salts, essential oils, and herbal teas. The website emphasizes natural ingredients, traditional Ayurvedic wisdom, and modern wellness practices.

**Tagline:** *from nature, with care*

## ✨ Features

### Design & Aesthetics
- **Luxury Design**: Inspired by premium Ayurvedic brands with elegant typography and sophisticated color palette
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean layout with smooth animations and hover effects
- **Forest Essentials-inspired**: Natural, organic feel with premium aesthetics

### Key Functionality
- **Product Showcase**: 17+ product categories with detailed descriptions
- **Image Carousel**: Multi-variant products display with interactive image sliders
- **Dropdown Navigation**: Easy category navigation with smooth dropdown menus
- **Contact Integration**: Phone, WhatsApp, Instagram, and Google Reviews
- **Certification Badges**: GMP, ISO, Made in India certifications displayed
- **Mobile-First**: Fully optimized for mobile shopping experience

### Technical Features
- Pure HTML5, CSS3, and vanilla JavaScript
- No external frameworks or libraries required
- Lightweight and fast loading
- SEO-friendly structure
- Cross-browser compatible

## 📁 Project Structure
```
vardan-naturals/
│
├── index.html                 # Main HTML file
├── README.md                  # Project documentation
│
└── images/
    ├── vardan-naturals-logo.png
    ├── vardan-naturals-hero-banner.jpg
    │
    ├── icons/
    │   ├── icons8-whatsapp.svg
    │   ├── icons8-instagram.svg
    │   └── google-icon.svg
    │
    ├── products/
    │   ├── pain-relief/
    │   │   ├── mahanarayana-tailam.jpg
    │   │   ├── dashmool-tailam.jpg
    │   │   ├── abhyangam-tailam.jpg
    │   │   └── massage-potli.jpg
    │   │
    │   ├── hair-care/
    │   │   ├── keshamrit.jpeg
    │   │   └── anti-dandruff-hair-oil.png
    │   │
    │   ├── skin-care/
    │   │   ├── kumkumadi.png
    │   │   ├── cocoa-butter-moisturizer.png
    │   │   ├── rosemary-hydrosol.jpg
    │   │   ├── CharcoalFacewash.jpeg
    │   │   ├── Aloe-facewash.png
    │   │   └── aloe.jpg
    │   │
    │   ├── soaps/
    │   │   ├── shea-butter-soap.jpg
    │   │   ├── triphala-charcoal-soap.jpg
    │   │   ├── citrus-loofah-soap.jpg
    │   │   └── goat-milk-soap.jpg
    │   │
    │   ├── bath-salts/
    │   │   └── (placeholder images)
    │   │
    │   ├── essential-oils/
    │   │   ├── jasmine-essential-oil.jpg
    │   │   ├── lavender-essential-oil.jpg
    │   │   ├── lemongrass-essential-oil.jpg
    │   │   ├── green-apple-essential-oil.jpg
    │   │   └── citrus-essential-oil.jpg
    │   │
    │   ├── wellness/
    │   │   ├── belly-bliss-rollon.jpg
    │   │   ├── tranquil-rollon.jpg
    │   │   ├── crack-cream.jpeg
    │   │   ├── lip-balm-rose.jpg
    │   │   ├── lip-balm-green-apple.jpg
    │   │   ├── citrus-sachet.jpeg
    │   │   ├── kansa-wand.jpg
    │   │   └── double-sided-kansa-wand.jpg
    │   │
    │   ├── gut-care/
    │   │   └── gutcare.jpeg
    │   │
    │   └── tea/
    │       └── (placeholder images)
    │
    └── google-review-qr.png
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A text editor (VS Code, Sublime Text, Atom, etc.)
- Basic knowledge of HTML, CSS, and JavaScript

### Installation

1. **Clone or Download the Repository**
```bash
   git clone https://github.com/yourusername/vardan-naturals.git
   cd vardan-naturals
```

2. **Set Up Images**
   - Create an `images/` folder in the project root
   - Add all product images according to the structure above
   - Ensure logo images are in place

3. **Update Contact Information**
   - Open `index.html`
   - Search for phone numbers and update:
   - Update WhatsApp links
   - Update Instagram handle

4. **Set Up Google Reviews**
   - Get your Google Business Review link
   - Generate a QR code: https://www.qr-code-generator.com/
   - Save QR code as `google-review-qr.png`
   - Replace `YOUR_GOOGLE_REVIEW_LINK_HERE` in the contact section

5. **Launch the Website**
   - Simply open `index.html` in your web browser
   - Or use a local server:
```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx serve
```

## 🎨 Customization

### Colors
The website uses a natural green color palette:
- Primary Green: `#2c5f2d`
- Secondary Green: `#4a7c59`
- Background: `#faf9f7`
- Text: `#3a3a3a`

To change colors, search and replace the hex codes in the `<style>` section.

### Fonts
Default font: `'Cormorant Garamond', 'Georgia', serif`

To change fonts:
1. Add Google Fonts link in `<head>`:
```html
   <link href="https://fonts.googleapis.com/css2?family=YourFont&display=swap" rel="stylesheet">
```
2. Update font-family in CSS

### Add New Products

1. Find the appropriate category section
2. Copy an existing product block
3. Update:
   - Product image path
   - Product name
   - Tagline
   - Description
   - Ingredients
   - Features
   - Price

Example:
```html
<div class="product-item">
    <div class="product-image">
        <img src="images/your-product.jpg" alt="Your Product">
    </div>
    <div class="product-details">
        <div class="product-name">Your Product Name</div>
        <div class="product-tagline">Your Tagline</div>
        <p class="product-description">Your description...</p>
        <!-- ... rest of the details -->
    </div>
</div>
```

### Add Image Carousel for Variants

For products with multiple variants (like lip balms):
```html
<div class="product-image">
    <div class="image-carousel" id="unique-carousel-id">
        <div class="carousel-images">
            <div class="carousel-slide">
                <img src="images/variant1.jpg" alt="Variant 1">
            </div>
            <div class="carousel-slide">
                <img src="images/variant2.jpg" alt="Variant 2">
            </div>
        </div>
        <button class="carousel-btn prev" onclick="moveCarousel('unique-carousel-id', -1)">‹</button>
        <button class="carousel-btn next" onclick="moveCarousel('unique-carousel-id', 1)">›</button>
        <div class="carousel-indicators">
            <button class="carousel-indicator active" onclick="goToSlide('unique-carousel-id', 0)"></button>
            <button class="carousel-indicator" onclick="goToSlide('unique-carousel-id', 1)"></button>
        </div>
    </div>
</div>
```

## 📱 Product Categories

1. **Pain Relief Solutions** - Ayurvedic massage oils and potli
2. **Hair Care Excellence** - Hair oils for nourishment and dandruff control
3. **Radiant Skin Care** - Face oils, moisturizers, face washes, gels
4. **Artisan Soaps Collection** - Organic handmade soaps
5. **Luxurious Bath Salts** - Himalayan and Epsom salt blends
6. **Essential Oils Collection** - 100% pure essential oils
7. **Wellness Roll-Ons & Specialty Care** - Portable wellness solutions
8. **Herbal Gut Care** - Digestive support supplements
9. **Premium Herbal Tea Collection** - Caffeine-free herbal teas

## 💰 Pricing

Products range from ₹89 to ₹999
- Most products: ₹249 - ₹499
- Premium items (Kumkumadi Tailam, Kansa Wand): ₹699 - ₹999
- Special tools (Double Sided Kansa Wand): ₹999

## 🏆 Certifications

- ✅ GMP Certified (Good Manufacturing Practice)
- ✅ ISO Certified (International Standards)
- ✅ Made in India
- ✅ 100% Natural Ingredients

## 🛠️ Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📈 SEO Optimization

The website includes:
- Semantic HTML5 structure
- Meta descriptions
- Alt tags for all images
- Proper heading hierarchy
- Mobile-friendly design
- Fast loading times

## 🔧 Troubleshooting

### Images Not Loading
- Check file paths are correct
- Ensure images are in the `images/` folder
- Verify image file extensions match HTML references

### Dropdown Not Working
- Ensure JavaScript is enabled in browser
- Check browser console for errors
- Verify dropdown IDs match in HTML and JS

### Carousel Not Functioning
- Ensure each carousel has a unique ID
- Check that JavaScript is loaded after HTML
- Verify image paths are correct

### Mobile View Issues
- Clear browser cache
- Test on actual mobile devices
- Check viewport meta tag is present

## 📝 To-Do / Future Enhancements

- [ ] Add shopping cart functionality
- [ ] Integrate payment gateway
- [ ] Add customer testimonials section
- [ ] Implement product search feature
- [ ] Add product filtering by category
- [ ] Create admin panel for product management
- [ ] Add multilingual support (Hindi)
- [ ] Integrate WhatsApp Business API
- [ ] Add blog section for Ayurvedic tips
- [ ] Implement newsletter subscription

## 🤝 Contributing

If you'd like to contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is proprietary and confidential. All rights reserved by First Thought Technology.

## 👥 Credits

**Design & Development:** Megha Rastogi
**Brand:** Vardan Naturals
**Fonts:** Cormorant Garamond (Google Fonts)


---

**Vardan Naturals** - *from nature, with care* 🌿

*Crafted with ❤️ for holistic wellness*
