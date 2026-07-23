/* =========================================================
   BALLMONEY — main.js  (vanilla, IIFE, sin dependencias)
   ========================================================= */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasHover = window.matchMedia("(hover: hover)").matches;

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "]", e); }
  }

  /* ---------- SPLASH ---------- */
  function initSplash() {
    var splash = document.querySelector("[data-splash]");
    if (!splash) return;
    var hide = function () { splash.classList.add("is-out"); document.body.style.overflow = ""; };
    document.body.style.overflow = "hidden";
    var t = reduced ? 500 : 1500;
    if (document.readyState === "complete") setTimeout(hide, t);
    else window.addEventListener("load", function () { setTimeout(hide, t - 400); });
    setTimeout(hide, 4200); // safety
  }

  /* ---------- NAV state + mobile ---------- */
  function initNav() {
    var nav = document.querySelector("[data-nav]");
    var burger = document.querySelector("[data-burger]");
    var menu = document.querySelector("[data-mobile-menu]");

    var onScroll = function () {
      if (!nav) return;
      nav.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (burger && menu) {
      var toggle = function (open) {
        menu.classList.toggle("is-open", open);
        burger.setAttribute("aria-expanded", open ? "true" : "false");
        menu.setAttribute("aria-hidden", open ? "false" : "true");
        document.body.style.overflow = open ? "hidden" : "";
      };
      burger.addEventListener("click", function () {
        toggle(!menu.classList.contains("is-open"));
      });
      menu.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () { toggle(false); });
      });
    }
  }

  /* ---------- SMOOTH ANCHORS ---------- */
  function initAnchors() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var offset = 74;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - offset,
        behavior: reduced ? "auto" : "smooth"
      });
    });
  }

  /* ---------- SCROLL PROGRESS ---------- */
  function initProgress() {
    var bar = document.querySelector("[data-progress]");
    if (!bar) return;
    var update = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? (window.scrollY / h) * 100 : 0;
      bar.style.width = p + "%";
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  /* ---------- REVEAL on scroll ---------- */
  function initReveals() {
    var els = document.querySelectorAll(".reveal, [data-split]");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (el) { io.observe(el); });

    // safety: reveal anything still hidden after 6s
    setTimeout(function () {
      els.forEach(function (el) {
        if (!el.classList.contains("is-visible") &&
            el.getBoundingClientRect().top < window.innerHeight * 1.4) {
          el.classList.add("is-visible");
        }
      });
    }, 6000);
  }

  /* ---------- SPLIT TEXT (word rise) ---------- */
  function escHTML(s) {
    return s.replace(/[&<>]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
    });
  }
  function initSplit() {
    document.querySelectorAll("[data-split]").forEach(function (el) {
      if (el.dataset.splitDone) return;
      el.dataset.splitDone = "1";
      var i = 0;
      var wrapText = function (text) {
        return text.split(/(\s+)/).map(function (w) {
          if (/^\s*$/.test(w)) return w;
          var d = (i++ * 0.045).toFixed(3);
          return '<span class="word"><span style="--d:' + d + 's">' + escHTML(w) + "</span></span>";
        }).join("");
      };
      var out = Array.prototype.map.call(el.childNodes, function (node) {
        if (node.nodeType === 3) return wrapText(node.textContent);
        if (node.nodeName === "BR") return "<br>";
        if (node.nodeType === 1) {
          var tag = node.tagName.toLowerCase();
          var cls = node.className ? ' class="' + node.className + '"' : "";
          return "<" + tag + cls + ">" + wrapText(node.textContent) + "</" + tag + ">";
        }
        return "";
      }).join("");
      el.innerHTML = out;
    });
  }

  /* ---------- CURSOR GLOW ---------- */
  function initGlow() {
    var glow = document.querySelector("[data-glow]");
    if (!glow || !hasHover) return;
    var tx = 0, ty = 0, cx = 0, cy = 0, ready = false, raf;
    window.addEventListener("mousemove", function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!ready) {
        ready = true; cx = tx; cy = ty;
        glow.classList.add("is-ready");
        if (!raf) loop();
      }
    });
    function loop() {
      cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
      glow.style.transform = "translate3d(" + cx + "px," + cy + "px,0)";
      raf = requestAnimationFrame(loop);
    }
  }

  /* ---------- MAGNETIC BUTTONS ---------- */
  function initMagnetic() {
    if (!hasHover) return;
    document.querySelectorAll("[data-magnetic]").forEach(function (btn) {
      var strength = 0.28;
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var mx = e.clientX - r.left - r.width / 2;
        var my = e.clientY - r.top - r.height / 2;
        btn.style.transform = "translate(" + mx * strength + "px," + my * strength + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
      });
    });
  }

  /* ---------- HERO PARALLAX (light) ---------- */
  function initParallax() {
    if (reduced) return;
    var mesh = document.querySelector(".hero-mesh");
    var inner = document.querySelector(".hero-inner");
    if (!mesh && !inner) return;
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight) {
          if (mesh) mesh.style.transform = "translateY(" + y * 0.18 + "px)";
          if (inner) inner.style.transform = "translateY(" + y * 0.08 + "px)";
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- FORM ---------- */
  function initForm() {
    var form = document.querySelector("[data-form]");
    if (!form) return;
    var success = form.querySelector("[data-success]");
    var MAIL = "ballmoney.contact@gmail.com";

    /* =========================================================
       ENVÍO AUTOMÁTICO
       Pega aquí tu endpoint de Formspree (https://formspree.io/f/xxxxxxxx).
       Con esto la solicitud llega a tu correo AL INSTANTE y queda
       guardada en el panel de Formspree (aunque el email fallara).
       Mientras esté vacío, se usa el correo manual como respaldo.
       ========================================================= */
    var FORM_ENDPOINT = "https://formspree.io/f/xrenybvd";   // endpoint de Formspree
    var STORE_KEY = "bm_solicitudes";    // respaldo local en el navegador

    function get(n) { var el = form.querySelector("#" + n); return el ? el.value.trim() : ""; }

    function saveLocal(data) {
      try {
        var arr = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
        arr.push(data);
        localStorage.setItem(STORE_KEY, JSON.stringify(arr));
      } catch (e) { /* almacenamiento no disponible */ }
    }

    function buildMailto(d) {
      var body =
        "Nombre: " + d.nombre + "\n" +
        "Correo: " + d.email + "\n" +
        "País: " + d.pais + "\n" +
        "Experiencia en ventas: " + d.ventas + "\n\n" +
        "Por qué quiero entrar:\n" + d.mensaje + "\n";
      return "mailto:" + MAIL +
        "?subject=" + encodeURIComponent("Solicitud equipo BallMoney — " + d.nombre) +
        "&body=" + encodeURIComponent(body);
    }

    function showSuccess() {
      form.querySelectorAll(".field, .apply-submit, .apply-form-step").forEach(function (el) { el.style.display = "none"; });
      if (success) {
        success.classList.add("is-visible");
        success.setAttribute("aria-hidden", "false");
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.querySelectorAll(".is-error").forEach(function (f) { f.classList.remove("is-error"); });

      var valid = true;
      form.querySelectorAll("[required]").forEach(function (input) {
        if (!input.value.trim()) { input.closest(".field").classList.add("is-error"); valid = false; }
      });
      var email = form.querySelector("#email");
      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.closest(".field").classList.add("is-error"); valid = false;
      }
      if (!valid) {
        var firstErr = form.querySelector(".is-error");
        if (firstErr) firstErr.querySelector("input, textarea, select").focus();
        return;
      }

      var data = {
        nombre: get("nombre"),
        email: get("email"),
        pais: get("pais"),
        ventas: get("ventas"),
        mensaje: get("mensaje"),
        fecha: new Date().toISOString(),
        _subject: "Nueva solicitud BallMoney — " + get("nombre")
      };

      // 1) Respaldo local inmediato: no se pierde aunque falle la red o el correo
      saveLocal(data);

      var btn = form.querySelector("[type=submit]");
      var label = btn ? btn.querySelector("span") : null;
      var prevText = label ? label.textContent : "";
      if (btn) btn.disabled = true;
      if (label) label.textContent = "Enviando…";

      // Respaldo por correo si el envío automático no está configurado o falla
      function fallbackMailto() {
        if (btn) btn.disabled = false;
        if (label) label.textContent = prevText;
        window.location.href = buildMailto(data);
      }

      // Sin endpoint configurado todavía → respaldo por correo
      if (!FORM_ENDPOINT) { fallbackMailto(); return; }

      // 2) Envío automático (llega al correo y queda almacenado en Formspree)
      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (res && res.ok) { showSuccess(); }
        else { fallbackMailto(); }
      }).catch(function () { fallbackMailto(); });
    });

    // clear error on input
    form.addEventListener("input", function (e) {
      var field = e.target.closest(".field");
      if (field) field.classList.remove("is-error");
    });
  }

  /* ---------- HERO VIDEO (solo visible si carga de verdad) ---------- */
  function initHeroVideo() {
    var v = document.querySelector(".hero-video");
    if (!v) return;
    var show = function () { if (v.readyState >= 2) v.classList.add("is-playing"); };
    v.addEventListener("playing", show);
    v.addEventListener("loadeddata", show);
    // si el source no existe, no dispara eventos y la imagen sigue mandando
  }

  /* ---------- YEAR ---------- */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---------- BOOT ---------- */
  function boot() {
    safe(initSplit, "initSplit");   // split before reveal observes
    safe(initSplash, "initSplash");
    safe(initNav, "initNav");
    safe(initAnchors, "initAnchors");
    safe(initProgress, "initProgress");
    safe(initReveals, "initReveals");
    safe(initGlow, "initGlow");
    safe(initMagnetic, "initMagnetic");
    safe(initParallax, "initParallax");
    safe(initHeroVideo, "initHeroVideo");
    safe(initForm, "initForm");
    safe(initYear, "initYear");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
