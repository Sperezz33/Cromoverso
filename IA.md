# Uso de herramientas de IA en el proyecto

Durante el Sprint 1 incorporé Claude Code (Anthropic) como herramienta de apoyo dentro de mi flujo de desarrollo. Lo utilicé para agilizar tareas de análisis, implementación, pruebas y despliegue, manteniendo bajo mi responsabilidad la definición del alcance, las decisiones de arquitectura, los criterios de aceptación y la validación de cada funcionalidad.

El proceso no consistió en aceptar automáticamente las soluciones propuestas. Cada implementación fue contrastada con los requisitos del sprint, el diseño de Figma, el contrato de la API y el comportamiento esperado del sistema. Cuando aparecieron inconsistencias, identifiqué sus causas, definí los ajustes necesarios y comprobé que las correcciones resolvieran los problemas.

A continuación, documento algunos casos representativos del proceso.

### 1. Análisis previo de requisitos y referencias

**Fecha:** 9 de noviembre de 2026.

Antes de iniciar la implementación, realicé una revisión cruzada de los criterios del sprint, el contrato de la API, los diseños de Figma y el repositorio de referencia del curso.

Este análisis permitió identificar diferencias importantes entre el material de referencia y las condiciones reales del proyecto: el repositorio utilizaba Vite y JSX, mientras que el desarrollo debía realizarse con Next.js y TypeScript. También se encontraron diferencias en la gestión de cookies, la estructura de los datos y algunas funcionalidades que no formaban parte del alcance solicitado.

En el contrato de la API confirmé, entre otros comportamientos, que `GET /mundos/:id` incluye los cromos especiales y que los filtros no admitidos responden con código 422.

**Validación:** contrasté directamente las respuestas de `GET /mundos/neon` y `GET /cromos?rareza=dorada` con el contrato. A partir de ello, definí el comportamiento del catálogo para solicitar `edicion=album` y evitar la aplicación de filtros no contemplados por la API.

### 2. Revisión de la estrategia de integración con GitHub

**Fecha:** 9 de noviembre de 2026.

Organicé el desarrollo mediante ramas y pull requests independientes para cada historia de usuario, conservando las dependencias entre ellas.

Durante la integración identifiqué que la estrategia de ramas encadenadas no estaba llevando todos los cambios a `main`. El origen fue una respuesta equivocada de Claude Code: al planear la integración, afirmó que al fusionar el primer pull request GitHub cambiaría automáticamente la rama base de los siguientes a `main`. Eso solo ocurre cuando la rama base se elimina después de la fusión; como las ramas se conservaron, los PR #4 a #8 se fusionaron sobre sus respectivas ramas base.

Al revisar directamente el historial de `main`, comprobé que únicamente se encontraba integrada la primera historia.

