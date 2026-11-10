import type { CSSProperties } from "react";
import { Icono } from "@/components/ui/Icono";
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
  const estilo = { "--color-rareza": `var(--rareza-${rareza.id})` } as CSSProperties;
  return (
    <span
      className={[estilos.insignia, estilos[forma], className].filter(Boolean).join(" ")}
      style={estilo}
    >
      <span className={estilos.icono}>
        <Icono nombre={rareza.icono} tamano="pequeno" />
      </span>
      <span>{rareza.nombre}</span>
      {extra && <span className={estilos.extra}>{extra}</span>}
    </span>
  );
}
