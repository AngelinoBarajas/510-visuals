/* 5TEN VISUALS — Project Template JS
   Loaded: Project Template > Page Settings > Footer (before </body>)
   CDN: https://cdn.jsdelivr.net/gh/AngelinoBarajas/510-visuals@main/js/project-template.js
   Dependencies: GSAP 3.x (loaded via Webflow native) */

/* --- Gallery21 drag + lightbox override --- */
window.Webflow = window.Webflow || [];
window.Webflow.push(function () {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function isElementVisible(el) {
    if (!el) return false;
    const cs = window.getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false;
    return !!(el.getClientRects && el.getClientRects().length);
  }
  function lightboxIsOpen() { return isElementVisible(document.querySelector('.w-lightbox-backdrop')); }

  document.querySelectorAll('.section_gallery21').forEach((section) => {
    if (section.__g21Init) return;
    section.__g21Init = true;

    const scroller = section.querySelector('.gallery21_scroller');
    const track = section.querySelector('.gallery21_track');
    if (!scroller || !track) return;

    const btnPrev = section.querySelector('.gallery21_button.is-prev');
    const btnNext = section.querySelector('.gallery21_button.is-next');

    function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
    section.querySelectorAll('img').forEach((img) => img.setAttribute('draggable', 'false'));

    function tagSlideRatios() {
      Array.from(section.querySelectorAll('.gallery21_slide')).forEach((slide) => {
        const img = slide.querySelector('img');
        if (!img) return;
        function apply() {
          const w = img.naturalWidth || 0, h = img.naturalHeight || 0;
          if (!w || !h) return;
          slide.classList.remove('is-landscape', 'is-portrait', 'is-square');
          const r = w / h;
          if (r > 1.15) slide.classList.add('is-landscape');
          else if (r < 0.87) slide.classList.add('is-portrait');
          else slide.classList.add('is-square');
        }
        if (img.complete) apply(); else img.addEventListener('load', apply, { once: true });
      });
    }

    let slideStarts = [];
    function computeSlideStarts() {
      const slides = Array.from(section.querySelectorAll('.gallery21_slide'));
      if (!slides.length) { slideStarts = []; return; }
      const scrollerRect = scroller.getBoundingClientRect();
      slideStarts = slides.map((slide) => scroller.scrollLeft + (slide.getBoundingClientRect().left - scrollerRect.left));
    }
    function nearestIndex(x) {
      if (!slideStarts.length) return 0;
      let best = 0, bestDist = Infinity;
      for (let i = 0; i < slideStarts.length; i++) { const d = Math.abs(slideStarts[i] - x); if (d < bestDist) { bestDist = d; best = i; } }
      return best;
    }
    function killTween() { if (scroller.__g21Tween) { scroller.__g21Tween.kill(); scroller.__g21Tween = null; } }
    function scrollToIndex(idx) {
      if (!slideStarts.length) return;
      const target = slideStarts[clamp(idx, 0, slideStarts.length - 1)];
      killTween();
      if (reduce || !window.gsap) { scroller.scrollLeft = target; return; }
      scroller.__g21Tween = gsap.to(scroller, { scrollLeft: target, duration: 0.85, ease: 'power3.out', overwrite: true, onComplete: () => { scroller.__g21Tween = null; } });
    }
    function step(dir) { computeSlideStarts(); scrollToIndex(nearestIndex(scroller.scrollLeft) + dir); }

    if (btnPrev) btnPrev.addEventListener('click', (e) => { e.preventDefault(); step(-1); });
    if (btnNext) btnNext.addEventListener('click', (e) => { e.preventDefault(); step(1); });

    let isDown = false, isDragging = false, captured = false, startX = 0, startY = 0, startScroll = 0, movedX = 0, movedY = 0;
    const DRAG_THRESHOLD = 6, SUPPRESS_MS = 180;

    function resetDragState() { isDown = false; isDragging = false; captured = false; scroller.classList.remove('is-dragging'); scroller.__g21SuppressClick = false; }
    function onDown(e) { if (lightboxIsOpen()) return; if (e.pointerType === 'mouse' && e.button !== 0) return; killTween(); isDown = true; isDragging = false; captured = false; movedX = 0; movedY = 0; startX = e.clientX; startY = e.clientY; startScroll = scroller.scrollLeft; }
    function onMove(e) {
      if (!isDown) return;
      const dx = e.clientX - startX; movedX = Math.max(movedX, Math.abs(dx)); movedY = Math.max(movedY, Math.abs(e.clientY - startY));
      scroller.scrollLeft = startScroll - dx;
      if (!isDragging && movedX > DRAG_THRESHOLD) { isDragging = true; scroller.classList.add('is-dragging'); try { scroller.setPointerCapture(e.pointerId); captured = true; } catch (_) {} }
      if (isDragging && movedX > movedY && e.cancelable) e.preventDefault();
    }
    function onUp(e) {
      if (!isDown) return; isDown = false;
      if (isDragging) { scroller.classList.remove('is-dragging'); scroller.__g21SuppressClick = true; setTimeout(() => { scroller.__g21SuppressClick = false; }, SUPPRESS_MS); }
      if (captured) { try { scroller.releasePointerCapture(e.pointerId); } catch (_) {} }
      isDragging = false; captured = false;
    }

    scroller.addEventListener('pointerdown', onDown, { passive: true });
    scroller.addEventListener('pointermove', onMove, { passive: false });
    scroller.addEventListener('pointerup', onUp, { passive: true });
    scroller.addEventListener('pointercancel', onUp, { passive: true });

    scroller.addEventListener('click', (e) => { if (!scroller.__g21SuppressClick) return; const a = e.target.closest('a'); if (!a || !scroller.contains(a)) return; e.preventDefault(); e.stopPropagation(); }, true);

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setTimeout(resetDragState, 0); });
    document.addEventListener('click', (e) => { if (e.target.closest('.w-lightbox-close')) setTimeout(resetDragState, 0); }, true);

    window.addEventListener('resize', () => { clearTimeout(section.__g21RTO); section.__g21RTO = setTimeout(() => { tagSlideRatios(); computeSlideStarts(); }, 150); }, { passive: true });

    tagSlideRatios();
    computeSlideStarts();
  });
});

/* --- Content17 cinematic reveal --- */
window.Webflow = window.Webflow || [];
window.Webflow.push(function () {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const blocks = Array.from(document.querySelectorAll('.js-content17-reveal'));
  if (!blocks.length) return;
  const hasGSAP = !!window.gsap;

  blocks.forEach((wrap) => {
    if (wrap.__content17RevealInit) return;
    wrap.__content17RevealInit = true;

    const rich = wrap.querySelector('.case-study-text');
    if (!rich) return;
    const items = Array.from(rich.children).filter(Boolean);
    if (!items.length) return;

    wrap.classList.add('is-reveal-ready');
    const fromX = wrap.classList.contains('is-left') ? -18 : wrap.classList.contains('is-right') ? 18 : 0;

    if (reduce || !hasGSAP) { wrap.classList.remove('is-reveal-ready'); return; }

    gsap.set(items, { opacity: 0, x: fromX, y: 18, filter: 'blur(6px)' });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        gsap.to(items, { opacity: 1, x: 0, y: 0, filter: 'blur(0px)', duration: 0.85, ease: 'power3.out', stagger: 0.06, onComplete: () => { wrap.classList.remove('is-reveal-ready'); gsap.set(items, { clearProps: 'filter' }); } });
      });
    }, { threshold: 0.22, rootMargin: '0px 0px -10% 0px' });

    io.observe(wrap);
  });
});
