"use client";

import estilos from "./SelectorIdioma.module.css";

export type OpcionIdioma<T extends string> = {
  codigo: T;
  /** Lo que se ve en el botón (ES, EN). */
  corto: string;
  /** Nombre completo para lectores de pantalla (Español, English). */
  nombre: string;
};

type Props<T extends string> = {
  opciones: OpcionIdioma<T>[];
  actual: T;
  etiqueta: string;
  onCambiar: (codigo: T) => void;
  deshabilitado?: boolean;
  tamano?: "normal" | "grande";
};

/** Selector ES | EN: un grupo de botones conmutables (aria-pressed). */
export function SelectorIdioma<T extends string>({
  opciones,
  actual,
  etiqueta,
  onCambiar,
  deshabilitado,
  tamano = "normal",
}: Props<T>) {
  return (
    <div
      role="group"
      aria-label={etiqueta}
      className={`${estilos.selector} ${estilos[tamano]}`}
    >
      {opciones.map((opcion) => {
        const activo = opcion.codigo === actual;
        return (
          <button
            key={opcion.codigo}
            type="button"
            lang={opcion.codigo}
            className={estilos.opcion}
            aria-pressed={activo}
            aria-label={opcion.nombre}
            disabled={deshabilitado}
            onClick={() => {
              if (!activo) onCambiar(opcion.codigo);
            }}
          >
            {opcion.corto}
          </button>
        );
      })}
    </div>
  );
}
