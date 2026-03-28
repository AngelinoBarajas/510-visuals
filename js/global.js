/* 5TEN VISUALS — Global JS (site-wide)
   CDN: https://cdn.jsdelivr.net/gh/AngelinoBarajas/510-visuals@main/js/global.js
   NOTE: GSAP CDN and Unicorn Studio CDN must be loaded BEFORE this file */

<!-- =========================================================
  0) Unicorn Studio (load once globally)
  Where: Site Settings > Footer
========================================================= -->

  !(function () {
    var u = window.UnicornStudio;
    if (u && u.init) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
          u.init();
        });
      } else {
        u.init();
      }
    } else {
      window.UnicornStudio = { isInitialized: !1 };
      var i = document.createElement('script');
      ((i.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.5/dist/unicornStudio.umd.js'),
        (i.onload = function () {
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () {
              UnicornStudio.init();
            });
          } else {
            UnicornStudio.init();
          }
        }),
        (document.head || document.body).appendChild(i));
    }
  })();


<!-- =========================================================
  1) GSAP Core (load once globally)
  Where: Site Settings > Footer
========================================================= -->



  /* =========================================================
  2) Global Navbar Hide/Show (NO fade-in)
  Opt-in: .navbar1_component
  Where: Site Settings > Footer
========================================================= */
  window.Webflow = window.Webflow || [];
  window.Webflow.push(function () {
    const nav = document.querySelector('.navbar1_component');
    if (!nav) return;

    if (nav.__tenNavbarInit) return;
    nav.__tenNavbarInit = true;

    const HIDE_CLASS = 'navbar--hidden';
    const SCROLL_THRESHOLD = 5;
    const HIDE_AFTER_PX = 60;
    const IDLE_DELAY = 800;

    let lastY = window.pageYOffset || 0;
    let idleTO = null;
    let ticking = false;

    function isMenuOpen() {
      const btn = nav.querySelector('.w-nav-button');
      if (btn && btn.classList.contains('w--open')) return true;

      const menu = nav.querySelector('.w-nav-menu');
      if (menu && menu.classList.contains('w--nav-menu-open')) return true;

      return false;
    }

    function showNav() {
      nav.classList.remove(HIDE_CLASS);
    }
    function hideNav() {
      nav.classList.add(HIDE_CLASS);
    }

    function update() {
      ticking = false;

      if (isMenuOpen()) {
        showNav();
        lastY = window.pageYOffset || 0;
        return;
      }

      const y = window.pageYOffset || 0;
      const delta = y - lastY;

      if (Math.abs(delta) < SCROLL_THRESHOLD) {
        lastY = y;
        return;
      }

      if (delta > 0 && y > HIDE_AFTER_PX) hideNav();
      if (delta < 0) showNav();

      lastY = y;

      clearTimeout(idleTO);
      idleTO = setTimeout(function () {
        if (!isMenuOpen()) showNav();
      }, IDLE_DELAY);
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    document.addEventListener(
      'click',
      function () {
        if (isMenuOpen()) showNav();
      },
      { passive: true },
    );
  });



  /* =========================================================
  3) CTA38 (CMS) — Dim + Hover Preview (no jQuery)
  Opt-in: .section_cta38
  Where: Site Settings > Footer
========================================================= */
  window.Webflow = window.Webflow || [];
  window.Webflow.push(function () {
    if (window.innerWidth < 992) return;

    const section = document.querySelector('.section_cta38');
    if (!section) return;

    if (section.__cta38CmsHoverInit) return;
    section.__cta38CmsHoverInit = true;

    const links = Array.from(section.querySelectorAll('.w-dyn-list .cta38_link-block'));
    if (!links.length) return;

    if (window.getComputedStyle(section).position === 'static') {
      section.style.position = 'relative';
    }

    let preview = section.querySelector('.cta38_hover-preview');
    let previewImg = preview ? preview.querySelector('img') : null;

    if (!preview) {
      preview = document.createElement('div');
      preview.className = 'cta38_hover-preview';
      previewImg = document.createElement('img');
      previewImg.alt = '';
      preview.appendChild(previewImg);
      section.appendChild(preview);
    }

    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

    function setActive(link) {
      section.classList.add('is-dimming');
      links.forEach((a) => a.classList.toggle('is-active', a === link));
    }

    function clearActive() {
      section.classList.remove('is-dimming');
      links.forEach((a) => a.classList.remove('is-active'));
    }

    function setPreviewFromLink(link) {
      const img = link.querySelector('.cta38_link-image');
      if (!img) return false;
      const src = img.getAttribute('src');
      if (!src) return false;
      if (previewImg.getAttribute('src') !== src) previewImg.setAttribute('src', src);
      return true;
    }

    function showPreview() {
      preview.classList.add('is-active');
    }
    function hidePreview() {
      preview.classList.remove('is-active');
      preview.style.transform = 'translate3d(-9999px, -9999px, 0)';
    }

    function movePreview(e) {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const pw = preview.offsetWidth || 360;
      const ph = preview.offsetHeight || 240;

      const left = clamp(x + 26, 0, rect.width - pw);
      const top = clamp(y + 18, 0, rect.height - ph);

      preview.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    }

    links.forEach((link) => {
      link.addEventListener('mouseenter', (e) => {
        const ok = setPreviewFromLink(link);
        setActive(link);
        if (ok) {
          showPreview();
          movePreview(e);
        } else hidePreview();
      });

      link.addEventListener('mousemove', (e) => {
        if (!preview.classList.contains('is-active')) return;
        movePreview(e);
      });

      link.addEventListener('mouseleave', () => {
        clearActive();
        hidePreview();
      });

      link.addEventListener('focus', () => {
        const ok = setPreviewFromLink(link);
        setActive(link);
        if (ok) showPreview();
      });

      link.addEventListener('blur', () => {
        clearActive();
        hidePreview();
      });
    });
  });



  /* =========================================================
  4) Column Transition — hardened (working version)
  Opt-in: .column-transition_component + .column-transition_column
  Where: Site Settings > Footer
========================================================= */
  (function () {
    'use strict';

    function ready(fn) {
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
      else fn();
    }

    try {
      if (!sessionStorage.getItem('column-transition-first-visit')) {
        sessionStorage.setItem('column-transition-first-visit', 'viewed');
        document.documentElement.classList.add('column-transition-first-visit');
      }
    } catch (e) {}

    ready(function () {
      const component = document.querySelector('.column-transition_component');
      if (!component) return;

      if (!window.gsap) {
        component.style.display = 'none';
        return;
      }

      if (component.__tenInit) return;
      component.__tenInit = true;

      const cols = Array.from(component.querySelectorAll('.column-transition_column'));
      if (!cols.length) return;

      function showOverlay() {
        component.style.display = 'flex';
      }
      function hideOverlay() {
        component.style.display = 'none';
      }

      function isModifiedClick(e) {
        return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1;
      }

      function isSkippableLink(a) {
        if (!a) return true;
        if (a.hasAttribute('data-no-transition')) return true;

        const href = a.getAttribute('href') || '';
        if (!href) return true;
        if (/^(mailto:|tel:|sms:)/i.test(href)) return true;
        if (a.hasAttribute('download')) return true;
        if (a.classList.contains('w-lightbox')) return true;
        if (href.includes('#')) return true;
        if (a.target === '_blank') return true;

        let url;
        try {
          url = new URL(a.href);
        } catch (e) {
          return true;
        }
        if (url.host !== window.location.host) return true;

        return false;
      }

      hideOverlay();

      const isFirstVisit = document.documentElement.classList.contains('column-transition-first-visit');
      if (!isFirstVisit) {
        showOverlay();
        window.gsap.killTweensOf(cols);

        window.gsap
          .timeline({ defaults: { overwrite: true } })
          .set(cols, { yPercent: 0 })
          .to(cols, {
            yPercent: -100,
            duration: 0.55,
            ease: 'power1.inOut',
            stagger: { each: 0.14, from: 'start' },
          })
          .set(component, { display: 'none' });
      }

      document.addEventListener(
        'click',
        function (e) {
          if (isModifiedClick(e)) return;

          const link = e.target.closest('a');
          if (!link) return;
          if (isSkippableLink(link)) return;

          const nextUrl = link.href;
          if (!nextUrl || nextUrl === window.location.href) return;

          e.preventDefault();

          showOverlay();
          window.gsap.killTweensOf(cols);

          window.gsap
            .timeline({
              defaults: { overwrite: true },
              onComplete: function () {
                window.location.href = nextUrl;
              },
            })
            .set(cols, { yPercent: 100 })
            .to(cols, {
              yPercent: 0,
              duration: 0.55,
              ease: 'power1.inOut',
              stagger: { each: 0.14, from: 'start' },
            });
        },
        true,
      );

      window.addEventListener('pageshow', function (e) {
        if (e.persisted) window.location.reload();
      });
    });
  })();



  /* =========================================================
  5) Layout423 — Drag scroller (link-safe, no ghost drag)
  Opt-in: .section_layout423
  Where: Site Settings > Footer

  CHANGELOG (2026-02-17):
  - Removed preventDefault() on pointerdown (was killing anchor navigation)
  - Now prevents default ONLY after real horizontal drag intent is detected
  - Keeps click suppression ONLY after drag (no drag-link conflict)
========================================================= */
  window.Webflow = window.Webflow || [];
  window.Webflow.push(function () {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll('.section_layout423').forEach((section) => {
      if (section.__tenL423Init) return;
      section.__tenL423Init = true;

      const scroller = section.querySelector('.layout423_scroller');
      const track = section.querySelector('.layout423_track');
      if (!scroller || !track) return;

      const btnPrev = section.querySelector('.layout423_button.is-previous') || section.querySelector('.layout423_button.is-prev');

      const btnNext = section.querySelector('.layout423_button.is-next');

      let fadeRAF = 0;
      function updateFades() {
        fadeRAF = 0;
        const maxScroll = scroller.scrollWidth - scroller.clientWidth;
        const x = scroller.scrollLeft;
        scroller.classList.toggle('is-at-end', x >= maxScroll - 2);
      }
      function requestFadeUpdate() {
        if (fadeRAF) return;
        fadeRAF = requestAnimationFrame(updateFades);
      }

      function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
      }

      function killTween() {
        if (scroller.__tenScrollTween && scroller.__tenScrollTween.kill) {
          scroller.__tenScrollTween.kill();
          scroller.__tenScrollTween = null;
        }
      }

      function scrollToX(targetX, opts) {
        const maxScroll = scroller.scrollWidth - scroller.clientWidth;
        const x = clamp(targetX, 0, Math.max(0, maxScroll));

        killTween();

        const instant = opts && opts.instant;
        if (reduceMotion || !window.gsap || instant) {
          scroller.scrollLeft = x;
          requestFadeUpdate();
          return;
        }

        scroller.__tenScrollTween = gsap.to(scroller, {
          scrollLeft: x,
          duration: 0.65,
          ease: 'power3.out',
          overwrite: true,
          onUpdate: requestFadeUpdate,
          onComplete: () => {
            scroller.__tenScrollTween = null;
            requestFadeUpdate();
          },
        });
      }

      function go(dir) {
        const delta = scroller.clientWidth * 0.8;
        scrollToX(scroller.scrollLeft + dir * delta);
      }

      if (btnPrev)
        btnPrev.addEventListener('click', (e) => {
          e.preventDefault();
          go(-1);
        });
      if (btnNext)
        btnNext.addEventListener('click', (e) => {
          e.preventDefault();
          go(1);
        });

      // Prevent native browser drag on links/images inside scroller (the “ghost link grab”)
      scroller.addEventListener('dragstart', (e) => e.preventDefault(), true);

      // ---- Drag (link-safe) ----
      let isDown = false;
      let dragged = false;
      let startX = 0;
      let startY = 0;
      let startScrollLeft = 0;
      let pointerCaptured = false;

      const DRAG_THRESHOLD = 10;

      section.querySelectorAll('img').forEach((img) => img.setAttribute('draggable', 'false'));

      scroller.addEventListener(
        'pointerdown',
        (e) => {
          if (e.pointerType === 'mouse' && e.button !== 0) return;

          isDown = true;
          dragged = false;
          pointerCaptured = false;

          killTween();

          startX = e.clientX;
          startY = e.clientY;
          startScrollLeft = scroller.scrollLeft;

          // NOTE: DO NOT preventDefault here.
          // We only preventDefault after we detect a real horizontal drag.
        },
        { passive: true },
      );

      scroller.addEventListener(
        'pointermove',
        (e) => {
          if (!isDown) return;

          const dx = e.clientX - startX;
          const dy = e.clientY - startY;

          // Only enter "dragging" after threshold is met
          if (!dragged && Math.abs(dx) > DRAG_THRESHOLD) {
            dragged = true;
            scroller.classList.add('is-dragging');

            // capture only AFTER real drag, so normal clicks still work
            try {
              scroller.setPointerCapture(e.pointerId);
              pointerCaptured = true;
            } catch (_) {}
          }

          if (!dragged) return;

          // Once dragging, we own the gesture (prevent text selection / link activation)
          if (e.cancelable) e.preventDefault();

          scroller.scrollLeft = startScrollLeft - dx;
          requestFadeUpdate();
        },
        { passive: false },
      );

      scroller.addEventListener(
        'pointerup',
        (e) => {
          if (!isDown) return;
          isDown = false;

          scroller.classList.remove('is-dragging');

          if (dragged) {
            scroller.__tenSuppressClick = true;
            setTimeout(() => {
              scroller.__tenSuppressClick = false;
            }, 0);
          }

          if (pointerCaptured) {
            try {
              scroller.releasePointerCapture(e.pointerId);
            } catch (_) {}
          }

          dragged = false;
          pointerCaptured = false;
        },
        { passive: true },
      );

      scroller.addEventListener(
        'pointercancel',
        () => {
          isDown = false;
          dragged = false;
          pointerCaptured = false;
          scroller.classList.remove('is-dragging');
        },
        { passive: true },
      );

      // Only suppress navigation if the user actually dragged
      scroller.addEventListener(
        'click',
        (e) => {
          if (!scroller.__tenSuppressClick) return;

          const a = e.target.closest('a');
          if (!a) return;

          e.preventDefault();
          e.stopPropagation();
        },
        true,
      );

      scroller.addEventListener('scroll', requestFadeUpdate, { passive: true });

      const ro = 'ResizeObserver' in window ? new ResizeObserver(() => requestFadeUpdate()) : null;
      if (ro) ro.observe(scroller);

      window.addEventListener('resize', () => setTimeout(requestFadeUpdate, 120), { passive: true });

      setTimeout(requestFadeUpdate, 60);
      setTimeout(requestFadeUpdate, 300);
      setTimeout(requestFadeUpdate, 900);
    });
  });



  /* =========================================================
  6) Gallery21 — Drag stays working after Lightbox open/close
  Opt-in: .section_gallery21
  Fixes:
  - Lightbox clicks work
  - Drag works immediately
  - Drag continues working after opening/closing lightbox (backdrop stays in DOM)
  - Only suppress click after real drag
  Where: Site Settings > Footer
========================================================= */
  window.Webflow = window.Webflow || [];
  window.Webflow.push(function () {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function isElementVisible(el) {
      if (!el) return false;
      // visible in layout + not display:none/visibility:hidden
      const cs = window.getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false;
      // actually has a box on screen
      return !!(el.getClientRects && el.getClientRects().length);
    }

    function lightboxIsOpen() {
      const backdrop = document.querySelector('.w-lightbox-backdrop');
      return isElementVisible(backdrop);
    }

    document.querySelectorAll('.section_gallery21').forEach((section) => {
      if (section.__g21Init) return;
      section.__g21Init = true;

      const scroller = section.querySelector('.gallery21_scroller');
      const track = section.querySelector('.gallery21_track');
      if (!scroller || !track) return;

      const btnPrev = section.querySelector('.gallery21_button.is-prev');
      const btnNext = section.querySelector('.gallery21_button.is-next');

      function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
      }

      // Prevent native image drag
      section.querySelectorAll('img').forEach((img) => img.setAttribute('draggable', 'false'));

      // -------- Ratio tagging (keeps varied slide widths) --------
      function tagSlideRatios() {
        const slides = Array.from(section.querySelectorAll('.gallery21_slide'));
        slides.forEach((slide) => {
          const img = slide.querySelector('img');
          if (!img) return;

          function apply() {
            const w = img.naturalWidth || 0;
            const h = img.naturalHeight || 0;
            if (!w || !h) return;

            slide.classList.remove('is-landscape', 'is-portrait', 'is-square');
            const r = w / h;

            if (r > 1.15) slide.classList.add('is-landscape');
            else if (r < 0.87) slide.classList.add('is-portrait');
            else slide.classList.add('is-square');
          }

          if (img.complete) apply();
          else img.addEventListener('load', apply, { once: true });
        });
      }

      // -------- Prev/Next glide --------
      let slideStarts = [];
      function computeSlideStarts() {
        const slides = Array.from(section.querySelectorAll('.gallery21_slide'));
        if (!slides.length) {
          slideStarts = [];
          return;
        }
        const scrollerRect = scroller.getBoundingClientRect();
        slideStarts = slides.map((slide) => {
          const r = slide.getBoundingClientRect();
          return scroller.scrollLeft + (r.left - scrollerRect.left);
        });
      }

      function nearestIndex(x) {
        if (!slideStarts.length) return 0;
        let best = 0,
          bestDist = Infinity;
        for (let i = 0; i < slideStarts.length; i++) {
          const d = Math.abs(slideStarts[i] - x);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        }
        return best;
      }

      function killTween() {
        if (scroller.__g21Tween) {
          scroller.__g21Tween.kill();
          scroller.__g21Tween = null;
        }
      }

      function scrollToIndex(idx) {
        if (!slideStarts.length) return;
        const i = clamp(idx, 0, slideStarts.length - 1);
        const target = slideStarts[i];

        killTween();

        if (reduce || !window.gsap) {
          scroller.scrollLeft = target;
          return;
        }

        scroller.__g21Tween = gsap.to(scroller, {
          scrollLeft: target,
          duration: 0.85,
          ease: 'power3.out',
          overwrite: true,
          onComplete: () => {
            scroller.__g21Tween = null;
          },
        });
      }

      function step(dir) {
        computeSlideStarts();
        const idx = nearestIndex(scroller.scrollLeft);
        scrollToIndex(idx + dir);
      }

      if (btnPrev)
        btnPrev.addEventListener('click', (e) => {
          e.preventDefault();
          step(-1);
        });
      if (btnNext)
        btnNext.addEventListener('click', (e) => {
          e.preventDefault();
          step(1);
        });

      // -------- Drag (immediate) --------
      let isDown = false;
      let isDragging = false;
      let captured = false;

      let startX = 0;
      let startY = 0;
      let startScroll = 0;

      let movedX = 0;
      let movedY = 0;

      const DRAG_THRESHOLD = 6;
      const SUPPRESS_MS = 180;

      function resetDragState() {
        isDown = false;
        isDragging = false;
        captured = false;
        scroller.classList.remove('is-dragging');
        scroller.__g21SuppressClick = false;
      }

      function onDown(e) {
        // only block if lightbox is truly OPEN (visible)
        if (lightboxIsOpen()) return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;

        killTween();

        isDown = true;
        isDragging = false;
        captured = false;

        movedX = 0;
        movedY = 0;

        startX = e.clientX;
        startY = e.clientY;
        startScroll = scroller.scrollLeft;
      }

      function onMove(e) {
        if (!isDown) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        movedX = Math.max(movedX, Math.abs(dx));
        movedY = Math.max(movedY, Math.abs(dy));

        // Immediate feel
        scroller.scrollLeft = startScroll - dx;

        if (!isDragging && movedX > DRAG_THRESHOLD) {
          isDragging = true;
          scroller.classList.add('is-dragging');

          // capture only after real drag
          try {
            scroller.setPointerCapture(e.pointerId);
            captured = true;
          } catch (_) {}
        }

        // Touch: prevent vertical page scroll only when horizontal intent wins
        if (isDragging && movedX > movedY && e.cancelable) {
          e.preventDefault();
        }
      }

      function onUp(e) {
        if (!isDown) return;
        isDown = false;

        if (isDragging) {
          scroller.classList.remove('is-dragging');
          scroller.__g21SuppressClick = true;
          setTimeout(() => {
            scroller.__g21SuppressClick = false;
          }, SUPPRESS_MS);
        }

        if (captured) {
          try {
            scroller.releasePointerCapture(e.pointerId);
          } catch (_) {}
        }

        isDragging = false;
        captured = false;
      }

      scroller.addEventListener('pointerdown', onDown, { passive: true });
      scroller.addEventListener('pointermove', onMove, { passive: false });
      scroller.addEventListener('pointerup', onUp, { passive: true });
      scroller.addEventListener('pointercancel', onUp, { passive: true });

      // Suppress lightbox/link open ONLY after real drag
      scroller.addEventListener(
        'click',
        (e) => {
          if (!scroller.__g21SuppressClick) return;
          const a = e.target.closest('a');
          if (!a) return;
          if (!scroller.contains(a)) return;
          e.preventDefault();
          e.stopPropagation();
        },
        true,
      );

      // Safety reset when lightbox closes (covers edge cases)
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setTimeout(resetDragState, 0);
      });

      // If user clicks the lightbox close, reset drag state right after
      document.addEventListener(
        'click',
        (e) => {
          const closeBtn = e.target.closest('.w-lightbox-close');
          if (!closeBtn) return;
          setTimeout(resetDragState, 0);
        },
        true,
      );

      // Init + resize
      window.addEventListener(
        'resize',
        () => {
          clearTimeout(section.__g21RTO);
          section.__g21RTO = setTimeout(() => {
            tagSlideRatios();
            computeSlideStarts();
          }, 150);
        },
        { passive: true },
      );

      tagSlideRatios();
      computeSlideStarts();
    });
  });



  /* =========================================================
  Content17 — Cinematic reveal on enter (NO ScrollTrigger)
  Opt-in:
  - .js-content17-reveal on content17_component wrapper
  - .case-study-text on the rich text (you already have it)
  - .is-left / .is-right on wrapper for direction
========================================================= */
  window.Webflow = window.Webflow || [];
  window.Webflow.push(function () {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const blocks = Array.from(document.querySelectorAll('.js-content17-reveal'));
    if (!blocks.length) return;

    // Defensive: only run if gsap exists; if not, just unhide
    const hasGSAP = !!window.gsap;

    function revealNow(wrap) {
      wrap.classList.remove('is-reveal-ready');
      const items = wrap.querySelectorAll('.case-study-text > *');
      items.forEach((el) => {
        el.style.opacity = '';
        el.style.transform = '';
        el.style.filter = '';
      });
    }

    blocks.forEach((wrap) => {
      if (wrap.__content17RevealInit) return;
      wrap.__content17RevealInit = true;

      const rich = wrap.querySelector('.case-study-text');
      if (!rich) return;

      const items = Array.from(rich.children).filter(Boolean);
      if (!items.length) return;

      wrap.classList.add('is-reveal-ready');

      const fromX = wrap.classList.contains('is-left') ? -18 : wrap.classList.contains('is-right') ? 18 : 0;

      if (reduce || !hasGSAP) {
        // show everything instantly
        wrap.classList.remove('is-reveal-ready');
        return;
      }

      gsap.set(items, { opacity: 0, x: fromX, y: 18, filter: 'blur(6px)' });

      // Observer triggers once per block
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            io.disconnect();

            gsap.to(items, {
              opacity: 1,
              x: 0,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.85,
              ease: 'power3.out',
              stagger: 0.06,
              onComplete: () => {
                wrap.classList.remove('is-reveal-ready');
                gsap.set(items, { clearProps: 'filter' });
              },
            });
          });
        },
        { threshold: 0.22, rootMargin: '0px 0px -10% 0px' },
      );

      io.observe(wrap);
    });
  });



  /* =========================================================
   C) SERVICES — Card Row Cinematic Reveal (GSAP + IO)
   Scope: header.services_card only
   Notes:
   - No ScrollTrigger used
   - Prevents double-init
   - Respects prefers-reduced-motion
   - Runs ONCE by default (can be changed)
========================================================= */
  window.Webflow = window.Webflow || [];
  window.Webflow.push(function () {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.querySelector('header.services_card');
    if (!root) return;

    if (root.__svcRevealInit) return;
    root.__svcRevealInit = true;

    const cards = Array.from(root.querySelectorAll('.card-row_card'));
    if (!cards.length) return;

    // If GSAP missing, do nothing (content remains visible)
    if (!window.gsap || reduce) return;

    // ---- Authoring state: set initial visuals without layout shift
    cards.forEach((card) => {
      if (card.__svcPrepared) return;
      card.__svcPrepared = true;

      const top = card.querySelector('.card-row_card-content-top');
      const bottom = card.querySelector('.card-row_card-content-bottom');

      gsap.set(card, { opacity: 0, y: 18, filter: 'blur(8px)' });
      if (top) gsap.set(top, { opacity: 0, y: 10 });
      if (bottom) gsap.set(bottom, { opacity: 0, y: 10 });
    });

    // CONFIG: change to false if you want replay behavior
    const RUN_ONCE = true;

    function animateCard(card) {
      const top = card.querySelector('.card-row_card-content-top');
      const bottom = card.querySelector('.card-row_card-content-bottom');

      const tl = gsap.timeline({ defaults: { overwrite: true } });

      tl.to(
        card,
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.95,
          ease: 'power3.out',
          clearProps: 'filter',
        },
        0,
      );

      if (top) {
        tl.to(
          top,
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power3.out',
          },
          0.1,
        );
      }

      if (bottom) {
        tl.to(
          bottom,
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power3.out',
          },
          0.18,
        );
      }

      return tl;
    }

    // ---- Observe each card
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            if (!RUN_ONCE) {
              // replay mode: reset when leaving viewport
              const card = entry.target;
              if (!card) return;
              const top = card.querySelector('.card-row_card-content-top');
              const bottom = card.querySelector('.card-row_card-content-bottom');

              gsap.set(card, { opacity: 0, y: 18, filter: 'blur(8px)' });
              if (top) gsap.set(top, { opacity: 0, y: 10 });
              if (bottom) gsap.set(bottom, { opacity: 0, y: 10 });

              card.__svcAnimated = false;
            }
            return;
          }

          const card = entry.target;
          if (!card || card.__svcAnimated) return;

          card.__svcAnimated = true;
          animateCard(card);

          if (RUN_ONCE) io.unobserve(card);
        });
      },
      { threshold: 0.22, rootMargin: '0px 0px -10% 0px' },
    );

    cards.forEach((card) => io.observe(card));
  });


  (function () {
    const header = document.querySelector('header.services_card.js-svc-reveal');
    if (!header) return;

    // Set stagger index on each direct grid child (cards + connectors)
    const items = header.querySelectorAll('.card-row_component > *');
    items.forEach((el, i) => el.style.setProperty('--svc-reveal-i', i));

    // In-view toggle
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            header.classList.add('is-inview');
            io.disconnect(); // run once
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px' },
    );

    io.observe(header);
  })();


