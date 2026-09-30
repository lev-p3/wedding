/* ============================================================
   GALLERIES — stack, contact sheet, film strip, album, viewer
   ============================================================ */
(function () {
  "use strict";

  var W = window, doc = document;
  var $ = W.FILM.$, $$ = W.FILM.$$, reduce = W.FILM.reduce;
  var D = W.WEDDING;
  var gsap = W.gsap, ST = W.ScrollTrigger;
  if (gsap && ST) gsap.registerPlugin(ST);

  function img(id, alt, eager) {
    return "<img loading='" + (eager ? "eager" : "lazy") + "' alt='" + (alt || "") +
      "' src='" + D.photo(id, 1200) + "' srcset='" + D.srcset(id) + "' sizes='(max-width:760px) 90vw, 40vw' />";
  }

  /* ================================================================
     §44 PHOTO FLIP STACK
     ================================================================ */
  (function stack() {
    var wrap = $("#photo-stack");
    if (!wrap) return;
    var scene = wrap.closest(".stack-scene");
    var count = $(".stack-count");
    var cards = D.stack.map(function (item, i) {
      var el = document.createElement("figure");
      el.className = "stack-card";
      el.innerHTML = img(item.id, item.alt) +
        "<figcaption class='stack-meta'><b>" + item.n + "</b><span>" + item.cap + "</span></figcaption>";
      wrap.appendChild(el);
      return el;
    });
    var hint = document.createElement("p");
    hint.className = "stack-hint";
    hint.textContent = "ЛИСТАЙТЕ ФОТОГРАФИИ";
    wrap.parentNode.appendChild(hint);

    if (reduce || !ST) {
      cards.forEach(function (c) { c.style.position = "relative"; });
      return;
    }

    // base stacking: each next card sits slightly lower & rotated, behind
    cards.forEach(function (c, i) {
      gsap.set(c, {
        zIndex: i + 1,
        yPercent: i === 0 ? 0 : 110,
        rotation: i === 0 ? 0 : (i % 2 ? 2.6 : -2.2),
        scale: 1
      });
    });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: scene,
        start: "top top",
        end: "bottom bottom",
        scrub: reduce ? false : 0.6,
        onUpdate: function (self) {
          if (!count) return;
          var idx = Math.min(cards.length, Math.floor(self.progress * cards.length) + 1);
          var text = "0" + idx + " / 0" + cards.length;
          if (count.textContent !== text) count.textContent = text;
        }
      }
    });

    // top card rises, tilts away at 50–70% of its path, next reveals from below
    cards.forEach(function (c, i) {
      if (i === cards.length - 1) return;
      var next = cards[i + 1];
      tl.to(c, { yPercent: -46, rotation: (i % 2 ? -7 : 6), scale: 1.04, ease: "power1.inOut", duration: 1 }, i)
        .to(c, { yPercent: -78, opacity: 0, filter: "blur(6px)", ease: "power2.in", duration: 0.55 }, i + 0.55)
        .to(next, { yPercent: 0, rotation: 0, ease: "power2.out", duration: 1 }, i + 0.15);
      if (i === 0) tl.to(hint, { opacity: 0, duration: 0.4 }, 0.2);
    });
    // third card keeps a slight offset angle for physicality
    if (cards[2]) tl.to(cards[2], { rotation: -1.2, duration: 0.4 }, ">");
  })();

  /* ================================================================
     §41 CONTACT SHEET — sheet approaches, one frame goes fullscreen
     ================================================================ */
  (function contactSheet() {
    var sheet = $("#cs-sheet");
    var zoom = $("#cs-zoom");
    if (!sheet) return;
    var scene = sheet.closest(".contactsheet-scene");
    var counter = $("[data-cs-counter]");
    var caption = $("[data-cs-caption]");
    var cells = D.contactSheet.map(function (item, i) {
      var el = document.createElement("div");
      el.className = "cs-cell";
      el.setAttribute("data-n", item.cap.slice(0, 2));
      el.setAttribute("data-cursor", "VIEW");
      el.setAttribute("data-i", String(i));
      el.innerHTML = "<img loading='lazy' alt='" + item.alt + "' src='" + D.photo(item.id, 700) + "' />";
      sheet.appendChild(el);
      return el;
    });

    var focusIndex = 3; // candles — the frame that becomes fullscreen

    function setMeta(i) {
      var item = D.contactSheet[i];
      if (counter) counter.textContent = "0" + (i + 1) + " / 0" + cells.length;
      if (caption) caption.textContent = "FRAME " + item.cap;
    }
    setMeta(0);

    if (reduce || !ST) { cells.forEach(function (c) { c.style.cursor = "pointer"; }); return; }

    gsap.set(sheet, { scale: 1.22, y: 40 });
    cells.forEach(function (c) { gsap.set(c, { opacity: 0.0, y: 26 }); });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: scene,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: function (self) {
          var idx = Math.min(cells.length - 1, Math.floor(self.progress * 2.4));
          setMeta(self.progress > 0.62 ? focusIndex : idx);
        }
      }
    });

    tl.to(sheet, { scale: 1, y: 0, ease: "power2.out", duration: 1.4 }, 0)
      .to(cells, { opacity: 1, y: 0, stagger: 0.05, duration: 0.6 }, 0.1);

    // choose a frame → it grows to fullscreen
    var focus = cells[focusIndex];
    tl.add(function () {
      sheet.classList.add("is-zooming");
      focus.classList.add("is-focus");
    }, 1.5);
    tl.to(focus, { scale: 1.02, duration: 0.3 }, 1.5);

    // clip-path expansion using the focused cell rect
    tl.add(function () {}, 1.7);
    var applyZoom = function (p) {
      if (!zoom) return;
      var r = focus.getBoundingClientRect();
      var vw = W.innerWidth, vh = W.innerHeight;
      var top = (r.top / vh) * 100, left = (r.left / vw) * 100;
      var bottom = (1 - (r.bottom / vh)) * 100, right = (1 - (r.right / vw)) * 100;
      var it = p, ot = 1 - p;
      var t = top * ot, l = left * ot, b = bottom * ot, rr = right * ot;
      zoom.style.opacity = p > 0.02 ? 1 : 0;
      zoom.style.clipPath = "inset(" + t + "% " + rr + "% " + b + "% " + l + "%)";
      var im = zoom.querySelector("img");
      if (im && im.getAttribute("src") !== D.photo(D.contactSheet[focusIndex].id, 2000)) {
        im.src = D.photo(D.contactSheet[focusIndex].id, 2000);
        im.alt = D.contactSheet[focusIndex].alt;
      }
      if (im) im.style.transform = "scale(" + (1.15 - 0.15 * p) + ")";
    };
    applyZoom(0);

    tl.to({ p: 0 }, {
      p: 1, duration: 1.6, ease: "power2.inOut",
      onUpdate: function () { applyZoom(this.targets()[0].p); }
    }, 1.9);
    tl.to(zoom, { opacity: 0, duration: 0.5, ease: "power2.in" }, 3.5);
    tl.add(function () {
      sheet.classList.remove("is-zooming");
      focus.classList.remove("is-focus");
      applyZoom(0);
      if (zoom) zoom.style.opacity = 0;
    }, 4.0);

    // hover to preview
    cells.forEach(function (c, i) {
      c.addEventListener("mouseenter", function () { if (self0()) setMeta(i); });
    });
    function self0() { var t = scene.getBoundingClientRect(); return t.top <= 0 && t.bottom >= W.innerHeight; }

    // click a cell → album viewer at that frame
    cells.forEach(function (c, i) {
      c.addEventListener("click", function () { W.FILM.openViewer && W.FILM.openViewer(i); });
    });
  })();

  /* ================================================================
     §42 FILM STRIP — vertical scroll drives horizontal travel
     ================================================================ */
  (function filmStrip() {
    var strip = $("#strip");
    var viewport = $("#strip-viewport");
    var fill = $("#strip-fill");
    if (!strip || !viewport) return;
    var scene = strip.closest(".strip-scene");

    strip.innerHTML = D.strip.map(function (f, i) {
      var n = "FRAME 00" + (i + 1);
      return "<figure class='strip-frame'>" + img(f.id, f.alt) +
        "<figcaption><span class='strip-num'>" + n + "</span>" +
        "<span class='strip-note'>" + f.note + "</span></figcaption></figure>";
    }).join("");

    // mobile: native swipe sequence with soft snap (§54)
    if (W.FILM.mobile || reduce || !ST) {
      if (fill) {
        viewport.addEventListener("scroll", function () {
          var max = viewport.scrollWidth - viewport.clientWidth;
          fill.style.width = (max > 0 ? (viewport.scrollLeft / max) * 100 : 0) + "%";
        }, { passive: true });
      }
      attachDrag(viewport);
      return;
    }

    var maxShift = function () {
      return Math.max(0, strip.scrollWidth - viewport.clientWidth + 40);
    };

    gsap.to(strip, {
      x: function () { return -maxShift(); },
      ease: "none",
      scrollTrigger: {
        trigger: scene,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.55,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          if (fill) fill.style.width = (self.progress * 100).toFixed(2) + "%";
        }
      }
    });
  })();

  /* simple pointer drag for horizontal reels */
  function attachDrag(el) {
    var down = false, startX = 0, startL = 0;
    el.addEventListener("pointerdown", function (e) {
      down = true; startX = e.clientX; startL = el.scrollLeft;
      el.setPointerCapture && el.setPointerCapture(e.pointerId);
    });
    el.addEventListener("pointermove", function (e) {
      if (!down) return;
      el.scrollLeft = startL - (e.clientX - startX);
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (ev) {
      el.addEventListener(ev, function () { down = false; });
    });
  }

  /* ================================================================
     §43 PHOTO ALBUM — grid opens a physical album experience
     ================================================================ */
  (function albumGrid() {
    var grid = $("#album-grid");
    if (!grid) return;
    grid.innerHTML = D.album.map(function (item, i) {
      return "<figure class='album-cell photo--hover' data-i='" + i + "' data-cursor='VIEW'>" +
        img(item.id, item.alt) +
        "<figcaption class='photo-caption'>" + item.cap + "</figcaption></figure>";
    }).join("");
    $$(".album-cell", grid).forEach(function (cell) {
      cell.addEventListener("click", function () {
        W.FILM.openViewer && W.FILM.openViewer(parseInt(cell.getAttribute("data-i"), 10));
      });
    });
  })();

  /* ================================================================
     ALBUM VIEWER (§43, §96) — keyboard, wheel, swipe, ESC
     ================================================================ */
  (function viewer() {
    var root = $("#album-viewer");
    if (!root) return;
    var stageImg = $("#av-img img");
    var counter = $("#av-counter");
    var caption = $("#av-caption");
    var idx = 0, visible = false, lastScroll = 0;

    function pad(n) { return n < 10 ? "0" + n : String(n); }

    function render(dir) {
      var item = D.album[idx];
      counter.textContent = pad(idx + 1) + " / " + pad(D.album.length);
      caption.textContent = item.cap;
      var apply = function () {
        stageImg.src = D.photo(item.id, 2000);
        stageImg.alt = item.alt;
      };
      if (reduce || !window.gsap || dir === 0) {
        apply();
        stageImg.parentElement.style.transform = "";
        stageImg.parentElement.style.opacity = 1;
        return;
      }
      // old frame slides left, new arrives with a soft overshoot (§43)
      gsap.timeline()
        .to("#av-img", { x: dir > 0 ? -60 : 60, opacity: 0, filter: "blur(6px)", duration: 0.32, ease: "power2.in" })
        .add(apply)
        .fromTo("#av-img",
          { x: dir > 0 ? 90 : -90, opacity: 0, filter: "blur(8px)", scale: 0.97 },
          { x: 0, opacity: 1, filter: "blur(0px)", scale: 1, duration: 0.85, ease: "back.out(1.25)" });
    }

    function open(i) {
      idx = i || 0;
      lastScroll = W.scrollY;
      root.hidden = false;
      doc.body.classList.add("viewer-open");
      requestAnimationFrame(function () { root.classList.add("is-visible"); });
      visible = true;
      render(0);
      if (W.FILM.sound) W.FILM.sound.paper();
      $("#av-close").focus();
    }
    function close() {
      if (!visible) return;
      visible = false;
      root.classList.remove("is-visible");
      doc.body.classList.remove("viewer-open");
      setTimeout(function () { root.hidden = true; }, 600);
      window.scrollTo(0, lastScroll); // page keeps its place (§96)
    }
    function next() { idx = (idx + 1) % D.album.length; render(1); if (W.FILM.sound) W.FILM.sound.paper(); }
    function prev() { idx = (idx - 1 + D.album.length) % D.album.length; render(-1); if (W.FILM.sound) W.FILM.sound.paper(); }

    W.FILM.openViewer = open;

    $("#av-next").addEventListener("click", next);
    $("#av-prev").addEventListener("click", prev);
    $("#av-close").addEventListener("click", close);
    root.addEventListener("click", function (e) { if (e.target === root || e.target.classList.contains("av-stage")) close(); });

    doc.addEventListener("keydown", function (e) {
      if (!visible) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
    });

    // wheel → next/prev (throttled)
    var wheelLock = 0;
    root.addEventListener("wheel", function (e) {
      if (Date.now() - wheelLock < 520) return;
      wheelLock = Date.now();
      e.deltaY > 0 ? next() : prev();
    }, { passive: true });

    // touch swipe
    var sx = 0, sy = 0;
    root.addEventListener("touchstart", function (e) {
      sx = e.touches[0].clientX; sy = e.touches[0].clientY;
    }, { passive: true });
    root.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      var dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 46 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? next() : prev());
    }, { passive: true });
  })();

  /* ================================================================
     §90 PARTY FAST CUTS + §91 COLLAGE + moodboard
     ================================================================ */
  (function party() {
    var wrap = $("#party-cuts");
    if (!wrap) return;
    var scene = wrap.closest(".party-scene");
    wrap.innerHTML = D.partyCuts.map(function (id) {
      return "<div class='party-cut'><img loading='lazy' alt='' src='" + D.photo(id, 1800) + "' /></div>";
    }).join("");
    var cuts = $$(".party-cut", wrap);
    if (reduce || !ST) { cuts[0].style.opacity = 1; return; }

    gsap.set(cuts, { opacity: 0, scale: 1.06 });
    gsap.set(cuts[0], { opacity: 1 });
    var tl = gsap.timeline({
      scrollTrigger: { trigger: scene, start: "top bottom", end: "bottom top", scrub: 0.4 }
    });
    cuts.forEach(function (c, i) {
      if (i === 0) return;
      var at = i / cuts.length;
      tl.to(cuts[i - 1], { opacity: 0, duration: 0.05 }, at)
        .fromTo(c, { opacity: 0, scale: 1.09 }, { opacity: 1, scale: 1.03, duration: 0.09 }, at)
        .to(c, { scale: 1.0, duration: 0.16 }, at + 0.09);
    });
  })();

  (function collage() {
    var wrap = $("#collage");
    if (!wrap) return;
    wrap.innerHTML = D.collage.map(function (item) {
      return "<figure class='collage-item photo--hover'>" + img(item.id, item.alt) +
        "<figcaption class='photo-caption'>" + item.cap + "</figcaption></figure>";
    }).join("");
    if (reduce || !ST) return;
    $$(".collage-item", wrap).forEach(function (el, i) {
      gsap.fromTo(el,
        { y: 70, opacity: 0, rotate: i % 2 ? 1.6 : -1.4 },
        {
          y: 0, opacity: 1, rotate: 0, duration: 1.3, ease: "power3.out", delay: (i % 3) * 0.08,
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" }
        });
    });
  })();

  (function mood() {
    var wrap = $("#mood-grid");
    if (!wrap) return;
    wrap.innerHTML = D.mood.map(function (item, i) {
      return "<figure class='mood-card' data-cursor='VIEW'>" +
        "<img loading='lazy' alt='" + item.alt + "' src='" + D.photo(item.id, 800) + "' />" +
        "<figcaption><span><i class='swatch' style='background:" + item.hex + "'></i>" + item.label + "</span>" +
        "<span>0" + (i + 1) + "</span></figcaption></figure>";
    }).join("");
    if (reduce || !ST) return;
    $$(".mood-card", wrap).forEach(function (el, i) {
      gsap.fromTo(el, { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.1, ease: "power3.out", delay: (i % 3) * 0.1,
        scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" }
      });
    });
  })();

  /* memory blur → focus + caption (§95) on album & collage images */
  if (!reduce && ST) {
    $$(".album-cell img, .collage-item img").forEach(function (im) {
      im.classList.add("photo--memory");
      ST.create({
        trigger: im, start: "top 92%",
        onEnter: function () { im.classList.add("is-sharp"); },
        onLeaveBack: function () { im.classList.remove("is-sharp"); }
      });
    });
  }
})();
