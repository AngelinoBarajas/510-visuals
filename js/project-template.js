/* 5TEN VISUALS — Project Template JS
   CDN: https://cdn.jsdelivr.net/gh/AngelinoBarajas/510-visuals@main/js/project-template.js */


/* =========================================================
   Page GSAP (CMS-safe) — Project Template
   - Navbar fade-in REMOVED (handled globally in Site Footer)
   - Loads ScrollTrigger if needed
   - Adds Portfolio Header 8 VIDEO injector (HLS + MP4) + is-ready flag
   - No double-init, template-safe, published-safe
========================================================= */
window.Webflow = window.Webflow || [];
window.Webflow.push(function () {
  // Reduced motion
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Require GSAP
  if (!window.gsap) return;

  // Prevent double init on this template
  if (window.__tenProjectTemplateGsapInit) return;
  window.__tenProjectTemplateGsapInit = true;

  function loadScriptOnce(src){
    return new Promise((resolve, reject) => {
      if ([...document.scripts].some(s => (s.src || "").includes(src))) return resolve();
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function ensureScrollTrigger(){
    if (window.ScrollTrigger) return Promise.resolve();
    return loadScriptOnce("https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js");
  }

  /* =========================================================
     Portfolio Header 8 — Background Video Injector
     - Supports MP4 or HLS (.m3u8)
     - Never blanks hero: image stays as fallback always
     - Adds .is-ready to .portfolio-header8_bg-video when video is ready
  ========================================================= */
  function initHeader8BackgroundVideo(){
    const headers = document.querySelectorAll(".section_portfolio-header8");
    if (!headers.length) return;

    function canPlayHlsNatively(video){
      // Safari/iOS
      try { return video.canPlayType("application/vnd.apple.mpegURL") !== ""; }
      catch(e){ return false; }
    }

    function buildVideo(){
      const v = document.createElement("video");
      v.muted = true;
      v.autoplay = true;
      v.loop = true;
      v.playsInline = true;
      v.preload = "metadata";
      v.setAttribute("muted", "");
      v.setAttribute("autoplay", "");
      v.setAttribute("loop", "");
      v.setAttribute("playsinline", "");
      // keep it purely decorative
      v.setAttribute("aria-hidden", "true");
      v.tabIndex = -1;
      return v;
    }

    headers.forEach(header => {
      const bgImage = header.querySelector(".portfolio-header8_bg-image");
      const bgVideoWrap = header.querySelector(".portfolio-header8_bg-video");
      if (!bgVideoWrap) return;

      if (bgVideoWrap.__tenVidInit) return;
      bgVideoWrap.__tenVidInit = true;

      // IMPORTANT: Your attribute is named data-mp4 even when it’s m3u8.
      const src =
        bgVideoWrap.getAttribute("data-video") ||
        bgVideoWrap.getAttribute("data-hls") ||
        bgVideoWrap.getAttribute("data-mp4") ||
        "";

      if (!src) {
        // no video = ensure image is visible
        if (bgImage) bgImage.style.opacity = bgImage.style.opacity || "1";
        bgVideoWrap.classList.remove("is-ready");
        bgVideoWrap.style.opacity = "0";
        bgVideoWrap.style.visibility = "hidden";
        return;
      }

      // Always keep image as fallback (never blank)
      if (bgImage) {
        bgImage.style.opacity = bgImage.style.opacity || "0.9";
        bgImage.style.visibility = "visible";
      }

      // Start hidden until truly ready
      bgVideoWrap.style.opacity = "0";
      bgVideoWrap.style.visibility = "hidden";

      // If already injected (Designer / previous run), don’t duplicate
      let video = bgVideoWrap.querySelector("video");
      if (!video){
        video = buildVideo();
        bgVideoWrap.appendChild(video);
      }

      const isHls = /\.m3u8(\?|#|$)/i.test(src);

      function markReady(){
        bgVideoWrap.classList.add("is-ready");
        bgVideoWrap.style.visibility = "visible";
        bgVideoWrap.style.opacity = "1";
      }

      function failSoft(){
        // keep image, keep video hidden
        bgVideoWrap.classList.remove("is-ready");
        bgVideoWrap.style.opacity = "0";
        bgVideoWrap.style.visibility = "hidden";
      }

      // MP4: simplest path
      if (!isHls){
        // ensure we have a source child (avoid stacking duplicates)
        if (!video.querySelector("source")){
          const s = document.createElement("source");
          s.src = src;
          s.type = "video/mp4";
          video.appendChild(s);
        }

        const onCanPlay = () => {
          video.removeEventListener("canplay", onCanPlay);
          // try to play, then mark ready
          const p = video.play();
          if (p && p.catch) p.catch(() => {});
          markReady();
        };

        video.addEventListener("canplay", onCanPlay, { once: true });
        video.addEventListener("error", failSoft, { once: true });

        // kick load
        try { video.load(); } catch(e){}
        return;
      }

      // HLS: native (Safari) or hls.js (Chrome/Firefox)
      if (canPlayHlsNatively(video)){
        video.src = src;

        const onLoaded = () => {
          video.removeEventListener("loadedmetadata", onLoaded);
          const p = video.play();
          if (p && p.catch) p.catch(() => {});
          // if it can load metadata, we consider it ready
          markReady();
        };

        video.addEventListener("loadedmetadata", onLoaded, { once: true });
        video.addEventListener("error", failSoft, { once: true });

        return;
      }

      // hls.js fallback (only load if needed)
      loadScriptOnce("https://cdn.jsdelivr.net/npm/hls.js@1.5.15/dist/hls.min.js")
        .then(() => {
          if (!window.Hls || !window.Hls.isSupported()) {
            failSoft();
            return;
          }

          // don’t double attach
          if (bgVideoWrap.__tenHls) {
            try { bgVideoWrap.__tenHls.destroy(); } catch(e){}
            bgVideoWrap.__tenHls = null;
          }

          const hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });

          bgVideoWrap.__tenHls = hls;
          hls.loadSource(src);
          hls.attachMedia(video);

          hls.on(window.Hls.Events.MANIFEST_PARSED, function(){
            const p = video.play();
            if (p && p.catch) p.catch(() => {});
            markReady();
          });

          hls.on(window.Hls.Events.ERROR, function(_, data){
            if (data && data.fatal){
              try { hls.destroy(); } catch(e){}
              failSoft();
            }
          });
        })
        .catch(() => {
          failSoft();
        });
    });
  }

  ensureScrollTrigger()
    .then(() => {
      if (!window.ScrollTrigger) return;

      gsap.registerPlugin(ScrollTrigger);

      // Ensure the header video is injected ASAP (so is-ready can happen)
      initHeader8BackgroundVideo();

      /* =========================================================
         Portfolio Header 8 — cinematic intro (CONTAINER-BASED)
      ========================================================= */
      (function initHeader8CinematicIntro(){
        const headers = document.querySelectorAll(".section_portfolio-header8");
        if (!headers.length) return;

        headers.forEach(header => {
          if (header.__header8CineInit) return;
          header.__header8CineInit = true;

          const bgImage = header.querySelector(".portfolio-header8_bg-image");
          const bgVideoWrap = header.querySelector(".portfolio-header8_bg-video");

          const bgWrapper =
            header.querySelector(".portfolio-header8_background-image-wrapper") ||
            (bgVideoWrap ? bgVideoWrap.parentElement : null) ||
            header;

          const contentLeft = header.querySelector(".portfolio-header8_content-left");
          const contentRight = header.querySelector(".portfolio-header8_content-right");
          const contentFallback =
            header.querySelector(".portfolio-header8_component") ||
            header.querySelector(".portfolio-header8_content") ||
            header;

          const leftTarget = contentLeft || contentFallback;
          const rightTarget = contentRight;

          if (leftTarget) gsap.set(leftTarget, { autoAlpha: 0, y: 18 });
          if (rightTarget) gsap.set(rightTarget, { autoAlpha: 0, y: 18 });

          const waitForReady = (cb) => {
            let done = false;
            const finish = () => { if (done) return; done = true; cb(); };

            // Only wait if it becomes ready; otherwise continue after timeout.
            if (bgVideoWrap && bgVideoWrap.classList.contains("is-ready")) {
              finish(); return;
            }

            let obs = null;
            if (bgVideoWrap && "MutationObserver" in window) {
              obs = new MutationObserver(() => {
                if (bgVideoWrap.classList.contains("is-ready")) {
                  if (obs) obs.disconnect();
                  finish();
                }
              });
              obs.observe(bgVideoWrap, { attributes: true, attributeFilter: ["class"] });
            }

            setTimeout(() => {
              if (obs) obs.disconnect();
              finish();
            }, 1500);
          };

          const tl = gsap.timeline({ paused: true });

          if (bgWrapper) {
            tl.fromTo(bgWrapper, { y: 0 }, { y: -14, duration: 3.4, ease: "power1.out" }, 0);
          }

          if (bgImage) {
            tl.fromTo(bgImage, { autoAlpha: 1 }, { autoAlpha: 0.9, duration: 2.4, ease: "power1.out" }, 0);
          }

          if (leftTarget) {
            tl.to(leftTarget, { autoAlpha: 1, y: 0, duration: 1.35, ease: "power2.out" }, 0.45);
          }

          if (rightTarget) {
            tl.to(rightTarget, { autoAlpha: 1, y: 0, duration: 1.2, ease: "power2.out" }, 0.75);
          }

          ScrollTrigger.create({
            trigger: header,
            start: "top 88%",
            once: true,
            onEnter: () => {
              // Re-run injector once more right before reveal (in case CMS loads late)
              initHeader8BackgroundVideo();
              waitForReady(() => tl.play(0));
            }
          });
        });
      })();

      /* =========================================================
         Existing Case Study Sections — reveal + subtle drift (kept)
      ========================================================= */
      function findComponentRoot(section) {
        return (
          section.querySelector('[class*="_component"]') ||
          section.querySelector(".container-large") ||
          section
        );
      }

      const sections = Array.from(
        document.querySelectorAll('section[class^="section_content"], section[class*=" section_content"]')
      );

      sections.forEach(section => {
        if (section.__gsapRevealInit) return;
        section.__gsapRevealInit = true;

        const root = findComponentRoot(section);
        if (!root) return;

        const items = Array.from(
          root.querySelectorAll("h1, h2, h3, h4, p, .text-rich-text, .w-richtext, .text-block, .button, .button-group, img, .w-video")
        ).filter(el => el && (el.offsetHeight > 0 || el.offsetWidth > 0));

        if (!items.length) return;

        gsap.fromTo(
          items,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            stagger: 0.07,
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
              end: "top 40%",
              toggleActions: "play none none none",
              once: true
            }
          }
        );

        const imgs = Array.from(root.querySelectorAll("img")).slice(0, 2);
        imgs.forEach(img => {
          gsap.fromTo(
            img,
            { y: 10 },
            {
              y: -10,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.7
              }
            }
          );
        });
      });

      setTimeout(() => {
        try { ScrollTrigger.refresh(); } catch (e) {}
      }, 250);
    })
    .catch(() => {
      // If plugin load fails, do nothing (no hard failure on published pages)
    });
});



