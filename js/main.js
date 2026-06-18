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
  const SLIDE_DURATION = 3500;  // ms each slide is visible (exactly 3.5 seconds)
  const FADE_DURATION  = 800;   // ms — matched to CSS transition

  function goToSlide(index) {
    const prevSlide = currentSlide;

    // Remove active and add fade-out to outgoing slide
    slides[prevSlide].classList.remove('active');
    slides[prevSlide].classList.add('fade-out');

    // Clean up fade-out class after 800ms transition ends
    setTimeout(() => {
      slides[prevSlide].classList.remove('fade-out');
    }, 800);

    if (dots && dots[prevSlide]) {
      dots[prevSlide].classList.remove('active');
    }

    // Force animation restart on incoming slide: remove, reflow, re-add
    slides[index].style.animation = 'none';
    void slides[index].offsetWidth; // trigger reflow
    slides[index].style.animation  = '';

    currentSlide = index;
    slides[currentSlide].classList.add('active');
    if (dots && dots[currentSlide]) {
      dots[currentSlide].classList.add('active');
    }
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

    // Dot click navigation (safe if no dots exist)
    if (dots && dots.length > 0) {
      dots.forEach((dot) => {
        dot.addEventListener('click', () => {
          const idx = parseInt(dot.dataset.index, 10);
          if (idx !== currentSlide) {
            goToSlide(idx);
            resetSlideshow();
          }
        });
      });
    }

    // Pause on visibility change to avoid timing drift
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearInterval(slideshowTimer);
      } else {
        resetSlideshow();
      }
    });
  }

  // Preload remaining slideshow images in background after window load
  window.addEventListener('load', () => {
    const imagesToPreload = [
      'assets/elevations/build2.jpeg',
      'assets/elevations/build3.jpeg',
      'assets/elevations/build4.jpeg',
      'assets/elevations/build6.jpeg'
    ];
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  });
  // ── End Hero Slideshow ───────────────────────────────────────────────────────

  // ── Project Carousel ─────────────────────────────────────────────────────────
  const track      = document.getElementById('carouselTrack');
  const prevBtn    = document.getElementById('carouselPrev');
  const nextBtn    = document.getElementById('carouselNext');
  const cdots      = document.querySelectorAll('.cdot');
  const projCards  = document.querySelectorAll('.proj-card');
  let carouselIdx  = 0;
  const carouselTotal = projCards.length;

  function goToProject(idx) {
    // Clamp with wrap-around
    carouselIdx = (idx + carouselTotal) % carouselTotal;
    track.style.transform = `translateX(-${carouselIdx * 100}%)`;
    // Update dots
    cdots.forEach((d, i) => d.classList.toggle('active', i === carouselIdx));
  }

  if (track && carouselTotal > 0) {
    // Arrow clicks
    if (prevBtn) prevBtn.addEventListener('click', () => goToProject(carouselIdx - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToProject(carouselIdx + 1));

    // Dot clicks
    cdots.forEach(d => {
      d.addEventListener('click', () => goToProject(parseInt(d.dataset.index, 10)));
    });

    // Keyboard navigation
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  goToProject(carouselIdx - 1);
      if (e.key === 'ArrowRight') goToProject(carouselIdx + 1);
    });

    // Touch / mouse drag swipe
    let dragStartX = null;
    let dragDeltaX = 0;
    const SWIPE_THRESHOLD = 50;

    function onDragStart(e) {
      dragStartX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
      dragDeltaX = 0;
      track.classList.add('is-dragging');
    }

    function onDragMove(e) {
      if (dragStartX === null) return;
      const x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
      dragDeltaX = x - dragStartX;
      track.style.transform = `translateX(calc(-${carouselIdx * 100}% + ${dragDeltaX}px))`;
    }

    function onDragEnd() {
      if (dragStartX === null) return;
      track.classList.remove('is-dragging');
      if (dragDeltaX < -SWIPE_THRESHOLD)      goToProject(carouselIdx + 1);
      else if (dragDeltaX > SWIPE_THRESHOLD)  goToProject(carouselIdx - 1);
      else                                     goToProject(carouselIdx); // snap back
      dragStartX = null;
    }

    // Mouse events
    track.addEventListener('mousedown',  onDragStart);
    track.addEventListener('mousemove',  onDragMove);
    track.addEventListener('mouseup',    onDragEnd);
    track.addEventListener('mouseleave', onDragEnd);

    // Touch events
    track.addEventListener('touchstart', onDragStart, { passive: true });
    track.addEventListener('touchmove',  onDragMove,  { passive: true });
    track.addEventListener('touchend',   onDragEnd);
  }
  // ── End Project Carousel ─────────────────────────────────────────────────────
});
