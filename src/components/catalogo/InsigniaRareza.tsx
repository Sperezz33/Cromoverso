"use client";

import type { CSSProperties } from "react";
import { Icono } from "@/components/ui/Icono";
import { usePreferencias } from "@/contexto/Preferencias";
import { nombreDeRareza } from "@/lib/rarezas";
import type { Rareza } from "@/lib/tipos";
import estilos from "./InsigniaRareza.module.css";

type Props = {
  rareza: Rareza;
  /** "chip" con borde (filtros, tarjetas) o "texto" en línea. */
  forma?: "chip" | "texto";
  extra?: string;
  className?: string;
};

/** La rareza siempre se muestra con su icono y su palabra (GET /rarezas), nunca solo con color. */
export function InsigniaRareza({ rareza, forma = "chip", extra, className }: Props) {
  const { textos } = usePreferencias();
  const estilo = { "--color-rareza": rareza.color } as CSSProperties;
  return (
    <span
      className={[estilos.insignia, estilos[forma], className].filter(Boolean).join(" ")}
      style={estilo}
    >
      <span className={estilos.icono}>
        <Icono nombre={rareza.icono} tamano="pequeno" />
      </span>
      <span>{nombreDeRareza(textos, rareza)}</span>
      {extra && <span className={estilos.extra}>{extra}</span>}
    </span>
  );
}