/* =========================================================
   Gallery10 Masonry — GIF Injector (SCOPED)
   --------------------------------------------------------
   Reads Cloudflare GIF URLs from [data-gallery-gifs] and
   randomly inserts them into the Gallery10 masonry grid.
   Only runs when gallery style is "masonry".
   To remove: delete this script and the .gallery-gifs_data
   div from the template.
========================================================= */
window.Webflow = window.Webflow || [];
window.Webflow.push(function () {

  var wrapper = document.querySelector('.project-gallery[data-gallery-style="masonry"]');
  if (!wrapper) return;

  var dataEl = wrapper.querySelector('.gallery-gifs_data') ||
               document.querySelector('.gallery-gifs_data');
  if (!dataEl) return;

  var raw = (dataEl.getAttribute('data-gallery-gifs') || '').trim();
  if (!raw) return;

  var urls = raw.split('\n')
    .map(function (u) { return u.trim(); })
    .filter(function (u) { return u.length > 0; });

  if (!urls.length) return;

  var list = wrapper.querySelector('.section_gallery10 .gallery10_list');
  if (!list) return;

  var existingItems = Array.from(list.querySelectorAll('.gallery10_item'));
  if (!existingItems.length) return;

  function buildGifItem(url) {
    var item = document.createElement('div');
    item.className = 'gallery10_item gallery10_item-gif';

    var link = document.createElement('div');
    link.className = 'gallery10_lightbox-link';
    link.style.cursor = 'default';

    var imgWrap = document.createElement('div');
    imgWrap.className = 'gallery10_image-wrapper';

    var img = document.createElement('img');
    img.src = url;
    img.alt = '';
    img.loading = 'lazy';
    img.className = 'gallery10_image1';
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';

    imgWrap.appendChild(img);
    link.appendChild(imgWrap);
    item.appendChild(link);

    return item;
  }

  function getRandomPositions(gifCount, totalSlots) {
    var count = Math.min(gifCount, totalSlots);
    var positions = [];
    var maxAttempts = 500;
    var attempt = 0;

    while (positions.length < count && attempt < maxAttempts) {
      attempt++;
      var pos = 1 + Math.floor(Math.random() * (totalSlots - 1));

      // Check minimum 2-slot gap from all existing positions
      var tooClose = false;
      for (var j = 0; j < positions.length; j++) {
        if (Math.abs(pos - positions[j]) < 2) {
          tooClose = true;
          break;
        }
      }

      if (!tooClose && positions.indexOf(pos) === -1) {
        positions.push(pos);
      }
    }

    positions.sort(function (a, b) { return a - b; });
    return positions;
  }

  var positions = getRandomPositions(urls.length, existingItems.length);

  for (var i = positions.length - 1; i >= 0; i--) {
    var gifItem = buildGifItem(urls[i]);
    var refItem = existingItems[positions[i]];
    if (refItem && refItem.parentNode) {
      refItem.parentNode.insertBefore(gifItem, refItem);
    }
  }

  // Refresh ScrollTrigger if present (masonry height changed)
  setTimeout(function () {
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }, 200);

});
