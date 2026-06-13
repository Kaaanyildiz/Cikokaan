/* ═══════════════════════════════════════════════
   ÇIKOKAAN — Master Controller v3
   Premium: proxy video scrub + word-split text + 
   letterbox bars + effects integration
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  // ═══════════════════════════════════════════
  // REFERENCES
  // ═══════════════════════════════════════════
  const $ = (sel) => document.querySelector(sel);
  const videoElements = {
    v12:   $('#l-vid12 video'),
    v23:   $('#l-vid23 video'),
    v34:   $('#l-vid34 video'),
    v45:   $('#l-vid45 video'),
    v1011: $('#l-vid1011 video'),
    v1112: $('#l-vid1112 video'),
    v1213: $('#l-vid1213 video'),
  };

  // Letterbox bar references
  const letterboxTop = $('#letterbox-top');
  const letterboxBottom = $('#letterbox-bottom');

  // ═══════════════════════════════════════════
  // VIDEO SCRUB HELPER (Proxy object pattern)
  // ═══════════════════════════════════════════
  function scrubVideo(tl, videoEl, startPos, duration) {
    if (!videoEl) return;
    const proxy = { time: 0 };
    const videoDur = videoEl.duration || 8;

    tl.fromTo(proxy,
      { time: 0 },
      {
        time: videoDur,
        ease: 'none',
        duration: duration,
        onUpdate: function () {
          if (videoEl.readyState >= 2) {
            const target = Math.min(proxy.time, videoDur - 0.01);
            if (Math.abs(videoEl.currentTime - target) > 0.02) {
              videoEl.currentTime = target;
            }
          }
        }
      },
      startPos
    );
  }

  // ═══════════════════════════════════════════
  // LETTERBOX HELPER — Sinematik barlar
  // Video geçişlerinde barlar açılır,
  // görsel sahnelerde kapanır
  // ═══════════════════════════════════════════
  function letterboxIn() { /* devre dışı */ }
  function letterboxOut() { /* devre dışı */ }

  // ═══════════════════════════════════════════
  // TEXT ANIMATION HELPERS
  // Kelime kelime reveal + blur geçişi
  // ═══════════════════════════════════════════
  function textReveal(tl, textId, enterPos, exitPos) {
    const container = $(textId);
    if (!container) return;

    const words = container.querySelectorAll('.word');
    const accent = container.querySelector('.scene-text__accent');

    if (words.length === 0) {
      // Fallback: eski basit animasyon
      tl.fromTo(textId, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 1 }, enterPos);
      tl.to(textId, { autoAlpha: 0, duration: 0.8 }, exitPos);
      return;
    }

    // Container'ı görünür yap
    tl.to(textId, { autoAlpha: 1, duration: 0.01 }, enterPos);

    // Kelime kelime giriş — blur + y offset + opacity
    tl.fromTo(words,
      { autoAlpha: 0, y: 30, filter: 'blur(6px)', scale: 0.95 },
      {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        scale: 1,
        duration: 0.5,
        stagger: 0.06,
        ease: 'power3.out'
      },
      enterPos
    );

    // Altın accent çizgi animasyonu
    if (accent) {
      const accentDelay = enterPos + 0.3 + (words.length * 0.06);
      tl.to(accent, { width: '60px', duration: 0.6, ease: 'power2.out' }, accentDelay);
    }

    // Kelime kelime çıkış
    const accentExitPos = exitPos - 0.1;
    if (accent) {
      tl.to(accent, { width: '0px', duration: 0.3, ease: 'power2.in' }, accentExitPos);
    }
    tl.to(words,
      {
        autoAlpha: 0,
        y: -20,
        filter: 'blur(4px)',
        duration: 0.35,
        stagger: 0.03,
        ease: 'power2.in'
      },
      exitPos
    );
    tl.to(textId, { autoAlpha: 0, duration: 0.01 }, exitPos + 0.35 + (words.length * 0.03));
  }

  // ═══════════════════════════════════════════
  // PRELOADER
  // ═══════════════════════════════════════════
  const preloaderEl = $('#preloader');
  const barEl = $('#preloaderBar');
  const pctEl = $('#preloaderPercent');

  function setProgress(pct) {
    if (barEl) barEl.style.width = pct + '%';
    if (pctEl) pctEl.textContent = Math.round(pct) + '%';
  }

  function hidePreloader() {
    if (preloaderEl) preloaderEl.classList.add('is-hidden');
    setTimeout(initExperience, 800);
  }

  function waitForVideos() {
    const videoEls = Object.values(videoElements).filter(Boolean);
    let loaded = 0;
    const total = videoEls.length + 2;

    function tick() {
      loaded++;
      setProgress((loaded / total) * 100);
      if (loaded >= total) {
        setTimeout(hidePreloader, 400);
      }
    }

    ['çikokaanimage/image1.jpg', 'çikokaanimage/image2.jpg'].forEach(src => {
      const img = new Image();
      img.onload = tick;
      img.onerror = tick;
      img.src = src;
    });

    videoEls.forEach(v => {
      if (!v) { tick(); return; }
      if (v.readyState >= 3) { tick(); return; }
      v.addEventListener('canplaythrough', function handler() {
        v.removeEventListener('canplaythrough', handler);
        tick();
      });
      v.addEventListener('error', function handler() {
        v.removeEventListener('error', handler);
        tick();
      });
      setTimeout(() => {
        if (v.readyState < 1) tick();
      }, 15000);
    });
  }

  // ═══════════════════════════════════════════
  // ANA DENEYİM
  // ═══════════════════════════════════════════
  function initExperience() {

    // 0. Premium Efektleri Başlat
    if (window.CikokaanEffects) {
      window.CikokaanEffects.init();
    }

    // 1. Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // 2. Tüm videoları hazırla
    Object.values(videoElements).forEach(v => {
      if (!v) return;
      v.pause();
      v.currentTime = 0;
      v.preload = 'auto';
    });

    // 3. MASTER TIMELINE
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#scroll-wrapper',
        start: 'top top',
        end: 'bottom bottom',
        pin: '#viewport',
        scrub: 1,
        anticipatePin: 1,
      }
    });

    let t = 0;

    // ─────────────────────────────────
    // SAHNE 1: image1 — Fabrika uzaktan
    // ─────────────────────────────────
    gsap.set('#scroll-indicator', { autoAlpha: 1 });

    tl.fromTo('#l-img1 img', { scale: 1.08 }, { scale: 1, ease: 'none', duration: 4 }, t);

    // Gelişmiş metin animasyonu
    textReveal(tl, '#text-1', t + 0.3, t + 2.8);

    tl.to('#scroll-indicator', { autoAlpha: 0, duration: 1 }, t + 1.5);
    t += 4;

    // ─────────────────────────────────
    // VİDEO 1→2: Fabrikaya yaklaşma
    // ─────────────────────────────────
    letterboxIn(tl, t);
    tl.to('#l-vid12', { autoAlpha: 1, duration: 0.3 }, t);
    scrubVideo(tl, videoElements.v12, t, 7);
    tl.to('#l-img1', { autoAlpha: 0, duration: 0.5 }, t + 0.3);
    t += 7;
    tl.to('#l-img2', { autoAlpha: 1, duration: 0.5 }, t - 0.5);
    tl.to('#l-vid12', { autoAlpha: 0, duration: 0.3 }, t);
    letterboxOut(tl, t - 0.3);

    // ─────────────────────────────────
    // SAHNE 2: image2 — Fabrika yakın plan
    // ─────────────────────────────────
    tl.fromTo('#l-img2 img', { scale: 1 }, { scale: 1.08, x: 15, ease: 'none', duration: 3 }, t);
    t += 3;

    // ─────────────────────────────────
    // VİDEO 2→3: Kapıya gelme
    // ─────────────────────────────────
    letterboxIn(tl, t);
    tl.to('#l-vid23', { autoAlpha: 1, duration: 0.3 }, t);
    scrubVideo(tl, videoElements.v23, t, 7);
    tl.to('#l-img2', { autoAlpha: 0, duration: 0.5 }, t + 0.3);
    t += 7;
    tl.to('#l-img3', { autoAlpha: 1, duration: 0.5 }, t - 0.5);
    tl.to('#l-vid23', { autoAlpha: 0, duration: 0.3 }, t);
    letterboxOut(tl, t - 0.3);

    // ─────────────────────────────────
    // SAHNE 3: image3 — Açık kapı
    // ─────────────────────────────────
    tl.fromTo('#l-img3 img', { scale: 1 }, { scale: 1.1, ease: 'none', duration: 3 }, t);
    textReveal(tl, '#text-5', t + 0.4, t + 2.2);
    t += 3;

    // ─────────────────────────────────
    // VİDEO 3→4: İçeri giriş (buğulu)
    // ─────────────────────────────────
    letterboxIn(tl, t);
    tl.to('#l-vid34', { autoAlpha: 1, duration: 0.3 }, t);
    scrubVideo(tl, videoElements.v34, t, 7);
    tl.to('#l-img3', { autoAlpha: 0, duration: 0.5 }, t + 0.3);
    t += 7;
    tl.fromTo('#l-img4 img', { filter: 'blur(15px)' }, { filter: 'blur(0px)', duration: 1.5 }, t - 1.5);
    tl.to('#l-img4', { autoAlpha: 1, duration: 1 }, t - 1.5);
    tl.to('#l-vid34', { autoAlpha: 0, duration: 0.5 }, t - 0.3);
    letterboxOut(tl, t - 0.5);

    // ─────────────────────────────────
    // SAHNE 4: image4 — Fabrika içi, 3 çocuk
    // ─────────────────────────────────
    tl.fromTo('#l-img4 img', { scale: 1.1 }, { scale: 1, ease: 'none', duration: 3 }, t);
    textReveal(tl, '#text-7', t + 0.4, t + 2.2);
    t += 3;

    // ─────────────────────────────────
    // VİDEO 4→5: Çocuk 1'e yakınlaşma
    // ─────────────────────────────────
    letterboxIn(tl, t);
    tl.to('#l-vid45', { autoAlpha: 1, duration: 0.3 }, t);
    scrubVideo(tl, videoElements.v45, t, 7);
    tl.to('#l-img4', { autoAlpha: 0, duration: 0.5 }, t + 0.3);
    t += 7;
    tl.to('#l-img5', { autoAlpha: 1, duration: 0.5 }, t - 0.5);
    tl.to('#l-vid45', { autoAlpha: 0, duration: 0.3 }, t);
    letterboxOut(tl, t - 0.3);

    // ─────────────────────────────────
    // SAHNE 5: image5 — Çocuk 1 sütlü çikolata
    // ─────────────────────────────────
    tl.fromTo('#l-img5 img', { scale: 1 }, { scale: 1.05, ease: 'none', duration: 3 }, t);
    tl.fromTo('#info-milk', { autoAlpha: 0, y: 20, scale: 0.95 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }, t + 0.3);
    tl.to('#info-milk', { autoAlpha: 0, y: -10, duration: 0.6, ease: 'power2.in' }, t + 2.2);
    t += 3;

    // ─────────────────────────────────
    // CROSSFADE: image5 → image6
    // ─────────────────────────────────
    tl.to('#l-img6', { autoAlpha: 1, duration: 1.5 }, t);
    tl.to('#l-img5', { autoAlpha: 0, duration: 1.5 }, t + 0.2);
    t += 2;

    // ─────────────────────────────────
    // CROSSFADE: image6 → image7 + info card
    // ─────────────────────────────────
    tl.to('#l-img7', { autoAlpha: 1, x: 0, duration: 1.5 }, t);
    tl.to('#l-img6', { autoAlpha: 0, x: -30, duration: 1.5 }, t + 0.2);
    t += 2;
    tl.fromTo('#info-dark', { autoAlpha: 0, y: 20, scale: 0.95 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }, t);
    tl.to('#info-dark', { autoAlpha: 0, y: -10, duration: 0.6, ease: 'power2.in' }, t + 1.5);
    t += 2;

    // ─────────────────────────────────
    // CROSSFADE: image7 → image8 (punch)
    // ─────────────────────────────────
    tl.fromTo('#l-img8', { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1.03, duration: 1.2 }, t);
    tl.to('#l-img7', { autoAlpha: 0, duration: 1 }, t + 0.2);
    tl.to('#l-img8', { scale: 1, duration: 1 }, t + 1.2);
    t += 2;

    // ─────────────────────────────────
    // CROSSFADE: image8 → image9 (krem ışık patlaması)
    // ─────────────────────────────────
    tl.to('#cream-flash', { autoAlpha: 0.45, duration: 0.8 }, t);
    tl.to('#l-img9', { autoAlpha: 1, duration: 1 }, t + 0.5);
    tl.to('#l-img8', { autoAlpha: 0, duration: 1 }, t + 0.6);
    tl.to('#cream-flash', { autoAlpha: 0, duration: 1 }, t + 1);
    t += 2;
    tl.fromTo('#info-white', { autoAlpha: 0, y: 20, scale: 0.95 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }, t);
    tl.to('#info-white', { autoAlpha: 0, y: -10, duration: 0.6, ease: 'power2.in' }, t + 1.5);
    t += 2;

    // ─────────────────────────────────
    // CROSSFADE: image9 → image10
    // ─────────────────────────────────
    tl.to('#l-img10', { autoAlpha: 1, duration: 1.5 }, t);
    tl.to('#l-img9', { autoAlpha: 0, duration: 1.5 }, t + 0.2);
    t += 2;

    // ─────────────────────────────────
    // VİDEO 10→11: Kızdan geriye çekilme
    // ─────────────────────────────────
    letterboxIn(tl, t);
    tl.to('#l-vid1011', { autoAlpha: 1, duration: 0.3 }, t);
    scrubVideo(tl, videoElements.v1011, t, 7);
    tl.to('#l-img10', { autoAlpha: 0, duration: 0.5 }, t + 0.3);
    t += 7;
    tl.to('#l-img11', { autoAlpha: 1, duration: 0.8 }, t - 1);
    tl.to('#l-vid1011', { autoAlpha: 0, duration: 0.3 }, t);
    letterboxOut(tl, t - 0.3);

    // ─────────────────────────────────
    // SAHNE 11: image11 — Grup portre
    // ─────────────────────────────────
    tl.fromTo('#l-img11 img', { scale: 1.08 }, { scale: 1, ease: 'none', duration: 3 }, t);
    textReveal(tl, '#text-16', t + 0.4, t + 2.2);
    t += 3;

    // ─────────────────────────────────
    // VİDEO 11→12: Sihirli dönüşüm
    // ─────────────────────────────────
    letterboxIn(tl, t);
    tl.to('#l-vid1112', { autoAlpha: 1, duration: 0.3 }, t);
    scrubVideo(tl, videoElements.v1112, t, 7);
    tl.to('#l-img11', { autoAlpha: 0, duration: 0.5 }, t + 0.3);
    t += 7;
    tl.to('#l-vid1112', { autoAlpha: 0, duration: 0.3 }, t);

    // ─────────────────────────────────
    // VİDEO 12→13: Sihir → Ürün vitrini
    // ─────────────────────────────────
    tl.to('#l-vid1213', { autoAlpha: 1, duration: 0.3 }, t);
    scrubVideo(tl, videoElements.v1213, t, 7);
    t += 7;
    tl.to('#l-img13', { autoAlpha: 1, duration: 0.8 }, t - 1);
    tl.to('#l-vid1213', { autoAlpha: 0, duration: 0.3 }, t);
    letterboxOut(tl, t - 0.5);

    // ─────────────────────────────────
    // SAHNE 13: image13 — Ürün vitrini + kartlar
    // ─────────────────────────────────
    tl.to('#products-overlay', { autoAlpha: 1, duration: 0.5 }, t + 0.5);
    tl.fromTo('.product-card', { autoAlpha: 0, y: 40, scale: 0.9 }, {
      autoAlpha: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.2)'
    }, t + 0.8);
    tl.to('#product-info-panel', { autoAlpha: 1, y: 0, duration: 0.6 }, t + 1.8);
    t += 5;
    tl.to('#products-overlay', { autoAlpha: 0, duration: 0.8 }, t);
    t += 1;

    // ─────────────────────────────────
    // SAHNE 14: image14 — Final / kapanış
    // ─────────────────────────────────
    tl.to('#l-img14', { autoAlpha: 1, duration: 1.5 }, t);
    tl.to('#l-img13', { autoAlpha: 0, duration: 1.5 }, t + 0.3);
    t += 2;
    tl.to('#footer', { autoAlpha: 1, y: 0, duration: 1 }, t);
    t += 3;

    // 4. ScrollTrigger refresh
    ScrollTrigger.refresh();

    // 5. Ürün kartı etkileşimi
    initProductCards();

    console.log('[Çikokaan] Experience initialized. Total timeline duration:', t);
  }

  // ═══════════════════════════════════════════
  // ÜRÜN KARTI ETKİLEŞİMİ
  // ═══════════════════════════════════════════
  const ProductData = {
    milk: { name: 'Sütlü Klasik', desc: 'El yapımı, tek köken kakao çekirdeklerinden üretilmiş sütlü çikolata. Her bir parça, ustanın tutkusuyla şekillendirilmiştir.' },
    white: { name: 'Beyaz İnci', desc: 'Fildişi renginde, kremamsı dokusuyla damağınızda eriyen beyaz çikolata. Doğal vanilya ve kakao yağının mükemmel uyumu.' },
    dark: { name: 'Bitter Asil', desc: 'Yoğun kakao aroması, zarif acılığıyla sofistike bir deneyim. %72 kakao, tek köken Ekvador çekirdekleri.' },
  };

  function initProductCards() {
    const cards = document.querySelectorAll('.product-card');
    const panelTitle = $('#panel-title');
    const panelDesc = $('#panel-desc');

    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        const key = card.dataset.product;
        if (!ProductData[key]) return;
        cards.forEach(c => c.classList.remove('is-active'));
        card.classList.add('is-active');
        if (panelTitle) panelTitle.textContent = ProductData[key].name;
        if (panelDesc) panelDesc.textContent = ProductData[key].desc;
      });
    });
  }

  // ═══════════════════════════════════════════
  // BAŞLAT
  // ═══════════════════════════════════════════
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForVideos);
  } else {
    waitForVideos();
  }

})();
