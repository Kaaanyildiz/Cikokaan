/* ═══════════════════════════════════════════════
   ÇIKOKAAN — Product Card Interactions
   ═══════════════════════════════════════════════ */

const ProductData = {
  milk: {
    name: 'Sütlü Klasik',
    subtitle: 'Artisan Cocoa Reserve',
    desc: 'El yapımı, tek köken kakao çekirdeklerinden üretilmiş sütlü çikolata. Her bir parça, ustanın tutkusuyla şekillendirilmiştir.',
    price: '₺189'
  },
  white: {
    name: 'Beyaz İnci',
    subtitle: 'Creamy White Reserve',
    desc: 'Fildişi renginde, kremamsı dokusuyla damağınızda eriyen beyaz çikolata. Doğal vanilya ve kakao yağının mükemmel uyumu.',
    price: '₺199'
  },
  dark: {
    name: 'Bitter Asil',
    subtitle: 'Dark Cocoa Reserve',
    desc: 'Yoğun kakao aroması, zarif acılığıyla sofistike bir deneyim. %72 kakao, tek köken Ekvador çekirdekleri.',
    price: '₺219'
  }
};

class ProductCards {
  constructor() {
    this.cards = document.querySelectorAll('.product-card');
    this.panel = document.getElementById('product-info-panel');
    this.panelTitle = document.getElementById('panel-title');
    this.panelDesc = document.getElementById('panel-desc');
    this.activeProduct = 'milk';

    this.bindEvents();
  }

  bindEvents() {
    this.cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        const productKey = card.dataset.product;
        this.setActive(productKey);
      });

      card.addEventListener('click', () => {
        const productKey = card.dataset.product;
        this.setActive(productKey);
      });
    });
  }

  setActive(productKey) {
    if (!ProductData[productKey]) return;

    this.activeProduct = productKey;
    const data = ProductData[productKey];

    // Kartları güncelle
    this.cards.forEach(card => {
      card.classList.toggle('is-active', card.dataset.product === productKey);
    });

    // Panel güncelle
    if (this.panelTitle) this.panelTitle.textContent = data.name;
    if (this.panelDesc) this.panelDesc.textContent = data.desc;

    // Panel görünür yap
    if (this.panel) this.panel.classList.add('is-visible');
  }

  // Animasyonlu reveal (ScrollTrigger'dan çağrılır)
  revealCards() {
    const overlay = document.getElementById('products-overlay');
    if (overlay) overlay.classList.add('is-active');

    gsap.to(this.cards, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
      onComplete: () => {
        // İlk kartı aktif yap
        this.setActive('milk');
      }
    });
  }

  // Gizle
  hideCards() {
    const overlay = document.getElementById('products-overlay');
    if (overlay) overlay.classList.remove('is-active');

    gsap.to(this.cards, {
      opacity: 0,
      y: 40,
      duration: 0.5,
      ease: 'power2.in'
    });

    if (this.panel) this.panel.classList.remove('is-visible');
  }
}

// Global erişim
window.ProductCards = ProductCards;
