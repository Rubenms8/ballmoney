/* =========================================================
   BALLMONEY — Gestión del banner de cookies (vanilla, IIFE)
   Guarda la elección en localStorage. Sin cookies de rastreo.
   ========================================================= */
(function () {
  "use strict";

  var KEY = "bm_cookie_consent";        // "accepted" | "rejected"
  var banner = document.querySelector("[data-cookie-banner]");

  function getConsent() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function setConsent(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
  }

  function showBanner() {
    if (!banner) return;
    banner.hidden = false;
    // forzar reflow para que la transición de entrada funcione
    void banner.offsetWidth;
    banner.classList.add("is-visible");
  }
  function hideBanner() {
    if (!banner) return;
    banner.classList.remove("is-visible");
    var done = function () {
      banner.hidden = true;
      banner.removeEventListener("transitionend", done);
    };
    banner.addEventListener("transitionend", done);
    // salvaguarda por si no se dispara transitionend
    setTimeout(function () { banner.hidden = true; }, 500);
  }

  /* Aquí es donde, en el futuro, se activarían/desactivarían
     scripts de terceros (analítica, píxeles, etc.) según el consentimiento. */
  function applyConsent(value) {
    // if (value === "accepted") { /* cargar scripts de terceros */ }
    setConsent(value);
  }

  function bind() {
    var accept = document.querySelector("[data-cookie-accept]");
    var reject = document.querySelector("[data-cookie-reject]");
    if (accept) accept.addEventListener("click", function () { applyConsent("accepted"); hideBanner(); });
    if (reject) reject.addEventListener("click", function () { applyConsent("rejected"); hideBanner(); });

    // Reabrir el banner desde cualquier enlace "Configurar cookies"
    document.querySelectorAll("[data-cookie-settings]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        showBanner();
      });
    });
  }

  function init() {
    bind();
    if (!getConsent()) {
      // pequeño retardo para no competir con la entrada del hero
      setTimeout(showBanner, 900);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
