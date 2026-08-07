# PROJECT_CONTEXT.md — Ballmoney

> Documento de memoria permanente del proyecto. Cualquier Claude nuevo puede leer **solo este archivo** y continuar exactamente donde lo dejamos, sin acceso a la conversación anterior.
> Última actualización: julio de 2026. Último commit de referencia: `f636343`.

---

## 0. Datos operativos rápidos (para no perder tiempo)

- **Carpeta del proyecto (local):** `C:\Users\RUBEN\Desktop\BallMoney`
- **Código de la web:** subcarpeta `web/`
- **Repositorio GitHub:** `https://github.com/Rubenms8/ballmoney` — rama **`main`**
- **Git user:** `Rubenms8` · `rubenmusal8@gmail.com`
- **Hosting:** Vercel, despliegue automático al hacer push a `main`. **Root Directory de Vercel = `web`**.
- **Web pública:** `https://ballmoney.vercel.app`
- **Destino del CTA (bridge):** `https://techix.es` (con UTMs, ver más abajo)
- **Contacto/marca:**
  - Email: `ballmoney.contact@gmail.com`
  - TikTok: `@ballmoneyy` · Instagram: `@ballmoneyyyy` · Handle mostrado en la web: `@ballmoney`
- **Formspree (newsletter de la revista):** `https://formspree.io/f/xrenybvd`
- **Convención de commits:** terminar SIEMPRE el mensaje con
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`

---

## 1. Visión del proyecto

**Qué es Ballmoney (HOY):** una **marca personal** en torno a inteligencia artificial, negocios, productividad y libertad financiera. El tráfico llega desde **TikTok** (@ballmoneyy).

**La web pública actual (raíz `ballmoney.vercel.app`) es una BRIDGE PAGE** (página puente) para el enlace de la biografía de TikTok. Su **único objetivo**: que el visitante pulse **un solo botón** que lo lleva a **Techix** (`techix.es`), donde está el contenido real. No se vende nada; todo es gratis.

> IMPORTANTE — el proyecto ha pasado por varios enfoques (ver §6). El enfoque ACTUAL y vigente es la **bridge page**. Las versiones anteriores (landing de reclutamiento, revista digital) están archivadas dentro del propio proyecto pero **no son el foco**.

**Objetivo de la web:** convertir tráfico frío de TikTok en clics cualificados hacia Techix, transmitiendo autoridad y confianza en pocos segundos. KPI real: no "que haga clic" a secas, sino que llegue a Techix "caliente".

**Público objetivo:** personas jóvenes y ambiciosas interesadas en IA aplicada, negocios, productividad y ganar dinero de forma legal. Llegan desde TikTok: **escanean, no leen** → textos cortos y contundentes.

**Filosofía de marca:** liderazgo real, no gurú. Conocimiento práctico y gratuito. "El gurú vende; nosotros regalamos" — ese contraste es la mayor ventaja de confianza.

**Sensación que debe transmitir:** premium, seria, exclusiva, "startup tecnológica de millones de euros", mucho trabajo detrás. Que el visitante piense: *"Joder, esta página está muy currada"* y *"este tío sabe de lo que habla"*.

**Qué NO queremos transmitir:** vendehumos, gurú, curso, academia, dinero fácil, hype/urgencia agresiva, estética barata de "hazte rico". Nada de exclamaciones, cuentas atrás ni promesas vacías.

---

## 2. Estado actual

### Terminado y desplegado en producción
- **Bridge page** (`web/index.html`, la raíz): diseño oscuro premium, un solo CTA a Techix, contadores tipo odómetro, sección bento, banner de cookies. Totalmente funcional.
- **Logo Ballmoney** integrado (monograma "BM" azul) como `background-image` (nítido en cualquier pantalla).
- **Animaciones idénticas en escritorio y móvil** (se eliminó el gateo por `prefers-reduced-motion`, ver §6/§7).
- **Páginas legales completas** (tema oscuro, coherentes): aviso legal, privacidad, cookies, términos + **banner y configuración de cookies**. Sin placeholders.
- **Copia `/ia`** de la bridge (por si el enlace de bio apunta ahí).
- **Revista digital** preservada e intacta en `/revista.html` (medio digital, tema claro; legado).

### A medias / pendiente de confirmación
- **Cifras de los contadores:** `+1.000` ("Horas dentro de la IA") y `+10.000` ("En la comunidad") son **de ejemplo/ilustrativas**. Falta que el cliente dé los **números reales**. `100%` (gratis) sí es real. **No publicar cifras inventadas como definitivas** — sustituir cuando el cliente las facilite.
- **Confirmación del cliente** de que las animaciones ya se ven en su escritorio (tras el fix de `reduced-motion`).

### Pendiente (no empezado)
- **Auditoría técnica completa** (el cliente la pidió y luego la interrumpió): RGPD/legal, metadatos, SEO básico, accesibilidad, rendimiento, errores HTML/CSS/JS, enlaces rotos, responsive. **Queda por hacer.**
- Decidir el futuro de `/ia` (duplicado) y de `/revista.html`.

---

## 3. Diseño

### Bridge page (enfoque ACTUAL — tema oscuro)
- **Colores (CSS vars en `web/index.html`):**
  - `--bg:#060609` (fondo casi negro) · `--fg:#f3f5fa` (texto)
  - `--sub:rgba(243,245,250,.64)` · `--mute:rgba(243,245,250,.42)`
  - Acento azul: `--blue:#4a9eff` · `--blue-lo:#2f7bff` · `--blue-hi:#a9d4ff`
  - Verde "en vivo": `--green:#39d98a`
  - Líneas/glass: `--line`, `--line2`, `--glass:rgba(255,255,255,.035)`
