// ============================================================
// FarmGPS — Main JavaScript
// File: js/main.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================
  // LANGUAGE MANAGER INIT
  // ==========================================================
  LangManager.init();

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      LangManager.setLang(btn.getAttribute('data-lang'));
    });
  });

  // ==========================================================
  // HERO BACKGROUND — Ken Burns zoom-in on load
  // ==========================================================
  const heroBg = document.getElementById('hero-bg-img');
  if (heroBg) {
    // Small delay lets the CSS transition kick in visibly
    requestAnimationFrame(() => {
      setTimeout(() => heroBg.classList.add('loaded'), 80);
    });
  }

  // ==========================================================
  // HEADER — Scroll shadow + shrink
  // ==========================================================
  const header = document.getElementById('header');

  const handleScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load

  // ==========================================================
  // MOBILE NAVIGATION
  // ==========================================================
  const hamburger  = document.querySelector('.hamburger');
  const mobileNav  = document.querySelector('.mobile-nav');

  const closeMobileNav = () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  hamburger?.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (
      mobileNav.classList.contains('open') &&
      !mobileNav.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMobileNav();
    }
  });

  // ==========================================================
  // SMOOTH SCROLL — Anchor links
  // ==========================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const headerH = header?.offsetHeight || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ==========================================================
  // ACTIVE NAV LINK — Highlight on scroll
  // ==========================================================
  const sections  = Array.from(document.querySelectorAll('section[id]'));
  const navLinks  = document.querySelectorAll('.nav-links a');

  const setActive = () => {
    const scrollY   = window.scrollY;
    const headerH   = header?.offsetHeight || 70;
    let current     = '';

    sections.forEach(section => {
      if (scrollY >= section.offsetTop - headerH - 40) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', isActive);
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  // ==========================================================
  // SCROLL ANIMATIONS — IntersectionObserver
  // ==========================================================
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.10, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // ==========================================================
  // COUNTER ANIMATION — Hero stats
  // ==========================================================
  const animateValue = (el, target, suffix, decimals = 0) => {
    const duration = 1600;
    const start    = performance.now();
    const step = ts => {
      const progress = Math.min((ts - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const val      = eased * target;
      el.textContent = (decimals ? val.toFixed(decimals) : Math.floor(val)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const heroSection    = document.querySelector('#hero');
  const counterDone    = { done: false };
  const counterObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !counterDone.done) {
      counterDone.done = true;
      const nums = document.querySelectorAll('.hero-stat-num');
      if (nums[0]) animateValue(nums[0], 20,  '+');
      if (nums[1]) animateValue(nums[1], 150, '+');
      if (nums[2]) { nums[2].textContent = '±2,5'; } // static — no animation needed
      counterObserver.disconnect();
    }
  }, { threshold: 0.5 });

  if (heroSection) counterObserver.observe(heroSection);

  // ==========================================================
  // CONTACT FORM — FormSubmit AJAX (nincs oldal-átirányítás)
  // ==========================================================
  const form        = document.getElementById('contact-form');
  const formSuccess = document.querySelector('.form-success');

  form?.addEventListener('submit', async e => {
    e.preventDefault();

    const submitBtn = form.querySelector('[type="submit"]');
    const origHTML  = submitBtn.innerHTML;
    submitBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> <span>${LangManager.t('contact_sending')}</span>`;
    submitBtn.disabled = true;

    try {
      const data = new FormData(form);

      const res = await fetch('https://formsubmit.co/ajax/info@mtzklima.hu', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      });

      if (res.ok) {
        form.style.display = 'none';
        if (formSuccess) {
          formSuccess.textContent = LangManager.t('contact_success');
          formSuccess.style.display = 'block';
        }
        setTimeout(() => {
          form.reset();
          form.style.display = 'block';
          if (formSuccess) formSuccess.style.display = 'none';
          submitBtn.innerHTML = origHTML;
          submitBtn.disabled  = false;
        }, 5000);
      } else {
        throw new Error('Send failed');
      }
    } catch {
      // Fallback: natív form submit ha AJAX nem sikerül
      form.submit();
    }
  });

  // ==========================================================
  // COOKIE BANNER
  // ==========================================================
  const cookieBanner  = document.getElementById('cookie-banner');
  const cookieAccept  = document.getElementById('cookie-accept');
  const cookieReject  = document.getElementById('cookie-reject');

  if (!localStorage.getItem('farmgps_cookie')) {
    setTimeout(() => cookieBanner?.classList.add('show'), 1800);
  }

  const hideCookie = val => {
    localStorage.setItem('farmgps_cookie', val);
    cookieBanner?.classList.remove('show');
  };

  cookieAccept?.addEventListener('click', () => hideCookie('accepted'));
  cookieReject?.addEventListener('click', () => hideCookie('rejected'));

  // ==========================================================
  // FOOTER YEAR
  // ==========================================================
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
