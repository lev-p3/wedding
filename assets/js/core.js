/* ============================================================
   CORE — cursor, menu, progress, parallax, velocity, sound
   ============================================================ */
(function () {
  "use strict";

  var W = window;
  var doc = document;
  var reduce = W.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = W.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var isMobile = W.matchMedia("(max-width: 760px)").matches;

  W.FILM = {
    reduce: reduce,
    fine: finePointer,
    mobile: isMobile,
    events: {}
  };

  /* ---------------- helpers ---------------- */
  function on(el, ev, fn, opts) { if (el) el.addEventListener(ev, fn, opts); }
  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  W.FILM.$ = $; W.FILM.$$ = $$; W.FILM.on = on;

  /* ================================================================
     1. CURSOR AS GUIDE (§61)
     ================================================================ */
  (function cursor() {
    var el = $(".cursor");
    if (!el || !finePointer || reduce) return;
    var label = $(".cursor-label", el);
    var tx = W.innerWidth / 2, ty = W.innerHeight / 2, cx = tx, cy = ty, raf = 0;

    on(W, "mousemove", function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });

    function tick() {
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      el.style.transform = "translate3d(" + cx + "px," + cy + "px,0)";
      raf = Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4 ? requestAnimationFrame(tick) : 0;
    }

    doc.addEventListener("mouseover", function (e) {
      var target = e.target instanceof Element ? e.target.closest("[data-cursor]") : null;
      var text = target ? target.getAttribute("data-cursor") : "";
      if (text) {
        label.textContent = text;
        el.classList.add("is-label");
      } else {
        el.classList.remove("is-label");
      }
    });
  })();

  /* ================================================================
     2. MENU AS SCENE (§97)
     ================================================================ */
  (function menu() {
    var scene = $("#menu-scene");
    var toggle = $("#menu-toggle");
    var bg = $("#menu-bg");
    if (!scene || !toggle) return;
    var open = false;

    function setImage(key) {
      var id = W.WEDDING.menu[key];
      if (!id) return;
      bg.style.backgroundImage = "url('" + W.WEDDING.photo(id, 1800) + "')";
    }
    setImage("hero");

    $$(".menu-list a", scene).forEach(function (a) {
      on(a, "mouseenter", function () { setImage(a.getAttribute("data-menu-img")); });
      on(a, "click", function (e) {
        e.preventDefault();
        var target = a.getAttribute("href");
        close(function () {
          var node = $(target);
          if (node) node.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
        });
      });
    });

    function openMenu() {
      open = true;
      scene.classList.add("is-open");
      scene.setAttribute("aria-hidden", "false");
      toggle.setAttribute("aria-expanded", "true");
      toggle.textContent = "CLOSE";
      doc.body.classList.add("menu-open");
      W.FILM.emit("menu", true);
    }
    function close(cb) {
      open = false;
      scene.classList.remove("is-open");
      scene.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "MENU";
      doc.body.classList.remove("menu-open");
      W.FILM.emit("menu", false);
      if (cb) setTimeout(cb, 260);
    }
    on(toggle, "click", function () { open ? close() : openMenu(); });
    on(doc, "keydown", function (e) { if (e.key === "Escape" && open) close(); });
    W.FILM.menuClose = function () { if (open) close(); };
  })();

  /* ================================================================
     3. SCROLL INDICATOR (§62) + progress
     ================================================================ */
  (function progress() {
    var num = $("#progress-num");
    var fill = $("#progress-fill");
    var label = $("#progress-label");
    var fillM = $("#progress-fill-m");
    var rail = $(".progress-rail");
    var acts = $$("[data-act]");
    var ACT_LABELS = {
      "1": "THE INVITATION", "2": "THE STORY", "3": "THE DAY",
      "4": "THE CELEBRATION", "5": "FOREVER"
    };
    var ticking = false;

    function update() {
      ticking = false;
      var max = Math.max(1, doc.documentElement.scrollHeight - W.innerHeight);
      var p = Math.min(1, Math.max(0, W.scrollY / max));
      doc.documentElement.style.setProperty("--page-progress", p.toFixed(4));
      if (fill) fill.style.height = (p * 100).toFixed(2) + "%";
      if (fillM) fillM.style.width = (p * 100).toFixed(2) + "%";

      var current = acts[0];
      var mid = W.innerHeight * 0.45;
      for (var i = 0; i < acts.length; i++) {
        var r = acts[i].getBoundingClientRect();
        if (r.top <= mid) current = acts[i];
      }
      if (current) {
        var n = current.getAttribute("data-act");
        var l = current.getAttribute("data-act-label") || ACT_LABELS[n] || "";
        if (num && num.textContent !== "0" + n) num.textContent = "0" + n;
        if (label && l && label.textContent !== l) label.textContent = l;
      }
      if (rail) rail.classList.toggle("is-in", W.scrollY > W.innerHeight * 0.6);
    }
    on(W, "scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    on(W, "resize", update);
    update();
  })();

  /* ================================================================
     4. SCROLL VELOCITY (§58)
     ================================================================ */
  (function velocity() {
    if (reduce) return;
    var last = W.scrollY, v = 0, raf = 0;
    on(W, "scroll", function () {
      var y = W.scrollY;
      v = Math.min(1, Math.abs(y - last) / 60);
      last = y;
      doc.documentElement.style.setProperty("--vel", v.toFixed(3));
      if (!raf) raf = requestAnimationFrame(decay);
    }, { passive: true });
    function decay() {
      v *= 0.86;
      doc.documentElement.style.setProperty("--vel", v.toFixed(3));
      raf = v > 0.01 ? requestAnimationFrame(decay) : 0;
    }
  })();

  /* ================================================================
     5. MOUSE PARALLAX (§59) — depth layers
     ================================================================ */
  (function parallax() {
    if (reduce || !finePointer || isMobile) return;
    var layers = $$("[data-depth]");
    if (!layers.length) return;
    var mx = 0, my = 0, cx = 0, cy = 0, raf = 0;

    on(W, "mousemove", function (e) {
      mx = (e.clientX / W.innerWidth - 0.5) * 2;
      my = (e.clientY / W.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });

    function tick() {
      cx += (mx - cx) * 0.06;
      cy += (my - cy) * 0.06;
      for (var i = 0; i < layers.length; i++) {
        var d = parseFloat(layers[i].getAttribute("data-depth")) || 8;
        layers[i].style.setProperty("--px", (cx * d).toFixed(2) + "px");
        layers[i].style.setProperty("--py", (cy * d * 0.6).toFixed(2) + "px");
        layers[i].style.translate = (cx * d).toFixed(2) + "px " + (cy * d * 0.6).toFixed(2) + "px";
      }
      raf = Math.abs(mx - cx) > 0.002 ? requestAnimationFrame(tick) : 0;
    }
  })();

  /* ================================================================
     6. SOUND DESIGN (§51) — procedural, very quiet
     ================================================================ */
  (function sound() {
    var btn = $("#sound-toggle");
    if (!btn) return;
    var ctx = null, master = null, ambience = null, on_ = false;

    function build() {
      var AC = W.AudioContext || W.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.0;
      master.connect(ctx.destination);

      // room tone: filtered noise loop
      var len = ctx.sampleRate * 3;
      var buf = ctx.createBuffer(1, len, ctx.sampleRate);
      var data = buf.getChannelData(0);
      var b0 = 0;
      for (var i = 0; i < len; i++) {
        var white = Math.random() * 2 - 1;
        b0 = 0.985 * b0 + 0.015 * white;      // brown-ish
        data[i] = b0 * 3.2;
      }
      ambience = ctx.createBufferSource();
      ambience.buffer = buf; ambience.loop = true;
      var lp = ctx.createBiquadFilter();
      lp.type = "lowpass"; lp.frequency.value = 620;
      var g = ctx.createGain(); g.gain.value = 0.5;
      ambience.connect(lp); lp.connect(g); g.connect(master);
      ambience.start();
      return true;
    }

    function ramp(v, t) {
      if (!ctx) return;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(v, ctx.currentTime, t || 0.6);
    }

    // soft cues
    function tone(freq, dur, vol, type) {
      if (!ctx || !on_) return;
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type || "sine"; o.frequency.value = freq;
      g.gain.value = 0;
      g.gain.setTargetAtTime(vol, ctx.currentTime, 0.02);
      g.gain.setTargetAtTime(0, ctx.currentTime + dur * 0.4, dur * 0.3);
      o.connect(g); g.connect(master);
      o.start(); o.stop(ctx.currentTime + dur + 0.4);
    }
    function noise(dur, vol, freq) {
      if (!ctx || !on_) return;
      var len = Math.floor(ctx.sampleRate * dur);
      var buf = ctx.createBuffer(1, len, ctx.sampleRate);
      var d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      var src = ctx.createBufferSource(); src.buffer = buf;
      var bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = freq || 2400;
      var g = ctx.createGain(); g.gain.value = vol;
      src.connect(bp); bp.connect(g); g.connect(master);
      src.start();
    }

    W.FILM.sound = {
      on: function () { return on_; },
      paper: function () { noise(0.28, 0.16, 1800); },
      click: function () { noise(0.06, 0.2, 3400); tone(880, 0.1, 0.05, "triangle"); },
      hit: function () { tone(96, 1.4, 0.34, "sine"); tone(144, 1.0, 0.12, "sine"); },
      chime: function () { tone(523, 1.2, 0.08); tone(784, 1.4, 0.05); },
      fade: function (v) { ramp(v, 1.2); }
    };

    on(btn, "click", function () {
      if (!ctx && !build()) return;
      if (ctx.state === "suspended") ctx.resume();
      on_ = !on_;
      btn.classList.toggle("is-on", on_);
      btn.setAttribute("aria-pressed", String(on_));
      $("span", btn).textContent = on_ ? "SOUND ON" : "SOUND OFF";
      ramp(on_ ? 0.12 : 0.0, 1.0);
      if (on_) W.FILM.sound.chime();
    });
  })();

  /* ================================================================
     7. SCROLL-TO buttons + smooth anchor behavior (§98)
     ================================================================ */
  $$("[data-scroll-to]").forEach(function (btn) {
    on(btn, "click", function () {
      var node = $(btn.getAttribute("data-scroll-to"));
      if (node) node.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    });
  });

  /* ================================================================
     8. tiny event bus
     ================================================================ */
  W.FILM.emit = function (name, payload) {
    (W.FILM.events[name] || []).forEach(function (fn) { fn(payload); });
  };
  W.FILM.on = function (name, fn) {
    (W.FILM.events[name] = W.FILM.events[name] || []).push(fn);
  };
})();
