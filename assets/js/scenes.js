/* ============================================================
   SCENES — reveals, chapters, typography, timeline, RSVP, finale
   ============================================================ */
(function () {
  "use strict";

  var W = window, doc = document;
  var $ = W.FILM.$, $$ = W.FILM.$$, reduce = W.FILM.reduce;
  var D = W.WEDDING;
  var gsap = W.gsap, ST = W.ScrollTrigger;
  if (gsap && ST) gsap.registerPlugin(ST);
  var hasGSAP = !!(gsap && ST);

  /* ================================================================
     0. REVEALS — every one reversible (§79)
     ================================================================ */
  (function reveals() {
    function start() {
      // char / line / fade reveals
      $$("[data-reveal]").forEach(function (el) {
        var mode = el.getAttribute("data-reveal");
        if (reduce || !hasGSAP) { el.style.opacity = 1; return; }

        if (mode === "chars" && W.SplitText) {
          var split = new W.SplitText(el, { type: "chars" });
          gsap.set(split.chars, { yPercent: 118, opacity: 0 });
          gsap.to(split.chars, {
            yPercent: 0, opacity: 1, duration: 1.1, ease: "power4.out", stagger: 0.028,
            scrollTrigger: { trigger: el, start: "top 86%", toggleActions: "play none none reverse" }
          });
        } else if (mode === "lines" && W.SplitText) {
          var s2 = new W.SplitText(el, { type: "lines" });
          gsap.set(s2.lines, { yPercent: 60, opacity: 0, filter: "blur(6px)" });
          gsap.to(s2.lines, {
            yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 1.4, ease: "power3.out", stagger: 0.14,
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" }
          });
        } else {
          gsap.set(el, { opacity: 0, y: 26 });
          gsap.to(el, {
            opacity: 1, y: 0, duration: 1.3, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" }
          });
        }
      });
      if (W.ScrollTrigger) W.ScrollTrigger.refresh();
    }

    // SplitText needs the metrics of the loaded fonts
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(start).catch(start);
    else if (W.addEventListener) W.addEventListener("load", start);
    else start();
  })();

  /* ================================================================
     1. CHAPTER TITLE CARDS (§63)
     ================================================================ */
  $$(".chapter-card").forEach(function (card) {
    if (hasGSAP && !reduce) {
      ST.create({
        trigger: card, start: "top 70%", end: "bottom 30%",
        onEnter: function () { card.classList.add("is-in"); },
        onEnterBack: function () { card.classList.add("is-in"); },
        onLeaveBack: function () { card.classList.remove("is-in"); }
      });
      // pause beat: the card breathes while centred
      gsap.fromTo(card.querySelector(".chapter-title"),
        { letterSpacing: "0.14em", opacity: 0.2 },
        {
          letterSpacing: "-0.03em", opacity: 1, duration: 1.6, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 62%", toggleActions: "play none none reverse" }
        });
    } else card.classList.add("is-in");
  });

  /* ================================================================
     2. DIGITAL LETTER (§68) — lines arrive like handwriting
     ================================================================ */
  (function letter() {
    var lines = $$(".letter-line, .letter-sign [data-line]");
    if (!lines.length) return;
    if (reduce || !hasGSAP) { lines.forEach(function (l) { l.style.opacity = 1; }); return; }
    lines.forEach(function (l) {
      gsap.set(l, { opacity: 0, y: 34, filter: "blur(5px)" });
      gsap.to(l, {
        opacity: 1, y: 0, filter: "blur(0px)", duration: 1.5, ease: "power3.out",
        scrollTrigger: { trigger: l, start: "top 88%", toggleActions: "play none none reverse" }
      });
    });
    // slight paper parallax
    var paper = $(".letter-paper");
    if (paper && !W.FILM.mobile) {
      gsap.to(paper, {
        y: -50, ease: "none",
        scrollTrigger: { trigger: ".letter-scene", start: "top bottom", end: "bottom top", scrub: true }
      });
    }
  })();

  /* ================================================================
     3. TYPOGRAPHY AS ACTOR (§46) — word by word, not all at once
     ================================================================ */
  (function typo() {
    var words = $$(".typo-word");
    if (!words.length) return;
    if (reduce || !hasGSAP) { words.forEach(function (w) { w.style.opacity = 1; }); return; }
    words.forEach(function (w, i) {
      gsap.set(w, { opacity: 0, y: 70, filter: "blur(14px)", scale: 0.96 });
      gsap.to(w, {
        opacity: 1, y: 0, filter: "blur(0px)", scale: 1,
        duration: 1.5, ease: "power3.out", delay: i === 0 ? 0 : 0.12,
        scrollTrigger: { trigger: w, start: "top 88%", toggleActions: "play none none reverse" }
      });
      // horizontal drift for the "arrives from the right" line
      if (w.classList.contains("typo-word--right")) {
        gsap.fromTo(w, { x: 110 }, {
          x: 0, duration: 1.8, ease: "power4.out",
          scrollTrigger: { trigger: w, start: "top 88%", toggleActions: "play none none reverse" }
        });
      }
    });
    // letter-spacing animation on the final word (§47)
    var full = $(".typo-word--full");
    if (full) {
      gsap.fromTo(full, { letterSpacing: "0.34em" }, {
        letterSpacing: "-0.03em", duration: 2.6, ease: "power2.inOut",
        scrollTrigger: { trigger: full, start: "top 92%", toggleActions: "play none none reverse" }
      });
    }
  })();

  /* ================================================================
     4. MATCH CUT: sun → ring → glass (§64)
     ================================================================ */
  (function matchcut() {
    var scene = $(".matchcut-scene");
    if (!scene) return;
    var circles = $$(".mc-circle", scene);
    var captionEl = $("[data-mc-caption]", scene);
    var labels = ["СОЛНЦЕ", "КОЛЬЦО", "БОКАЛ"];
    if (reduce || !hasGSAP) {
      circles.forEach(function (c) { c.style.opacity = 1; c.style.transform = "none"; });
      return;
    }
    gsap.set(circles, { opacity: 0, scale: 0.7 });
    gsap.set(circles[0], { opacity: 1, scale: 1 });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: scene, start: "top top", end: "bottom bottom", scrub: 0.6,
        onUpdate: function (self) {
          var i = Math.min(2, Math.floor(self.progress * 3));
          if (captionEl && captionEl.textContent !== labels[i]) {
            captionEl.textContent = labels[i];
            gsap.fromTo(captionEl, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
          }
        }
      }
    });
    // circle 1 grows out, circle 2 matches its shape and takes its place
    tl.to(circles[0], { scale: 1.9, opacity: 0, duration: 1, ease: "power2.in" }, 0.7)
      .fromTo(circles[1], { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: "power2.out" }, 0.9)
      .to(circles[1], { scale: 1.9, opacity: 0, duration: 1, ease: "power2.in" }, 2.1)
      .fromTo(circles[2], { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: "power2.out" }, 2.3);
  })();

  /* ================================================================
     5. BIG NUMBERS + COUNTDOWN (§70, §77)
     ================================================================ */
  (function dateScene() {
    var big = $$("[data-bigline]");
    if (big.length && hasGSAP && !reduce) {
      big.forEach(function (line, i) {
        gsap.fromTo(line,
          { xPercent: i % 2 ? 30 : -26, opacity: 0, filter: "blur(16px)" },
          {
            xPercent: 0, opacity: 1, filter: "blur(0px)", duration: 1.6, ease: "power4.out",
            scrollTrigger: { trigger: line, start: "top 90%", toggleActions: "play none none reverse" }
          });
        gsap.to(line, {
          x: (i % 2 ? -60 : 70) * (i + 1) * 0.4, ease: "none",
          scrollTrigger: { trigger: ".date-scene", start: "top bottom", end: "bottom top", scrub: true }
        });
      });
    }

    // countdown / live / archive modes
    var target = new Date(D.dateISO).getTime();
    var now = Date.now();
    var past = now > target;
    var sameDay = new Date(now).toDateString() === new Date(target).toDateString();
    if (past) doc.body.setAttribute("data-archive", "true");

    var box = $("#countdown");
    if (!box) return;
    var caption = $("[data-cd-caption]", box);
    if (past) {
      caption.textContent = "THE DAY WE SAID YES";
      box.classList.add("is-today");
      ["d", "h", "m", "s"].forEach(function (k) {
        var el = box.querySelector("[data-cd='" + k + "']");
        if (el) el.textContent = k === "d" ? "19" : k === "h" ? "09" : k === "m" ? "20" : "26";
      });
      return;
    }
    if (sameDay) { caption.textContent = "СЕГОДНЯ · TODAY"; box.classList.add("is-today"); }

    function tick() {
      var diff = Math.max(0, target - Date.now());
      var d = Math.floor(diff / 86400000);
      var h = Math.floor(diff / 3600000) % 24;
      var m = Math.floor(diff / 60000) % 60;
      var s = Math.floor(diff / 1000) % 60;
      var map = { d: d, h: h, m: m, s: s };
      Object.keys(map).forEach(function (k) {
        var el = box.querySelector("[data-cd='" + k + "']");
        if (el) {
          var v = String(map[k]);
          if (k !== "d" && v.length < 2) v = "0" + v;
          if (el.textContent !== v) el.textContent = v;
        }
      });
      if (diff === 0) { caption.textContent = "СЕГОДНЯ · TODAY"; box.classList.add("is-today"); }
    }
    tick();
    setInterval(tick, 1000);
  })();

  /* ================================================================
     6. TIMELINE — line draws with scroll; live mode (§70)
     ================================================================ */
  (function timeline() {
    var list = $("#timeline");
    if (!list) return;
    var target = new Date(D.dateISO);
    var today = Date.now() > target.getTime() &&
      new Date().toDateString() === target.toDateString();
    var archive = Date.now() > target.getTime();

    list.innerHTML = D.timeline.map(function (item, i) {
      return "<li" + (today ? " class='is-today'" : "") + ">" +
        "<span class='tl-time'>" + item.time + "</span>" +
        "<div class='tl-body'><h3>" + item.title + "</h3><p>" + item.text + "</p></div></li>";
    }).join("");

    var head = $(".tl-title");
    if (head && archive) head.textContent = "КАК ЭТО БЫЛО";

    if (reduce || !hasGSAP) {
      list.style.setProperty("--tl-progress", 1);
      $$("li", list).forEach(function (li) { li.classList.add("is-in"); });
      return;
    }
    gsap.to(list, {
      "--tl-progress": 1, ease: "none",
      scrollTrigger: { trigger: list, start: "top 75%", end: "bottom 70%", scrub: 0.4 }
    });
    $$("li", list).forEach(function (li) {
      ST.create({
        trigger: li, start: "top 85%",
        onEnter: function () { li.classList.add("is-in"); if (W.FILM.sound) W.FILM.sound.click(); },
        onLeaveBack: function () { li.classList.remove("is-in"); }
      });
      gsap.fromTo(li.querySelector(".tl-body"),
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.1, ease: "power3.out",
          scrollTrigger: { trigger: li, start: "top 88%", toggleActions: "play none none reverse" }
        });
    });
  })();

  /* ================================================================
     7. WIDE SHOT / SUNSET / DINNER — camera moves
     ================================================================ */
  (function cameraMoves() {
    if (reduce || !hasGSAP) return;

    // venue: slow push-in (ZOOM IN §37)
    var venueImg = $(".venue-photo img");
    if (venueImg) {
      gsap.fromTo(venueImg, { scale: 1.16 }, {
        scale: 1.02, ease: "none",
        scrollTrigger: { trigger: ".venue-scene", start: "top bottom", end: "bottom top", scrub: true }
      });
    }

    // sunset: colour grades into evening (§87, §88)
    var sunset = $(".sunset-scene");
    if (sunset) {
      var photoImg = sunset.querySelector("img");
      gsap.fromTo(photoImg, { scale: 1.14, filter: "brightness(.95) saturate(1)" }, {
        scale: 1.0, filter: "brightness(.55) saturate(1.25) sepia(.18)", ease: "none",
        scrollTrigger: { trigger: sunset, start: "top bottom", end: "bottom top", scrub: true }
      });
      gsap.fromTo(sunset, { "--sunset-a": .06 }, {
        "--sunset-a": .5, ease: "none",
        scrollTrigger: { trigger: sunset, start: "top center", end: "bottom top", scrub: true }
      });
      gsap.to(sunset, {
        backgroundColor: "#0B0908", ease: "none",
        scrollTrigger: { trigger: sunset, start: "center center", end: "bottom top", scrub: true }
      });
    }

    // dinner: very slow handheld drift (§92)
    var dinnerImg = $(".dinner-photo img");
    if (dinnerImg) {
      gsap.fromTo(dinnerImg, { scale: 1.02, x: 6, y: -4 }, {
        scale: 1.1, x: -8, y: 6, ease: "none",
        scrollTrigger: { trigger: ".dinner-scene", start: "top bottom", end: "bottom top", scrub: true }
      });
    }

    // final: very slow zoom over the whole finale (§71)
    var finalScene = $(".final-scene");
    if (finalScene) {
      gsap.fromTo(finalScene, { "--final-scale": 1.16 }, {
        "--final-scale": 1.0, ease: "none",
        scrollTrigger: { trigger: finalScene, start: "top bottom", end: "bottom bottom", scrub: true }
      });
    }
  })();

  /* ================================================================
     8. FINAL 60 SECONDS (§71)
     ================================================================ */
  (function finale() {
    var lines = $$("[data-final]");
    if (!lines.length) return;
    if (reduce || !hasGSAP) { lines.forEach(function (l) { l.style.opacity = 1; l.style.transform = "none"; }); return; }
    lines.forEach(function (l, i) {
      gsap.timeline({
        scrollTrigger: {
          trigger: l, start: "top 74%", end: "bottom 30%",
          toggleActions: "play none none reverse"
        }
      })
        .to(l, { opacity: 1, y: 0, duration: 1.6, ease: "power3.out" })
        .to(l, { opacity: 1, duration: 1.2 }, ">"); // deliberate pause
    });

    var end = $(".end-scene");
    if (end) {
      ST.create({
        trigger: end, start: "top 65%",
        onEnter: function () {
          end.classList.add("is-in");
          if (W.FILM.sound) W.FILM.sound.fade(0.04);
        },
        onLeaveBack: function () {
          end.classList.remove("is-in");
          if (W.FILM.sound && W.FILM.sound.on()) W.FILM.sound.fade(0.12);
        }
      });
    }
  })();

  /* ================================================================
     9. RSVP AS PHYSICAL INVITATION (§69)
     ================================================================ */
  (function rsvp() {
    var card = $("#rsvp-card");
    var form = $("#rsvp-form");
    if (!card || !form) return;
    var attend = "yes";

    // remember previous answer
    try {
      var saved = JSON.parse(localStorage.getItem("wedding:rsvp") || "null");
      if (saved) {
        form.name.value = saved.name || "";
        if (saved.wish) form.wish.value = saved.wish;
        attend = saved.attend || "yes";
        if (saved.guests) form.guests.value = saved.guests;
        $$(".choice button", form).forEach(function (b) {
          b.classList.toggle("is-active", b.getAttribute("data-attend") === attend);
        });
      }
    } catch (e) {}

    card.addEventListener("click", function (e) {
      if (card.classList.contains("is-open") || card.classList.contains("is-sent")) return;
      if (e.target.closest(".rsvp-front") || e.target === card) {
        card.classList.add("is-open");
        if (W.FILM.sound) W.FILM.sound.paper();
        setTimeout(function () { form.name.focus(); }, 650);
      }
    });

    $(".rsvp-close", form).addEventListener("click", function (e) {
      e.stopPropagation();
      card.classList.remove("is-open");
    });

    $$(".choice button", form).forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        attend = b.getAttribute("data-attend");
        $$(".choice button", form).forEach(function (x) { x.classList.toggle("is-active", x === b); });
        $$("[data-keep]", form).forEach(function (f) {
          f.style.display = attend === "yes" ? "" : "none";
        });
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (!form.name.value.trim()) { form.name.focus(); return; }
      var payload = {
        name: form.name.value.trim(),
        attend: attend,
        guests: form.guests.value,
        wish: form.wish.value.trim(),
        at: Date.now()
      };
      try { localStorage.setItem("wedding:rsvp", JSON.stringify(payload)); } catch (err) {}
      $("[data-rsvp-echo]").textContent = attend === "yes"
        ? payload.name + " · " + payload.guests + " гост(я/ей) — ждём вас."
        : payload.name + ", спасибо за ответ.";
      card.classList.add("is-sent");
      card.classList.remove("is-open");
      if (W.FILM.sound) W.FILM.sound.chime();

      // wishes written through RSVP appear in the guest book
      if (payload.wish) addWish({ author: payload.name, text: payload.wish }, true);
    });
  })();

  /* ================================================================
     10. WISHES / GUEST BOOK
     ================================================================ */
  var addWish;
  (function wishes() {
    var list = $("#wishes-list");
    var form = $("#wishes-form");
    if (!list || !form) return;

    var stored = [];
    try { stored = JSON.parse(localStorage.getItem("wedding:wishes") || "[]"); } catch (e) {}
    var all = stored.concat(D.wishes);

    function render() {
      list.innerHTML = all.map(function (w) {
        return "<li class='wish' data-cursor='READ'><p>" + escapeHtml(w.text) + "</p><span>" + escapeHtml(w.author) + "</span></li>";
      }).join("");
      if (hasGSAP && !reduce) {
        $$(".wish", list).forEach(function (el, i) {
          gsap.fromTo(el, { y: 46, opacity: 0, rotate: i % 2 ? 1.5 : -1.5 }, {
            y: 0, opacity: 1, rotate: 0, duration: 1.1, ease: "power3.out", delay: (i % 3) * 0.07,
            scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none reverse" }
          });
        });
      }
    }
    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    }

    addWish = function (w, persist) {
      all.unshift(w);
      if (persist) {
        stored.unshift(w);
        try { localStorage.setItem("wedding:wishes", JSON.stringify(stored.slice(0, 30))); } catch (e) {}
      }
      render();
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var author = form.author.value.trim(), text = form.text.value.trim();
      if (!author || !text) return;
      addWish({ author: author, text: text }, true);
      form.reset();
      if (W.FILM.sound) W.FILM.sound.paper();
    });

    render();
  })();

  /* ================================================================
     11. IMAGE LOADING — film-like develop instead of grey box (§81)
     ================================================================ */
  $$("img").forEach(function (im) {
    var mark = function () { im.classList.add("is-loaded"); };
    if (im.complete) mark();
    else { im.addEventListener("load", mark); im.addEventListener("error", mark); }
  });

  /* ================================================================
     12. section palette shift: body follows the act (§88)
     ================================================================ */
  if (hasGSAP && !reduce) {
    $$("[data-act]").forEach(function (sec) {
      ST.create({
        trigger: sec, start: "top 55%", end: "bottom 55%",
        onToggle: function (self) { if (self.isActive) doc.body.setAttribute("data-act", sec.getAttribute("data-act")); }
      });
    });
  }
})();
