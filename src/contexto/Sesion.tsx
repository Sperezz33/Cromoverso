"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { pedirUnaVez } from "@/lib/peticion";
import type { Usuario } from "@/lib/tipos";

export type Credenciales = { correo: string; clave: string; mantener: boolean };

type ValorContexto = {
  usuario: Usuario | null;
  ingresar: (credenciales: Credenciales) => Promise<void>;
};

const Contexto = createContext<ValorContexto | null>(null);

/** La ruta del sitio que guarda la cookie httpOnly; ella llama a /sesion de la API. */
const SITIO = { base: "/api", cabeceras: {} };

/** Comparte quién inició sesión. El token vive en una cookie httpOnly, no aquí. */
export function ProveedorSesion({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const ingresar = useCallback(async (credenciales: Credenciales) => {
    const respuesta = await pedirUnaVez<{ usuario: Usuario }>(SITIO, "/sesion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credenciales),
    });
    setUsuario(respuesta.usuario);
  }, []);

  const valor = useMemo(() => ({ usuario, ingresar }), [usuario, ingresar]);

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useSesion() {
  const valor = useContext(Contexto);
  if (!valor) throw new Error("useSesion necesita ProveedorSesion.");
  return valor;
}
