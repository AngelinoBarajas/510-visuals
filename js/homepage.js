/* 5TEN VISUALS — Homepage JS
   CDN: https://cdn.jsdelivr.net/gh/AngelinoBarajas/510-visuals@main/js/homepage.js
   NOTE: SplitType and Swiper must be loaded BEFORE this file */

<!-- Libraries (load once on this page) -->




(() => {
  "use strict";

  // Prevent double-init if Webflow re-runs scripts
  if (window.__TEN_MASTER_V5) return;
  window.__TEN_MASTER_V5 = true;

  // -----------------------------
  // SWIPER DRIFT
  // -----------------------------
  function initSwiperDrift() {
    if (!window.Swiper) return;

    document.querySelectorAll(".breakout_slider-parallax_component").forEach((component) => {
      const slider = component.querySelector(".breakout_slider-parallax_wrap");
      if (!slider) return;

      if (slider.__TEN_SWIPER_INIT) return;
      slider.__TEN_SWIPER_INIT = true;

      const swiper = new Swiper(slider, {
        slidesPerView: "auto",
        centeredSlides: true,
        loop: true,
        freeMode: { enabled: true, momentum: false },
        grabCursor: true,
        allowTouchMove: true,
        speed: 600
      });

      let driftSpeed = 0.15;
      let isInteracting = false;

      swiper.on("touchStart", () => isInteracting = true);
      swiper.on("touchEnd", () => isInteracting = false);
      swiper.on("sliderMove", () => isInteracting = true);

      function drift() {
        if (!isInteracting) swiper.setTranslate(swiper.getTranslate() - driftSpeed);
        requestAnimationFrame(drift);
      }
      drift();
    });
  }

  // -----------------------------
  // LAYOUT 484 REVEAL ON SCROLL (SAFE RESET)
  // -----------------------------
  function initLayout484Split() {
    if (!window.gsap || !window.ScrollTrigger || !window.SplitType) return;

    gsap.registerPlugin(ScrollTrigger);

    const textEl = document.querySelector(".layout484_text");
    if (!textEl) return;

    const TRIGGER_ID = "TEN_LAYOUT484_SPLIT";

    const existing = ScrollTrigger.getById(TRIGGER_ID);
    if (existing) existing.kill(true);

    if (textEl.__tenSplitInstance && typeof textEl.__tenSplitInstance.revert === "function") {
      textEl.__tenSplitInstance.revert();
      textEl.__tenSplitInstance = null;
    }

    const split = new SplitType(textEl, { types: "words" });
    textEl.__tenSplitInstance = split;

    gsap.set(split.words, { opacity: 0.15 });

    const isMobile = window.innerWidth <= 767;
    const startValue = isMobile ? "top 92%" : "top 82%";
    const endValue   = isMobile ? "bottom 70%" : "bottom 58%";

    gsap.to(split.words, {
      opacity: 1,
      stagger: 0.08,
      ease: "none",
      scrollTrigger: {
        id: TRIGGER_ID,
        trigger: textEl,
        start: startValue,
        end: endValue,
        scrub: 2,
        invalidateOnRefresh: true
      }
    });

    ScrollTrigger.refresh();
  }

  // -----------------------------
  // SCROLL SECTION (STATIC BG, CONTENT ONLY)  (UNCHANGED)
  // -----------------------------
  function initScrollSection() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    const ID = "TEN_SCROLL_SECTION";

    const section =
      document.querySelector('[data-scroll-section="true"]') ||
      document.querySelector(".scroll-section_component");

    if (!section) return;

    const sticky = section.querySelector(".scroll-section_sticky-wrapper");
    const container = section.querySelector(".scroll-section_container");
    const spacer = section.querySelector(".scroll-section_spacer");
    const slides = Array.from(section.querySelectorAll(".scroll-section_slide"));

    if (!sticky || !container || slides.length < 2) return;

    const existing = ScrollTrigger.getById(ID);
    if (existing) existing.kill(true);

    if (spacer) spacer.style.height = "0px";

    gsap.set(sticky, {
      width: "100vw",
      height: "100vh",
      left: "50%",
      xPercent: -50,
      position: "relative",
      overflow: "hidden"
    });

    gsap.set(container, { position: "relative", width: "100%", height: "100%", zIndex: 2 });

    slides.forEach((s, i) => {
      gsap.set(s, {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 3,
        autoAlpha: i === 0 ? 1 : 0,
        y: 0,
        willChange: "transform, opacity"
      });
    });

    const steps = slides.length - 1;

    const swapAt = 0.50;
    const enterY = 12;
    const exitY  = -6;

    const outDur = 0.55;
    const inDur  = 0.70;
    const inDelay = 0.18;

    let current = 0;
    let animating = false;

    function finalize(next) {
      slides.forEach((s, i) => gsap.set(s, { autoAlpha: i === next ? 1 : 0, y: 0 }));
      current = next;
      animating = false;
    }

    function transitionTo(next) {
      if (next === current || animating) return;
      animating = true;

      const from = slides[current];
      const to = slides[next];

      gsap.set(to, { autoAlpha: 0, y: enterY });

      gsap.timeline({
        defaults: { overwrite: true },
        onComplete: () => finalize(next)
      })
      .to(from, { autoAlpha: 0, y: exitY, duration: outDur, ease: "power1.inOut" }, 0)
      .to(to,   { autoAlpha: 1, y: 0,   duration: inDur,  ease: "power2.out" }, inDelay);
    }

    ScrollTrigger.create({
      id: ID,
      trigger: section,
      start: "top top",
      end: () => "+=" + (steps * window.innerHeight),
      scrub: 2.0,
      pin: sticky,
      pinSpacing: true,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate(self) {
        const p = self.progress * steps;
        const base = Math.floor(p + 1e-6);
        const frac = p - base;

        let idx = base;
        if (frac >= swapAt) idx = Math.min(base + 1, steps);

        transitionTo(idx);
      }
    });
  }

  // -----------------------------
  // SIMPLE FADE UP
  // -----------------------------
  function initFadeUps() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".gsap-fade-up").forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true
          }
        }
      );
    });
  }

  // =========================================================
  // GALLERY24 — PARALLAX STACK (Pinned + Overlapping via clip-path)
  // + Premium overlay animation (grain/spec)
  // =========================================================
  function initGallery24() {
    if (window.__TEN_GALLERY24_STACK_BUILD_V5) return;
    window.__TEN_GALLERY24_STACK_BUILD_V5 = true;

    function loadScriptOnce(src){
      return new Promise(function(resolve, reject){
        if ([].slice.call(document.scripts).some(function(s){ return (s.src || "").includes(src); })) return resolve();
        var s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }

    function isHls(url){
      return /\.m3u8(\?|$)/i.test(url || "");
    }

    async function attachHlsOrFile(vid, url){
      if (!url) return null;

      if (!isHls(url)){
        vid.src = url;
        return null;
      }

      if (vid.canPlayType("application/vnd.apple.mpegurl")){
        vid.src = url;
        return null;
      }

      try{
        await loadScriptOnce("https://cdn.jsdelivr.net/npm/hls.js@1.5.8");
        if (!window.Hls || !window.Hls.isSupported()) return null;

        var hls = new Hls({ backBufferLength: 30, maxBufferLength: 60 });
        hls.loadSource(url);
        hls.attachMedia(vid);
        return hls;
      }catch(e){
        return null;
      }
    }

    function buildPanel(fromCmsItem){
      var hrefEl = fromCmsItem.querySelector("a.gallery24_item-link");
      var titleEl = fromCmsItem.querySelector(".gallery24_title-text");
      var posterEl = fromCmsItem.querySelector("img.gallery24_poster");
      var mountEl = fromCmsItem.querySelector(".gallery24_video");

      var href = hrefEl ? (hrefEl.getAttribute("href") || "#").trim() : "#";
      var title = titleEl ? titleEl.textContent.trim() : "";
      var posterUrl = posterEl ? (posterEl.currentSrc || posterEl.getAttribute("src") || "").trim() : "";
      var videoUrl = mountEl ? (mountEl.getAttribute("data-video-url") || "").trim() : "";

      var item = document.createElement("div");
      item.className = "gallery24_item";

      var media = document.createElement("div");
      media.className = "gallery24_media";

      var poster = document.createElement("img");
      poster.className = "gallery24_poster";
      poster.loading = "lazy";
      poster.alt = title || "";
      if (posterUrl) poster.src = posterUrl;
      media.appendChild(poster);

      var mount = document.createElement("div");
      mount.className = "gallery24_video";
      if (videoUrl) mount.setAttribute("data-video-url", videoUrl);
      media.appendChild(mount);

      var link = document.createElement("a");
      link.className = "gallery24_item-link w-inline-block";
      link.href = href;

      var titleWrap = document.createElement("div");
      titleWrap.className = "gallery24_title";

      var titleText = document.createElement("div");
      titleText.className = "gallery24_title-text";
      titleText.textContent = title;

      titleWrap.appendChild(titleText);

      item.appendChild(media);
      item.appendChild(link);
      item.appendChild(titleWrap);

      return item;
    }

    function mountVideo(panel){
      var mount = panel.querySelector(".gallery24_video");
      if (!mount || mount.__tenBuilt) return null;

      var url = (mount.getAttribute("data-video-url") || "").trim();
      if (!url) return null;

      mount.__tenBuilt = true;
      mount.innerHTML = "";

      var vid = document.createElement("video");
      vid.muted = true;
      vid.playsInline = true;
      vid.loop = true;
      vid.preload = "metadata";
      vid.autoplay = false;

      vid.setAttribute("muted", "");
      vid.setAttribute("playsinline", "");
      vid.setAttribute("loop", "");

      var posterImg = panel.querySelector("img.gallery24_poster");
      var posterUrl = posterImg ? (posterImg.currentSrc || posterImg.getAttribute("src") || "").trim() : "";
      if (posterUrl) vid.poster = posterUrl;

      mount.appendChild(vid);

      function markReady(){ mount.classList.add("is-ready"); }
      vid.addEventListener("playing", markReady);
      vid.addEventListener("canplay", markReady);

      attachHlsOrFile(vid, url).then(function(hls){
        vid.__tenHls = hls || null;
      });

      return vid;
    }

    function setupParallax(section){
      if (!window.gsap || !window.ScrollTrigger) return;
      gsap.registerPlugin(ScrollTrigger);

      var track = section.querySelector(".gallery24_stack-track");
      if (!track) return;

      var panels = [].slice.call(track.querySelectorAll(".gallery24_item"));
      if (panels.length < 2) return;

      if (section.__tenG24ST && typeof section.__tenG24ST.kill === "function"){
        section.__tenG24ST.kill(true);
        section.__tenG24ST = null;
      }
      if (section.__tenG24TL && typeof section.__tenG24TL.kill === "function"){
        section.__tenG24TL.kill();
        section.__tenG24TL = null;
      }

      function tryPlay(vid){
        if (!vid) return;
        try{
          var p = vid.play();
          if (p && typeof p.catch === "function") p.catch(function(){});
        }catch(e){}
      }

      function playIndex(idx){
        [idx - 1, idx, idx + 1].forEach(function(i){
          if (i < 0 || i >= panels.length) return;
          var vid = panels[i].querySelector(".gallery24_video video");
          if (vid) tryPlay(vid);
        });
      }

      function setVideoVisibility(activeIdx){
        panels.forEach(function(p, i){
          p.classList.toggle("is-active", i === activeIdx);
          p.classList.toggle("is-next", i === activeIdx + 1);
        });
      }

      var titles = panels.map(function(p){ return p.querySelector(".gallery24_title"); });
      titles.forEach(function(t, i){
        if (!t) return;
        gsap.set(t, { autoAlpha: i === 0 ? 1 : 0, y: 0 });
      });

      var depthStep = 70;
      var yStep     = 2.2;
      var sStep     = 0.02;
      var baseTiltX = 10;
      var baseTiltY = -6;

      panels.forEach(function(p, i){
        var isTop = (i === 0);

        gsap.set(p, {
          zIndex: (panels.length - i),
          opacity: 1,
          force3D: true,
          transformOrigin: "50% 70%",
          rotateX: isTop ? 0 : baseTiltX,
          rotateY: isTop ? 0 : baseTiltY,
          z:       isTop ? 0 : (-i * depthStep),
          yPercent:isTop ? 0 : (i * yStep),
          scale:   isTop ? 1 : (1 - (i * sStep)),
          clipPath: isTop ? "inset(0% 0% 0% 0%)" : "inset(96% 0% 0% 0%)",
          webkitClipPath: isTop ? "inset(0% 0% 0% 0%)" : "inset(96% 0% 0% 0%)",
          "--grain-o": isTop ? 0.16 : 0,
          "--spec-o":  isTop ? 0.55 : 0,
          "--spec-x":  "-25%"
        });
      });

      setVideoVisibility(0);
      playIndex(0);

      var tl = gsap.timeline({ defaults: { ease: "none" } });

      var outFadeDur = 0.18;
      var outShrink  = 0.90;
      var outTiltX   = 16;
      var outTiltY   = -10;
      var outZ       = -220;
      var outY       = -3;

      var inStartTiltX = 14;
      var inStartTiltY = -10;
      var inStartZ     = -120;
      var inStartY     = 10;
      var inStartScale = 0.94;

      for (var s = 0; s < panels.length - 1; s++){
        var current = panels[s];
        var next    = panels[s + 1];

        var currentTitle = titles[s];
        var nextTitle    = titles[s + 1];

        tl.set(next, { zIndex: 999, opacity: 1 }, s);

        tl.call((function(idx){
          return function(){
            setVideoVisibility(idx);
            playIndex(idx);
          };
        })(s), null, s);

        tl.set(next, {
          rotateX: inStartTiltX,
          rotateY: inStartTiltY,
          z: inStartZ,
          yPercent: inStartY,
          scale: inStartScale,
          opacity: 1,
          clipPath: "inset(96% 0% 0% 0%)",
          webkitClipPath: "inset(96% 0% 0% 0%)",
          "--grain-o": 0.10,
          "--spec-o":  0.35,
          "--spec-x":  "-35%"
        }, s);

        tl.to(next, { "--spec-x": "35%", duration: 1.0 }, s);

        tl.to(next, {
          clipPath: "inset(0% 0% 0% 0%)",
          webkitClipPath: "inset(0% 0% 0% 0%)",
          duration: 1.0,
          ease: "power2.out"
        }, s + 0.05);

        tl.to(next, {
          rotateX: 0,
          rotateY: 0,
          z: 0,
          yPercent: 0,
          scale: 1,
          duration: 1.0
        }, s);

        if (currentTitle) tl.set(currentTitle, { autoAlpha: 0 }, s);
        if (nextTitle)    tl.set(nextTitle,    { autoAlpha: 1 }, s + 0.22);

        tl.to(current, { opacity: 0, duration: outFadeDur }, s);
        tl.to(current, { "--grain-o": 0, "--spec-o": 0, duration: 0.18 }, s);
        tl.to(current, {
          rotateX: outTiltX,
          rotateY: outTiltY,
          z: outZ,
          yPercent: outY,
          scale: outShrink,
          duration: 0.55
        }, s);

        tl.set(next, { "--grain-o": 0.16, "--spec-o": 0.55 }, s + 0.22);
        tl.to(next,  { "--spec-x": "-10%", duration: 0.9 }, s + 0.35);

        tl.set(next, { zIndex: (panels.length - (s + 1)) }, s + 1.0);

        tl.call((function(idx){
          return function(){
            setVideoVisibility(idx + 1);
            playIndex(idx + 1);
          };
        })(s), null, s + 0.02);
      }

      var st = ScrollTrigger.create({
        id: "TEN_GALLERY24_PARALLAX",
        trigger: section,
        start: "top top",
        end: function(){ return "+=" + ((panels.length - 1) * window.innerHeight); },

        pin: section,
        pinSpacing: true,

        scrub: 1.0,
        animation: tl,
        invalidateOnRefresh: true,
        anticipatePin: 1,

        onEnter: function(){
          setVideoVisibility(0);
          playIndex(0);
        },
        onEnterBack: function(){
          var idx = Math.round((st.progress || 0) * (panels.length - 1));
          setVideoVisibility(idx);
          playIndex(idx);
        },
        onUpdate: function(self){
          var idx = Math.round(self.progress * (panels.length - 1));
          if (idx !== section.__tenG24ActiveIdx){
            section.__tenG24ActiveIdx = idx;
            setVideoVisibility(idx);
            playIndex(idx);
          }
        }
      });

      section.__tenG24TL = tl;
      section.__tenG24ST = st;

      ScrollTrigger.refresh();
    }

    function rebuild(){
      document.querySelectorAll(".section_gallery24").forEach(function(section){
        var track = section.querySelector(".gallery24_stack-track");
        var source = section.querySelector(".gallery24_cms-source .w-dyn-items");
        if (!track || !source) return;

        var cmsItems = [].slice.call(source.querySelectorAll(".w-dyn-item"));
        if (!cmsItems.length) return;

        track.innerHTML = "";

        var panels = cmsItems.map(buildPanel);
        panels.forEach(function(p){ track.appendChild(p); });
        panels.forEach(function(p){ mountVideo(p); });

        setupParallax(section);

        setTimeout(function(){
          if (window.ScrollTrigger) ScrollTrigger.refresh();
        }, 120);
      });
    }

    window.Webflow = window.Webflow || [];
    window.Webflow.push(function(){
      rebuild();
      window.addEventListener("load", function(){ setTimeout(rebuild, 150); }, { once:true });
    });
  }

  function start() {
    initSwiperDrift();
    initLayout484Split();
    initScrollSection();
    initFadeUps();
    initGallery24();

    window.addEventListener("resize", () => {
      clearTimeout(window.__tenResizeTO);
      window.__tenResizeTO = setTimeout(() => {
        initLayout484Split();
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      }, 200);
    });

    window.addEventListener("load", () => {
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }, { once: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();

