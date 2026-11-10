import type { CSSProperties } from "react";
import estilos from "./Icono.module.css";

type Props = {
  nombre: string;
  tamano?: "pequeno" | "normal" | "grande";
  className?: string;
};

/** Icono del sistema de diseño. Toma el color del texto que lo rodea. */
export function Icono({ nombre, tamano = "normal", className }: Props) {
  const estilo = { "--icono": `url(/iconos/${nombre}.svg)` } as CSSProperties;
  return (
    <span
      aria-hidden="true"
      className={[estilos.icono, estilos[tamano], className].filter(Boolean).join(" ")}
      style={estilo}
    />
  );
}
