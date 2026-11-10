# Uso de IA en el proyecto

En el Sprint 1 usé **Claude Code** (Anthropic) como asistente de programación. Lo usé para revisar el contrato de la API, el Figma y el repositorio de referencia; para escribir el código de las seis historias; para probar las vistas en el navegador y para configurar el despliegue. Yo definí el alcance, revisé y fusioné los PR, y comprobé el resultado en el sitio desplegado.

Cada entrada dice qué le pedí, qué respondió, qué estaba bien o mal y cómo lo verifiqué.

---

## 1. Revisar el contrato y el material de referencia antes de programar

- **Fecha:** 9 de noviembre de 2026
- **Qué le pedí:** comparar los criterios del sprint con el contrato de la API, el Figma y el repositorio de referencia del curso, y avisarme de lo que no cumpliera.
- **Qué respondió:** el repositorio de referencia usa Vite y JSX en vez de Next.js con TypeScript. Además, tiene los datos y los textos escritos en el código, cookies con otro nombre (`cromoverso_consentimiento`) y un panel de preferencias que el sprint no pide. En la API encontró que `GET /mundos/:id` trae también `especiales` y que un filtro inválido responde 422.
- **Cómo lo verifiqué:** consulté yo mismo `GET /mundos/neon` y `GET /cromos?rareza=dorada` y comparé con el contrato. Por eso el catálogo pide `edicion=album` e ignora los filtros que no existen.

## 2. Respuesta equivocada: «GitHub cambia solo la base de los PR encadenados»

- **Fecha:** 9 de noviembre de 2026
- **Qué le pedí:** organizar el trabajo con una rama y un PR por historia. Como cada historia dependía de la anterior, los PR quedaron encadenados: cada uno apuntaba a la rama de la historia anterior.
- **Qué respondió (mal):** que al fusionar el primero, GitHub cambiaría solo la base de los siguientes a `main`.
- **Qué pasó en realidad:** eso solo ocurre si se borra la rama al fusionar, y yo no las borré. Los PR #4 a #8 se fusionaron cada uno en la rama anterior y `main` quedó solo con S1-01.
- **Cómo se corrigió:** lo noté al revisar `main` antes de desplegar. Abrimos el PR #9, que llevó a `main` los mismos commits ya revisados, sin cambios nuevos. Desde entonces reviso la rama base de cada PR antes de fusionar.

## 3. Respuesta incompleta: el sitio se caía si la API fallaba en todas las rutas

- **Fecha:** 9 de noviembre de 2026
- **Qué le pedí:** al principio, manejar los estados de carga y de error de cada vista.
- **Qué respondió:** creó `loading.tsx` y `error.tsx` con los textos de `estados`. Funcionaban cuando fallaba una vista, pero no cubrían el layout principal, que pide `GET /textos` y `GET /idiomas`.
- **Cómo lo detecté:** probé con `API_SIMULAR_ERROR=503`, que agrega la cabecera `X-Simular-Error`. En vez del estado de error salía la página 500 genérica de Next.js.
- **Cómo se corrigió (PR #10):** reintentos cortos ante errores 5xx, respaldo para `GET /idiomas` con `textos.idioma.opciones` y una pantalla `global-error.tsx` con «Reintentar». Lo verifiqué en un build de producción con y sin la falla simulada.

## 4. Tamaños de letra escritos a mano en los componentes base

- **Fecha:** 9 de noviembre de 2026
- **Qué le pedí:** crear los componentes base con los tokens de Figma.
- **Qué respondió:** usó los tokens de color, espacio y radio, pero escribió a mano los tamaños, pesos e interlineados de la letra (`font-size: 16px`, `font-weight: 600`). Eso incumple el criterio 3: ningún valor escrito a mano.
- **Cómo se corrigió:** se agregaron los estilos de texto de Figma como variables (`--tipo-cuerpo-m`, `--tipo-titular-h2`...) y los componentes pasaron a usar `font: var(--tipo-...)`. Lo verifiqué buscando en los `.css` valores en `px` y colores en hexadecimal fuera de `tokens.css`.

## 5. Dirección del despliegue en Vercel

- **Fecha:** 9 de noviembre de 2026
- **Qué le pedí:** desplegar el proyecto en Vercel con el nombre `cromoverso`.
- **Qué pasó:** se asumió que el sitio quedaría en `cromoverso.vercel.app`, pero ese dominio ya era de otra persona y daba 404. Además, Vercel había dejado activada la protección por inicio de sesión, así que nadie sin cuenta podía ver el sitio.
- **Cómo se corrigió:** se usó la dirección del proyecto, `https://cromoverso-sperezz33.vercel.app`, y se desactivó «Vercel Authentication». Lo verifiqué abriendo las rutas sin sesión (todas responden 200) y con UptimeRobot, que marca el monitor en «Up».

---

## Decisiones que tomé yo

- En Figma, «Aceptar» va relleno y «Rechazar» con borde. El criterio 2 de S1-06 pide el mismo peso visual, así que los dos usan el mismo estilo.
- Figma no muestra las rarezas en el inicio, pero el criterio 1 de S1-03 las pide. Las agregué como leyenda con icono, palabra y porcentaje.
- Las figuras `ola`, `hoja`, `orbita` y `runa` que entrega la API no venían en el paquete de iconos. Las dibujé en SVG con el mismo estilo de trazo.