<!-- =========================================================
  LAYOUT357 — Standalone cards with staggered reveal + fade exit
  Target: .layout357_content-item and all children
  Dependencies: GSAP 3.x + ScrollTrigger (already loaded)
  Safe to remove: Yes — delete this script
  Changed: 2026-03-25 — Added fade-out exit per card
========================================================= -->

  window.Webflow ||= [];
  window.Webflow.push(() => {
    const LAYOUT357_REVEAL = (() => {
      if (document.querySelector('.section_layout357')?.__tenL357RevealInit) return;

      const section = document.querySelector('.section_layout357');
      if (!section) return;
      section.__tenL357RevealInit = true;

      gsap.registerPlugin(ScrollTrigger);

      const items = section.querySelectorAll('.layout357_content-item');
      const totalItems = items.length;

      items.forEach((item, index) => {
        const number = item.querySelector('.layout357_number');
        const title = item.querySelector('.layout357_title');
        const tagline = item.querySelector('.text-style-tagline');
        const heading = item.querySelector('.heading-style-h2');
        const bodyText = item.querySelector('.text-size-medium');
        const buttonGroup = item.querySelector('.button-group');
        const imageWrapper = item.querySelector('.layout357_image-wrapper');

        const allElements = [number, title, tagline, heading, bodyText, buttonGroup, imageWrapper].filter(Boolean);
        gsap.set(allElements, { opacity: 0 });

        if (number) gsap.set(number, { scale: 0.7, y: 20 });
        if (title) gsap.set(title, { x: -60, y: 10 });
        if (tagline) gsap.set(tagline, { y: 20 });
        if (heading) gsap.set(heading, { y: 40 });
        if (bodyText) gsap.set(bodyText, { y: 30 });
        if (buttonGroup) gsap.set(buttonGroup, { y: 25 });
        if (imageWrapper) gsap.set(imageWrapper, { x: 60, scale: 0.95 });

        /* === ENTER animation === */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'top 20%',
            toggleActions: 'play none none reverse',
            id: 'layout357-card-' + index,
          },
        });

        if (number) {
          tl.to(number, {
            scale: 1, y: 0, opacity: 0.08,
            duration: 1, ease: 'power3.out',
          }, 0);
        }

        if (title) {
          tl.to(title, {
            x: 0, y: 0, opacity: 1,
            duration: 0.8, ease: 'power3.out',
          }, 0.15);
        }

        if (tagline) {
          tl.to(tagline, {
            y: 0, opacity: 1,
            duration: 0.6, ease: 'power2.out',
          }, 0.35);
        }

        if (heading) {
          tl.to(heading, {
            y: 0, opacity: 1,
            duration: 0.7, ease: 'power2.out',
          }, 0.45);
        }

        if (bodyText) {
          tl.to(bodyText, {
            y: 0, opacity: 1,
            duration: 0.6, ease: 'power2.out',
          }, 0.55);
        }

        if (buttonGroup) {
          tl.to(buttonGroup, {
            y: 0, opacity: 1,
            duration: 0.5, ease: 'power2.out',
          }, 0.65);
        }

        if (imageWrapper) {
          tl.to(imageWrapper, {
            x: 0, scale: 1, opacity: 1,
            duration: 0.9, ease: 'power3.out',
          }, 0.3);
        }

        const spacers = item.querySelectorAll('.spacer-small');
        if (spacers.length) {
          gsap.set(spacers, { scaleX: 0, transformOrigin: 'left center' });
          tl.to(spacers, {
            scaleX: 1, duration: 0.8, ease: 'power2.inOut',
          }, 0.5);
        }

        /* === EXIT animation — fade out as card leaves top === */
        if (index < totalItems - 1) {
          ScrollTrigger.create({
            trigger: item,
            start: 'bottom 60%',
            end: 'bottom 10%',
            scrub: 0.4,
            id: 'layout357-exit-' + index,
            onUpdate: (self) => {
              const p = self.progress;
              gsap.set(item, {
                opacity: 1 - (p * 0.85),
                y: p * -20,
                filter: 'blur(' + (p * 3) + 'px)',
              });
            },
            onLeaveBack: () => {
              gsap.set(item, {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
              });
            },
          });
        }
      });

      return {
        destroy: () => {
          ScrollTrigger.getAll()
            .filter((st) => st.vars.id?.startsWith('layout357-'))
            .forEach((st) => st.kill());
        },
      };
    })();
  });
