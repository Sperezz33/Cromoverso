import type { ReactNode } from "react";
import { Icono } from "./Icono";
import estilos from "./Alerta.module.css";

type Props = { titulo: string; texto?: ReactNode; icono?: string };

/** Aviso de error de un formulario. Va dentro de un role="alert" para que se anuncie. */
export function Alerta({ titulo, texto, icono = "alerta" }: Props) {
  return (
    <div className={estilos.alerta}>
      <Icono nombre={icono} className={estilos.icono} />
      <div>
        <p className={estilos.titulo}>{titulo}</p>
        {texto && <p className={estilos.texto}>{texto}</p>}
      </div>
    </div>
  );
}
