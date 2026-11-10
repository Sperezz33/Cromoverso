"use client";

import { useId } from "react";
import { Boton } from "./Boton";
import { Icono } from "./Icono";
import estilos from "./AvisoCookies.module.css";

type Props = {
  titulo: string;
  texto: string;
  aceptar: string;
  rechazar: string;
  onAceptar: () => void;
  onRechazar: () => void;
  deshabilitado?: boolean;
};

/**
 * Aviso de cookies de la primera visita. Aceptar y Rechazar usan la misma variante
 * y el mismo ancho para que ninguna opción tenga más peso visual que la otra.
 */
export function AvisoCookies({
  titulo,
  texto,
  aceptar,
  rechazar,
  onAceptar,
  onRechazar,
  deshabilitado,
}: Props) {
  const idTitulo = useId();
  const idTexto = useId();

  return (
    <section
      className={estilos.aviso}
      aria-labelledby={idTitulo}
      aria-describedby={idTexto}
    >
      <span className={estilos.simbolo}>
        <Icono nombre="galleta" />
      </span>
      <div className={estilos.mensaje}>
        <h2 id={idTitulo} className={estilos.titulo}>
          {titulo}
        </h2>
        <p id={idTexto} className={estilos.texto}>
          {texto}
        </p>
      </div>
      <div className={estilos.acciones}>
        <Boton variante="secundario" onClick={onRechazar} disabled={deshabilitado}>
          {rechazar}
        </Boton>
        <Boton variante="secundario" onClick={onAceptar} disabled={deshabilitado}>
          {aceptar}
        </Boton>
      </div>
    </section>
  );
}
