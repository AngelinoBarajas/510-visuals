/* 5TEN VISUALS — Global JS (site-wide)
   Loaded: Site Settings > Footer
   CDN: https://cdn.jsdelivr.net/gh/AngelinoBarajas/510-visuals@main/js/global.js
   Dependencies: GSAP 3.x (loaded separately before this file) */

/* --- Unicorn Studio init --- */
!(function () {
  var u = window.UnicornStudio;
  if (u && u.init) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { u.init(); });
    } else { u.init(); }
  } else {
    window.UnicornStudio = { isInitialized: !1 };
    var i = document.createElement('script');
    i.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.5/dist/unicornStudio.umd.js';
    i.onload = function () {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { UnicornStudio.init(); });
      } else { UnicornStudio.init(); }
    };
    (document.head || document.body).appendChild(i);
  }
})();

/* --- Navbar Hide/Show --- */
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

  function showNav() { nav.classList.remove(HIDE_CLASS); }
  function hideNav() { nav.classList.add(HIDE_CLASS); }

  function update() {
    ticking = false;
    if (isMenuOpen()) { showNav(); lastY = window.pageYOffset || 0; return; }
    const y = window.pageYOffset || 0;
    const delta = y - lastY;
    if (Math.abs(delta) < SCROLL_THRESHOLD) { lastY = y; return; }
    if (delta > 0 && y > HIDE_AFTER_PX) hideNav();
    if (delta < 0) showNav();
    lastY = y;
    clearTimeout(idleTO);
    idleTO = setTimeout(function () { if (!isMenuOpen()) showNav(); }, IDLE_DELAY);
  }

  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  window.addEventListener('scroll', onScroll, { passive: true });
  update();
  document.addEventListener('click', function () { if (isMenuOpen()) showNav(); }, { passive: true });
});

/* --- CTA38 Dim + Hover Preview --- */
window.Webflow = window.Webflow || [];
window.Webflow.push(function () {
  if (window.innerWidth < 992) return;
  const section = document.querySelector('.section_cta38');
  if (!section) return;
  if (section.__cta38CmsHoverInit) return;
  section.__cta38CmsHoverInit = true;

  const links = Array.from(section.querySelectorAll('.w-dyn-list .cta38_link-block'));
  if (!links.length) return;

  if (window.getComputedStyle(section).position === 'static') section.style.position = 'relative';

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
  function showPreview() { preview.classList.add('is-active'); }
  function hidePreview() { preview.classList.remove('is-active'); preview.style.transform = 'translate3d(-9999px, -9999px, 0)'; }
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
    link.addEventListener('mouseenter', (e) => { const ok = setPreviewFromLink(link); setActive(link); if (ok) { showPreview(); movePreview(e); } else hidePreview(); });
    link.addEventListener('mousemove', (e) => { if (!preview.classList.contains('is-active')) return; movePreview(e); });
    link.addEventListener('mouseleave', () => { clearActive(); hidePreview(); });
    link.addEventListener('focus', () => { const ok = setPreviewFromLink(link); setActive(link); if (ok) showPreview(); });
    link.addEventListener('blur', () => { clearActive(); hidePreview(); });
  });
});

/* --- Column Transition --- */
(function () {
  'use strict';
  function ready(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }

  try {
    if (!sessionStorage.getItem('column-transition-first-visit')) {
      sessionStorage.setItem('column-transition-first-visit', 'viewed');
      document.documentElement.classList.add('column-transition-first-visit');
    }
  } catch (e) {}

  ready(function () {
    const component = document.querySelector('.column-transition_component');
    if (!component) return;
    if (!window.gsap) { component.style.display = 'none'; return; }
    if (component.__tenInit) return;
    component.__tenInit = true;

    const cols = Array.from(component.querySelectorAll('.column-transition_column'));
    if (!cols.length) return;

    function showOverlay() { component.style.display = 'flex'; }
    function hideOverlay() { component.style.display = 'none'; }

    function isModifiedClick(e) { return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1; }
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
      try { url = new URL(a.href); } catch (e) { return true; }
      if (url.host !== window.location.host) return true;
      return false;
    }

    hideOverlay();

    const isFirstVisit = document.documentElement.classList.contains('column-transition-first-visit');
    if (!isFirstVisit) {
      showOverlay();
      window.gsap.killTweensOf(cols);
      window.gsap.timeline({ defaults: { overwrite: true } })
        .set(cols, { yPercent: 0 })
        .to(cols, { yPercent: -100, duration: 0.55, ease: 'power1.inOut', stagger: { each: 0.14, from: 'start' } })
        .set(component, { display: 'none' });
    }

    document.addEventListener('click', function (e) {
      if (isModifiedClick(e)) return;
      const link = e.target.closest('a');
      if (!link) return;
      if (isSkippableLink(link)) return;
      const nextUrl = link.href;
      if (!nextUrl || nextUrl === window.location.href) return;
      e.preventDefault();
      showOverlay();
      window.gsap.killTweensOf(cols);
      window.gsap.timeline({ defaults: { overwrite: true }, onComplete: function () { window.location.href = nextUrl; } })
        .set(cols, { yPercent: 100 })
        .to(cols, { yPercent: 0, duration: 0.55, ease: 'power1.inOut', stagger: { each: 0.14, from: 'start' } });
    }, true);

    window.addEventListener('pageshow', function (e) { if (e.persisted) window.location.reload(); });
  });
})();
