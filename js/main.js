/**
 * DAGAM CHANDRAMOHAN | Portfolio Interaction Engine
 * Clean, vanilla JavaScript with zero external runtime dependencies.
 * Modern UI/UX: Warm Neutrals + High-Res Case Study Showcase & Lightbox Inspector.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /* ----------------------------------------------------------------------------
     1. THEME SWITCHER WITH LOCALSTORAGE PERSISTENCE
     ---------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('dc_portfolio_theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dc_portfolio_theme', theme);

    if (themeToggleBtn) {
      const isDark = theme === 'dark';
      themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      themeToggleBtn.innerHTML = isDark
        ? `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
        : `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    }

    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', theme === 'dark' ? '#151413' : '#FAF7F2');
    }
  };

  // Initialize theme
  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // System theme changes listener
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('dc_portfolio_theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  /* ----------------------------------------------------------------------------
     2. STICKY NAVBAR & SCROLL DETECTIONS
     ---------------------------------------------------------------------------- */
  const navbar = document.getElementById('main-header');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('back-to-top');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    if (navbar) {
      if (scrollY > 16) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Active section spy
  if ('IntersectionObserver' in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else if (href && href.startsWith('#')) {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-40% 0px -50% 0px',
      threshold: 0
    });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    });
  }

  /* ----------------------------------------------------------------------------
     3. MOBILE NAVIGATION DRAWER
     ---------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileBackdrop = document.getElementById('mobile-drawer-backdrop');

  const openMobileMenu = () => {
    if (!mobileDrawer || !mobileToggle) return;
    mobileDrawer.classList.add('open');
    mobileBackdrop?.classList.add('open');
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');

    const firstFocusable = mobileDrawer.querySelector('a, button');
    firstFocusable?.focus();
  };

  const closeMobileMenu = () => {
    if (!mobileDrawer || !mobileToggle) return;
    mobileDrawer.classList.remove('open');
    mobileBackdrop?.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    mobileToggle.focus();
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer?.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileMenu);
  }

  const drawerLinks = mobileDrawer?.querySelectorAll('a');
  drawerLinks?.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  /* ----------------------------------------------------------------------------
     4. CASE STUDY INTERACTIVE TABS (Problem & Solution / Features / Stack)
     ---------------------------------------------------------------------------- */
  const caseCards = document.querySelectorAll('.case-card');

  caseCards.forEach((card) => {
    const tabButtons = card.querySelectorAll('.case-tab-btn');
    const tabPanels = card.querySelectorAll('.case-tab-panel');

    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetPanelId = btn.getAttribute('aria-controls');

        // Reset all buttons in this card
        tabButtons.forEach((b) => b.setAttribute('aria-selected', 'false'));
        btn.setAttribute('aria-selected', 'true');

        // Toggle panels
        tabPanels.forEach((panel) => {
          if (panel.id === targetPanelId) {
            panel.removeAttribute('hidden');
          } else {
            panel.setAttribute('hidden', '');
          }
        });
      });
    });
  });

  /* ----------------------------------------------------------------------------
     5. CASE STUDY CATEGORY FILTERING & ARIA LIVE
     ---------------------------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.case-filter-btn');
  const filterLiveAnnouncer = document.getElementById('projects-live-announcer');

  if (filterButtons.length > 0 && caseCards.length > 0) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filterValue = btn.getAttribute('data-filter') || 'all';

        filterButtons.forEach((b) => b.setAttribute('aria-pressed', 'false'));
        btn.setAttribute('aria-pressed', 'true');

        let visibleCount = 0;

        caseCards.forEach((card) => {
          const categories = (card.getAttribute('data-categories') || '').split(',');
          const matches = filterValue === 'all' || categories.includes(filterValue);

          if (matches) {
            visibleCount++;
            card.removeAttribute('hidden');
            setTimeout(() => {
              card.classList.remove('filtering-out');
            }, 10);
          } else {
            card.classList.add('filtering-out');
            setTimeout(() => {
              card.setAttribute('hidden', '');
            }, 250);
          }
        });

        if (filterLiveAnnouncer) {
          filterLiveAnnouncer.textContent = `Showing ${visibleCount} case stud${visibleCount === 1 ? 'y' : 'ies'}`;
        }
      });
    });
  }

  /* ----------------------------------------------------------------------------
     6. HIGH-RESOLUTION CASE STUDY LIGHTBOX INSPECTOR
     ---------------------------------------------------------------------------- */
  const lightboxDialog = document.getElementById('case-study-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxImgWrapper = document.getElementById('lightbox-img-wrapper');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxBadge = document.getElementById('lightbox-badge');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxIndicator = document.getElementById('lightbox-indicator');
  const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
  const lightboxNextBtn = document.getElementById('lightbox-next-btn');
  const lightboxZoomToggle = document.getElementById('lightbox-zoom-toggle');
  const lightboxOpenExternal = document.getElementById('lightbox-open-external');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');

  // Case studies data definition for the lightbox
  const caseStudiesData = [
    {
      id: 'agro-mitra',
      badge: 'Case Study 01 · AgriTech & AI',
      title: 'Agro Mitra — Better Farming • Smarter Decisions • Higher Yields',
      image: 'assets/images/case-study-agro-mitra.jpg',
      caption: 'Full-Stack Board: 8 Android Screens, Real-Time Mandi Prices, Dijkstra Logistics & Gromitra AI Engine'
    },
    {
      id: 'diagnosphere',
      badge: 'Case Study 02 · Healthcare AI',
      title: 'Diagnosphere — AI-Powered Healthcare Platform',
      image: 'assets/images/case-study-diagnosphere.jpg',
      caption: 'Diagnostic Telemetry Board: Responsive Web Dashboard, Android Vitals Telemetry, Sequential Intake Pipeline & 90%+ Accuracy'
    },
    {
      id: 'ai-smart-healthcare',
      badge: 'Case Study 03 · Clinical Telemetry',
      title: 'AI Smart Health Care — Predictive Diagnosis & Treatment Platform',
      image: 'assets/images/case-study-ai-smart-healthcare.jpg',
      caption: 'Platform Board: Patient Web Hub, Android Mobile Suite, Medicine Adherence Alerts & 50K+ Active Users'
    }
  ];

  let currentCaseIndex = 0;
  let isZoomedFull = false;

  const updateLightboxContent = (index) => {
    currentCaseIndex = (index + caseStudiesData.length) % caseStudiesData.length;
    const item = caseStudiesData[currentCaseIndex];

    if (lightboxImg) {
      lightboxImg.src = item.image;
      lightboxImg.alt = `${item.title} full resolution infographic presentation`;
    }
    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxBadge) lightboxBadge.textContent = item.badge;
    if (lightboxCaption) lightboxCaption.textContent = item.caption;
    if (lightboxIndicator) lightboxIndicator.textContent = `${currentCaseIndex + 1} of ${caseStudiesData.length}`;
    if (lightboxOpenExternal) lightboxOpenExternal.href = item.image;

    // Reset zoom state when navigating
    isZoomedFull = false;
    lightboxImgWrapper?.classList.remove('zoomed-full');
    if (lightboxZoomToggle) {
      lightboxZoomToggle.querySelector('.zoom-label').textContent = 'Fit Screen';
    }
  };

  const openLightbox = (index = 0) => {
    if (!lightboxDialog) return;
    updateLightboxContent(index);
    if (typeof lightboxDialog.showModal === 'function') {
      lightboxDialog.showModal();
    } else {
      lightboxDialog.setAttribute('open', '');
    }
    document.body.classList.add('dialog-open');
  };

  const closeLightbox = () => {
    if (!lightboxDialog) return;
    if (typeof lightboxDialog.close === 'function') {
      lightboxDialog.close();
    } else {
      lightboxDialog.removeAttribute('open');
    }
    document.body.classList.remove('dialog-open');
  };

  // Wire all inspect triggers on page
  const inspectTriggers = document.querySelectorAll('.open-lightbox-trigger');
  inspectTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const caseIndex = parseInt(trigger.getAttribute('data-case-index'), 10) || 0;
      openLightbox(caseIndex);
    });
  });

  if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener('click', () => {
      updateLightboxContent(currentCaseIndex - 1);
    });
  }

  if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener('click', () => {
      updateLightboxContent(currentCaseIndex + 1);
    });
  }

  if (lightboxZoomToggle) {
    lightboxZoomToggle.addEventListener('click', () => {
      isZoomedFull = !isZoomedFull;
      lightboxImgWrapper?.classList.toggle('zoomed-full', isZoomedFull);
      const label = lightboxZoomToggle.querySelector('.zoom-label');
      if (label) {
        label.textContent = isZoomedFull ? 'Actual 100%' : 'Fit Screen';
      }
    });
  }

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  // Close when clicking directly on the backdrop of native dialog
  if (lightboxDialog) {
    lightboxDialog.addEventListener('click', (e) => {
      if (e.target === lightboxDialog) {
        closeLightbox();
      }
    });

    lightboxDialog.addEventListener('cancel', () => {
      document.body.classList.remove('dialog-open');
    });
  }

  // Keyboard navigation inside lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightboxDialog?.hasAttribute('open')) return;

    if (e.key === 'ArrowLeft') {
      updateLightboxContent(currentCaseIndex - 1);
    } else if (e.key === 'ArrowRight') {
      updateLightboxContent(currentCaseIndex + 1);
    } else if (e.key === 'Escape') {
      closeLightbox();
    }
  });

  /* ----------------------------------------------------------------------------
     7. TOAST NOTIFICATION UTILITY
     ---------------------------------------------------------------------------- */
  const toastNotice = document.getElementById('toast-notice');
  let toastTimeout = null;

  const showToast = (message, duration = 3000) => {
    if (!toastNotice) return;
    toastNotice.textContent = message;
    toastNotice.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNotice.classList.remove('show');
    }, duration);
  };

  /* ----------------------------------------------------------------------------
     8. ONE-CLICK EMAIL COPY
     ---------------------------------------------------------------------------- */
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'mohandagam04@gmail.com';
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = email;
          textarea.style.position = 'fixed';
          textarea.style.left = '-9999px';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }
        showToast('Email address copied to clipboard!');
        const originalText = copyEmailBtn.textContent;
        copyEmailBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyEmailBtn.textContent = originalText;
        }, 2200);
      } catch (err) {
        showToast(`Email: ${email}`);
      }
    });
  }

  /* ----------------------------------------------------------------------------
     9. CONTACT FORM INTERACTIVE VALIDATION & BACKEND CONNECTIVITY
     ---------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status-notice');
  const formTimeInput = document.getElementById('form_time');
  const csrfTokenInput = document.getElementById('csrf_token');

  // Initialize anti-bot timestamp
  const resetFormTimer = () => {
    if (formTimeInput) {
      formTimeInput.value = Math.floor(Date.now() / 1000).toString();
    }
  };
  resetFormTimer();

  // Fetch CSRF token if backend provides session token endpoint (e.g. PHP backend)
  const refreshCsrfToken = async () => {
    try {
      const response = await fetch('php/contact.php?action=token', { credentials: 'same-origin' });
      if (response.ok) {
        const data = await response.json();
        if (data?.token && csrfTokenInput) {
          csrfTokenInput.value = data.token;
        }
      }
    } catch (_) {
      // In static preview or Vercel, CSRF token is not required
    }
  };
  refreshCsrfToken();

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = contactForm.querySelector('[name="name"]');
      const emailInput = contactForm.querySelector('[name="email"]');
      const subjectInput = contactForm.querySelector('[name="subject"]');
      const messageInput = contactForm.querySelector('[name="message"]');
      const honeypot = contactForm.querySelector('[name="website_hp"]');

      if (honeypot && honeypot.value.trim() !== '') {
        return; // Bot detected, silent reject
      }

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const subjectVal = subjectInput && subjectInput.value.trim() ? subjectInput.value.trim() : 'Portfolio Inquiry';
      const messageVal = messageInput ? messageInput.value.trim() : '';

      if (!nameVal) {
        showToast('Please enter your name.');
        nameInput?.focus();
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailRegex.test(emailVal)) {
        showToast('Please enter a valid email address.');
        emailInput?.focus();
        return;
      }

      if (!messageVal || messageVal.length < 10) {
        showToast('Please provide a message of at least 10 characters.');
        messageInput?.focus();
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '<span>Send Message</span>';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending Message...</span>';
      }

      if (formStatus) {
        formStatus.innerHTML = '';
      }

      // Collect form data payload
      const payload = {
        name: nameVal,
        email: emailVal,
        subject: subjectVal,
        message: messageVal,
        website_hp: honeypot ? honeypot.value : '',
        form_time: formTimeInput ? formTimeInput.value : '',
        csrf_token: csrfTokenInput ? csrfTokenInput.value : ''
      };

      const formData = new FormData(contactForm);

      let responseSuccess = false;
      let responseMessage = '';

      // STEP 1: Attempt Vercel Serverless Function (/api/contact)
      try {
        const vercelRes = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        // If the Vercel API endpoint answered (not a 404 static page)
        if (vercelRes.status !== 404) {
          const contentType = vercelRes.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const data = await vercelRes.json();
            if (vercelRes.ok && data.success) {
              responseSuccess = true;
              responseMessage = data.message || `Thank you, ${nameVal}! Your message has been received.`;
            } else {
              responseMessage = data.message || 'Submission error. Please check your details.';
            }
          }
        }
      } catch (vercelErr) {
        // Continue to PHP fallback if /api/contact is unavailable
      }

      // STEP 2: If /api/contact did not succeed, attempt PHP backend (php/contact.php)
      if (!responseSuccess && !responseMessage) {
        try {
          const phpRes = await fetch('php/contact.php', {
            method: 'POST',
            body: formData,
            credentials: 'same-origin',
            headers: {
              'Accept': 'application/json'
            }
          });

          const contentType = phpRes.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const data = await phpRes.json();
            if (phpRes.ok && data.success) {
              responseSuccess = true;
              responseMessage = data.message || `Thank you, ${nameVal}! Your message has been received.`;
            } else {
              responseMessage = data.message || 'Submission error. Please check your details.';
            }
          }
        } catch (phpErr) {
          // Both endpoints were unreachable (e.g. offline preview without server)
        }
      }

      // Restore submit button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }

      // Render response
      if (responseSuccess) {
        if (formStatus) {
          formStatus.innerHTML = `
            <div style="padding: 16px; background-color: var(--accent-soft); border: 1px solid var(--accent-border); border-radius: var(--r-sm); color: var(--text-main); margin-top: 12px;">
              <strong style="color: var(--primary-accent); display: block; margin-bottom: 4px;">✓ Message Sent Successfully!</strong>
              ${responseMessage}<br>
              <span style="font-size: 0.8125rem; color: var(--text-muted); margin-top: 4px; display: inline-block;">
                A confirmation has been recorded for <strong>${emailVal}</strong>.
              </span>
            </div>
          `;
        }
        showToast('Message sent successfully!');
        contactForm.reset();
        resetFormTimer();
        refreshCsrfToken();
      } else if (responseMessage) {
        // Server reported specific error
        if (formStatus) {
          formStatus.innerHTML = `
            <div style="padding: 14px; background-color: rgba(220, 38, 38, 0.08); border: 1px solid rgba(220, 38, 38, 0.3); border-radius: var(--r-sm); color: var(--text-main); margin-top: 12px;">
              <strong style="color: #DC2626;">Submission Notice:</strong> ${responseMessage}
            </div>
          `;
        }
        showToast(responseMessage);
      } else {
        // Both backends unreachable (e.g. static file preview without web server)
        const mailtoUrl = `mailto:mohandagam04@gmail.com?subject=${encodeURIComponent(subjectVal)}&body=${encodeURIComponent(`Hi Chandramohan,\n\nName: ${nameVal}\nEmail: ${emailVal}\n\n${messageVal}`)}`;
        if (formStatus) {
          formStatus.innerHTML = `
            <div style="padding: 16px; background-color: var(--surface-alt); border: 1px solid var(--border); border-radius: var(--r-sm); margin-top: 12px;">
              <div style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 12px;">
                Direct backend connection is in preview mode. Click below to deliver your message directly via email:
              </div>
              <a href="${mailtoUrl}" class="btn-editorial-primary" style="display: inline-flex; font-size: 0.8125rem; padding: 8px 18px;">
                Send directly to mohandagam04@gmail.com ↗
              </a>
            </div>
          `;
        }
        showToast('Connecting via direct email...');
      }
    });
  }

  // Footer Year
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear().toString();
  }
});
