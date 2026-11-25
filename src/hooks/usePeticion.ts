"use client";

import { useCallback, useEffect, useState } from "react";
import { useConfiguracionApi } from "@/contexto/Api";
import { pedir, type ConfiguracionApi } from "@/lib/peticion";
import type { ListaPaginada } from "@/lib/tipos";

export type Peticion<T> = {
  /** Lo que respondió la API; undefined mientras carga o si falló. */
  datos: T | undefined;
  error: unknown;
  reintentar: () => void;
};

type Pedir<T> = (
  api: ConfiguracionApi,
  ruta: string,
  opciones: RequestInit,
) => Promise<T>;

type Resultado<T> = { clave: string; datos?: T; error?: unknown };

/** Guarda el resultado junto a su clave: si la ruta cambia, lo anterior ya no cuenta. */
function usePedir<T>(ruta: string | null, pedirDatos: Pedir<T>): Peticion<T> {
  const api = useConfiguracionApi();
  const [intento, setIntento] = useState(0);
  const [resultado, setResultado] = useState<Resultado<T> | null>(null);
  const clave = `${intento} ${ruta}`;

  useEffect(() => {
    if (ruta === null) return;
    const control = new AbortController();
    pedirDatos(api, ruta, { signal: control.signal })
      .then((datos) => {
        if (!control.signal.aborted) setResultado({ clave, datos });
      })
      .catch((error: unknown) => {
        if (!control.signal.aborted) setResultado({ clave, error });
      });
    return () => control.abort();
  }, [api, ruta, clave, pedirDatos]);

  const reintentar = useCallback(() => setIntento((anterior) => anterior + 1), []);
  const vigente = resultado?.clave === clave ? resultado : null;

  return { datos: vigente?.datos, error: vigente?.error, reintentar };
}

/** Pide una ruta de la API desde el navegador. Con `null` espera sin pedir nada. */
export function usePeticion<T>(ruta: string | null): Peticion<T> {
  return usePedir<T>(ruta, pedir);
}

/** Pide la primera página y, si la API dice que hay más, las demás. */
async function pedirPaginas<T>(
  api: ConfiguracionApi,
  ruta: string,
  opciones: RequestInit,
): Promise<ListaPaginada<T>> {
  const primera = await pedir<ListaPaginada<T>>(api, ruta, opciones);
  const faltantes = Array.from(
    { length: Math.max(0, primera.paginacion.paginas - 1) },
    (_, indice) => indice + 2,
  );
  const otras = await Promise.all(
    faltantes.map((pagina) =>
      pedir<ListaPaginada<T>>(api, `${ruta}&pagina=${pagina}`, opciones),
    ),
  );
  return { ...primera, datos: [primera, ...otras].flatMap((lista) => lista.datos) };
}

/** Como usePeticion, para listas paginadas (GET /cromos): entrega todos los datos. */
export function useListaCompleta<T>(ruta: string | null): Peticion<ListaPaginada<T>> {
  return usePedir<ListaPaginada<T>>(ruta, pedirPaginas<T>);
}
