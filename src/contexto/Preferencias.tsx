"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { traducir, type Valores } from "@/lib/textos";
import type { IdIdioma, Textos } from "@/lib/tipos";

type ValorContexto = {
  idioma: IdIdioma;
  textos: Textos;
  t: (ruta: string, valores?: Valores) => string;
};

const Contexto = createContext<ValorContexto | null>(null);

type Props = {
  idioma: IdIdioma;
  textos: Textos;
  children: ReactNode;
};

/** Comparte el idioma y los textos de la interfaz (de GET /textos) con toda la app. */
export function ProveedorPreferencias({ idioma, textos, children }: Props) {
  const t = useCallback(
    (ruta: string, valores?: Valores) => traducir(textos, ruta, valores),
    [textos],
  );
  const valor = useMemo(() => ({ idioma, textos, t }), [idioma, textos, t]);
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function usePreferencias() {
  const valor = useContext(Contexto);
  if (!valor) throw new Error("usePreferencias necesita ProveedorPreferencias.");
  return valor;
}
