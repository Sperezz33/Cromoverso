"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { cargarTextos } from "@/app/acciones";
import { COOKIE_IDIOMA, guardarCookie, type Consentimiento } from "@/lib/cookies";
import { traducir, type Valores } from "@/lib/textos";
import type { IdIdioma, Idioma, Textos } from "@/lib/tipos";

type ValorContexto = {
  idioma: IdIdioma;
  idiomas: Idioma[];
  textos: Textos;
  t: (ruta: string, valores?: Valores) => string;
  cambiarIdioma: (idioma: IdIdioma) => void;
  cambiandoIdioma: boolean;
  errorIdioma: boolean;
  consentimiento: Consentimiento | null;
};

const Contexto = createContext<ValorContexto | null>(null);

type Props = {
  idioma: IdIdioma;
  idiomas: Idioma[];
  textos: Textos;
  consentimiento: Consentimiento | null;
  children: ReactNode;
};

/** Comparte el idioma, los textos de la interfaz (GET /textos) y el consentimiento. */
export function ProveedorPreferencias({
  idioma: idiomaInicial,
  idiomas,
  textos: textosIniciales,
  consentimiento,
  children,
}: Props) {
  const [idioma, setIdioma] = useState(idiomaInicial);
  const [textos, setTextos] = useState(textosIniciales);
  const [errorIdioma, setErrorIdioma] = useState(false);
  const [cambiandoIdioma, iniciarCambio] = useTransition();

  // <html lang> sigue al idioma elegido.
  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  const cambiarIdioma = useCallback(
    (nuevo: IdIdioma) => {
      iniciarCambio(async () => {
        try {
          const nuevosTextos = await cargarTextos(nuevo);
          setTextos(nuevosTextos);
          setIdioma(nuevo);
          setErrorIdioma(false);
          // Solo se recuerda el idioma si la persona aceptó las cookies.
          if (consentimiento === "aceptado") guardarCookie(COOKIE_IDIOMA, nuevo);
        } catch {
          setErrorIdioma(true);
        }
      });
    },
    [consentimiento],
  );

  const t = useCallback(
    (ruta: string, valores?: Valores) => traducir(textos, ruta, valores),
    [textos],
  );

  const valor = useMemo(
    () => ({
      idioma,
      idiomas,
      textos,
      t,
      cambiarIdioma,
      cambiandoIdioma,
      errorIdioma,
      consentimiento,
    }),
    [
      idioma,
      idiomas,
      textos,
      t,
      cambiarIdioma,
      cambiandoIdioma,
      errorIdioma,
      consentimiento,
    ],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function usePreferencias() {
  const valor = useContext(Contexto);
  if (!valor) throw new Error("usePreferencias necesita ProveedorPreferencias.");
  return valor;
}
