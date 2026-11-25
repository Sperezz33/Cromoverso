"use client";

import { Boton } from "@/components/ui/Boton";
import { usePreferencias } from "@/contexto/Preferencias";
import type { Peticion } from "@/hooks/usePeticion";
import { Estado } from "./Estado";

type Props = {
  peticiones: Peticion<unknown>[];
  nivel?: "h1" | "h2";
};

/** Carga o error de una o varias peticiones. Reintentar repite solo las que fallaron. */
export function EstadoPeticiones({ peticiones, nivel }: Props) {
  const { t } = usePreferencias();
  const fallidas = peticiones.filter((peticion) => peticion.error !== undefined);

  if (fallidas.length === 0) {
    return (
      <div aria-busy="true">
        <Estado icono="reloj" nivel={nivel} rol="status" titulo={t("estados.cargando")} />
      </div>
    );
  }

  return (
    <Estado
      icono="alerta"
      nivel={nivel}
      rol="alert"
      titulo={t("estados.error.titulo")}
      texto={t("estados.error.texto")}
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