- **Tipografías:** `Fraunces` (serif, titulares) + `Inter` (sans, UI/cuerpo). El **odómetro** usa Inter con `tabular-nums` (ancho fijo).
- **Animaciones (todas elegantes, ninguna exagerada):** auroras azules en movimiento, rejilla técnica, grano sutil, **glow que sigue al cursor** (escritorio), **barra de progreso de scroll**, **reveals** al hacer scroll (fade + translate + scale, con `stagger`), **odómetro / rolling numbers**, **botón magnético**, **tilt 3D** en tarjetas, borde de gradiente giratorio y "sheen" en el CTA, shimmer en el texto en degradado. Se disparan con `IntersectionObserver` (una sola vez).
- **Estilo visual:** minimalista, muchísimo espacio negativo, glassmorphism sutil, profundidad y glow azul. Sin scroll infinito.
- **Responsive:** verificado escritorio y móvil, sin scroll horizontal. Bento y stats se apilan en móvil.

### Revista (legado — tema claro, en `/revista.html`, usa `styles.css`)
- Fondo papel `#fbfbf9`, tinta `#14140f`, acento **verde** `#0c7a54`, Fraunces + Inter. Estilo editorial/periódico. (No tocar salvo que se decida retomarla.)

### Branding / uso del logo
- **Logo oficial:** monograma "BM" azul con degradado, en `web/assets/img/bm-logo.png` (fondo oscuro propio ~`#0a1122`).
- **Cómo usarlo:** siempre como **`background-image`** dentro de un "tile" cuadrado con `border-radius`, borde azul sutil y glow, y `background-size` ~`164%` con `center` para recortar el margen del PNG. NO usar `<img>` con `transform:translate` para recortarlo (causaba blur de subpíxel en escritorio). Junto al logo va el wordmark "Ballmoney" (Fraunces) y, en escritorio, una micro-tagline "IA · NEGOCIOS · FUTURO".
- El favicon es ese mismo PNG.

---

## 4. Reglas permanentes

1. **NADA de placeholders** visibles: prohibido "TU NOMBRE", "TU EMAIL", "COMPLETAR", "XXXX", "[...]". Usar la información disponible o texto neutro que no requiera intervención.
2. **No inventar datos personales** (NIF, domicilio, etc.). Si no se tienen, se omiten redactando sin huecos.
3. **No inventar métricas como si fueran reales.** Las cifras de ejemplo se marcan como tales y se pide al cliente el dato real antes de darlas por definitivas.
4. **Todo premium.** Cada sección debe parecer de una startup tecnológica de millones. Si no lo parece, mejorarlo.
5. **Animaciones elegantes y modernas**, nunca exageradas. Deben verse **igual en escritorio y móvil**.
6. **Código limpio**, sin dependencias innecesarias. La bridge es **autónoma** (CSS y JS embebidos) para carga instantánea.
7. **Responsive impecable** siempre; comprobar que no hay scroll horizontal.
8. **Textos cortos y contundentes** (público de TikTok). Nada de párrafos largos.
9. **No repetir "Techix"** por toda la página: la experiencia es Ballmoney; el botón simplemente lleva allí. Añadir **UTMs** para medir.
10. **Un solo objetivo/CTA** en la bridge. Sin formularios, sin newsletter, sin varios botones que compitan (repetir el MISMO botón al final sí está permitido).
11. **Mantener el ángulo "miles de euros con IA"** como liderazgo (dato correcto según el cliente), pero blindarlo contra el "humo" con tono calmado y el mensaje **"todo gratis / no vendo nada"** como protagonista.
12. **Legal completo para España** (RGPD/LSSI-CE), sin placeholders.
13. **No desplegar sin permiso.** Flujo: implementar en local → el cliente revisa → cuando dice "hazlo/deploy" → commit + push + verificar en producción.
14. **No rediseñar ni cambiar el estilo visual** salvo que se pida explícitamente.

