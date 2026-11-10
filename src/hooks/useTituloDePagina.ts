"use client";

import { useEffect } from "react";
import { usePreferencias } from "@/contexto/Preferencias";
import type { Valores } from "@/lib/textos";

/** Mantiene el título de la pestaña en el idioma elegido (textos.paginas.<pagina>.seo). */
export function useTituloDePagina(pagina: string, valores?: Valores) {
  const { t } = usePreferencias();
  const titulo = t(`paginas.${pagina}.seo.titulo`, valores);

  useEffect(() => {
    document.title = titulo;
  }, [titulo]);
}
