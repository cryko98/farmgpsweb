// ============================================================
// FarmGPS - Main JavaScript
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
  // HEADER SCROLL EFFECT
  // ==========================================================
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // ==========================================================
  // MOBILE NAVIGATION
  // ==========================================================
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile nav on link click
  document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ==========================================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ==========================================================
  // SCROLL ANIMATIONS (Intersection Observer)
  // ==========================================================
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // ==========================================================
  // CONTACT FORM
  // ==========================================================
  const form = document.getElementById('contact-form');
  const formSuccess = document.querySelector('.form-success');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = LangManager.t('contact_sending');
    submitBtn.disabled = true;

    // Simulate form submission (replace with real endpoint if needed)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Show success
    form.style.display = 'none';
    if (formSuccess) {
      formSuccess.textContent = LangManager.t('contact_success');
      formSuccess.style.display = 'block';
    }

    // Reset after 5s
    setTimeout(() => {
      form.reset();
      form.style.display = 'block';
      if (formSuccess) formSuccess.style.display = 'none';
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 5000);
  });

  // ==========================================================
  // COOKIE BANNER
  // ==========================================================
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieReject = document.getElementById('cookie-reject');

  if (!localStorage.getItem('farmgps_cookie')) {
    setTimeout(() => cookieBanner?.classList.add('show'), 1500);
  }

  cookieAccept?.addEventListener('click', () => {
    localStorage.setItem('farmgps_cookie', 'accepted');
    cookieBanner.classList.remove('show');
  });

  cookieReject?.addEventListener('click', () => {
    localStorage.setItem('farmgps_cookie', 'rejected');
    cookieBanner.classList.remove('show');
  });

  // ==========================================================
  // ACTIVE NAV LINK ON SCROLL
  // ==========================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.style.color = '';
      link.style.background = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = 'var(--green-700)';
        link.style.background = 'var(--green-50)';
      }
    });
  }, { passive: true });

  // ==========================================================
  // COUNTER ANIMATION (Hero stats)
  // ==========================================================
  function animateCounter(el, target, suffix = '') {
    let current = 0;
    const increment = target / 40;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, 30);
  }

  // Trigger counters when hero is visible
  const heroSection = document.querySelector('#hero');
  const counterObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      const counters = document.querySelectorAll('.hero-stat-num');
      const targets = [20, 150, 2.5];
      const suffixes = ['+', '+', ''];
      counters.forEach((c, i) => {
        animateCounter(c, targets[i], suffixes[i]);
      });
      counterObserver.disconnect();
    }
  }, { threshold: 0.5 });

  if (heroSection) counterObserver.observe(heroSection);

});