---

## 5. Arquitectura del proyecto

```
BallMoney/                     ← raíz del repositorio git
├── PROJECT_CONTEXT.md         ← ESTE archivo (memoria permanente)
├── Logo Bm 1.png              ← logo antiguo (dorado), NO usado
├── .gitignore
└── web/                       ← lo que Vercel sirve (Root Directory = web)
    ├── index.html             ← BRIDGE PAGE (raíz). Autónoma: CSS+JS embebidos.
    │                            Fondo aurora, odómetro, bento, banner cookies, CTA→Techix.
    ├── ia/
    │   └── index.html         ← COPIA de la bridge (rutas con ../). Servida en /ia.
    ├── revista.html           ← Revista digital (legado, tema claro). Usa styles.css + main.js.
    ├── aviso-legal.html       ┐
    ├── privacidad.html        │  Páginas legales (tema oscuro).
    ├── cookies.html           │  Usan legal.css + cookies.js. Sin placeholders.
    ├── terminos.html          ┘
    ├── legal.css              ← Estilos oscuros de las páginas legales.
    ├── styles.css             ← Estilos de la REVISTA (tema claro editorial). Legado.
    ├── main.js                ← JS de la REVISTA (nav, reveals, newsletter Formspree). Legado.
    ├── cookies.js             ← Lógica del banner de cookies (compartida). localStorage "bm_cookie_consent".
    ├── .htaccess              ← Config Apache (irrelevante en Vercel, inofensiva).
    └── assets/
        ├── img/
        │   └── bm-logo.png    ← LOGO oficial (BM azul). También favicon.
        └── credits.json       ← Restos antiguos, sin uso.
```

**Notas de rutas:**
- La bridge (`index.html`, raíz) referencia `assets/img/bm-logo.png`, `cookies.js`, `aviso-legal.html`, etc. (relativas desde `web/`).
- La copia `/ia/index.html` usa las mismas con `../` delante (favicon, `url()` del logo en CSS, `cookies.js`, enlaces legales). **Si editas `index.html`, re-sincroniza `/ia` copiándolo y ajustando `../`** (ver §9).
- **UTMs del CTA:** `?utm_source=tiktok&utm_medium=bio&utm_campaign=ballmoney_bridge&utm_content=cta_hero` (y `cta_final` en el botón del cierre).

---

## 6. Decisiones importantes tomadas

- **Historia de enfoques (por orden):** 1) Landing premium de **reclutamiento** (unirse a un equipo de ventas). 2) **Revista/medio digital** "Ballmoney". 3) **Bridge page** hacia Techix, que pasó a ser la **portada (raíz)**; la revista se conservó en `/revista.html`. **El enfoque vigente es la bridge.**
- **Bridge como raíz:** el cliente pidió verla en el índice; se hizo `index.html` = bridge y se preservó la revista en `/revista.html` (reversible).
- **Titular:** se mantiene "Miles de euros con inteligencia artificial" (dato correcto del cliente), enmarcado como liderazgo, no como gurú. La confianza la dan el diseño, el tono y el "todo gratis".
- **Odómetro (rolling numbers):** se implementó un odómetro real (ruedas de dígitos que giran con easing, una vez al entrar en vista), no un contador de texto simple. Formato español con separador de miles.
- **`prefers-reduced-motion`:** se **eliminó** el gateo que desactivaba animaciones. Motivo: el escritorio del cliente (Windows) tenía "reducir movimiento" activado, así que no veía animaciones ni el odómetro, mientras que en móvil sí. Para que la experiencia sea **idéntica en ambos dispositivos**, ahora las animaciones se ejecutan siempre. **Trade-off consciente de accesibilidad**, hecho a petición explícita del cliente.
- **Logo como `background-image`:** para evitar el blur de subpíxel en escritorio (el `transform` de recorte se veía nítido solo en pantallas de alta densidad como el móvil).
- **Autonomía de la bridge:** CSS y JS embebidos (sin depender de `styles.css`/`main.js`) para carga instantánea y cero riesgo.
- **Reseñas/testimonios (en versiones anteriores):** se usaron nombres/ frases de ejemplo y siempre se avisó de que deben sustituirse por reales.
- **Envío de formularios (revista):** newsletter conectada a **Formspree** (`f/xrenybvd`) con respaldo por correo si falla.

