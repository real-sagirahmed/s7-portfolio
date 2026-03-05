/* ============================================================
   main.js – Portfolio Interactive Behaviour
   ============================================================ */

(function () {
  'use strict';

  /* ── Navbar scroll ─────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const scrollThreshold = 80;

  function handleNavbarScroll() {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Run once on load

  /* ── Active nav link on scroll ─────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNavLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink, { passive: true });

  /* ── Mobile hamburger ──────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');

  if (hamburger && navLinksContainer) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinksContainer.classList.toggle('open');
    });

    // Close nav when a link is clicked
    navLinksContainer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinksContainer.classList.remove('open');
      });
    });
  }

  /* ── Smooth scroll for all anchor links ────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Intersection Observer: Scroll Reveals ─────── */
  const revealSelectors = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-stagger'];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after animation to save resources
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  // Add reveal classes to elements
  function setupRevealAnimations() {
    // Hero content
    const heroContentEl = document.querySelector('.hero-content');
    if (heroContentEl) heroContentEl.classList.add('reveal-left');

    const heroPhotoWrapEl = document.querySelector('.hero-photo-wrap');
    if (heroPhotoWrapEl) heroPhotoWrapEl.classList.add('reveal-right');

    // Section titles
    document.querySelectorAll('.section-title-wrap').forEach(el => {
      el.classList.add('reveal');
    });

    // About / services
    const aboutPara = document.querySelector('.about-paragraph');
    if (aboutPara) aboutPara.classList.add('reveal');

    const servicesGrid = document.querySelector('.services-grid');
    if (servicesGrid) servicesGrid.classList.add('reveal-stagger');

    // Skills groups
    document.querySelectorAll('.skills-group').forEach((group, i) => {
      group.classList.add('reveal');
    });

    document.querySelectorAll('.skills-grid').forEach(grid => {
      grid.classList.add('reveal-stagger');
    });

    // Portfolio cards
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) projectsGrid.classList.add('reveal-stagger');

    // Contact
    const contactFormSection = document.querySelector('.contact-form');
    if (contactFormSection) contactFormSection.classList.add('reveal');

    // Footer
    const footerInner = document.querySelector('.footer-inner');
    if (footerInner) footerInner.classList.add('reveal');

    // Intro
    const introContent = document.querySelector('.intro-content');
    if (introContent) introContent.classList.add('reveal-left');
  }

  setupRevealAnimations();

  /* ======================== CV DOWNLOAD LOGIC ======================== */
  const downloadPDF = document.getElementById('downloadPDF');
  const downloadPNG = document.getElementById('downloadPNG');

  if (downloadPDF) {
    downloadPDF.addEventListener('click', () => {
      window.print();
    });
  }

  if (downloadPNG) {
    downloadPNG.addEventListener('click', () => {
      const originalScrollPos = window.scrollY;

      // Scroll to top for better capture
      window.scrollTo(0, 0);

      // Target a main wrapper if it exists, or body
      // We want to capture the core info sections
      const resumeContainer = document.body;

      // Add a temporary class to body for PNG-specific layout if needed
      document.body.classList.add('printing-png');

      html2canvas(resumeContainer, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        allowTaint: true,
        ignoreElements: (element) => {
          // Hide non-CV elements during PNG capture
          const hideSelectors = ['nav', '.cv-download-wrap', '.hero-socials', '.back-to-top', '.contact-section', '.footer', '.hero-diagonal'];
          return hideSelectors.some(selector => element.matches(selector));
        }
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'SAGIR_AHMED_CV.png';
        link.href = canvas.toDataURL('image/png');
        link.click();

        document.body.classList.remove('printing-png');
        window.scrollTo(0, originalScrollPos);
      }).catch(err => {
        console.error('Canvas capture failed:', err);
        document.body.classList.remove('printing-png');
      });
    });
  }

  // Observe all reveal elements
  document.querySelectorAll(revealSelectors.join(',')).forEach(el => {
    observer.observe(el);
  });

  // Hero elements are immediately visible
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal-left, .hero .reveal-right').forEach(el => {
      el.classList.add('visible');
    });
  }, 100);

  /* ── Portfolio Filter ──────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show / hide cards
      projectCards.forEach(card => {
        const cat = card.getAttribute('data-cat') || 'all';

        if (filter === 'all' || cat.includes(filter)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ── Back to Top ───────────────────────────────── */
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Contact Form ──────────────────────────────── */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Remove old message
      const oldMsg = contactForm.querySelector('.form-msg');
      if (oldMsg) oldMsg.remove();

      const name = contactForm.querySelector('#userName').value.trim();
      const email = contactForm.querySelector('#userEmail').value.trim();
      const message = contactForm.querySelector('#userMessage').value.trim();

      // Basic validation
      if (!name || !email || !message) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
      }

      // Simulate send (replace with real API call as needed)
      const submitBtn = contactForm.querySelector('#submitBtn');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'SENDING…';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        contactForm.reset();
        showFormMessage("Thank you! Your message has been sent. I'll get back to you soon.", 'success');
      }, 1500);
    });

    function showFormMessage(text, type) {
      const msg = document.createElement('p');
      msg.className = `form-msg ${type}`;
      msg.textContent = text;
      contactForm.appendChild(msg);

      setTimeout(() => msg.remove(), 5000);
    }

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  }

  /* ── Parallax on hero ──────────────────────────── */
  const heroSection = document.querySelector('.hero');
  const heroDiagonal = document.querySelector('.hero-diagonal');

  if (heroSection && heroDiagonal) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        heroDiagonal.style.transform = `rotate(9.67deg) translateY(${window.scrollY * 0.15}px)`;
      }
    }, { passive: true });
  }

  /* ── Hero fallback image ───────────────────────── */
  const heroPhoto = document.getElementById('heroPhoto');
  if (heroPhoto) {
    heroPhoto.addEventListener('error', () => {
      // Generate CSS avatar placeholder on image error
      heroPhoto.style.display = 'none';
      const placeholder = document.createElement('div');
      placeholder.style.cssText = `
        width: 100%;
        height: 100%;
        background: linear-gradient(160deg, #2c2c2c 0%, #111 100%);
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 200 280');
      svg.setAttribute('fill', 'none');
      svg.style.cssText = 'width: 60%; max-width: 300px; opacity: 0.4;';
      svg.innerHTML = `
        <circle cx="100" cy="80" r="55" fill="#999"/>
        <ellipse cx="100" cy="220" rx="80" ry="70" fill="#999"/>
      `;
      placeholder.appendChild(svg);

      const wrap = document.querySelector('.hero-photo-wrap');
      if (wrap) {
        wrap.style.background = 'linear-gradient(160deg, #2c2c2c 0%, #111 100%)';
        wrap.appendChild(placeholder);
      }
    });
  }

  /* ── Typewriter for hero title ─────────────────── */
  const heroTitleEl = document.querySelector('.hero-title');
  if (heroTitleEl) {
    const titles = [
      'Aspiring Full Stack .NET Developer',
      '.NET Core & C# enthusiast',
      'Web Application Developer',
      'Software Engineering student',
    ];

    let titleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function type() {
      const current = titles[titleIdx];

      if (isDeleting) {
        heroTitleEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        typingSpeed = 45;
      } else {
        heroTitleEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        typingSpeed = 80;
      }

      if (!isDeleting && charIdx === current.length) {
        typingSpeed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        titleIdx = (titleIdx + 1) % titles.length;
        typingSpeed = 400;
      }

      setTimeout(type, typingSpeed);
    }

    // Start after a short delay so it doesn't interrupt initial render
    setTimeout(type, 1800);
  }

  /* ── Skill tooltip hover ───────────────────────── */
  document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.cursor = 'default';
    });
  });

  /* ── Cursor trail (subtle) ─────────────────────── */
  const trail = document.createElement('div');
  trail.style.cssText = `
    position: fixed;
    width: 8px; height: 8px;
    background: rgba(0,0,0,0.35);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s ease, opacity 0.3s ease;
    transform: translate(-50%, -50%);
    opacity: 0;
  `;
  document.body.appendChild(trail);

  let trailVisible = false;

  document.addEventListener('mousemove', (e) => {
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';

    if (!trailVisible) {
      trail.style.opacity = '1';
      trailVisible = true;
    }
  });

  document.addEventListener('mouseleave', () => {
    trail.style.opacity = '0';
    trailVisible = false;
  });

})();
