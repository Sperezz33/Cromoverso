"use client";

import type { ReactNode } from "react";
import { Icono } from "@/components/ui/Icono";
import estilos from "./Estado.module.css";

type Props = {
  icono: string;
  titulo: string;
  texto?: string;
  /** Nivel del título según dónde se muestre el estado. */
  nivel?: "h1" | "h2";
  rol?: "status" | "alert";
  children?: ReactNode;
};

/** Bloque para los estados de carga, vacío, error y no encontrado. */
export function Estado({ icono, titulo, texto, nivel = "h2", rol, children }: Props) {
  const Titulo = nivel;
  return (
    <div className={estilos.estado} role={rol}>
      <span className={estilos.icono}>
        <Icono nombre={icono} tamano="grande" />
      </span>
      <Titulo className={estilos.titulo}>{titulo}</Titulo>
      {texto && <p className={estilos.texto}>{texto}</p>}
      {children && <div className={estilos.acciones}>{children}</div>}
    </div>
  );
}