---

## 7. Errores conocidos / cosas a corregir

1. **Contadores con cifras de ejemplo:** `+1.000` y `+10.000` no son datos reales. Pedir al cliente y sustituir. (`100%` sí es real.)
2. **Aviso legal sin NIF/domicilio** (no disponibles). Legalmente incompleto, pero sin placeholders por regla del cliente. Completar cuando los facilite.
3. **Enlace "Volver" de las páginas legales** apunta a `index.html` (la bridge), no a la revista. Coherente con que la bridge es la raíz, pero conviene confirmarlo.
4. **Google Fonts (terceros)** se cargan siempre (no bloqueados por el banner). La política de cookies lo documenta, pero para cumplimiento RGPD estricto lo ideal sería **auto-alojar las fuentes**. Pendiente/opcional.
5. **Sin analítica propia** en la bridge: la medición depende de los UTMs en Techix. Si se quiere medir CTR en la propia bridge, habría que añadir analítica (y su aviso de cookies).
6. **`/ia` duplica la bridge** y `/revista.html` sigue viva sin enlazar. Decidir qué se mantiene.
7. **Accesibilidad:** al ignorar `reduced-motion`, usuarios con esa preferencia verán todas las animaciones. Decisión consciente del cliente.
8. **Auditoría técnica** (SEO, meta, a11y, rendimiento, enlaces rotos, validación HTML/CSS/JS) **no realizada aún**.

---

## 8. Próximas tareas (por prioridad)

1. **Cifras reales de los contadores** (pedir al cliente) y sustituir `+1.000` / `+10.000`.
2. **Confirmar con el cliente** que en su escritorio ya se ven las animaciones y el odómetro girando (tras el fix de reduced-motion). Ctrl+F5.
3. **Auditoría técnica completa** que pidió el cliente: RGPD/legal, metadatos, SEO básico, accesibilidad, rendimiento, errores HTML/CSS/JS, enlaces rotos, responsive. Corregir directamente lo que aparezca (sin preguntar uno por uno) y resumir al final.
4. **Decidir** el destino de `/ia` (¿mantener como bio-link o quedarnos solo con la raíz?) y de `/revista.html`.
5. Opcional: **auto-alojar fuentes** (RGPD estricto) y/o añadir **analítica** con su consentimiento.
6. Opcional: mejorar SEO/OG (imagen OG real, sitemap, etc.).

---

## 9. Forma de trabajar (cómo quiere el cliente que trabajes)

- **Analiza antes de modificar.** Entiende el estado actual y no rehagas lo que ya funciona.
- **Piensa como diseñador UX/UI senior y especialista en conversión.** Sé crítico con las ideas (también las del cliente) y propón alternativas mejores explicando el porqué. No te limites a ejecutar una lista: **mejora por iniciativa propia**.
- **No gastes créditos innecesariamente.** Revisión inteligente y práctica, no análisis de 20 páginas. Evita releer todo el contexto una y otra vez.
- **Implementa directamente** los arreglos; no preguntes uno por uno. Explica al final qué has cambiado y por qué.
- **Explica las decisiones** de diseño/técnicas de forma breve.
- **No rediseñes ni cambies el estilo visual** salvo petición explícita.
- **Verifica siempre antes de desplegar** (móvil + escritorio, animaciones, sin errores).
- **Flujo de despliegue:** el cliente revisa en local → cuando dé el OK (o diga "hazlo") → `git add -A` → commit (con la línea Co-Authored-By) → `git push origin main` → verificar sincronización local/remoto → **comprobar en producción** con `https://ballmoney.vercel.app/?v=<hash>` (cache-bust) que los cambios están online. No dar por terminado hasta verlo en producción.
- **Idioma de trabajo:** español.

