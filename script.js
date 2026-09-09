/* ============================================
   AutoVerse - Car Website JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Preloader ----
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 600);
  });

  // ---- Navbar Scroll ----
  const navbar = document.querySelector('.navbar');
  const backToTop = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top
    if (scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- Smooth Scroll for Nav Links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if open
        closeMobileMenu();
      }
    });
  });

  // ---- Mobile Menu ----
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileOverlay = document.querySelector('.mobile-menu-overlay');
  const mobilePanel = document.querySelector('.mobile-menu-panel');
  const mobileCloseBtn = document.querySelector('.mobile-close-btn');

  function openMobileMenu() {
    mobileOverlay.classList.add('active');
    mobilePanel.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileOverlay.classList.remove('active');
    mobilePanel.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileMenuBtn.addEventListener('click', openMobileMenu);
  mobileCloseBtn.addEventListener('click', closeMobileMenu);
  mobileOverlay.addEventListener('click', closeMobileMenu);

  // ---- Search Modal ----
  const searchModal = document.querySelector('.search-modal');
  const searchOpenBtns = document.querySelectorAll('.nav-search-btn');
  const searchOverlay = document.querySelector('.search-modal-overlay');

  searchOpenBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      searchModal.classList.add('active');
      document.querySelector('.search-modal-input').focus();
      document.body.style.overflow = 'hidden';
    });
  });

  searchOverlay.addEventListener('click', () => {
    searchModal.classList.remove('active');
    document.body.style.overflow = '';
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchModal.classList.remove('active');
      document.body.style.overflow = '';
    }
    // Ctrl+K to open search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchModal.classList.toggle('active');
      if (searchModal.classList.contains('active')) {
        document.querySelector('.search-modal-input').focus();
      }
    }
  });

  // ---- Featured Tabs ----
  const tabs = document.querySelectorAll('.featured-tab');
  const carCards = document.querySelectorAll('.car-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;

      carCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, index * 80);
          } else {
            card.style.display = 'none';
          }
        }, 300);
      });
    });
  });

  // ---- Wishlist Toggle ----
  document.querySelectorAll('.car-card-wishlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.toggle('active');
      if (btn.classList.contains('active')) {
        btn.innerHTML = '❤️';
        // Animate
        btn.style.transform = 'scale(1.3)';
        setTimeout(() => { btn.style.transform = 'scale(1)'; }, 200);
      } else {
        btn.innerHTML = '🤍';
      }
    });
  });

  // ---- Counter Animation ----
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const suffix = element.dataset.suffix || '';
    const prefix = element.dataset.prefix || '';

    function update() {
      start += increment;
      if (start >= target) {
        element.textContent = prefix + target.toLocaleString() + suffix;
        return;
      }
      element.textContent = prefix + Math.floor(start).toLocaleString() + suffix;
      requestAnimationFrame(update);
    }

    update();
  }

  // ---- Scroll Reveal ----
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');
  const counterElements = document.querySelectorAll('.counter');
  let countersAnimated = false;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');

        // Counter animation
        if (!countersAnimated && entry.target.closest('.hero-stats')) {
          countersAnimated = true;
          counterElements.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            animateCounter(counter, target);
          });
        }

        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
  counterElements.forEach(el => {
    const parent = el.closest('.hero-stats');
    if (parent) revealObserver.observe(parent);
  });

  // ---- Particle Effect for Hero ----
  const canvas = document.querySelector('.particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrameId;

    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.4 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width ||
            this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Create particles
    for (let i = 0; i < 60; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animFrameId = requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  // ---- Active Nav Link on Scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // ---- Comparison Highlight Winners ----
  const comparisonRows = document.querySelectorAll('.compare-spec-row');
  // This is a visual hint – already set in HTML via .winner class

  // ---- Newsletter Form ----
  const ctaForm = document.querySelector('.cta-form');
  if (ctaForm) {
    ctaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = ctaForm.querySelector('.cta-input');
      if (input.value.trim()) {
        const btn = ctaForm.querySelector('.cta-submit');
        btn.textContent = '✓ Đã đăng ký!';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        input.value = '';
        setTimeout(() => {
          btn.textContent = 'Đăng ký';
          btn.style.background = '';
        }, 3000);
      }
    });
  }

  // ---- Tilt Effect on Car Cards ----
  document.querySelectorAll('.car-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // ---- Typing Effect for Hero Badge ----
  // Already handled by CSS animations

  // ---- Preloader hide fallback ----
  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 3000);
});
