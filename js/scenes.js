/* ═══════════════════════════════════════════════
   ÇIKOKAAN — Scene ScrollTrigger Definitions
   20 segment'in tamamı
   ═══════════════════════════════════════════════ */

function initScenes() {
  gsap.registerPlugin(ScrollTrigger);

  const productCards = new ProductCards();

  // ═══════════════════════════════════════════
  // SEGMENT 1 — Fabrika Uzaktan (image1)
  // ═══════════════════════════════════════════
  const tl1 = gsap.timeline({
    scrollTrigger: {
      trigger: '#segment-1',
      start: 'top top',
      end: 'bottom bottom',
      pin: '#pin-1',
      scrub: 1
    }
  });

  tl1.fromTo('#scene-img1 img', { scale: 1.05 }, { scale: 1, ease: 'none' }, 0);
  tl1.fromTo('#text-1', { opacity: 0, y: 20 }, { opacity: 1, y: 0, ease: 'power2.out' }, 0.05);
  tl1.to('#text-1', { opacity: 0, ease: 'power2.in' }, 0.6);
  tl1.fromTo('#scroll-indicator', { opacity: 0 }, { opacity: 1, ease: 'power2.out' }, 0.05);
  tl1.to('#scroll-indicator', { opacity: 0, ease: 'power2.in' }, 0.3);


  // ═══════════════════════════════════════════
  // SEGMENT 2 — Video: Fabrikaya Yaklaşma
  // ═══════════════════════════════════════════
  new VideoScrubber('video-1-2', 'segment-2', 'pin-2');


  // ═══════════════════════════════════════════
  // SEGMENT 3 — Fabrika Yakın Plan (image2)
  // ═══════════════════════════════════════════
  const tl3 = gsap.timeline({
    scrollTrigger: {
      trigger: '#segment-3',
      start: 'top top',
      end: 'bottom bottom',
      pin: '#pin-3',
      scrub: 1
    }
  });

  tl3.fromTo('#scene-img2 img', { scale: 1 }, { scale: 1.08, ease: 'none' }, 0);
  tl3.fromTo('#scene-img2 img', { x: 0 }, { x: 20, ease: 'none' }, 0);
  tl3.fromTo('#gold-overlay-2', { opacity: 0 }, { opacity: 0.2, ease: 'none' }, 0.3);


  // ═══════════════════════════════════════════
  // SEGMENT 4 — Video: Kapıya Gelme
  // ═══════════════════════════════════════════
  new VideoScrubber('video-2-3', 'segment-4', 'pin-4');


  // ═══════════════════════════════════════════
  // SEGMENT 5 — Açık Kapı (image3)
  // ═══════════════════════════════════════════
  const tl5 = gsap.timeline({
    scrollTrigger: {
      trigger: '#segment-5',
      start: 'top top',
      end: 'bottom bottom',
      pin: '#pin-5',
      scrub: 1
    }
  });

  tl5.fromTo('#scene-img3 img', { scale: 1 }, { scale: 1.1, ease: 'none' }, 0);
  tl5.fromTo('#gold-overlay-3', { opacity: 0 }, { opacity: 0.25, ease: 'none' }, 0);
  tl5.fromTo('#text-5', { opacity: 0, y: 20 }, { opacity: 1, y: 0, ease: 'power2.out' }, 0.1);
  tl5.to('#text-5', { opacity: 0, ease: 'power2.in' }, 0.7);


  // ═══════════════════════════════════════════
  // SEGMENT 6 — Video: İçeri Giriş (buğulu geçiş)
  // ═══════════════════════════════════════════
  new VideoScrubber('video-3-4', 'segment-6', 'pin-6', {
    revealImage: 'scene-img4-reveal'
  });


  // ═══════════════════════════════════════════
  // SEGMENT 7 — Fabrika İçi Panorama (image4)
  // ═══════════════════════════════════════════
  const tl7 = gsap.timeline({
    scrollTrigger: {
      trigger: '#segment-7',
      start: 'top top',
      end: 'bottom bottom',
      pin: '#pin-7',
      scrub: 1
    }
  });

  tl7.fromTo('#scene-img4 img', { scale: 1.15 }, { scale: 1, ease: 'none' }, 0);
  tl7.fromTo('#text-7', { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: 'power2.out' }, 0.1);
  tl7.to('#text-7', { opacity: 0, ease: 'power2.in' }, 0.7);


  // ═══════════════════════════════════════════
  // SEGMENT 8 — Video: Çocuk 1'e Yakınlaşma
  // ═══════════════════════════════════════════
  new VideoScrubber('video-4-5', 'segment-8', 'pin-8');


  // ═══════════════════════════════════════════
  // SEGMENT 9 — Çocuk 1: Sütlü Çikolata (image5)
  // ═══════════════════════════════════════════
  const tl9 = gsap.timeline({
    scrollTrigger: {
      trigger: '#segment-9',
      start: 'top top',
      end: 'bottom bottom',
      pin: '#pin-9',
      scrub: 1
    }
  });

  tl9.fromTo('#scene-img5 img', { scale: 1 }, { scale: 1.05, ease: 'none' }, 0);
  tl9.fromTo('#info-card-milk', { opacity: 0, y: 20 }, { opacity: 1, y: 0, ease: 'power2.out' }, 0.1);
  tl9.to('#info-card-milk', { opacity: 0, y: -10, ease: 'power2.in' }, 0.7);


  // ═══════════════════════════════════════════
  // SEGMENT 10 — CSS Crossfade (image5→image6)
  // ═══════════════════════════════════════════
  const tl10 = gsap.timeline({
    scrollTrigger: {
      trigger: '#segment-10',
      start: 'top top',
      end: 'bottom bottom',
      pin: '#pin-10',
      scrub: 1
    }
  });

  tl10.to('#scene-img5b', { opacity: 0, ease: 'none' }, 0);
  tl10.to('#scene-img6', { opacity: 1, ease: 'none' }, 0);
  tl10.fromTo('#scene-img6 img', { scale: 1.05 }, { scale: 1.08, ease: 'none' }, 0);


  // ═══════════════════════════════════════════
  // SEGMENT 11 — CSS Crossfade + Pan (image6→image7)
  // ═══════════════════════════════════════════
  const tl11 = gsap.timeline({
    scrollTrigger: {
      trigger: '#segment-11',
      start: 'top top',
      end: 'bottom bottom',
      pin: '#pin-11',
      scrub: 1
    }
  });

  // Crossfade ile translateX pan
  tl11.to('#scene-img6b', { opacity: 0, x: -50, ease: 'power1.inOut' }, 0);
  tl11.fromTo('#scene-img7', { opacity: 0, x: 50 }, { opacity: 1, x: 0, ease: 'power1.inOut' }, 0);
  // Bilgi kartı
  tl11.fromTo('#info-card-dark', { opacity: 0, y: 20 }, { opacity: 1, y: 0, ease: 'power2.out' }, 0.5);
  tl11.to('#info-card-dark', { opacity: 0, y: -10, ease: 'power2.in' }, 0.85);


  // ═══════════════════════════════════════════
  // SEGMENT 12 — CSS Crossfade + Punch (image7→image8)
  // ═══════════════════════════════════════════
  const tl12 = gsap.timeline({
    scrollTrigger: {
      trigger: '#segment-12',
      start: 'top top',
      end: 'bottom bottom',
      pin: '#pin-12',
      scrub: 1
    }
  });

  tl12.to('#scene-img7b', { opacity: 0, ease: 'none' }, 0);
  tl12.fromTo('#scene-img8', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1.05, ease: 'power2.out' }, 0);
  tl12.to('#scene-img8 img', { scale: 1, ease: 'power1.inOut' }, 0.5);


  // ═══════════════════════════════════════════
  // SEGMENT 13 — CSS Crossfade + Işık (image8→image9)
  // ═══════════════════════════════════════════
  const tl13 = gsap.timeline({
    scrollTrigger: {
      trigger: '#segment-13',
      start: 'top top',
      end: 'bottom bottom',
      pin: '#pin-13',
      scrub: 1
    }
  });

  // Krem ışık patlaması
  tl13.to('#cream-flash', { opacity: 0.5, ease: 'power2.in' }, 0);
  tl13.to('#scene-img8b', { opacity: 0, ease: 'none' }, 0.15);
  tl13.to('#scene-img9', { opacity: 1, ease: 'none' }, 0.15);
  tl13.to('#cream-flash', { opacity: 0, ease: 'power2.out' }, 0.35);
  // Bilgi kartı
  tl13.fromTo('#info-card-white', { opacity: 0, y: 20 }, { opacity: 1, y: 0, ease: 'power2.out' }, 0.55);
  tl13.to('#info-card-white', { opacity: 0, y: -10, ease: 'power2.in' }, 0.85);


  // ═══════════════════════════════════════════
  // SEGMENT 14 — CSS Crossfade (image9→image10)
  // ═══════════════════════════════════════════
  const tl14 = gsap.timeline({
    scrollTrigger: {
      trigger: '#segment-14',
      start: 'top top',
      end: 'bottom bottom',
      pin: '#pin-14',
      scrub: 1
    }
  });

  tl14.to('#scene-img9b', { opacity: 0, ease: 'none' }, 0);
  tl14.to('#scene-img10', { opacity: 1, ease: 'none' }, 0);
  tl14.fromTo('#scene-img10 img', { scale: 1 }, { scale: 1.05, ease: 'none' }, 0);


  // ═══════════════════════════════════════════
  // SEGMENT 15 — Video: Kızdan Geriye Çekilme
  // ═══════════════════════════════════════════
  new VideoScrubber('video-10-11', 'segment-15', 'pin-15', {
    revealImage: 'scene-img11-reveal'
  });


  // ═══════════════════════════════════════════
  // SEGMENT 16 — Grup Portre (image11)
  // ═══════════════════════════════════════════
  const tl16 = gsap.timeline({
    scrollTrigger: {
      trigger: '#segment-16',
      start: 'top top',
      end: 'bottom bottom',
      pin: '#pin-16',
      scrub: 1
    }
  });

  tl16.fromTo('#scene-img11 img', { scale: 1.1 }, { scale: 1, ease: 'none' }, 0);
  tl16.fromTo('#text-16', { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: 'power2.out' }, 0.1);
  tl16.to('#text-16', { opacity: 0, ease: 'power2.in' }, 0.7);


  // ═══════════════════════════════════════════
  // SEGMENT 17 — Video: Sihirli Dönüşüm
  // ═══════════════════════════════════════════
  new VideoScrubber('video-11-12', 'segment-17', 'pin-17');


  // ═══════════════════════════════════════════
  // SEGMENT 18 — Video: Sihir → Ürün Vitrini
  // ═══════════════════════════════════════════
  new VideoScrubber('video-12-13', 'segment-18', 'pin-18', {
    revealImage: 'scene-img13-reveal'
  });


  // ═══════════════════════════════════════════
  // SEGMENT 19 — Ürün Vitrini (image13)
  // ═══════════════════════════════════════════
  const tl19 = gsap.timeline({
    scrollTrigger: {
      trigger: '#segment-19',
      start: 'top top',
      end: 'bottom bottom',
      pin: '#pin-19',
      scrub: false, // Bu sahne event-driven, scrub değil
      onEnter: () => {
        gsap.to('#products-overlay', { opacity: 1, duration: 0.5 });
        productCards.revealCards();
      },
      onLeaveBack: () => {
        productCards.hideCards();
        gsap.to('#products-overlay', { opacity: 0, duration: 0.3 });
      }
    }
  });


  // ═══════════════════════════════════════════
  // SEGMENT 20 — Final / Kapanış (image14)
  // ═══════════════════════════════════════════
  const tl20 = gsap.timeline({
    scrollTrigger: {
      trigger: '#segment-20',
      start: 'top top',
      end: 'bottom bottom',
      pin: '#pin-20',
      scrub: 1
    }
  });

  // image13 → image14 fade
  tl20.to('#scene-img13c', { opacity: 0, ease: 'none' }, 0);
  tl20.to('#scene-img14', { opacity: 1, ease: 'none' }, 0);
  // Footer reveal
  tl20.fromTo('#footer', { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: 'power2.out' }, 0.3);


  // ═══════════════════════════════════════════
  // PRELOAD STRATEJİSİ
  // Scroll konumuna göre sonraki videoları preload et
  // ═══════════════════════════════════════════
  const videoPreloadMap = [
    { trigger: '#segment-1', videoId: 'video-2-3' },
    { trigger: '#segment-3', videoId: 'video-3-4' },
    { trigger: '#segment-5', videoId: 'video-4-5' },
    { trigger: '#segment-12', videoId: 'video-10-11' },
    { trigger: '#segment-14', videoId: 'video-11-12' },
    { trigger: '#segment-16', videoId: 'video-12-13' },
  ];

  videoPreloadMap.forEach(({ trigger, videoId }) => {
    ScrollTrigger.create({
      trigger: trigger,
      start: 'top 80%',
      onEnter: () => {
        const vid = document.getElementById(videoId);
        if (vid && vid.preload !== 'auto') {
          vid.preload = 'auto';
        }
      },
      once: true
    });
  });
}

// Global erişim
window.initScenes = initScenes;
