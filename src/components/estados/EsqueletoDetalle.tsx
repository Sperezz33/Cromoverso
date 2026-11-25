import { Bloque, Esqueleto } from "./Esqueleto";
import estilos from "./EsqueletoDetalle.module.css";

/** El panel del detalle mientras llega el cromo. */
export function EsqueletoDetalle() {
  return (
    <Esqueleto className={estilos.fondo}>
      <div className={estilos.panel}>
        <Bloque className={estilos.carta} />
        <div className={estilos.datos}>
          <Bloque className={estilos.etiquetas} />
          <Bloque className={estilos.nombre} />
          <Bloque className={estilos.poder} />
          <Bloque className={estilos.atributos} />
        </div>
      </div>
    </Esqueleto>
  );
}
