/* ═══════════════════════════════════════════════
   ÇIKOKAAN — Premium Effects Engine
   Film grain, gold particles, mouse light, 
   text splitting, letterbox control
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  // ═══════════════════════════════════════════
  // 1. FILM GRAIN — Canvas-generated noise texture
  // ═══════════════════════════════════════════
  class FilmGrain {
    constructor() {
      this.el = document.getElementById('film-grain');
      if (!this.el) return;
      this.generateTexture();
    }

    generateTexture() {
      const size = 256;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      const imageData = ctx.createImageData(size, size);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i]     = v;     // R
        data[i + 1] = v;     // G
        data[i + 2] = v;     // B
        data[i + 3] = 255;   // A (full, opacity controlled via CSS)
      }

      ctx.putImageData(imageData, 0, 0);
      this.el.style.backgroundImage = `url(${canvas.toDataURL('image/png')})`;
    }
  }

  // ═══════════════════════════════════════════
  // 2. GOLD PARTICLES — Canvas-based floating particles
  // ═══════════════════════════════════════════
  class GoldParticles {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.particleCount = 45;
      this.mouse = { x: -1000, y: -1000 };
      this.isRunning = true;

      this.resize();
      this.createParticles();
      this.bindEvents();
      this.animate();
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    createParticles() {
      this.particles = [];
      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push(this.createParticle(true));
      }
    }

    createParticle(randomY = false) {
      return {
        x: Math.random() * this.canvas.width,
        y: randomY ? Math.random() * this.canvas.height : this.canvas.height + 10,
        size: Math.random() * 2 + 0.5,
        speedY: -(Math.random() * 0.25 + 0.08),
        speedX: (Math.random() - 0.5) * 0.15,
        opacity: Math.random() * 0.4 + 0.1,
        opacitySpeed: (Math.random() * 0.004 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
        // Gold color variations
        hue: 38 + Math.random() * 15,
        saturation: 55 + Math.random() * 35,
        lightness: 55 + Math.random() * 25,
        // Shimmer
        shimmerPhase: Math.random() * Math.PI * 2,
        shimmerSpeed: Math.random() * 0.02 + 0.005,
      };
    }

    bindEvents() {
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => this.resize(), 150);
      });

      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      });

      // Pause when tab is not visible
      document.addEventListener('visibilitychange', () => {
        this.isRunning = !document.hidden;
        if (this.isRunning) this.animate();
      });
    }

    animate() {
      if (!this.isRunning) return;

      const { ctx, canvas, particles } = this;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        // Update position
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.shimmerPhase) * 0.1;
        p.shimmerPhase += p.shimmerSpeed;

        // Mouse interaction — gentle repulsion
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 0.8;
          p.y += (dy / dist) * force * 0.8;
        }

        // Opacity pulsing
        p.opacity += p.opacitySpeed;
        if (p.opacity > 0.55) { p.opacity = 0.55; p.opacitySpeed *= -1; }
        if (p.opacity < 0.05) { p.opacity = 0.05; p.opacitySpeed *= -1; }

        // Reset if off screen
        if (p.y < -20 || p.x < -20 || p.x > canvas.width + 20) {
          this.particles[i] = this.createParticle(false);
          return;
        }

        // Draw particle core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${p.opacity})`;
        ctx.fill();

        // Draw glow halo
        const glowSize = p.size * 4;
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
        gradient.addColorStop(0, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${p.opacity * 0.2})`);
        gradient.addColorStop(1, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      requestAnimationFrame(() => this.animate());
    }
  }

  // ═══════════════════════════════════════════
  // 3. MOUSE LIGHT — Warm glow following cursor
  // ═══════════════════════════════════════════
  class MouseLight {
    constructor() {
      this.el = document.getElementById('mouse-light');
      if (!this.el) return;

      this.currentX = -500;
      this.currentY = -500;
      this.targetX = -500;
      this.targetY = -500;

      window.addEventListener('mousemove', (e) => {
        this.targetX = e.clientX;
        this.targetY = e.clientY;
        this.el.classList.add('is-visible');
      });

      window.addEventListener('mouseleave', () => {
        this.el.classList.remove('is-visible');
      });

      this.animate();
    }

    animate() {
      // Smooth follow with lerp
      this.currentX += (this.targetX - this.currentX) * 0.08;
      this.currentY += (this.targetY - this.currentY) * 0.08;

      this.el.style.left = this.currentX + 'px';
      this.el.style.top = this.currentY + 'px';

      requestAnimationFrame(() => this.animate());
    }
  }

  // ═══════════════════════════════════════════
  // 4. TEXT SPLITTING — Word-level for animations
  // ═══════════════════════════════════════════
  function wrapWords(selector) {
    const elements = document.querySelectorAll(selector);

    elements.forEach(el => {
      // Walk all text nodes, preserve existing HTML structure
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
      const textNodes = [];
      let node;
      while ((node = walker.nextNode())) {
        textNodes.push(node);
      }

      textNodes.forEach(textNode => {
        const parts = textNode.textContent.split(/(\s+)/);
        const fragment = document.createDocumentFragment();

        parts.forEach(part => {
          if (part.match(/\S/)) {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word';
            wordSpan.textContent = part;
            fragment.appendChild(wordSpan);
          } else if (part.length > 0) {
            fragment.appendChild(document.createTextNode(part));
          }
        });

        textNode.parentNode.replaceChild(fragment, textNode);
      });

      // Add accent line after the heading
      const accent = document.createElement('span');
      accent.className = 'scene-text__accent';
      el.appendChild(accent);
    });
  }

  // ═══════════════════════════════════════════
  // 5. SCROLL PROGRESS BAR
  // ═══════════════════════════════════════════
  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    ScrollTrigger.create({
      trigger: '#scroll-wrapper',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        bar.style.width = (self.progress * 100) + '%';
      }
    });
  }

  // ═══════════════════════════════════════════
  // EXPORT — Initialize all effects
  // ═══════════════════════════════════════════
  window.CikokaanEffects = {
    init() {
      // Film grain
      new FilmGrain();
      console.log('[Effects] Film grain initialized');

      // Gold particles
      new GoldParticles('particle-canvas');
      console.log('[Effects] Gold particles initialized');

      // Mouse light
      new MouseLight();
      console.log('[Effects] Mouse light initialized');

      // Split text into words for animation
      wrapWords('.scene-text__heading');
      console.log('[Effects] Text splitting complete');

      // Scroll progress bar
      initScrollProgress();
      console.log('[Effects] Scroll progress initialized');

      console.log('[Effects] All premium effects loaded ✨');
    }
  };

})();
