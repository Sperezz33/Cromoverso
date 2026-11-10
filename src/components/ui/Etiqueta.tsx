import type { ReactNode } from "react";
import { Icono } from "./Icono";
import estilos from "./Etiqueta.module.css";

type Variante = "neutra" | "acento" | "marca" | "inversa";

type Props = {
  children: ReactNode;
  variante?: Variante;
  icono?: string;
  className?: string;
};

/** Etiqueta corta (insignia o píldora) para estados y categorías. */
export function Etiqueta({ children, variante = "neutra", icono, className }: Props) {
  return (
    <span
      className={[estilos.etiqueta, estilos[variante], className]
        .filter(Boolean)
        .join(" ")}
    >
      {icono && <Icono nombre={icono} tamano="pequeno" />}
      {children}
    </span>
  );
}
