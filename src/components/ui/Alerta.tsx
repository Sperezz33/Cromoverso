import { Icono } from "./Icono";
import estilos from "./Alerta.module.css";

type Props = { titulo: string; texto?: string };

/** Aviso de error de un formulario. Los lectores de pantalla lo anuncian al aparecer. */
export function Alerta({ titulo, texto }: Props) {
  return (
    <div className={estilos.alerta}>
      <Icono nombre="alerta" className={estilos.icono} />
      <div>
        <p className={estilos.titulo}>{titulo}</p>
        {texto && <p className={estilos.texto}>{texto}</p>}
      </div>
    </div>
  );
}
