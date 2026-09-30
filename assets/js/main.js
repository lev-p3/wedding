/* ============================================================
   MAIN — bootstrap the film
   ============================================================ */
(function () {
  "use strict";

  var W = window, doc = document;
  var $ = W.FILM.$, $$ = W.FILM.$$, reduce = W.FILM.reduce;
  var D = W.WEDDING;

  /* ---- archive mode (§103): after the date the site becomes memory ---- */
  (function archive() {
    var past = Date.now() > new Date(D.dateISO).getTime();
    doc.body.setAttribute("data-archive", past ? "true" : "false");
    if (past) {
      var hint = $(".album-hint");
      if (hint) hint.textContent = "Фотографии нашего дня — откройте любой кадр.";
      var cd = $("[data-cd-caption]");
      if (cd) cd.textContent = "THE DAY WE SAID YES";
      var partyNote = $(".party-note");
      if (partyNote) partyNote.textContent = "Та самая ночь.";
    }
  })();

  /* ---- header date (§76 editorial detail) ---- */
  (function headerDate() {
    var el = $("[data-role='header-date']");
    if (el) el.textContent = D.dateShort;
  })();

  /* ---- keep layout honest as images arrive (§80) ---- */
  function refresh() {
    if (W.ScrollTrigger) W.ScrollTrigger.refresh();
  }
  W.addEventListener("load", function () {
    refresh();
    setTimeout(refresh, 900);
    setTimeout(refresh, 2600);
  });
  W.addEventListener("resize", function () {
    clearTimeout(W.__rz);
    W.__rz = setTimeout(refresh, 240);
  });

  /* ---- no-JS safety: if GSAP failed to load, show everything ---- */
  if (!W.gsap) {
    $$("[data-reveal], .typo-word, .letter-line, .chapter-title, .final-line").forEach(function (el) {
      el.style.opacity = 1;
      el.style.transform = "none";
      el.style.filter = "none";
    });
    $$(".photo--develop").forEach(function (p) { p.classList.add("is-developed"); });
    doc.body.classList.remove("is-locked");
    var header = $("#site-header");
    if (header) header.classList.add("is-in");
  }

  /* ---- reduced motion: never trap the visitor on black ---- */
  if (reduce) {
    doc.body.classList.remove("is-locked");
  }

  /* ---- deep links: /#chapter jumps straight to a scene ---- */
  function jumpHash() {
    var hash = location.hash.replace("#", "");
    if (!hash) return;
    var node = doc.getElementById(hash);
    if (!node) return;
    doc.body.classList.remove("is-locked");
    setTimeout(function () {
      node.scrollIntoView({ behavior: "auto", block: "start" });
      if (W.ScrollTrigger) W.ScrollTrigger.refresh();
      W.dispatchEvent(new Event("resize"));
    }, 120);
  }
  if (location.hash) {
    W.addEventListener("load", jumpHash);
    setTimeout(jumpHash, 1500);
  }

  /* ---- service worker: skip (static folder, no offline contract) ---- */
})();
