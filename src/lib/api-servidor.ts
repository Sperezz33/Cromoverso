import { pedir, type ConfiguracionApi } from "./peticion";
import { rutasApi } from "./rutas-api";
import type {
  IdIdioma,
  Lista,
  Mundo,
  MundoConCromos,
  RespuestaIdiomas,
  RespuestaTextos,
} from "./tipos";

/**
 * Lee API_URL en el servidor. El layout se la pasa al navegador, que pide
 * directamente a la API los mundos, los cromos, las rarezas y los textos.
 */
export function configuracionApi(): ConfiguracionApi {
  const base = process.env.API_URL;
  if (!base) {
    throw new Error("Falta la variable de entorno API_URL (revisa .env.example).");
  }

  // Cabeceras para ver los estados de carga y de error (solo si se definen).
  const cabeceras: Record<string, string> = {};
  if (process.env.API_SIMULAR_LATENCIA) {
    cabeceras["X-Simular-Latencia"] = process.env.API_SIMULAR_LATENCIA;
  }
  if (process.env.API_SIMULAR_ERROR) {
    cabeceras["X-Simular-Error"] = process.env.API_SIMULAR_ERROR;
  }

  return { base: base.replace(/\/+$/, ""), cabeceras };
}

const CACHE_TEXTOS = 300;
const CACHE_CATALOGO = 60;

function pedirEnServidor<T>(ruta: string, segundosEnCache: number) {
  return pedir<T>(configuracionApi(), ruta, { next: { revalidate: segundosEnCache } });
}

export function obtenerIdiomas() {
  return pedirEnServidor<RespuestaIdiomas>(rutasApi.idiomas, CACHE_TEXTOS);
}

export function obtenerTextos(idioma: IdIdioma) {
  return pedirEnServidor<RespuestaTextos>(rutasApi.textos(idioma), CACHE_TEXTOS);
}

export function obtenerMundos() {
  return pedirEnServidor<Lista<Mundo>>(rutasApi.mundos, CACHE_CATALOGO);
}

export function obtenerMundo(id: string) {
  return pedirEnServidor<MundoConCromos>(rutasApi.mundo(id), CACHE_CATALOGO);
}
