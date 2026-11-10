import type { CSSProperties } from "react";
import { Icono } from "@/components/ui/Icono";
import type { Cromo } from "@/lib/tipos";
import estilos from "./IlustracionCromo.module.css";

type Props = {
  ilustracion: Cromo["ilustracion"];
  holografico?: boolean;
};

/**
 * Los cromos no traen imagen: se dibujan con CSS y SVG a partir de
 * ilustracion.colorBase y ilustracion.figura.
 */
export function IlustracionCromo({ ilustracion, holografico }: Props) {
  const estilo = { "--color-cromo": ilustracion.colorBase } as CSSProperties;
  return (
    <div
      className={[estilos.ilustracion, holografico ? estilos.holografico : ""].join(" ")}
      style={estilo}
      aria-hidden="true"
    >
      <svg className={estilos.silueta} viewBox="0 0 100 100" focusable="false">
        <circle className={estilos.halo} cx="50" cy="44" r="34" />
        <path
          className={estilos.cuerpo}
          d="M16 100 C16 74 31 64 50 64 C69 64 84 74 84 100 Z"
        />
        <circle className={estilos.cuerpo} cx="50" cy="40" r="17" />
        <rect className={estilos.visor} x="35" y="35" width="30" height="7" rx="3.5" />
      </svg>
      <span className={estilos.figura}>
        <Icono nombre={ilustracion.figura} tamano="pequeno" />
      </span>
    </div>
  );
}
