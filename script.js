/* Kevin & Co. Agency — Interactive behaviour */

(function () {
  'use strict';

  // ===== NAVBAR: scroll effect + hamburger =====

  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navBackdrop = document.getElementById('navBackdrop');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  function lockScroll() {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
  }

  function unlockScroll() {
    const scrollY = parseInt(document.body.style.top || '0', 10) * -1;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollY);
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    navBackdrop.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    unlockScroll();
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    navBackdrop.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    isOpen ? lockScroll() : unlockScroll();
  });

  navLinks.addEventListener('click', (e) => {
    if (e.target.matches('a')) closeMenu();
  });

  navBackdrop.addEventListener('click', closeMenu);

  // ===== SCROLL REVEAL =====

  const revealElements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach((el, i) => {
    el.dataset.delay = (i % 3) * 80;
    observer.observe(el);
  });

  // ===== ACTIVE NAV LINK on scroll =====

  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkEls.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  // ===== CONTACT FORM via Formspree =====

  const form = document.getElementById('contactForm');
  const btnText = document.getElementById('btnText');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (form.action.includes('YOUR_FORM_ID')) {
        formStatus.textContent = 'Contact form not yet configured. Please email Kevinjrm@yahoo.com directly.';
        formStatus.className = 'form-note error';
        return;
      }

      submitBtn.disabled = true;
      btnText.textContent = 'Sending…';
      formStatus.textContent = '';
      formStatus.className = 'form-note';

      try {
        const data = new FormData(form);
        const res = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' }
        });

        if (res.ok) {
          formStatus.textContent = "Message sent! I'll be in touch within 24 hours.";
          formStatus.className = 'form-note success';
          form.reset();
        } else {
          throw new Error('Server error');
        }
      } catch {
        formStatus.textContent = 'Something went wrong. Please email Kevinjrm@yahoo.com directly.';
        formStatus.className = 'form-note error';
      } finally {
        submitBtn.disabled = false;
        btnText.textContent = 'Send Message';
      }
    });
  }

})();
