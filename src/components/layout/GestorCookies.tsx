"use client";

import { AvisoCookies } from "@/components/ui/AvisoCookies";
import { usePreferencias } from "@/contexto/Preferencias";
import { ID_CONTENIDO } from "./SaltarAlContenido";

/** Muestra el aviso de cookies hasta que la persona acepta o rechaza. */
export function GestorCookies() {
  const { consentimiento, decidirCookies, t } = usePreferencias();

  if (consentimiento !== null) return null;

  function decidir(acepta: boolean) {
    decidirCookies(acepta);
    // El aviso desaparece: el foco pasa al contenido para no perderse.
    document.getElementById(ID_CONTENIDO)?.focus();
  }

  return (
    <AvisoCookies
      titulo={t("cookies.banner.titulo")}
      texto={t("cookies.banner.texto")}
      aceptar={t("cookies.banner.botones.aceptar")}
      rechazar={t("cookies.banner.botones.rechazar")}
      onAceptar={() => decidir(true)}
      onRechazar={() => decidir(false)}
    />
  );
}
