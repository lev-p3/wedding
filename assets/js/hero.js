/* ============================================================
   HERO — FRAME 01 → 08, cinematic opening (§38)
   ================================================================ */
(function () {
  "use strict";

  var W = window, doc = document;
  var $ = W.FILM.$, reduce = W.FILM.reduce;
  var hero = $(".hero");
  var btn = $("#open-invitation");
  if (!hero) return;

  var photo = $(".hero-photo", hero);
  var lines = [".hero-line--1", ".hero-line--amp", ".hero-line--2"].map(function (s) { return $(s, hero); });
  var eyebrow = $(".hero-eyebrow", hero);
  var dateEl = $(".hero-date", hero);
  var meta = $(".hero-meta", hero);
  var hint = $(".hero-scroll-hint", hero);
  var header = $("#site-header");

  var opened = false;

  /* ---------- FRAME 01–08 timeline ---------- */
  function playIntro() {
    if (reduce) {
      [eyebrow, dateEl, meta, hint, btn].concat(lines).forEach(function (el) {
        if (el) { el.style.opacity = 1; }
      });
      if (photo) photo.classList.add("is-developed");
      if (header) header.classList.add("is-in");
      enableScroll();
      return;
    }

    if (!W.gsap) { fallback(); return; }

    var tl = W.gsap.timeline({ defaults: { ease: "power3.out" } });

    // FRAME 01 — darkness + grain settle (CSS already shows grain)
    // FRAME 02 — eyebrow below optical centre
    tl.to(eyebrow, { opacity: 1, duration: 1.1, delay: 0.45, ease: "power2.out" }, 0);

    // FRAME 03 — photograph develops (film reveal, not fade)
    if (photo) tl.add(function () { photo.classList.add("is-developed"); }, 0.85);

    // FRAME 04 / 05 / 06 — names, one line at a time
    lines.forEach(function (line, i) {
      if (!line) return;
      tl.fromTo(line,
        { opacity: 0, yPercent: 108, filter: "blur(10px)" },
        { opacity: 1, yPercent: 0, filter: "blur(0px)", duration: 1.25 },
        1.5 + i * 0.42);
    });

    // FRAME 07 — technical date
    tl.to(dateEl, { opacity: 1, duration: 0.9, ease: "power2.out" }, 3.15);

    // FRAME 08 — invitation button
    tl.to(btn, { opacity: 1, duration: 0.8 }, 3.7);
    tl.to([meta, hint].filter(Boolean), { opacity: 1, duration: 1.0, stagger: 0.15 }, 3.9);
    tl.add(function () { if (header) header.classList.add("is-in"); }, 3.4);
    tl.add(function () { W.FILM.emit("hero-ready"); }, 4.4);
  }

  function fallback() {
    [eyebrow, dateEl, meta, hint, btn].concat(lines).forEach(function (el, i) {
      if (!el) return;
      setTimeout(function () {
        el.style.transition = "opacity 1s ease";
        el.style.opacity = 1;
      }, 400 + i * 380);
    });
    if (photo) setTimeout(function () { photo.classList.add("is-developed"); }, 700);
    if (header) setTimeout(function () { header.classList.add("is-in"); }, 2400);
    setTimeout(function () { W.FILM.emit("hero-ready"); }, 3400);
  }

  /* ---------- clicking OPEN INVITATION (0 → 1.4 s) ---------- */
  function openInvitation() {
    if (opened) return;
    opened = true;
    if (W.FILM.sound) W.FILM.sound.hit();

    if (reduce || !W.gsap) {
      hero.classList.add("is-opening");
      setTimeout(function () {
        enableScroll();
        var story = $("#chapter-I, .chapter-card");
        if (story) story.scrollIntoView({ behavior: "auto" });
        doc.body.classList.remove("is-locked");
        window.dispatchEvent(new Event("resize"));
      }, 300);
      return;
    }

    hero.classList.add("is-opening");
    var layer = $("#transition-layer");

    // 0.7s → next frame develops beneath; 1.1s → transition; 1.4s → scene assembled
    var tl = W.gsap.timeline();
    tl.to(layer, { opacity: 1, duration: 0.42, ease: "power2.in" }, 0.7);
    tl.add(function () {
      enableScroll();
      var next = $(".chapter-card");
      if (next) window.scrollTo({ top: next.offsetTop, behavior: "auto" });
      window.dispatchEvent(new Event("resize"));
      if (W.ScrollTrigger) W.ScrollTrigger.refresh();
    }, 1.08);
    tl.to(layer, { opacity: 0, duration: 0.5, ease: "power2.out" }, 1.12);
    tl.add(function () { hero.classList.add("is-out"); }, 1.35);
    tl.add(function () {
      doc.body.classList.remove("is-locked");
      W.FILM.emit("entered");
      if (W.FILM.sound) W.FILM.sound.chime();
      window.dispatchEvent(new Event("resize"));
      if (W.ScrollTrigger) W.ScrollTrigger.refresh();
    }, 1.45);
  }

  function enableScroll() { /* body unlock happens in timeline */ }

  if (btn) btn.addEventListener("click", openInvitation);

  // scroll hint also opens
  if (hint) hint.addEventListener("click", openInvitation);

  // allow wheel/touch to enter as well
  var wheelGuard = function (e) {
    if (!opened && (e.deltaY > 8 || e.touches)) { openInvitation(); }
  };
  W.addEventListener("wheel", wheelGuard, { passive: true });
  W.addEventListener("touchmove", wheelGuard, { passive: true });

  // keyboard: Enter / ArrowDown / PageDown
  doc.addEventListener("keydown", function (e) {
    if (opened) return;
    if (["Enter", "ArrowDown", "PageDown", " "].indexOf(e.key) !== -1 &&
        !/input|textarea/i.test((doc.activeElement || {}).tagName || "")) {
      openInvitation();
    }
  });

  if (doc.readyState === "complete") playIntro();
  else W.addEventListener("load", playIntro);
  // safety: never leave the visitor stuck on a black screen
  setTimeout(function () { if (!opened && eyebrow && getComputedStyle(eyebrow).opacity === "0") fallback(); }, 6000);
})();
