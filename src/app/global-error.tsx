"use client";

import "@/styles/tokens.css";
import "@/styles/fuentes.css";
import "./globals.css";
import { useEffect, useState } from "react";
import { Estado } from "@/components/estados/Estado";
import { Boton } from "@/components/ui/Boton";
import { cargarTextos } from "@/app/acciones";
import { COOKIE_IDIOMA, esIdioma } from "@/lib/cookies";
import { IDIOMA_DE_RESPALDO } from "@/lib/idiomas";
import { traducir } from "@/lib/textos";
import type { IdIdioma } from "@/lib/tipos";
import { rubik, unbounded } from "@/styles/fuentes";
import estilos from "./global-error.module.css";

/**
 * Única excepción a "ningún texto en el código": esta pantalla aparece cuando la API
 * no entregó GET /textos, así que no hay textos que mostrar. Si la API vuelve a
 * responder, se usan los de estados.error.
 */
const SIN_API = {
  titulo: "No se pudo cargar · Could not load",
  texto: "La API no responde. Vuelve a intentarlo en unos segundos.",
  reintentar: "Reintentar · Try again",
};

function idiomaGuardado(): IdIdioma {
  const valor = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${COOKIE_IDIOMA}=`))
    ?.split("=")[1];
  return esIdioma(valor) ? valor : IDIOMA_DE_RESPALDO;
}

export default function ErrorGlobal({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  const [idioma, setIdioma] = useState<IdIdioma>(IDIOMA_DE_RESPALDO);
  const [mensajes, setMensajes] = useState(SIN_API);

  useEffect(() => {
    console.error(error);
    const elegido = idiomaGuardado();
    cargarTextos(elegido)
      .then((textos) => {
        setIdioma(elegido);
        setMensajes({
          titulo: traducir(textos, "estados.error.titulo"),
          texto: traducir(textos, "estados.error.texto"),
          reintentar: traducir(textos, "estados.error.botones.reintentar"),
        });
      })
      .catch(() => {
        // La API sigue sin responder: se quedan los mensajes de respaldo.
      });
  }, [error]);

  return (
    <html lang={idioma} className={`${unbounded.variable} ${rubik.variable}`}>
      <body>
        <main className={`contenedor ${estilos.pantalla}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- logo SVG del sistema de diseño */}
          <img src="/logos/logo-normal.svg" alt="" className={estilos.logo} />
          <Estado
            icono="wifioff"
            nivel="h1"
            rol="alert"
            titulo={mensajes.titulo}
            texto={mensajes.texto}
          >
            <Boton variante="primario" icono="intercambio" onClick={() => retry()}>
              {mensajes.reintentar}
            </Boton>
          </Estado>
        </main>
      </body>
    </html>
  );
}
