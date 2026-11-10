"use client";

import { useEffect } from "react";
import { Estado } from "@/components/estados/Estado";
import { Boton } from "@/components/ui/Boton";
import { usePreferencias } from "@/contexto/Preferencias";

/** Error al pedir datos a la API (por ejemplo, una falla simulada 503). */
export default function ErrorDeVista({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  const { t } = usePreferencias();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="contenedor">
      <Estado
        icono="alerta"
        nivel="h1"
        rol="alert"
        titulo={t("estados.error.titulo")}
        texto={t("estados.error.texto")}
      >
        <Boton variante="primario" icono="intercambio" onClick={() => retry()}>
          {t("estados.error.botones.reintentar")}
        </Boton>
      </Estado>
    </div>
  );
}
