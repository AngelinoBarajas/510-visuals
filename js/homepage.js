/* 5TEN VISUALS — Homepage JS
   Loaded: Homepage > Page Settings > Footer (before </body>)
   CDN: https://cdn.jsdelivr.net/gh/AngelinoBarajas/510-visuals@main/js/homepage.js
   Dependencies: GSAP 3.x + ScrollTrigger (loaded via Webflow native) */

/* --- Layout423 drag scroller --- */
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
    function updateFades() { fadeRAF = 0; const maxScroll = scroller.scrollWidth - scroller.clientWidth; scroller.classList.toggle('is-at-end', scroller.scrollLeft >= maxScroll - 2); }
    function requestFadeUpdate() { if (fadeRAF) return; fadeRAF = requestAnimationFrame(updateFades); }
    function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

    function killTween() { if (scroller.__tenScrollTween && scroller.__tenScrollTween.kill) { scroller.__tenScrollTween.kill(); scroller.__tenScrollTween = null; } }

    function scrollToX(targetX, opts) {
      const maxScroll = scroller.scrollWidth - scroller.clientWidth;
      const x = clamp(targetX, 0, Math.max(0, maxScroll));
      killTween();
      if (reduceMotion || !window.gsap || (opts && opts.instant)) { scroller.scrollLeft = x; requestFadeUpdate(); return; }
      scroller.__tenScrollTween = gsap.to(scroller, { scrollLeft: x, duration: 0.65, ease: 'power3.out', overwrite: true, onUpdate: requestFadeUpdate, onComplete: () => { scroller.__tenScrollTween = null; requestFadeUpdate(); } });
    }

    function go(dir) { scrollToX(scroller.scrollLeft + dir * scroller.clientWidth * 0.8); }

    if (btnPrev) btnPrev.addEventListener('click', (e) => { e.preventDefault(); go(-1); });
    if (btnNext) btnNext.addEventListener('click', (e) => { e.preventDefault(); go(1); });

    scroller.addEventListener('dragstart', (e) => e.preventDefault(), true);

    let isDown = false, dragged = false, startX = 0, startScrollLeft = 0, pointerCaptured = false;
    const DRAG_THRESHOLD = 10;

    section.querySelectorAll('img').forEach((img) => img.setAttribute('draggable', 'false'));

    scroller.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      isDown = true; dragged = false; pointerCaptured = false;
      killTween(); startX = e.clientX; startScrollLeft = scroller.scrollLeft;
    }, { passive: true });

    scroller.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (!dragged && Math.abs(dx) > DRAG_THRESHOLD) {
        dragged = true; scroller.classList.add('is-dragging');
        try { scroller.setPointerCapture(e.pointerId); pointerCaptured = true; } catch (_) {}
      }
      if (!dragged) return;
      if (e.cancelable) e.preventDefault();
      scroller.scrollLeft = startScrollLeft - dx;
      requestFadeUpdate();
    }, { passive: false });

    scroller.addEventListener('pointerup', (e) => {
      if (!isDown) return; isDown = false;
      scroller.classList.remove('is-dragging');
      if (dragged) { scroller.__tenSuppressClick = true; setTimeout(() => { scroller.__tenSuppressClick = false; }, 0); }
      if (pointerCaptured) { try { scroller.releasePointerCapture(e.pointerId); } catch (_) {} }
      dragged = false; pointerCaptured = false;
    }, { passive: true });

    scroller.addEventListener('pointercancel', () => { isDown = false; dragged = false; pointerCaptured = false; scroller.classList.remove('is-dragging'); }, { passive: true });

    scroller.addEventListener('click', (e) => {
      if (!scroller.__tenSuppressClick) return;
      const a = e.target.closest('a'); if (!a) return;
      e.preventDefault(); e.stopPropagation();
    }, true);

    scroller.addEventListener('scroll', requestFadeUpdate, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(() => requestFadeUpdate()).observe(scroller);
    window.addEventListener('resize', () => setTimeout(requestFadeUpdate, 120), { passive: true });
    setTimeout(requestFadeUpdate, 60);
    setTimeout(requestFadeUpdate, 300);
    setTimeout(requestFadeUpdate, 900);
  });
});

