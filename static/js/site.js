/* Naughty Bean Consulting — sheet behaviour (no dependencies) */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Theme: PAPER / BLUEPRINT ------------------------------------------ */
  function currentTheme() {
    return root.getAttribute("data-theme") === "blueprint" ? "blueprint" : "paper";
  }
  function paintToggles() {
    var t = currentTheme();
    document.querySelectorAll("[data-theme-toggle] .theme-toggle__opt").forEach(function (el) {
      el.classList.toggle("is-on", el.getAttribute("data-opt") === t);
    });
  }
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("nbc-theme", t); } catch (e) {}
    paintToggles();
  }
  document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setTheme(currentTheme() === "paper" ? "blueprint" : "paper");
    });
  });
  paintToggles();

  /* ---- Mobile navigation -------------------------------------------------- */
  var menuBtn = document.querySelector("[data-menu-toggle]");
  var mnav = document.querySelector("[data-mobile-nav]");
  if (menuBtn && mnav) {
    menuBtn.addEventListener("click", function () {
      var open = mnav.hasAttribute("hidden");
      if (open) { mnav.removeAttribute("hidden"); } else { mnav.setAttribute("hidden", ""); }
      menuBtn.setAttribute("aria-expanded", String(open));
      var label = menuBtn.querySelector("[data-menu-label]");
      if (label) label.textContent = open ? "Close" : "Menu";
    });
  }

  /* ---- Year --------------------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (n) {
    n.textContent = String(new Date().getFullYear());
  });

  /* ---- Dimension lines: measure real lettering width ----------------------- */
  var dims = Array.prototype.slice.call(document.querySelectorAll("[data-dim-of]"));
  function fmt(px) {
    var n = Math.round(px);
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " px";
  }
  function measure(dim) {
    var target = document.querySelector(dim.getAttribute("data-dim-of"));
    if (!target) return;
    var range = document.createRange();
    range.selectNodeContents(target);
    var rects = range.getClientRects();
    var w = 0;
    for (var i = 0; i < rects.length; i++) w = Math.max(w, rects[i].width);
    if (!w) w = target.getBoundingClientRect().width;
    dim.style.width = w + "px";
    var label = dim.querySelector("[data-dim-label]");
    if (!label) return;
    var final = w;
    if (reduceMotion || dim.__done) {
      label.textContent = fmt(final);
      return;
    }
    dim.__done = true;
    var start = null;
    var settle = setTimeout(function () { label.textContent = fmt(final); }, 900);
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / 700);
      var eased = 1 - Math.pow(1 - p, 3);
      label.textContent = fmt(final * eased);
      if (p < 1) requestAnimationFrame(tick); else clearTimeout(settle);
    }
    requestAnimationFrame(tick);
  }
  function measureAll() { dims.forEach(measure); }
  if (dims.length) {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measureAll);
    } else {
      window.addEventListener("load", measureAll);
    }
    var t;
    window.addEventListener("resize", function () {
      clearTimeout(t);
      t = setTimeout(function () { dims.forEach(function (d) { d.__done = true; measure(d); }); }, 120);
    });
  }

  /* ---- Stamps thump in ---------------------------------------------------- */
  document.querySelectorAll(".stamp--lg[data-stamp]").forEach(function (s) {
    if (reduceMotion) return;
    requestAnimationFrame(function () { s.classList.add("is-in"); });
  });

  /* ---- Register rows: whole row is the link ------------------------------- */
  document.querySelectorAll(".reg__row").forEach(function (row) {
    var link = row.querySelector(".reg__rowlink");
    if (!link) return;
    row.addEventListener("click", function (e) {
      if (e.target.closest("a")) return;
      if (e.metaKey || e.ctrlKey) { window.open(link.href, "_blank"); return; }
      window.location.href = link.href;
    });
  });
})();