### Notas técnicas útiles (previsualización local)
- El navegador integrado renderiza los `file://` como **instantáneas estáticas**: **NO ejecuta el `<script>` de la página** (por eso los reveals/odómetro no se ven ahí; hay que forzar el estado con JS inyectado para capturar). Las **animaciones solo se ven en un navegador real** (o en producción).
- El panel a veces se **queda anclado** a un archivo y no navega. Truco: cargar una **copia temporal con nombre único** (`_tXXXX.html`) para forzar render nuevo; borrarla después (no commitear temporales).
- Las capturas **por debajo del pliegue** salen en **negro** tras hacer scroll por JS (artefacto). Para ver secciones bajas, montar un panel de prueba propio o confiar en el DOM.
- **Validar sintaxis JS** sin navegador real: `fetch(archivo).then(t=> new Function(scriptInline))` en el panel.
- **Vercel:** despliega solo al hacer push a `main`. Root Directory = `web`. Verificar producción con WebFetch/curl y `?v=<hash>`.

---

## 10. INSTRUCCIONES PARA EL PRÓXIMO CLAUDE

Estás retomando el proyecto **Ballmoney**. Lee este archivo entero; contiene todo lo necesario (no hace falta la conversación anterior).

**Resumen para arrancar en 30 segundos:**
- La web pública (`ballmoney.vercel.app`, archivo `web/index.html`) es una **bridge page premium oscura** cuyo único fin es enviar tráfico de TikTok a **Techix** (`techix.es`) con un solo botón (con UTMs). Todo gratis, no se vende nada.
- Marca personal sobre **IA · negocios · productividad · libertad financiera**. Tono: **liderazgo serio, premium, NO gurú**. Textos cortos.
- Diseño oscuro, acento **azul** (`#4a9eff`), tipos **Fraunces + Inter**, muchas animaciones elegantes (auroras, reveals, **odómetro/rolling numbers**, glow de cursor, tilt, etc.). El logo (`web/assets/img/bm-logo.png`) se usa como **`background-image`** en un tile.
- **Las animaciones deben verse IGUAL en escritorio y móvil** (se eliminó a propósito el gateo por `prefers-reduced-motion`; NO lo vuelvas a añadir sin permiso).

**Antes de tocar nada:**
1. Abre `web/index.html` y familiarízate (es autónomo: CSS+JS embebidos).
2. Respeta TODAS las reglas de la §4 (sin placeholders, no inventar datos/métricas, premium, responsive, un solo CTA, no repetir "Techix", etc.).
3. Trabaja como en la §9 (senior, crítico, sin gastar créditos, implementa y explica, no despliegues sin OK).

**Si editas `web/index.html`, re-sincroniza la copia `/ia`:**
```bash
cd web
cp index.html ia/index.html
sed -i \
  -e 's#="assets/img/bm-logo.png"#="../assets/img/bm-logo.png"#g' \
  -e 's#url("assets/img/bm-logo.png")#url("../assets/img/bm-logo.png")#g' \
  -e 's#src="cookies.js#src="../cookies.js#g' \
  -e 's#href="aviso-legal.html"#href="../aviso-legal.html"#g' \
  -e 's#href="privacidad.html"#href="../privacidad.html"#g' \
  -e 's#href="cookies.html"#href="../cookies.html"#g' \
  -e 's#href="terminos.html"#href="../terminos.html"#g' \
  ia/index.html
```

**Primeras cosas a preguntar/hacer con el cliente:**
1. Pedir las **cifras reales** de los contadores (`+1.000`, `+10.000`) y sustituirlas.
2. Confirmar que ya ve las animaciones en su escritorio.
3. Ofrecer/ejecutar la **auditoría técnica** pendiente (§8, tarea 3).

**Flujo de despliegue (solo con OK del cliente):**
```bash
cd C:/Users/RUBEN/Desktop/BallMoney
git add -A
git commit -m "mensaje descriptivo

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
git push origin main
# luego verificar en https://ballmoney.vercel.app/?v=<hash-nuevo>
```

**Nunca:** dejes placeholders, inventes datos personales o métricas como definitivas, rediseñes sin permiso, ni des por terminada una tarea sin verla publicada en producción.
