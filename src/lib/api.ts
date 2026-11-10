import type {
  Cromo,
  IdIdioma,
  Lista,
  ListaPaginada,
  Mundo,
  MundoConCromos,
  Rareza,
  RespuestaIdiomas,
  RespuestaTextos,
} from "./tipos";

/** Error con la forma del contrato: { error: { codigo, mensaje, campos } }. */
export class ErrorApi extends Error {
  constructor(
    readonly estado: number,
    readonly codigo: string,
    mensaje: string,
  ) {
    super(mensaje);
    this.name = "ErrorApi";
  }
}

function direccionBase(): string {
  const base = process.env.API_URL;
  if (!base) {
    throw new Error("Falta la variable de entorno API_URL (revisa .env.example).");
  }
  return base.replace(/\/+$/, "");
}

/** Cabeceras para ver los estados de carga y de error (solo si se definen). */
function cabecerasDePrueba(): Record<string, string> {
  const cabeceras: Record<string, string> = {};
  if (process.env.API_SIMULAR_LATENCIA) {
    cabeceras["X-Simular-Latencia"] = process.env.API_SIMULAR_LATENCIA;
  }
  if (process.env.API_SIMULAR_ERROR) {
    cabeceras["X-Simular-Error"] = process.env.API_SIMULAR_ERROR;
  }
  return cabeceras;
}

async function pedirUnaVez<T>(ruta: string, segundosEnCache: number): Promise<T> {
  const respuesta = await fetch(`${direccionBase()}${ruta}`, {
    headers: { Accept: "application/json", ...cabecerasDePrueba() },
    next: { revalidate: segundosEnCache },
  });

  if (!respuesta.ok) {
    const cuerpo = (await respuesta.json().catch(() => null)) as {
      error?: { codigo?: string; mensaje?: string };
    } | null;
    throw new ErrorApi(
      respuesta.status,
      cuerpo?.error?.codigo ?? "error_interno",
      cuerpo?.error?.mensaje ?? `HTTP ${respuesta.status}`,
    );
  }

  return (await respuesta.json()) as T;
}

/** Esperas antes de cada reintento, en milisegundos. */
const ESPERAS_REINTENTO = [300, 900];

/** Los 5xx (incluida falla_simulada) y la falta de red pueden ser pasajeros; un 4xx no. */
function valeLaPenaReintentar(error: unknown) {
  return !(error instanceof ErrorApi) || error.estado >= 500;
}

async function pedir<T>(ruta: string, segundosEnCache: number): Promise<T> {
  for (let intento = 0; ; intento++) {
    try {
      return await pedirUnaVez<T>(ruta, segundosEnCache);
    } catch (error) {
      const espera = ESPERAS_REINTENTO[intento];
      if (espera === undefined || !valeLaPenaReintentar(error)) throw error;
      await new Promise((listo) => setTimeout(listo, espera));
    }
  }
}

const CACHE_TEXTOS = 300;
const CACHE_CATALOGO = 60;

export function obtenerIdiomas() {
  return pedir<RespuestaIdiomas>("/idiomas", CACHE_TEXTOS);
}

export function obtenerTextos(idioma: IdIdioma) {
  return pedir<RespuestaTextos>(`/textos?idioma=${idioma}`, CACHE_TEXTOS);
}

export function obtenerMundos() {
  return pedir<Lista<Mundo> & { totalAlbum: number }>("/mundos", CACHE_CATALOGO);
}

export function obtenerMundo(id: string) {
  return pedir<MundoConCromos>(`/mundos/${encodeURIComponent(id)}`, CACHE_CATALOGO);
}

export function obtenerRarezas() {
  return pedir<Lista<Rareza>>("/rarezas", CACHE_CATALOGO);
}

export type FiltrosCromos = {
  mundo?: string;
  rareza?: string;
  tipo?: string;
  porPagina?: number;
};

export function obtenerCromos(filtros: FiltrosCromos) {
  const parametros = new URLSearchParams({ edicion: "album" });
  for (const [clave, valor] of Object.entries(filtros)) {
    if (valor !== undefined && valor !== "") parametros.set(clave, String(valor));
  }
  return pedir<ListaPaginada<Cromo>>(`/cromos?${parametros}`, CACHE_CATALOGO);
}
