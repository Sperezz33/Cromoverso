"use client";

import { usePreferencias } from "@/contexto/Preferencias";
import estilos from "./SaltarAlContenido.module.css";

export const ID_CONTENIDO = "contenido";

export function SaltarAlContenido() {
  const { t } = usePreferencias();
  return (
    <a href={`#${ID_CONTENIDO}`} className={estilos.salto}>
      {t("general.aria.saltarAlContenido")}
    </a>
  );
}
