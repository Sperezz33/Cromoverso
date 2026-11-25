import type { ReactNode } from "react";
import type { Cromo } from "@/lib/tipos";
import { TarjetaCromo } from "./TarjetaCromo";
import estilos from "./AbanicoCromos.module.css";

/** Cartas que caben en el abanico según el diseño. */
const CARTAS = 3;

type Props = {
  /** undefined mientras cargan o si fallaron: el espacio queda reservado. */
  cromos: Cromo[] | undefined;
  /** Etiqueta sobre las cartas (solo se muestra cuando hay cartas). */
  etiqueta?: ReactNode;
  className?: string;
};

/** Abanico decorativo con los cromos holográficos. */
export function AbanicoCromos({ cromos, etiqueta, className }: Props) {
  const destacados = (cromos ?? []).filter((cromo) => cromo.holografico).slice(0, CARTAS);

  return (
    <div className={[estilos.abanico, className].filter(Boolean).join(" ")}>
      {destacados.length > 0 && etiqueta}
      {destacados.map((cromo) => (
        <TarjetaCromo
          key={cromo.id}
          cromo={cromo}
          conEnlace={false}
          className={estilos.carta}
        />
      ))}
    </div>
  );
}
