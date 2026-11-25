/** Dirección de la API y cabeceras extra. Las usan igual el servidor y el navegador. */
export type ConfiguracionApi = {
  base: string;
  cabeceras: Record<string, string>;
};

type DetalleError = {
  /** Mensaje por campo en los errores `validacion`. */
  campos?: Record<string, unknown>;
  /** Segundos de Retry-After, si la API lo envía. */
  espera?: number;
};

/** Error con la forma del contrato: { error: { codigo, mensaje, campos } }. */
export class ErrorApi extends Error {
  constructor(
    readonly estado: number,
    readonly codigo: string,
    mensaje: string,
    readonly detalle: DetalleError = {},
  ) {
    super(mensaje);
    this.name = "ErrorApi";
  }
}

/** Una sola petición, sin reintentos (por ejemplo, POST /sesion). */
export async function pedirUnaVez<T>(
  api: ConfiguracionApi,
  ruta: string,
  opciones: RequestInit,
): Promise<T> {
  const respuesta = await fetch(`${api.base}${ruta}`, {
    ...opciones,
    headers: { Accept: "application/json", ...api.cabeceras, ...opciones.headers },
  });

  if (!respuesta.ok) {
    const cuerpo = (await respuesta.json().catch(() => null)) as {
      error?: { codigo?: string; mensaje?: string; campos?: Record<string, unknown> };
    } | null;
    const espera = Number(respuesta.headers.get("Retry-After"));
    throw new ErrorApi(
      respuesta.status,
      cuerpo?.error?.codigo ?? "error_interno",
      cuerpo?.error?.mensaje ?? `HTTP ${respuesta.status}`,
      {
        campos: cuerpo?.error?.campos,
        espera: espera > 0 ? Math.ceil(espera) : undefined,
      },
    );
  }

  // 204: la API hizo lo pedido y no hay nada que leer.
  if (respuesta.status === 204) return undefined as T;
  return (await respuesta.json()) as T;
}

/** Esperas antes de cada reintento, en milisegundos. */
const ESPERAS_REINTENTO = [300, 900];

/** Los 5xx (incluida falla_simulada) y la falta de red pueden ser pasajeros; un 4xx no. */
function valeLaPenaReintentar(error: unknown) {
  return !(error instanceof ErrorApi) || error.estado >= 500;
}

/** GET a la API con reintentos. Si se cancela con `signal`, no reintenta. */
export async function pedir<T>(
  api: ConfiguracionApi,
  ruta: string,
  opciones: RequestInit = {},
): Promise<T> {
  for (let intento = 0; ; intento++) {
    try {
      return await pedirUnaVez<T>(api, ruta, opciones);
    } catch (error) {
      const espera = ESPERAS_REINTENTO[intento];
      if (espera === undefined || !valeLaPenaReintentar(error)) throw error;
      if (opciones.signal?.aborted) throw error;
      await new Promise((listo) => setTimeout(listo, espera));
    }
  }
}
