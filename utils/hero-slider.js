// utils/hero-slider.js

const throttle = (callback, limit) => {
  let waiting = false;
  return function () {
    if (!waiting) {
      callback.apply(this, arguments);
      waiting = true;
      setTimeout(() => {
        waiting = false;
      }, limit);
    }
  };
};

const debounce = (func, wait, immediate) => {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

import imgLivingRoom from "../assets/Tagungsmappe/NewClub199imags/livingroom1.png";
import imgKitchen from "../assets/Tagungsmappe/NewClub199imags/thekitchen1.png";
import imgThinktank from "../assets/Tagungsmappe/NewClub199imags/thinktank1.png";
import imgStudio from "../assets/Tagungsmappe/NewClub199imags/thestudio1.png";
import img4og from "../assets/Tagungsmappe/NewClub199imags/4og&199entrancelogo.png";
import imgOffice from "../assets/Tagungsmappe/NewClub199imags/theoffice1.png";
import imgWorkshop from "../assets/Tagungsmappe/NewClub199imags/workshop31.png";
import imgAtelier from "../assets/Tagungsmappe/NewClub199imags/atelier2.png";
import img1og from "../assets/Tagungsmappe/NewClub199imags/1og1.png";

// Map local verified assets to the slider
const SLIDES = [
  { name: "4. OG", color: "#000000", image: img4og },
  { name: "The Office", color: "#000000", image: imgOffice },
  { name: "Thinktank", color: "#000000", image: imgThinktank },
  { name: "Workshop III", color: "#000000", image: imgWorkshop },
  { name: "Living Room", color: "#000000", image: imgLivingRoom },
  { name: "The Studio", color: "#000000", image: imgStudio },
  { name: "Atelier", color: "#000000", image: imgAtelier },
  { name: "The Kitchen", color: "#000000", image: imgKitchen },
  { name: "1. OG", color: "#000000", image: img1og }
];

const AUTOPLAY_DELAY = 4000;

class Slider {
  constructor() {
    this.current = 0;
    this.animating = false;
    this.total = SLIDES.length;
    this.el = document.querySelector(".club-hero");
    
    // Only initialize if the hero section exists on the page
    if (!this.el) return;

    this.titleEl = document.querySelector(".club-hero__title");
    this.titleWords = this.titleEl ? Array.from(this.titleEl.querySelectorAll(".club-hero__title-word")) : [];
    this.imagesEl = document.querySelector(".club-hero__images");
    this.slideEls = [];
    this.cursorVisible = false;
    this.autoPlayId = null;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    this.preload();
    this.setTitle(SLIDES[0].name);
    
    // We handle background via CSS transition or GSAP, let's keep GSAP for consistency with the reference
    if (window.gsap) {
      gsap.set(this.el, { backgroundColor: SLIDES[0].color });
      this.buildCarousel();
      
      if (!this.isTouchDevice) {
        this.buildCursor();
      }
      
      this.bind();
      this.startAutoPlay();
    } else {
      console.warn("GSAP is not loaded. Slider interactions will be disabled.");
    }
  }

  preload() {
    SLIDES.forEach((s) => {
      new Image().src = s.image;
    });
  }

  mod(n) {
    return ((n % this.total) + this.total) % this.total;
  }

  buildCursor() {
    this.cursorEl = document.createElement("div");
    this.cursorEl.className = "club-hero__cursor";
    this.cursorEl.textContent = "+";
    this.cursorEl.setAttribute("aria-hidden", "true");
    this.el.appendChild(this.cursorEl);
    gsap.set(this.cursorEl, { xPercent: -50, yPercent: -50, opacity: 0 });
    this.cursorMoveX = gsap.quickTo(this.cursorEl, "x", { duration: 0.5, ease: "power3" });
    this.cursorMoveY = gsap.quickTo(this.cursorEl, "y", { duration: 0.5, ease: "power3" });
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayId = setInterval(() => {
      if (!this.animating) this.go("next");
    }, AUTOPLAY_DELAY);
  }

  stopAutoPlay() {
    if (this.autoPlayId) {
      clearInterval(this.autoPlayId);
      this.autoPlayId = null;
    }
  }

  setTitle(text) {
    if (!this.titleWords || this.titleWords.length === 0) return;
    this.titleWords.forEach(word => {
        word.classList.remove("is-active", "is-exiting");
        if (word.textContent.trim() === text) {
            word.classList.add("is-active");
        }
    });
  }

  animateTitle(newText, direction) {
    if (!this.titleWords || this.titleWords.length === 0) return gsap.timeline();
    
    // Find current active word and new word
    const oldWord = this.titleWords.find(w => w.classList.contains("is-active"));
    const newWord = this.titleWords.find(w => w.textContent.trim() === newText);

    if (oldWord && oldWord !== newWord) {
      oldWord.classList.remove("is-active");
      oldWord.classList.add("is-exiting");
      
      // Clean up the exiting class after the CSS transition ends
      setTimeout(() => {
        oldWord.classList.remove("is-exiting");
      }, 800);
    }

    if (newWord) {
      newWord.classList.add("is-active");
    }

    // Return a dummy timeline since we're using CSS transitions
    // The master timeline in `go` expects a GSAP timeline back
    return gsap.timeline().to({}, { duration: this.reducedMotion ? 0.01 : 0.8 });
  }

  makeSlide(idx) {
    const div = document.createElement("div");
    div.className = "club-hero__slide";
    const img = document.createElement("img");
    img.src = SLIDES[idx].image;
    img.alt = SLIDES[idx].name;
    img.width = 600;
    img.height = 420;
    
    // Add performance attributes
    if (idx !== 0) img.setAttribute("loading", "lazy");
    
    div.appendChild(img);
    return div;
  }

  getSlideProps(step) {
    if (!this.imagesEl) return { x: 0, y: 0, rotation: 0, scale: 1, blur: 0, opacity: 1, zIndex: 1 };
    
    const h = this.imagesEl.offsetHeight;
    const absStep = Math.abs(step);
    const positions = [
      { x: -0.35, y: -0.95, rot: -30, s: 1.35, b: 16, o: 0 },
      { x: -0.18, y: -0.5, rot: -15, s: 1.15, b: 8, o: 0.55 },
      { x: 0, y: 0, rot: 0, s: 1, b: 0, o: 1 },
      { x: -0.06, y: 0.5, rot: 15, s: 0.75, b: 6, o: 0.55 },
      { x: -0.12, y: 0.95, rot: 30, s: 0.55, b: 14, o: 0 }
    ];
    const idx = Math.max(0, Math.min(4, step + 2));
    const p = positions[idx];

    return {
      x: p.x * h,
      y: p.y * h,
      rotation: p.rot,
      scale: p.s,
      blur: p.b,
      opacity: p.o,
      zIndex: absStep === 0 ? 3 : absStep === 1 ? 2 : 1
    };
  }

  positionSlide(slide, step) {
    const props = this.getSlideProps(step);
    gsap.set(slide, {
      xPercent: -50,
      yPercent: -50,
      x: props.x,
      y: props.y,
      rotation: props.rotation,
      scale: props.scale,
      opacity: props.opacity,
      filter: "blur(" + props.blur + "px)",
      zIndex: props.zIndex
    });
  }

  buildCarousel() {
    if (!this.imagesEl || this.imagesEl.offsetHeight === 0) return;
    this.imagesEl.innerHTML = "";
    this.slideEls = [];

    for (let step = -1; step <= 1; step++) {
      const idx = this.mod(this.current + step);
      const slide = this.makeSlide(idx);
      this.imagesEl.appendChild(slide);
      this.positionSlide(slide, step);
      this.slideEls.push({ el: slide, step: step });
    }
  }

  animateCarousel(direction) {
    if (!this.imagesEl || this.imagesEl.offsetHeight === 0) return gsap.timeline();

    const shift = direction === "next" ? -1 : 1;
    const enterStep = direction === "next" ? 2 : -2;
    const newIdx = direction === "next" ? this.mod(this.current + 2) : this.mod(this.current - 2);

    const newSlide = this.makeSlide(newIdx);
    this.imagesEl.appendChild(newSlide);
    this.positionSlide(newSlide, enterStep);
    this.slideEls.push({ el: newSlide, step: enterStep });

    this.slideEls.forEach((s) => {
      s.step += shift;
    });

    const duration = this.reducedMotion ? 0.01 : 1.2;

    const tl = gsap.timeline({
      onComplete: () => {
        this.slideEls = this.slideEls.filter((s) => {
          if (Math.abs(s.step) >= 2) {
            s.el.remove();
            return false;
          }
          return true;
        });
      }
    });

    this.slideEls.forEach((s) => {
      const props = this.getSlideProps(s.step);
      s.el.style.zIndex = props.zIndex;

      tl.to(s.el, {
        x: props.x,
        y: props.y,
        rotation: props.rotation,
        scale: props.scale,
        opacity: props.opacity,
        filter: "blur(" + props.blur + "px)",
        duration: duration,
        ease: "power3.inOut"
      }, 0);
    });

    return tl;
  }

  go(direction) {
    if (this.animating) return;
    this.animating = true;
    this.startAutoPlay();

    const nextIdx = direction === "next" ? this.mod(this.current + 1) : this.mod(this.current - 1);

    const master = gsap.timeline({
      onComplete: () => {
        this.current = nextIdx;
        this.animating = false;
      }
    });

    master.to(this.el, {
      backgroundColor: SLIDES[nextIdx].color,
      duration: this.reducedMotion ? 0.01 : 1.2,
      ease: "power2.inOut"
    }, 0);

    master.add(this.animateTitle(SLIDES[nextIdx].name, direction), 0);
    master.add(this.animateCarousel(direction), 0);
  }

  bind() {
    // Note: We only bind wheel and touch inside the hero section to avoid global scroll locking
    const onWheel = throttle((e) => {
      if (this.animating) return;
      // Prevent default scrolling only when hovering over images to let the user scroll past the hero
      if (e.target.closest('.club-hero__images-wrapper')) {
        e.preventDefault();
        this.go(e.deltaY > 0 ? "next" : "prev");
      }
    }, 1800);
    this.el.addEventListener("wheel", onWheel, { passive: false });

    let touchStartY = 0;
    this.el.addEventListener("touchstart", (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    const onTouchEnd = throttle((e) => {
      if (this.animating) return;
      const diff = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 40) return;
      
      // Only capture touch swipe on the slider area specifically
      if (e.target.closest('.club-hero__images-wrapper')) {
        this.go(diff > 0 ? "next" : "prev");
      }
    }, 1800);
    this.el.addEventListener("touchend", onTouchEnd, { passive: true });

    window.addEventListener("keydown", (e) => {
      if (this.animating) return;
      // Ensure we only respond to keys if hero is somewhat in view
      const rect = this.el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        if (e.key === "ArrowDown" || e.key === "ArrowRight") { this.go("next"); }
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") { this.go("prev"); }
      }
    });

    if (!this.isTouchDevice && this.cursorEl) {
      this.el.addEventListener("mousemove", (e) => {
        if (!this.cursorVisible) {
          gsap.to(this.cursorEl, { opacity: 1, duration: 0.3 });
          this.cursorVisible = true;
        }
        this.cursorMoveX(e.clientX);
        this.cursorMoveY(e.clientY);
      }, { passive: true });

      this.el.addEventListener("mouseleave", () => {
        gsap.to(this.cursorEl, { opacity: 0, duration: 0.3 });
        this.cursorVisible = false;
      });
    }

    const onResize = debounce(() => {
      if (!this.animating && this.imagesEl && this.imagesEl.offsetHeight > 0) {
        this.slideEls.forEach((s) => {
          this.positionSlide(s.el, s.step);
        });
      }
    }, 300);
    window.addEventListener("resize", onResize, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.animating = false;
        this.stopAutoPlay();
      } else {
        this.startAutoPlay();
      }
    });
  }
}

// Initialize on DOM load or when module is imported if DOM is already ready
if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", () => {
    new Slider();
  });
} else {
  new Slider();
}
