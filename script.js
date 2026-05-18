/* Kevin Labs — Interactive behaviour */

(function () {
  'use strict';

  // ===== NAVBAR: scroll effect =====
  // Guarded — current build uses .chrome-top (no #navbar). Without this
  // guard the listener would throw TypeError on every scroll, burning
  // main-thread time during touch-inertia scroll on mobile.

  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // ===== FLOATING CTA: show after hero, hide on contact =====

  const floatingCta = document.getElementById('floatingCta');
  const heroEl = document.querySelector('.hero');
  const contactEl = document.getElementById('contact');

  if (floatingCta && heroEl && contactEl) {
    let heroVisible = true;
    let contactVisible = false;

    const updateFloatingCta = () => {
      floatingCta.classList.toggle('visible', !heroVisible && !contactVisible);
    };

    new IntersectionObserver((entries) => {
      heroVisible = entries[0].isIntersecting;
      updateFloatingCta();
    }, { threshold: 0, rootMargin: '-80px 0px 0px 0px' }).observe(heroEl);

    new IntersectionObserver((entries) => {
      contactVisible = entries[0].isIntersecting;
      updateFloatingCta();
    }, { threshold: 0.2 }).observe(contactEl);
  }

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

  // ===== WHATSAPP LINK (number kept out of HTML) =====

  const whatsappLink = document.getElementById('whatsappLink');
  if (whatsappLink) {
    whatsappLink.addEventListener('click', (e) => {
      e.preventDefault();
      const n = atob('NDQ3NTE5NjQwNTY4');
      window.open('https://wa.me/' + n, '_blank', 'noopener,noreferrer');
    });
  }

  // ===== CONTACT FORM via Formspree =====

  const form = document.getElementById('contactForm');
  const btnText = document.getElementById('btnText');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (form.action.includes('YOUR_FORM_ID')) {
        formStatus.textContent = 'Contact form not yet configured. Please email Kevin@kevwebdesign.com directly.';
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
          formStatus.textContent = "Brief received. Kevin Labs will respond within 24 hours with a formal scope assessment.";
          formStatus.className = 'form-note success';
          form.reset();
        } else {
          throw new Error('Server error');
        }
      } catch {
        formStatus.textContent = 'Something went wrong. Please email Kevin@kevwebdesign.com directly.';
        formStatus.className = 'form-note error';
      } finally {
        submitBtn.disabled = false;
        btnText.textContent = 'Send Message';
      }
    });
  }

})();
