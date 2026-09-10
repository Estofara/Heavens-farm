/* =========================================================================
   EASYLAUNCH WEB — SCRIPT
   Sections: mobile menu, sticky header state, FAQ accordion,
   scroll-reveal animations, contact form (n8n-ready stub).
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Mobile navigation ---------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close the mobile menu whenever a nav link is tapped
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  /* ---------------- Sticky header shadow on scroll ---------------- */
  const header = document.getElementById('siteHeader');
  if (header) {
    const applyScrollState = () => {
      header.style.boxShadow = window.scrollY > 8
        ? '0 12px 30px -20px rgba(0,0,0,0.6)'
        : 'none';
    };
    applyScrollState();
    window.addEventListener('scroll', applyScrollState, { passive: true });
  }

  /* ---------------- FAQ accordion ---------------- */
  const accordionItems = document.querySelectorAll('.accordion__item');

  accordionItems.forEach((item) => {
    const trigger = item.querySelector('.accordion__trigger');
    const panel = item.querySelector('.accordion__panel');
    if (!trigger || !panel) return;

    // Start collapsed
    panel.style.maxHeight = '0px';

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Close any other open item (one-at-a-time accordion)
      accordionItems.forEach((otherItem) => {
        if (otherItem === item) return;
        const otherTrigger = otherItem.querySelector('.accordion__trigger');
        const otherPanel = otherItem.querySelector('.accordion__panel');
        if (otherTrigger && otherPanel) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          otherPanel.style.maxHeight = '0px';
        }
      });

      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = isOpen ? '0px' : panel.scrollHeight + 'px';
    });
  });

  /* ---------------- Scroll-reveal on sections ---------------- */
  const revealTargets = document.querySelectorAll(
    '.card, .portfolio-card, .timeline__step, .why__item, .section__heading'
  );
  revealTargets.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    // Fallback: no IntersectionObserver support — just show everything
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------------- Contact form ---------------- */
  // PLACEHOLDER: paste your automation webhook URL here (e.g. an n8n
  // "Webhook" node URL) to make the form actually send data.
  const FORM_ENDPOINT_URL = ''; // e.g. 'https://your-n8n-instance.com/webhook/easylaunch-contact'

  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = Object.fromEntries(new FormData(contactForm).entries());

      // No endpoint configured yet — tell the developer/editor clearly,
      // rather than pretending the message was sent.
      if (!FORM_ENDPOINT_URL) {
        formStatus.textContent =
          'Form is not connected yet. Add your automation URL in script.js (FORM_ENDPOINT_URL) to enable sending.';
        formStatus.dataset.state = 'error';
        console.warn('Easylaunch Web contact form: FORM_ENDPOINT_URL is empty.', data);
        return;
      }

      const submitButton = contactForm.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;
      formStatus.dataset.state = '';
      formStatus.textContent = 'Sending...';

      try {
        const response = await fetch(FORM_ENDPOINT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Request failed with status ' + response.status);

        formStatus.textContent = "Thanks — we've received your request and will be in touch soon.";
        formStatus.dataset.state = 'success';
        contactForm.reset();
      } catch (error) {
        console.error('Easylaunch Web contact form error:', error);
        formStatus.textContent = 'Something went wrong sending your request. Please try again.';
        formStatus.dataset.state = 'error';
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }

});
