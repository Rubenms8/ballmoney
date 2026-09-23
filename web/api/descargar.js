// web/api/descargar.js
// Serverless Function (Vercel) — entrega protegida del producto.
//
// Flujo:
// 1) Recibe ?session_id=cs_... del retorno de Stripe Checkout (success_url).
// 2) Verifica la sesión con la API de Stripe (STRIPE_SECRET_KEY, server-side):
//    - la sesión existe
//    - payment_status === "paid"
//    - mode === "payment" (pago único)
//    - contiene el Price ID de BALLMONEY METHOD
// 3) Solo si es válida, entrega BALLMONEY-METHOD.zip desde el Blob PRIVADO
//    (@vercel/blob get() con access:"private") haciendo stream al navegador.
//
// SEGURIDAD:
// - La clave de Stripe se lee SOLO de process.env.STRIPE_SECRET_KEY. Nunca se
//   escribe en el repo ni se envía al cliente.
// - El acceso al Blob privado se autentica automáticamente por OIDC cuando el
//   store esta conectado al proyecto (BLOB_STORE_ID + VERCEL_OIDC_TOKEN); la SDK
//   los lee sola. Alternativa: BLOB_READ_WRITE_TOKEN.
// - El ZIP nunca es accesible por URL pública: solo se sirve tras verificar el pago.
//
// El Price ID no es secreto.

var PRICE_ID = process.env.STRIPE_PRICE_ID || "price_1UGI5nF3XQ4IYW2S7iQyHInw";
var BLOB_PATHNAME = "BALLMONEY-METHOD.zip";

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  var q = req.query || {};
  var sessionId = q.session_id;
  var checkOnly = q.check === "1" || q.check === "true";

  // Validación básica del identificador de sesión de Stripe.
  if (!sessionId || typeof sessionId !== "string" || sessionId.indexOf("cs_") !== 0) {
    return res.status(400).json({ error: "sesion_invalida" });
  }

  var key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return res.status(500).json({ error: "stripe_no_configurado" });
  }
  key = key.replace(/\s+/g, "");

  // 1-2) Verificar la sesión en Stripe (con line_items para comprobar el precio).
  try {
    var url = "https://api.stripe.com/v1/checkout/sessions/" +
      encodeURIComponent(sessionId) + "?expand[]=line_items";
    var r = await fetch(url, { headers: { "Authorization": "Bearer " + key } });
    var s = await r.json();

    if (!r.ok) {
      return res.status(403).json({ error: "no_verificado" });
    }

    var isPaid = s.payment_status === "paid";
    var isSinglePayment = s.mode === "payment";
    var hasProduct = !!(s.line_items && s.line_items.data &&
      s.line_items.data.some(function (li) {
        return li && li.price && li.price.id === PRICE_ID;
      }));

    if (!(isPaid && isSinglePayment && hasProduct)) {
      return res.status(403).json({ error: "pago_no_valido" });
    }
  } catch (e) {
    return res.status(500).json({ error: "server_error" });
  }

  // Modo comprobación: solo confirma que el pago es válido (para la UI).
  if (checkOnly) {
    return res.status(200).json({ ok: true });
  }

  // 3) Entregar el ZIP desde el Blob PRIVADO (stream). Sin URL pública.
  try {
    var blob = await import("@vercel/blob");
    var result = await blob.get(BLOB_PATHNAME, { access: "private" });

    if (!result || result.statusCode !== 200 || !result.stream) {
      return res.status(404).json({ error: "archivo_no_encontrado" });
    }

    var contentType = (result.blob && result.blob.contentType) || "application/zip";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", 'attachment; filename="BALLMONEY-METHOD.zip"');
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "private, no-store");

    var nodeStream = require("node:stream");
    nodeStream.Readable.fromWeb(result.stream).pipe(res);
  } catch (e) {
    return res.status(500).json({ error: "descarga_error" });
  }
};
