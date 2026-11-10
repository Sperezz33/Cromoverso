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
- `src/lib/api.ts`: cliente de la API. La dirección sale de `API_URL`.
- `src/styles/tokens.css`: tokens exportados de Figma (colores, tipografía, espacios, radios y sombras). Los componentes solo usan estas variables.
- `public/iconos/`: iconos SVG del sistema de diseño. Toman el color del texto.

## Estados de carga y error

Para verlos en desarrollo, define en `.env.local` `API_SIMULAR_LATENCIA=2000` o `API_SIMULAR_ERROR=503`. Se envían a la API como las cabeceras `X-Simular-Latencia` y `X-Simular-Error`.
