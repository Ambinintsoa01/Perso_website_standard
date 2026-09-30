/**
 * STUDIO PHOTO AMBININTSOA - ULTRA LIGHTWEIGHT & DYNAMIC ES6 ENGINE
 * Zero dependencies, ultra-fast, zero render-blocking
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initGalleryFiltering();
  initLightbox();
  initBeforeAfterSlider();
  initPriceEstimator();
  initFaqAccordion();
  initContactForm();
  initActiveNavSpy();
});

/* ==========================================================================
   THEME TOGGLE (Dark Luxury / Fine Art Light)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('studio_theme') || 'dark';
  applyTheme(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
    localStorage.setItem('studio_theme', nextTheme);
  });
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) toggleBtn.setAttribute('aria-label', 'Activer le mode sombre');
  } else {
    document.documentElement.removeAttribute('data-theme');
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) toggleBtn.setAttribute('aria-label', 'Activer le mode clair');
  }
}

/* ==========================================================================
   MOBILE MENU DRAWER
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!menuBtn || !mainNav) return;

  menuBtn.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   GALLERY FILTERING & DYNAMIC CARDS
   ========================================================================== */
function initGalleryFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.gallery-card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        const isLive = card.getAttribute('data-is-live') === 'true';

        let shouldShow = false;
        if (filterVal === 'all') {
          shouldShow = true;
        } else if (filterVal === 'live') {
          shouldShow = isLive;
        } else {
          shouldShow = category === filterVal;
        }

        if (shouldShow) {
          card.style.display = 'block';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            if (card.style.opacity === '0') {
              card.style.display = 'none';
            }
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   FULLSCREEN LIGHTBOX MODAL WITH KEYBOARD & TOUCH NAVIGATION
   ========================================================================== */
let currentLightboxIndex = 0;
let galleryItems = [];

function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const cards = document.querySelectorAll('.gallery-card');

  if (!modal) return;

  galleryItems = Array.from(cards).map(card => {
    const img = card.querySelector('img');
    const title = card.querySelector('.gallery-item-title')?.textContent || 'Cliché';
    const cat = card.querySelector('.gallery-category')?.textContent || '';
    const exif = card.querySelector('.gallery-exif')?.textContent || '';
    const fullSrc = card.getAttribute('data-full') || img.src;

    return {
      src: fullSrc,
      alt: img.alt,
      title: title,
      category: cat,
      exif: exif
    };
  });

  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      openLightbox(index);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxContent();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = galleryItems[currentLightboxIndex];
    if (!item) return;

    const imgEl = document.getElementById('lightbox-img');
    const counterEl = document.getElementById('lightbox-counter');
    const captionEl = document.getElementById('lightbox-caption');
    const exifEl = document.getElementById('lightbox-exif');

    if (imgEl) {
      imgEl.src = item.src;
      imgEl.alt = item.alt;
    }
    if (counterEl) {
      counterEl.textContent = `${currentLightboxIndex + 1} / ${galleryItems.length}`;
    }
    if (captionEl) {
      captionEl.textContent = `${item.title} — ${item.category}`;
    }
    if (exifEl) {
      exifEl.textContent = item.exif;
    }
  }

  function prevImage() {
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightboxContent();
  }

  function nextImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryItems.length;
    updateLightboxContent();
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', prevImage);
  if (nextBtn) nextBtn.addEventListener('click', nextImage);

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  // Close on clicking backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-viewport')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   AVANT / APRÈS (BEFORE & AFTER RETOUCH SLIDER)
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.querySelector('.slider-container');
  const modifiedImg = document.querySelector('.slider-img.img-modified');
  const handle = document.querySelector('.slider-handle');
  const rangeInput = document.querySelector('.slider-range-input');

  if (!container || !modifiedImg || !handle || !rangeInput) return;

  function updateSlider(val) {
    modifiedImg.style.width = `${val}%`;
    handle.style.left = `${val}%`;
    handle.setAttribute('aria-valuenow', val);
  }

  rangeInput.addEventListener('input', (e) => {
    updateSlider(e.target.value);
  });
}

/* ==========================================================================
   INTERACTIVE LIVE ESTIMATOR (CALCULATEUR DE BUDGET)
   ========================================================================== */