/* --- Layout357 standalone cards with staggered reveal + fade exit --- */
window.Webflow = window.Webflow || [];
window.Webflow.push(function () {
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

    const tl = gsap.timeline({
      scrollTrigger: { trigger: item, start: 'top 80%', end: 'top 20%', toggleActions: 'play none none reverse', id: 'layout357-card-' + index }
    });

    if (number) tl.to(number, { scale: 1, y: 0, opacity: 0.08, duration: 1, ease: 'power3.out' }, 0);
    if (title) tl.to(title, { x: 0, y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0.15);
    if (tagline) tl.to(tagline, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.35);
    if (heading) tl.to(heading, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, 0.45);
    if (bodyText) tl.to(bodyText, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.55);
    if (buttonGroup) tl.to(buttonGroup, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.65);
    if (imageWrapper) tl.to(imageWrapper, { x: 0, scale: 1, opacity: 1, duration: 0.9, ease: 'power3.out' }, 0.3);

    const spacers = item.querySelectorAll('.spacer-small');
    if (spacers.length) { gsap.set(spacers, { scaleX: 0, transformOrigin: 'left center' }); tl.to(spacers, { scaleX: 1, duration: 0.8, ease: 'power2.inOut' }, 0.5); }

    if (index < totalItems - 1) {
      ScrollTrigger.create({
        trigger: item, start: 'bottom 60%', end: 'bottom 10%', scrub: 0.4, id: 'layout357-exit-' + index,
        onUpdate: (self) => { const p = self.progress; gsap.set(item, { opacity: 1 - (p * 0.85), y: p * -20, filter: 'blur(' + (p * 3) + 'px)' }); },
        onLeaveBack: () => { gsap.set(item, { opacity: 1, y: 0, filter: 'blur(0px)' }); }
      });
    }
  });
});

/* --- Services Card Row Cinematic Reveal --- */
window.Webflow = window.Webflow || [];
window.Webflow.push(function () {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.querySelector('header.services_card');
  if (!root) return;
  if (root.__svcRevealInit) return;
  root.__svcRevealInit = true;

  const cards = Array.from(root.querySelectorAll('.card-row_card'));
  if (!cards.length) return;
  if (!window.gsap || reduce) return;

  cards.forEach((card) => {
    if (card.__svcPrepared) return;
    card.__svcPrepared = true;
    const top = card.querySelector('.card-row_card-content-top');
    const bottom = card.querySelector('.card-row_card-content-bottom');
    gsap.set(card, { opacity: 0, y: 18, filter: 'blur(8px)' });
    if (top) gsap.set(top, { opacity: 0, y: 10 });
    if (bottom) gsap.set(bottom, { opacity: 0, y: 10 });
  });

  const RUN_ONCE = true;

  function animateCard(card) {
    const top = card.querySelector('.card-row_card-content-top');
    const bottom = card.querySelector('.card-row_card-content-bottom');
    const tl = gsap.timeline({ defaults: { overwrite: true } });
    tl.to(card, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.95, ease: 'power3.out', clearProps: 'filter' }, 0);
    if (top) tl.to(top, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, 0.1);
    if (bottom) tl.to(bottom, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, 0.18);
    return tl;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        if (!RUN_ONCE) {
          const card = entry.target;
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
  }, { threshold: 0.22, rootMargin: '0px 0px -10% 0px' });

  cards.forEach((card) => io.observe(card));
});

/* --- Services stagger in-view toggle --- */
(function () {
  const header = document.querySelector('header.services_card.js-svc-reveal');
  if (!header) return;
  const items = header.querySelectorAll('.card-row_component > *');
  items.forEach((el, i) => el.style.setProperty('--svc-reveal-i', i));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { header.classList.add('is-inview'); io.disconnect(); }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -10% 0px' });
  io.observe(header);
})();
