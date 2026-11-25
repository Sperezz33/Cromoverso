/** Dirección de la API y cabeceras extra. Las usan igual el servidor y el navegador. */
export type ConfiguracionApi = {
  base: string;
  cabeceras: Record<string, string>;
};

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

async function pedirUnaVez<T>(
  api: ConfiguracionApi,
  ruta: string,
  opciones: RequestInit,
): Promise<T> {
  const respuesta = await fetch(`${api.base}${ruta}`, {
    ...opciones,
    headers: { Accept: "application/json", ...api.cabeceras },
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
