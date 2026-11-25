import { Bloque, Esqueleto } from "./Esqueleto";
import estilos from "./EsqueletoCatalogo.module.css";

/** Cartas de muestra: dos filas de la rejilla de escritorio. */
const CARTAS = Array.from({ length: 10 }, (_, indice) => indice);

/** Solo las cartas: mientras se aplican los filtros. */
export function EsqueletoCartas() {
  return (
    <Esqueleto>
      <div className={estilos.rejilla}>
        {CARTAS.map((carta) => (
          <Bloque key={carta} className={estilos.carta} />
        ))}
      </div>
    </Esqueleto>
  );
}

/** Todo el catálogo: cabecera del mundo, filtros y cartas. */
export function EsqueletoCatalogo() {
  return (
    <Esqueleto>
      <div className={estilos.cabecera}>
        <div className="contenedor">
          <Bloque className={estilos.titulo} />
        </div>
      </div>
      <div className={`contenedor ${estilos.cuerpo}`}>
        <div className={estilos.columna}>
          <Bloque className={estilos.panel} />
          <Bloque className={estilos.panel} />
        </div>
        <div className={estilos.rejilla}>
          {CARTAS.map((carta) => (
            <Bloque key={carta} className={estilos.carta} />
          ))}
        </div>
      </div>
    </Esqueleto>
  );
}
