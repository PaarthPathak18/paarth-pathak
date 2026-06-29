/* ═══════════════════════════════════════════════
   PAARTH PATHAK PORTFOLIO — index.js
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Mobile Sidebar Toggle ──────────────────────
  const sidebar      = document.getElementById('sidebar');
  const mobileBtn    = document.getElementById('mobileMenuBtn');
  let   overlay      = null;

  function createOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', closeSidebar);
  }
  createOverlay();

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  mobileBtn && mobileBtn.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });

  // Close sidebar when a nav link is clicked on mobile
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900) closeSidebar();
    });
  });

  // ── Active Nav on Scroll ───────────────────────
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  function setActiveNav(id) {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActiveNav(entry.target.id);
    });
  }, { threshold: 0.35, rootMargin: '-60px 0px -40% 0px' });

  sections.forEach(s => observer.observe(s));

  // ── Testimonials Slider ────────────────────────
  const cards      = Array.from(document.querySelectorAll('.testi-card'));
  const dotsEl     = document.querySelectorAll('.dot');
  const prevBtn    = document.getElementById('testiPrev');
  const nextBtn    = document.getElementById('testiNext');
  let   current    = 0;
  const visibleCnt = () => window.innerWidth < 640 ? 1 : window.innerWidth < 1100 ? 2 : 3;

  function showSlide(idx) {
    current = (idx + cards.length) % cards.length;
    cards.forEach((c, i) => c.classList.toggle('active', i === current));
    dotsEl.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  // Init — mark first N cards visible
  function initSlider() {
    const vis = visibleCnt();
    cards.forEach((c, i) => c.classList.toggle('active', i < vis));
  }
  initSlider();
  window.addEventListener('resize', initSlider);

  prevBtn && prevBtn.addEventListener('click', () => showSlide(current - 1));
  nextBtn && nextBtn.addEventListener('click', () => showSlide(current + 1));

  // Keyboard arrows
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  showSlide(current - 1);
    if (e.key === 'ArrowRight') showSlide(current + 1);
  });

  // Auto-advance
  let autoplay = setInterval(() => showSlide(current + 1), 5000);
  [prevBtn, nextBtn].forEach(btn => btn && btn.addEventListener('click', () => {
    clearInterval(autoplay);
    autoplay = setInterval(() => showSlide(current + 1), 5000);
  }));

  // ── Stat Counter Animation ─────────────────────
  const statNums = document.querySelectorAll('.stat-num');

  function animateCount(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step     = Math.ceil(target / (duration / 16));
    let   count    = 0;
    const tick = () => {
      count = Math.min(count + step, target);
      el.textContent = count + '+';
      if (count < target) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(n => statObserver.observe(n));

  // ── Contact Form ───────────────────────────────
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  form && form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    btn.textContent = 'Sending…';
    btn.style.opacity = '.7';

    setTimeout(() => {
      form.reset();
      btn.innerHTML = 'Send Message <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
      btn.style.opacity = '1';
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 4000);
    }, 1200);
  });

  // ── Smooth Scroll for anchor links ────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Watch Intro Button ─────────────────────────
  const watchBtn = document.getElementById('watchIntro');
  watchBtn && watchBtn.addEventListener('click', () => {
    alert('Video intro coming soon!');
  });

  // ── Entrance Animations (fade-in-up) ──────────
  const style = document.createElement('style');
  style.textContent = `
    .animate-in {
      animation: fadeUp .6s cubic-bezier(.4,0,.2,1) forwards;
    }
    @keyframes fadeUp {
      from { opacity:0; transform:translateY(28px); }
      to   { opacity:1; transform:none; }
    }
  `;
  document.head.appendChild(style);

  const animTargets = document.querySelectorAll('.srv-card, .proj-card, .testi-card, .stat-item, .detail-item');
  animTargets.forEach(el => { el.style.opacity = '0'; });

  const animObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '';
          entry.target.classList.add('animate-in');
          animObserver.unobserve(entry.target);
        }, i * 80);
      }
    });
  }, { threshold: 0.15 });

  animTargets.forEach(el => animObserver.observe(el));
});
