// web/api/checkout.js
// Serverless Function (Vercel) — crea una sesión de Stripe Checkout server-side.
//
// SEGURIDAD:
// - La clave secreta se lee EXCLUSIVAMENTE de process.env.STRIPE_SECRET_KEY.
// - Nunca se escribe en el repositorio, ni se envía al cliente, ni se registra en logs.
// - El cliente solo recibe la URL de la sesión de Checkout alojada por Stripe.
//
// Producto: BALLMONEY METHOD · 38,99 € · pago único (mode: payment).
// Se usa el Price ID indicado (los Price ID no son secretos).

var PRICE_ID = "price_1UGI5nF3XQ4IYW2S7iQyHInw";

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  var key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    // La variable de entorno aún no está configurada en Vercel.
    return res.status(500).json({ error: "stripe_no_configurado" });
  }

  // Base URL de retorno (funciona en producción y en previews de Vercel).
  var host = req.headers["x-forwarded-host"] || req.headers.host;
  var proto = req.headers["x-forwarded-proto"] || "https";
  var base = req.headers.origin || (proto + "://" + host);

  var params = new URLSearchParams();
  params.append("mode", "payment");
  params.append("line_items[0][price]", PRICE_ID);
  params.append("line_items[0][quantity]", "1");
  params.append("success_url", base + "/pago.html?pago=ok");
  params.append("cancel_url", base + "/pago.html?pago=cancelado");

  try {
    var r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + key,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });
    var data = await r.json();
    if (!r.ok) {
      var msg = (data && data.error && data.error.message) ? data.error.message : "stripe_request_failed";
      return res.status(502).json({ error: "stripe_error", detail: msg });
    }
    return res.status(200).json({ url: data.url, id: data.id });
  } catch (e) {
    return res.status(500).json({ error: "server_error" });
  }
};
