/**
 * NARESH GOEL - EXECUTIVE PORTFOLIO INTERACTION ENGINE
 * Premium Micro-interactions, Dynamic Counter Animations, and Accessible Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollAnimations();
  initMetricCounters();
  initContactForm();
  initVcardDownload();
});

/**
 * Navigation Bar Behavior (Scrolled Glass Effect + Active Anchor Tracking)
 */
function initNavigation() {
  const header = document.getElementById('siteHeader');
  const mobileToggle = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll effect on header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNavLink();
  }, { passive: true });

  // Mobile menu toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on link click
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target) && mobileDrawer.classList.contains('open')) {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Update active state in nav based on scroll position
  function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 180;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }
}

/**
 * Scroll Reveal Animations via IntersectionObserver
 */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up');
  
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.12
  });

  elements.forEach(el => observer.observe(el));
}

/**
 * Metric Counters Animation
 */
function initMetricCounters() {
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  const statsSection = document.querySelector('.hero-stats-row');
  if (!statsSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          const duration = 1600; // ms
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
}

/**
 * Contact Form Submission & Polite Executive Feedback
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const statusBox = document.getElementById('formStatus');

  if (!form || !statusBox) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName').value.trim();
    const org = document.getElementById('contactOrg').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }

    // Success response state
    statusBox.className = 'form-status success';
    statusBox.innerHTML = `
      <strong>Inquiry Registered:</strong> Thank you, <strong>${escapeHtml(name)}</strong> (${escapeHtml(org)}). 
      Your briefing regarding <em>${escapeHtml(subject || 'Executive Inquiry')}</em> has been logged. 
      You can also connect directly via <a href="https://www.linkedin.com/in/naresh-goel-9701913b" target="_blank" style="color: #4ade80; text-decoration: underline;">LinkedIn</a>.
    `;

    form.reset();

    // Auto-scroll to status
    statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }
}

/**
 * Direct vCard Download (.vcf file generation)
 */
function initVcardDownload() {
  const btn = document.getElementById('downloadVcardBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:Naresh Goel',
      'N:Goel;Naresh;;;',
      'TITLE:Global Vice President - Production',
      'ORG:Pinnacle Future Build',
      'ADR;TYPE=WORK:;;Jaipur;Rajasthan;;;India',
      'URL:https://www.linkedin.com/in/naresh-goel-9701913b',
      'NOTE:Seasoned TVS & MEP professional with 24+ yrs extensive managerial experience in infrastructure multinational companies. Construct with certainty using Digital solutions.',
      'END:VCARD'
    ].join('\r\n');

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Naresh_Goel_Pinnacle_Future_Build.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}
