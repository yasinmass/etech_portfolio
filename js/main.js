document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Mobile navigation menu toggling
  const openBtn = document.getElementById('openMenu');
  const closeBtn = document.getElementById('closeMenu');
  const menu = document.getElementById('mobileMenu');

  if (openBtn && closeBtn && menu) {
    openBtn.addEventListener('click', () => {
      menu.classList.add('open');
    });

    closeBtn.addEventListener('click', () => {
      menu.classList.remove('open');
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
      });
    });
  }

  // WhatsApp quote form handler
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const message = document.getElementById('message').value.trim();
      
      const text = `Hi E-Tech Builders, I'm ${name} (${phone}). ${message}`;
      const url = `https://wa.me/917667543543?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    });
  }

  // Scroll reveal animation using IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach((el) => el.classList.add('in'));
  }
  // ── Hero Slideshow ──────────────────────────────────────────────────────────
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  let currentSlide = 0;
  let slideshowTimer = null;
  const SLIDE_DURATION = 6000;  // ms each slide is visible
  const FADE_DURATION  = 1800;  // ms — must match CSS transition

  function goToSlide(index) {
    // Remove active from current
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    // Force Ken Burns restart: remove, reflow, re-add
    slides[index].style.animation = 'none';
    void slides[index].offsetWidth; // trigger reflow
    slides[index].style.animation  = '';

    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }

  function startSlideshow() {
    slideshowTimer = setInterval(nextSlide, SLIDE_DURATION);
  }

  function resetSlideshow() {
    clearInterval(slideshowTimer);
    startSlideshow();
  }

  if (slides.length > 1) {
    startSlideshow();

    // Dot click navigation
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.index, 10);
        if (idx !== currentSlide) {
          goToSlide(idx);
          resetSlideshow();
        }
      });
    });

    // Pause on visibility change to avoid timing drift
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearInterval(slideshowTimer);
      } else {
        resetSlideshow();
      }
    });
  }
  // ── End Hero Slideshow ───────────────────────────────────────────────────────
});
