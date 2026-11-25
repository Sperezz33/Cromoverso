"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ConfiguracionApi } from "@/lib/peticion";

const Contexto = createContext<ConfiguracionApi | null>(null);

type Props = { configuracion: ConfiguracionApi; children: ReactNode };

/** Da a los componentes del navegador la dirección de la API (API_URL). */
export function ProveedorApi({ configuracion, children }: Props) {
  return <Contexto.Provider value={configuracion}>{children}</Contexto.Provider>;
}

export function useConfiguracionApi() {
  const valor = useContext(Contexto);
  if (!valor) throw new Error("useConfiguracionApi necesita ProveedorApi.");
  return valor;
}
