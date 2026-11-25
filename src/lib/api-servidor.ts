import { pedir, type ConfiguracionApi } from "./peticion";
import { rutasApi } from "./rutas-api";
import type {
  Cromo,
  IdIdioma,
  Lista,
  Mundo,
  MundoConCromos,
  RespuestaIdiomas,
  RespuestaTextos,
} from "./tipos";

function direccionApi(): string {
  const base = process.env.API_URL;
  if (!base) {
    throw new Error("Falta la variable de entorno API_URL (revisa .env.example).");
  }
  return base.replace(/\/+$/, "");
}

/**
 * Lee API_URL en el servidor. El layout se la pasa al navegador, que pide
 * directamente a la API los mundos, los cromos, las rarezas y los textos.
 */
export function configuracionApi(): ConfiguracionApi {
  // Cabeceras para ver los estados de carga y de error (solo si se definen).
  const cabeceras: Record<string, string> = {};
  if (process.env.API_SIMULAR_LATENCIA) {
    cabeceras["X-Simular-Latencia"] = process.env.API_SIMULAR_LATENCIA;
  }
  if (process.env.API_SIMULAR_ERROR) {
    cabeceras["X-Simular-Error"] = process.env.API_SIMULAR_ERROR;
  }

  return { base: direccionApi(), cabeceras };
}

const CACHE_TEXTOS = 300;
const CACHE_CATALOGO = 60;

/** Sin las cabeceras de prueba: con los textos cargados se ven los estados de cada vista. */
function pedirEnServidor<T>(ruta: string, segundosEnCache: number) {
  return pedir<T>({ base: direccionApi(), cabeceras: {} }, ruta, {
    next: { revalidate: segundosEnCache },
  });
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

export function obtenerCromo(id: string) {
  return pedirEnServidor<Cromo>(rutasApi.cromo(id), CACHE_CATALOGO);
}

export function obtenerMundo(id: string) {
  return pedirEnServidor<MundoConCromos>(rutasApi.mundo(id), CACHE_CATALOGO);
}