function initPriceEstimator() {
  const eventSelect = document.getElementById('est-event-type');
  const hoursInput = document.getElementById('est-hours');
  const hoursValDisplay = document.getElementById('est-hours-val');
  const droneCheckbox = document.getElementById('opt-drone');
  const secondShooterCheckbox = document.getElementById('opt-second');
  const videoTeaserCheckbox = document.getElementById('opt-teaser');
  const fineArtAlbumCheckbox = document.getElementById('opt-album');
  
  const totalPriceDisplay = document.getElementById('est-total-price');
  const transferBtn = document.getElementById('btn-transfer-estimate');

  if (!eventSelect || !hoursInput || !totalPriceDisplay) return;

  const baseRates = {
    mariage: 180,    // €/h with minimum starting point
    soiree: 140,     // €/h
    fete: 120,       // €/h
    voyage: 220,     // €/h
    portrait: 150    // €/h
  };

  const optionPrices = {
    drone: 250,
    secondShooter: 350,
    videoTeaser: 290,
    album: 390
  };

  function calculateTotal() {
    const eventType = eventSelect.value;
    const hours = parseInt(hoursInput.value, 10);
    const hourlyRate = baseRates[eventType] || 160;

    let base = hours * hourlyRate;
    if (eventType === 'mariage' && base < 1200) base = 1200; // minimum package base

    let extras = 0;
    if (droneCheckbox && droneCheckbox.checked) extras += optionPrices.drone;
    if (secondShooterCheckbox && secondShooterCheckbox.checked) extras += optionPrices.secondShooter;
    if (videoTeaserCheckbox && videoTeaserCheckbox.checked) extras += optionPrices.videoTeaser;
    if (fineArtAlbumCheckbox && fineArtAlbumCheckbox.checked) extras += optionPrices.album;

    const total = base + extras;
    totalPriceDisplay.textContent = `${total.toLocaleString('fr-FR')} €`;

    if (hoursValDisplay) {
      hoursValDisplay.textContent = `${hours} h`;
    }

    return { total, eventType, hours, extras };
  }

  eventSelect.addEventListener('change', calculateTotal);
  hoursInput.addEventListener('input', calculateTotal);
  [droneCheckbox, secondShooterCheckbox, videoTeaserCheckbox, fineArtAlbumCheckbox].forEach(cb => {
    if (cb) cb.addEventListener('change', calculateTotal);
  });

  // Transfer estimate to contact form
  if (transferBtn) {
    transferBtn.addEventListener('click', () => {
      const { total, eventType, hours } = calculateTotal();
      const contactSelect = document.getElementById('contact-event');
      const contactMsg = document.getElementById('contact-message');

      if (contactSelect) {
        contactSelect.value = eventType;
      }
      if (contactMsg) {
        const optionsSelected = [];
        if (droneCheckbox?.checked) optionsSelected.push('Drone 4K');
        if (secondShooterCheckbox?.checked) optionsSelected.push('2e Photographe');
        if (videoTeaserCheckbox?.checked) optionsSelected.push('Teaser Reels/GIFs');
        if (fineArtAlbumCheckbox?.checked) optionsSelected.push('Livre d\'Art');

        const optionsText = optionsSelected.length > 0 ? `Options: ${optionsSelected.join(', ')}` : 'Sans options supplémentaires';
        contactMsg.value = `Bonjour Ambinintsoa,\n\nJe souhaite réserver une prestation pour : ${eventType.toUpperCase()} (${hours}h d'intervention estimée).\n${optionsText}.\nBudget estimé via le simulateur : ~${total} €.\n\nMerci de me recontacter !`;
      }

      // Smooth scroll to contact section
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        showToast('Devis transféré vers le formulaire !');
      }
    });
  }

  // Initial calculation
  calculateTotal();
}

/* ==========================================================================
   FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other items
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   CONTACT FORM & TOAST NOTIFICATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Simulate sending with loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
        <path d="M12 2a10 10 0 0 1 10 10"/>
      </svg>
      Envoi en cours...
    `;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();
      showToast('Votre demande a été envoyée avec succès ! Réponse sous 24h.');
    }, 900);
  });
}

function showToast(message) {
  let toast = document.getElementById('toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notice';
    toast.className = 'toast-notice';
    toast.innerHTML = `
      <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      <span id="toast-text">${message}</span>
    `;
    document.body.appendChild(toast);
  } else {
    document.getElementById('toast-text').textContent = message;
  }

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* ==========================================================================
   INTERSECTION OBSERVER FOR ACTIVE NAV HIGHLIGHT
   ========================================================================== */
function initActiveNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    },
    {
      rootMargin: '-30% 0px -70% 0px'
    }
  );

  sections.forEach(section => observer.observe(section));
}

// Add simple spinner keyframes if not present
const style = document.createElement('style');
style.textContent = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);
