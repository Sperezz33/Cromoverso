"use client";

import { useState, type ComponentProps } from "react";
import { Campo } from "./Campo";
import { Icono } from "./Icono";
import estilos from "./CampoClave.module.css";

type Props = Omit<ComponentProps<typeof Campo>, "type" | "accion"> & {
  /** Nombre del botón del ojo según el estado. */
  mostrar: string;
  ocultar: string;
};

/** Campo de contraseña con un botón para verla u ocultarla. */
export function CampoClave({ mostrar, ocultar, ...resto }: Props) {
  const [visible, setVisible] = useState(false);
  return (
    <Campo
      {...resto}
      type={visible ? "text" : "password"}
      accion={
        <button
          type="button"
          className={estilos.ojo}
          aria-label={visible ? ocultar : mostrar}
          onClick={() => setVisible((valor) => !valor)}
        >
          <Icono nombre={visible ? "ojooculto" : "ojo"} />
        </button>
      }
    />
  );
}
