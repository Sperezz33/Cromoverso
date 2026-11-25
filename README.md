# Cromoverso

Frontend del álbum de héroes Cromoverso, hecho con Next.js (App Router) y TypeScript.

- **Sitio desplegado:** https://cromoverso-sperezz33.vercel.app
- **API:** https://yanethm-cromoverso-api.fly.dev/api/v1 ([contrato](https://yanethm-cromoverso-api.fly.dev/docs/contrato))
- **Uso de IA:** ver [IA.md](IA.md)

## Cómo ejecutarlo

1. Copia `.env.example` como `.env.local`. Ahí va la dirección de la API en `API_URL`.
2. Instala y arranca:

```bash
npm install
npm run dev
```

## Scripts

| Script                 | Qué hace                                         |
| ---------------------- | ------------------------------------------------ |
| `npm run dev`          | Servidor de desarrollo                           |
| `npm run build`        | Compilación de producción                        |
| `npm run lint`         | ESLint                                           |
| `npm run format:check` | Revisa el formato con Prettier                   |
| `npm run typecheck`    | Revisa los tipos con TypeScript en modo estricto |

## Organización

- `src/app/`: rutas de Next.js.
- `src/components/ui/`: componentes base (botón, campo, etiqueta, tarjeta, selector de idioma, aviso de cookies).
- `src/lib/peticion.ts`: cliente de la API (errores y reintentos). La dirección sale de `API_URL`.
- `src/hooks/usePeticion.ts`: pide los mundos, las rarezas y los cromos desde el navegador, directo a la API. Cada petición se ve en la pestaña Network.
- `src/lib/api-servidor.ts`: lo que se pide en el servidor: los textos e idiomas de la primera carga y los metadatos.
- `src/styles/tokens.css`: tokens exportados de Figma (colores, tipografía, espacios, radios y sombras). Los componentes solo usan estas variables.
- `public/iconos/`: iconos SVG del sistema de diseño. Toman el color del texto.

## Estados de carga y error

Para verlos en desarrollo, define en `.env.local` `API_SIMULAR_LATENCIA=2000` o `API_SIMULAR_ERROR=503`. Se envían como las cabeceras `X-Simular-Latencia` y `X-Simular-Error` en las peticiones que hace el navegador (los mundos, los cromos, las rarezas y el cambio de idioma). Los textos de la primera carga se piden sin ellas, para poder ver los estados de cada vista.

## Sesión

El formulario de ingreso llama a `/api/sesion` del propio sitio (`src/app/api/sesion/route.ts`), que pide `POST /sesion` a la API, guarda el token en la cookie httpOnly `sesion` y devuelve solo los datos de la persona. El token nunca llega al JavaScript del navegador ni a `localStorage`. `GET /api/sesion` consulta quién ingresó y `DELETE /api/sesion` cierra la sesión.
