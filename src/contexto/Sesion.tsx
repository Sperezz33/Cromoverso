"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ErrorApi, pedir, pedirUnaVez } from "@/lib/peticion";
import { rutas } from "@/lib/rutas";
import type { Usuario } from "@/lib/tipos";

export type Credenciales = { correo: string; clave: string; mantener: boolean };

type ValorContexto = {
  usuario: Usuario | null;
  /** Hay una cookie de sesión y todavía no se sabe de quién es. */
  cargando: boolean;
  /** La sesión venció (401) y por eso se llegó a ingresar. */
  vencida: boolean;
  ingresar: (credenciales: Credenciales) => Promise<void>;
  cerrarSesion: () => Promise<void>;
};

const Contexto = createContext<ValorContexto | null>(null);

/** La ruta del sitio que guarda la cookie httpOnly; ella llama a /sesion de la API. */
const SITIO = { base: "/api", cabeceras: {} };
const RUTA = "/sesion";

type Props = {
  /** El servidor encontró la cookie de sesión. El navegador no puede leerla. */
  haySesion: boolean;
  children: ReactNode;
};

/** Comparte quién inició sesión. El token vive en una cookie httpOnly, no aquí. */
export function ProveedorSesion({ haySesion, children }: Props) {
  const router = useRouter();
  const rutaActual = usePathname();
  const [activa, setActiva] = useState(haySesion);
  const [cargando, setCargando] = useState(haySesion);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [vencida, setVencida] = useState(false);

  // Con sesión, cada vista pregunta GET /sesion: así se nota si venció mientras navegaba.
  useEffect(() => {
    if (!activa) return;
    const control = new AbortController();
    pedir<{ usuario: Usuario }>(SITIO, RUTA, { signal: control.signal })
      .then((respuesta) => {
        if (control.signal.aborted) return;
        setUsuario(respuesta.usuario);
        setCargando(false);
      })
      .catch((error: unknown) => {
        if (control.signal.aborted) return;
        setCargando(false);
        // Una falla de red o del servidor no significa que la sesión haya vencido.
        if (!(error instanceof ErrorApi) || error.codigo !== "no_autenticado") return;
        setActiva(false);
        setUsuario(null);
        setVencida(true);
        router.replace(rutas.ingresar);
      });
    return () => control.abort();
  }, [activa, rutaActual, router]);

  const ingresar = useCallback(async (credenciales: Credenciales) => {
    const respuesta = await pedirUnaVez<{ usuario: Usuario }>(SITIO, RUTA, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credenciales),
    });
    setUsuario(respuesta.usuario);
    setActiva(true);
    setVencida(false);
  }, []);

  const cerrarSesion = useCallback(async () => {
    await pedirUnaVez<void>(SITIO, RUTA, { method: "DELETE" });
    setActiva(false);
    setUsuario(null);
    router.push(rutas.inicio);
  }, [router]);

  const valor = useMemo(
    () => ({ usuario, cargando, vencida, ingresar, cerrarSesion }),
    [usuario, cargando, vencida, ingresar, cerrarSesion],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useSesion() {
  const valor = useContext(Contexto);
  if (!valor) throw new Error("useSesion necesita ProveedorSesion.");
  return valor;
}
