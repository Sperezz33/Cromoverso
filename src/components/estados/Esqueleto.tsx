"use client";

import type { ReactNode } from "react";
import { usePreferencias } from "@/contexto/Preferencias";
import estilos from "./Esqueleto.module.css";

/** Bloque gris que ocupa el lugar de un dato mientras carga. */
export function Bloque({ className }: { className?: string }) {
  return <span className={[estilos.bloque, className].filter(Boolean).join(" ")} />;
}

type Props = { className?: string; children: ReactNode };

/** Los bloques son decorativos: los lectores de pantalla oyen "Cargando…". */
export function Esqueleto({ className, children }: Props) {
  const { t } = usePreferencias();
  return (
    <div className={className} aria-busy="true">
      <p role="status" className="solo-lectores">
        {t("estados.cargando")}
      </p>
      <div aria-hidden="true" className={estilos.contenido}>
        {children}
      </div>
    </div>
  );
}
