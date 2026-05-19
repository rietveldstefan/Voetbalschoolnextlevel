/* =====================================================
   NEXT LEVEL VOETBALSCHOOL — JAVASCRIPT
   Navbar, smooth scroll, carrousel, animaties, form
   ===================================================== */

(function () {
  'use strict';

  /* ===== SMOOTH SCROLL ===== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        var navHeight = document.getElementById('navbar').offsetHeight;
        var targetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;

        window.scrollTo({ top: targetTop, behavior: 'smooth' });

        // Mobiel menu sluiten na klik
        closeMobileMenu();
      });
    });
  }

  /* ===== NAVBAR SCROLL EFFECT ===== */
  function initNavbar() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    function onScroll() {
      if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      updateActiveNavLink();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // direct uitvoeren bij laden
  }

  /* ===== ACTIEVE NAVIGATIELINK ===== */
  function updateActiveNavLink() {
    var scrollPos = window.scrollY + 130;
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link');

    var activeSectionId = null;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        activeSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      var href = link.getAttribute('href');
      if (activeSectionId && href === '#' + activeSectionId) {
        link.classList.add('active');
      }
    });
  }

  /* ===== HAMBURGER MENU ===== */
  var hamburger = document.getElementById('hamburger');
  var navMenu = document.getElementById('nav-menu');
  var menuOpen = false;

  function openMobileMenu() {
    menuOpen = true;
    hamburger.classList.add('open');
    navMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    menuOpen = false;
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function initHamburger() {
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', function () {
      if (menuOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Klik buiten menu → sluiten
    document.addEventListener('click', function (e) {
      if (menuOpen && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Escape toets
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuOpen) {
        closeMobileMenu();
      }
    });
  }

  /* ===== HERO VIDEO FALLBACK ===== */
  function initHeroBg() {
    // Video autoplay wordt volledig via HTML-attributen geregeld
  }

  /* ===== SCROLL-ANIMATIES (IntersectionObserver) ===== */
  function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: toon alles direct
      document.querySelectorAll('[data-animate]').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            // Staggering op kinderen als ze er zijn
            var children = el.querySelectorAll(
              '.pricing-card, .agenda-card, .feature-item, .sponsor-item'
            );

            if (children.length > 0) {
              children.forEach(function (child, idx) {
                child.style.transitionDelay = idx * 0.1 + 's';
              });
            }

            setTimeout(function () {
              el.classList.add('visible');
            }, 60);

            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('[data-animate]').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ===== FORMULIERVALIDATIE ===== */
  function initForm() {
    var form = document.getElementById('contactForm');
    var formSuccess = document.getElementById('formSuccess');
    var submitBtn = document.getElementById('submitBtn');

    if (!form) return;

    // Verwijder foutklasse bij typen
    form.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        this.classList.remove('is-error');
        var group = this.closest('.form-group');
        if (group) group.classList.remove('has-error');
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var valid = true;
      var requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(function (field) {
        field.classList.remove('is-error');
        var group = field.closest('.form-group');
        if (group) group.classList.remove('has-error');

        var isEmpty = !field.value.trim();
        var isInvalid = !field.checkValidity();

        if (isEmpty || isInvalid) {
          field.classList.add('is-error');
          if (group) group.classList.add('has-error');
          valid = false;
        }
      });

      if (!valid) {
        // Focus eerste fout-veld
        var firstError = form.querySelector('.is-error');
        if (firstError) firstError.focus();
        return;
      }

      // Simuleer verzending (geen echte backend)
      submitBtn.textContent = 'VERZENDEN...';
      submitBtn.disabled = true;

      setTimeout(function () {
        submitBtn.textContent = 'VERZONDEN ✓';
        submitBtn.style.background = '#4caf50';
        submitBtn.style.color = '#fff';
        submitBtn.style.boxShadow = '0 4px 24px rgba(76,175,80,0.35)';

        if (formSuccess) formSuccess.style.display = 'block';

        form.reset();

        // Na 5 seconden terugzetten
        setTimeout(function () {
          submitBtn.textContent = 'VERSTUUR BERICHT';
          submitBtn.disabled = false;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
          submitBtn.style.boxShadow = '';
          if (formSuccess) formSuccess.style.display = 'none';
        }, 5000);
      }, 900);
    });
  }

  /* ===== CARROUSEL PAUZE OP HOVER ===== */
  function initCarousel() {
    var track = document.getElementById('carouselTrack');
    if (!track) return;

    // De hover-pauze is al via CSS geregeld (.carousel-track:hover).
    // Hier voegen we touch-support toe voor mobiel.
    var touchStartX = 0;

    track.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
      track.style.animationPlayState = 'paused';
    }, { passive: true });

    track.addEventListener('touchend', function () {
      track.style.animationPlayState = 'running';
    }, { passive: true });
  }

  /* ===== TRAINER MODALS ===== */
  function initTrainerModals() {
    var cards = document.querySelectorAll('[data-modal]');
    if (!cards.length) return;

    function openModal(id) {
      var modal = document.getElementById(id);
      if (!modal) return;
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      // Focus sluiten-knop voor toegankelijkheid
      var closeBtn = modal.querySelector('.trainer-modal-close');
      if (closeBtn) closeBtn.focus();
    }

    function closeModal(modal) {
      modal.classList.remove('is-open');
      // Herstel scroll alleen als er geen mobiel menu open is
      var navMenu = document.getElementById('nav-menu');
      if (!navMenu || !navMenu.classList.contains('open')) {
        document.body.style.overflow = '';
      }
    }

    function closeAllModals() {
      document.querySelectorAll('.trainer-modal.is-open').forEach(closeModal);
    }

    // Klik op trainer-card → modal openen
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        openModal(card.getAttribute('data-modal'));
      });
      // Toetsenbord: Enter of Spatie
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(card.getAttribute('data-modal'));
        }
      });
    });

    // Klik op sluitknop
    document.querySelectorAll('.trainer-modal-close').forEach(function (btn) {
      btn.addEventListener('click', function () {
        closeModal(btn.closest('.trainer-modal'));
      });
    });

    // Klik op overlay (buiten het paneel)
    document.querySelectorAll('.trainer-modal').forEach(function (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal(modal);
      });
    });

    // Escape toets
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAllModals();
    });
  }

  /* ===== INITIALISATIE ===== */
  document.addEventListener('DOMContentLoaded', function () {
    initSmoothScroll();
    initNavbar();
    initHamburger();
    initHeroBg();
    initScrollAnimations();
    initForm();
    initCarousel();
    initTrainerModals();
  });

})();
