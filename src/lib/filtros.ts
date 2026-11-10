import { rutas } from "./rutas";
import { TIPOS_DE_CROMO, type Rareza, type TipoCromo } from "./tipos";

export type Filtros = { rareza?: string; tipo?: TipoCromo };

type Parametros = Record<string, string | string[] | undefined>;

function primero(valor: string | string[] | undefined) {
  return Array.isArray(valor) ? valor[0] : valor;
}

/**
 * Lee ?rareza=&tipo= de la URL. Un valor que no existe se ignora, así la API
 * no responde 422 y la vista muestra todos los cromos.
 */
export function leerFiltros(parametros: Parametros, rarezas: Rareza[]): Filtros {
  const rareza = primero(parametros.rareza);
  const tipo = primero(parametros.tipo);
  return {
    rareza: rarezas.some((opcion) => opcion.id === rareza) ? rareza : undefined,
    tipo: TIPOS_DE_CROMO.find((opcion) => opcion === tipo),
  };
}

/** Enlace al catálogo de un mundo con los filtros dados (los vacíos no van en la URL). */
export function enlaceConFiltros(idMundo: string, filtros: Filtros) {
  const parametros = new URLSearchParams();
  if (filtros.rareza) parametros.set("rareza", filtros.rareza);
  if (filtros.tipo) parametros.set("tipo", filtros.tipo);
  const consulta = parametros.toString();
  return consulta ? `${rutas.mundo(idMundo)}?${consulta}` : rutas.mundo(idMundo);
}