**Corrección:** estructuré un pull request adicional (#9), destinado a incorporar en `main` los commits de las historias previamente revisadas. No se introdujeron cambios funcionales nuevos; se corrigió la integración del trabajo existente.

A partir de este caso incorporé una comprobación explícita de la rama de destino antes de cada fusión.

### 3. Tratamiento de errores en la aplicación

**Fecha:** 9 de noviembre de 2026.

Implementé los estados de carga y error para las distintas vistas, contemplando los escenarios de fallo en las solicitudes a la API.

Durante las pruebas detecté que la cobertura inicial no contemplaba adecuadamente los errores que afectaban al layout principal, especialmente las solicitudes `GET /textos` y `GET /idiomas`. En esas circunstancias, la aplicación terminaba mostrando la página genérica de error 500 de Next.js.

Para reproducir el escenario utilicé `API_SIMULAR_ERROR=503`, que permite simular respuestas de error mediante la cabecera `X-Simular-Error`.

**Corrección (PR #10):** amplié el tratamiento de errores mediante reintentos breves ante respuestas 5xx, un mecanismo de respaldo para `GET /idiomas` basado en `textos.idioma.opciones` y una pantalla global de error mediante `global-error.tsx`, con una opción para reintentar.

**Validación:** ejecuté pruebas sobre una compilación de producción, tanto en condiciones normales como con la falla simulada, comprobando el comportamiento de recuperación y la presentación de los estados correspondientes.

### 4. Consistencia tipográfica con los tokens de diseño

**Fecha:** 9 de noviembre de 2026.

Al contrastar los componentes base con el sistema de diseño de Figma, identifiqué que, aunque se estaban utilizando los tokens de color, espaciado y bordes, algunos atributos tipográficos todavía estaban definidos directamente en los estilos.

Esto representaba una inconsistencia con el tercer criterio de aceptación, que exige evitar valores definidos manualmente fuera del sistema de tokens.

**Corrección:** incorporé los estilos tipográficos de Figma como variables CSS, entre ellas `--tipo-cuerpo-m` y `--tipo-titular-h2`, y adapté los componentes para consumirlas mediante `font: var(--tipo-...)`.

**Validación:** realicé una revisión de los archivos CSS para localizar valores tipográficos en píxeles y colores hexadecimales definidos fuera de `tokens.css`.

### 5. Configuración y accesibilidad del despliegue

**Fecha:** 9 de noviembre de 2026.

Gestioné la configuración del despliegue en Vercel y verifiqué que la aplicación estuviera disponible públicamente.

Durante la publicación detecté dos inconvenientes: el dominio `cromoverso.vercel.app` ya estaba asociado a otro proyecto y la protección de acceso de Vercel impedía consultar el sitio sin iniciar sesión.

**Corrección:** utilicé el dominio asignado al proyecto, `https://cromoverso-sperezz33.vercel.app`, y ajusté la configuración de autenticación para permitir el acceso público.

**Validación:** comprobé las rutas sin una sesión iniciada, verificando respuestas HTTP 200, y configuré un monitor en UptimeRobot, que confirmó el estado operativo del sitio.

### 6. Sección de cromos legendarios en el inicio

**Fecha:** 24 de noviembre de 2026.

Para la historia de la sustentación pedí a Claude Code el código de una sección con los legendarios de todos los mundos, reutilizando la tarjeta de cromo en tamaño mediano. Claude Code escribió el código.

**Respuesta equivocada de la IA:** la primera versión incumplía dos criterios. El total salía de contar las tarjetas (`legendarios.length`) en vez de `paginacion.total`, y en móvil la lista quedaba en dos columnas en vez de desplazarse en horizontal.

**Corrección (PR #13):** al comparar el código con el texto de la historia, Claude Code señaló las dos fallas y las corrigió.

**Validación:** Claude Code comprobó en el navegador, a 390 px, que se desplaza la lista y no la página, y que el total coincide con la API (14 en la API de sustentación).

### 7. Peticiones a la API desde el navegador

**Fecha:** 24 de noviembre de 2026.

En la revisión, la profesora señaló que en la pestaña Network no aparecían las llamadas a la API y que había valores escritos en el código. La primera versión, hecha con Claude Code, pedía todos los datos en el servidor (Server Components), así que las llamadas existían pero el navegador no las mostraba.

Claude Code explicó la causa y propuso alternativas. Elegí pedir desde el navegador los datos del inicio y del catálogo, y los textos al cambiar de idioma, sin modificar `API_URL` ni la configuración de Vercel. Claude Code escribió la implementación.

**Corrección (PR #14):** hook `usePeticion` con estados de carga y error, reintentos y cancelación. Los tipos de cromo y los totales pasaron a salir de la API. También se dejó de enviar `edicion=album` (caso 1), porque `GET /cromos` devuelve solo el álbum si no se indica la edición.

**Respuesta equivocada de la IA:** Claude Code también cambió los tokens de Figma del icono de las rarezas y del fondo de los mundos por colores calculados con la API, y dejó dos números a mano en el CSS. Después señaló que iba contra S1-01 y S1-03, y le pedí corregirlo en un PR aparte (rama `fix/colores-figma`).

**Error durante el cambio:** en la primera versión, si fallaba `GET /cromos`, el título de resultados seguía diciendo «Cargando…». Claude Code lo detectó al simular una respuesta 503 y lo corrigió antes de abrir el PR.

**Validación:** Claude Code probó en el navegador, con la API de sustentación, las peticiones de cada vista, los filtros por URL, los filtros inválidos, un mundo inexistente, el cambio de idioma y la recuperación con «Reintentar», además de lint, tipos, formato y compilación.

### 8. US-CRO-S1-08: contador y quitar filtros

**Fecha:** 24 de noviembre de 2026.

Entre las opciones que planteó Claude Code, elegí armar el contador con textos de la API («6 de 20 cromos»). Claude Code escribió el contador, los chips y «Quitar filtros» (PR #15).

**Respuesta equivocada de la IA:** Claude Code también tradujo los nombres de las rarezas al cambiar a inglés y lo presentó como una corrección. Al releer las historias señaló que iba contra S1-04 (la palabra de la rareza sale de `GET /rarezas`) y S1-05 (los datos del catálogo no se traducen). Le pedí deshacerlo, y el cambio se revirtió antes de fusionar el PR.

**Validación:** Claude Code comprobó en el navegador la URL al poner y quitar cada filtro, la apertura directa de `/mundos/coral?rareza=rara`, los textos en español e inglés, el estado vacío y la vista de 390 px.

---

### Decisiones de diseño y desarrollo bajo mi criterio

Además de las tareas de implementación, tomé decisiones propias para resolver diferencias entre los requisitos, los diseños y los recursos disponibles:

- **Consentimiento de cookies:** ajusté los estilos de «Aceptar» y «Rechazar» para que ambos tuvieran el mismo peso visual, atendiendo al segundo criterio de S1-06, aunque Figma presentaba el primero con relleno y el segundo con borde.

- **Leyenda de rarezas:** incorporé una leyenda en la página de inicio con iconos, nombres y porcentajes de rareza. Aunque este elemento no aparecía representado en Figma, era necesario para cumplir el primer criterio de S1-03.

- **Iconografía personalizada:** desarrollé las figuras de ola, hoja, órbita y runa mediante SVG, respetando el estilo de trazo del sistema visual, debido a que los recursos correspondientes no estaban incluidos en el paquete de iconos disponible.

### Consideraciones finales

El uso de Claude Code permitió reducir el tiempo dedicado a tareas repetitivas y acelerar la implementación de las historias de usuario. Sin embargo, la herramienta no sustituyó el análisis de requisitos ni la toma de decisiones durante el desarrollo.

Los casos documentados muestran que fue necesario contrastar propuestas, detectar comportamientos incorrectos, resolver problemas de integración y adaptar las implementaciones a los criterios reales del proyecto.

La responsabilidad sobre el alcance, las decisiones técnicas, la integración del código y la verificación del producto desplegado permaneció bajo mi criterio y supervisión.
