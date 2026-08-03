/* =========================================================
   BALLMONEY — medio digital · JS (vanilla, sin dependencias)
   ========================================================= */
(function () {
  "use strict";

  function safe(fn, name) { try { fn(); } catch (e) { if (window.console) console.warn("[bm] " + name + ":", e); } }

  /* ---------- NAV + MENÚ MÓVIL ---------- */
  function initNav() {
    var menu = document.querySelector("[data-mobile-menu]");
    var burgers = document.querySelectorAll("[data-burger]");

    function setMenu(open) {
      if (!menu) return;
      menu.classList.toggle("is-open", open);
      menu.setAttribute("aria-hidden", open ? "false" : "true");
      document.querySelectorAll(".burger[data-burger]").forEach(function (b) {
        b.setAttribute("aria-expanded", open ? "true" : "false");
      });
      document.body.style.overflow = open ? "hidden" : "";
    }

    burgers.forEach(function (b) {
      b.addEventListener("click", function () { setMenu(!menu.classList.contains("is-open")); });
    });
    if (menu) {
      menu.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () { setMenu(false); });
      });
    }
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

    var catnav = document.querySelector("[data-nav]");
    if (catnav) {
      var onScroll = function () { catnav.classList.toggle("is-scrolled", window.scrollY > 8); };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  }

  /* ---------- ANCLAS INTERNAS ---------- */
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var href = a.getAttribute("href");
        if (href === "#") { e.preventDefault(); return; }   // enlaces de artículo (placeholder)
        // el scroll suave lo gestiona CSS (scroll-behavior + scroll-margin-top)
      });
    });
  }

  /* ---------- REVEAL AL HACER SCROLL ---------- */
  function initReveals() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- AÑO / FECHA ---------- */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }
  function initToday() {
    var el = document.querySelector("[data-today]");
    if (!el) return;
    try {
      var s = new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
      el.textContent = s.charAt(0).toUpperCase() + s.slice(1);
    } catch (e) { /* deja el texto por defecto */ }
  }

  /* ---------- NEWSLETTER (Formspree) ---------- */
  function initForm() {
    var form = document.querySelector("[data-form]");
    if (!form) return;
    var success = form.querySelector("[data-success]");
    var ENDPOINT = "https://formspree.io/f/xrenybvd";   // envío automático + almacenamiento
    var STORE_KEY = "bm_newsletter";

    function get(n) { var el = form.querySelector("#" + n); return el ? el.value.trim() : ""; }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.querySelectorAll(".is-error").forEach(function (f) { f.classList.remove("is-error"); });

      var email = form.querySelector("#email");
      var okEmail = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      if (!okEmail) {
        if (email) { email.closest(".field").classList.add("is-error"); email.focus(); }
        return;
      }

      var data = {
        nombre: get("nombre"),
        email: get("email"),
        tipo: "Suscripción newsletter Ballmoney",
        fecha: new Date().toISOString(),
        _subject: "Nueva suscripción — Ballmoney"
      };

      // respaldo local
      try {
        var arr = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
        arr.push(data); localStorage.setItem(STORE_KEY, JSON.stringify(arr));
      } catch (err) { /* almacenamiento no disponible */ }

      var btn = form.querySelector("[type=submit]");
      var label = btn ? btn.querySelector("span") : null;
      var prev = label ? label.textContent : "";
      if (btn) btn.disabled = true;
      if (label) label.textContent = "Enviando…";

      function done(ok) {
        if (ok) {
          form.querySelectorAll(".news-row, .btn--block, .news-hint").forEach(function (el) { el.style.display = "none"; });
          if (success) { success.classList.add("is-visible"); success.setAttribute("aria-hidden", "false"); }
        } else {
          if (btn) btn.disabled = false;
          if (label) label.textContent = prev;
          // respaldo por correo si el envío automático fallara
          window.location.href = "mailto:ballmoney.contact@gmail.com" +
            "?subject=" + encodeURIComponent("Suscripción newsletter Ballmoney") +
            "&body=" + encodeURIComponent("Nombre: " + data.nombre + "\nCorreo: " + data.email + "\n");
        }
      }

      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      }).then(function (r) { done(r && r.ok); }).catch(function () { done(false); });
    });

    form.addEventListener("input", function (e) {
      var f = e.target.closest(".field");
      if (f) f.classList.remove("is-error");
    });
  }

  /* ---------- BOOT ---------- */
  function boot() {
    safe(initNav, "initNav");
    safe(initAnchors, "initAnchors");
    safe(initReveals, "initReveals");
    safe(initYear, "initYear");
    safe(initToday, "initToday");
    safe(initForm, "initForm");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
