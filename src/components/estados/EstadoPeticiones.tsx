"use client";

import type { ReactNode } from "react";
import { Boton } from "@/components/ui/Boton";
import { usePreferencias } from "@/contexto/Preferencias";
import type { Peticion } from "@/hooks/usePeticion";
import { ErrorApi } from "@/lib/peticion";
import { buscarTexto } from "@/lib/textos";
import { Estado } from "./Estado";

type Props = {
  peticiones: Peticion<unknown>[];
  nivel?: "h1" | "h2";
  /** Esqueleto de la vista. Sin él se muestra "Cargando…". */
  cargando?: ReactNode;
};

/** Carga o error de una o varias peticiones. Reintentar repite solo las que fallaron. */
export function EstadoPeticiones({ peticiones, nivel, cargando }: Props) {
  const { t, textos } = usePreferencias();
  const fallidas = peticiones.filter((peticion) => peticion.error !== undefined);

  if (fallidas.length === 0) {
    return (
      cargando ?? (
        <div aria-busy="true">
          <Estado
            icono="reloj"
            nivel={nivel}
            rol="status"
            titulo={t("estados.cargando")}
          />
        </div>
      )
    );
  }

  // El mensaje depende del código de la API; sin respuesta, es un problema de conexión.
  const error = fallidas[0]?.error;
  const sinRespuesta = !(error instanceof ErrorApi);
  const mensaje = sinRespuesta
    ? undefined
    : buscarTexto(textos, `errores.${error.codigo}`);

  return (
    <Estado
      icono={sinRespuesta ? "wifioff" : "alerta"}
      nivel={nivel}
      rol="alert"
      titulo={t(sinRespuesta ? "estados.sinConexion.titulo" : "estados.error.titulo")}
      texto={typeof mensaje === "string" ? mensaje : t("estados.error.texto")}
    >
      <Boton
        variante="primario"
        icono="intercambio"
        onClick={() => fallidas.forEach((peticion) => peticion.reintentar())}
      >
        {t("estados.error.botones.reintentar")}
      </Boton>
    </Estado>
  );
}
