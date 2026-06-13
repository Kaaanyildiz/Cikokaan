/* ═══════════════════════════════════════════════
   ÇIKOKAAN — Video Scrub Controller
   Scroll progress → video.currentTime senkronizasyonu
   ═══════════════════════════════════════════════ */

class VideoScrubber {
  constructor(videoId, segmentId, pinId, options = {}) {
    this.video = document.getElementById(videoId);
    this.segment = document.getElementById(segmentId);
    this.pin = document.getElementById(pinId);
    this.options = options;
    this.isReady = false;
    this.scrollTrigger = null;

    if (this.video && this.segment) {
      this.init();
    }
  }

  init() {
    // Video metadata yüklendiğinde
    this.video.addEventListener('loadedmetadata', () => {
      this.isReady = true;
      this.video.currentTime = 0;
      this.createScrollTrigger();
    });

    // Eğer video zaten yüklüyse
    if (this.video.readyState >= 2) {
      this.isReady = true;
      this.video.currentTime = 0;
      this.createScrollTrigger();
    }

    // Video'yu pause durumunda tut
    this.video.pause();
  }

  createScrollTrigger() {
    if (this.scrollTrigger) return;

    const config = {
      trigger: this.segment,
      start: 'top top',
      end: 'bottom bottom',
      pin: this.pin,
      scrub: 0.5,
      onUpdate: (self) => this.onScroll(self),
    };

    // Segment 6 ve 15 için özel geçiş (buğu→image reveal)
    if (this.options.revealImage) {
      config.onUpdate = (self) => this.onScrollWithReveal(self);
    }

    this.scrollTrigger = ScrollTrigger.create(config);
  }

  onScroll(self) {
    if (!this.isReady || !this.video.duration) return;

    const targetTime = self.progress * this.video.duration;
    
    // Seek sadece anlamlı fark varsa (performans)
    if (Math.abs(this.video.currentTime - targetTime) > 0.03) {
      this.video.currentTime = targetTime;
    }
  }

  onScrollWithReveal(self) {
    if (!this.isReady || !this.video.duration) return;

    const progress = self.progress;
    const targetTime = progress * this.video.duration;

    if (Math.abs(this.video.currentTime - targetTime) > 0.03) {
      this.video.currentTime = targetTime;
    }

    // Son %20'de image reveal geçişi
    const revealEl = document.getElementById(this.options.revealImage);
    const revealImg = revealEl ? revealEl.querySelector('img') : null;

    if (revealEl) {
      if (progress > 0.8) {
        const revealProgress = (progress - 0.8) / 0.2; // 0→1 (son %20)
        revealEl.style.opacity = revealProgress;
        
        // Video fade-out
        this.video.parentElement.style.opacity = 1 - (revealProgress * 0.8);

        // Blur azalması
        if (revealImg) {
          const blur = 20 * (1 - revealProgress);
          revealImg.style.filter = `blur(${blur}px)`;
        }
      } else {
        revealEl.style.opacity = 0;
        this.video.parentElement.style.opacity = 1;
        if (revealImg) {
          revealImg.style.filter = 'blur(20px)';
        }
      }
    }
  }

  // Preload tetikleme
  preload() {
    if (this.video) {
      this.video.preload = 'auto';
    }
  }

  destroy() {
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
    }
  }
}

// Global erişim için
window.VideoScrubber = VideoScrubber;
