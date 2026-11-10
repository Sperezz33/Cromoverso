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

Durante la integración identifiqué que la estrategia de ramas encadenadas no estaba llevando todos los cambios a `main`, contrario a lo que se había previsto inicialmente. El problema se originó porque los pull requests se fusionaron sobre sus respectivas ramas base y estas no se eliminaron después de la integración.

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
