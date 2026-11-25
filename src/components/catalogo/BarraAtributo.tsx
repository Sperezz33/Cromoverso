import { useId, type CSSProperties } from "react";
import estilos from "./BarraAtributo.module.css";

/** Escala de los atributos según el contrato (vista 3). */
const MINIMO = 10;
const MAXIMO = 99;

type Props = { nombre: string; valor: number };

/** Un atributo del cromo: nombre, barra y número. */
export function BarraAtributo({ nombre, valor }: Props) {
  const idNombre = useId();
  return (
    <div className={estilos.fila}>
      <span id={idNombre} className={estilos.nombre}>
        {nombre}
      </span>
      <span
        className={estilos.barra}
        role="meter"
        aria-labelledby={idNombre}
        aria-valuemin={MINIMO}
        aria-valuemax={MAXIMO}
        aria-valuenow={valor}
      >
        <span
          className={estilos.relleno}
          style={{ "--porcentaje": `${valor}%` } as CSSProperties}
        />
      </span>
      <span className={estilos.valor} aria-hidden="true">
        {valor}
      </span>
    </div>
  );
}
