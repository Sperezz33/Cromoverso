"use client";

import { Estado } from "@/components/estados/Estado";
import { usePreferencias } from "@/contexto/Preferencias";

export default function Cargando() {
  const { t } = usePreferencias();
  return (
    <div className="contenedor" aria-busy="true">
      <Estado icono="reloj" titulo={t("estados.cargando")} rol="status" />
    </div>
  );
}
