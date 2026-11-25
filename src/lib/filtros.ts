import { rutas } from "./rutas";
import { buscarTexto } from "./textos";
import type { Rareza, Textos } from "./tipos";

export type Filtros = { rareza?: string; tipo?: string };

/** Los tipos de cromo salen de las opciones del filtro que entrega GET /textos. */
export function tiposDeCromo(textos: Textos): string[] {
  const opciones = buscarTexto(textos, "paginas.albumMundo.filtros.tipo.opciones");
  return opciones && typeof opciones !== "string" ? Object.keys(opciones) : [];
}

/**
 * Lee ?rareza=&tipo= de la URL. Un valor que no existe se ignora, así la API
 * no responde 422 y la vista muestra todos los cromos.
 */
export function leerFiltros(
  parametros: Pick<URLSearchParams, "get">,
  rarezas: Rareza[],
  tipos: string[],
): Filtros {
  const rareza = parametros.get("rareza");
  const tipo = parametros.get("tipo");
  return {
    rareza: rarezas.find((opcion) => opcion.id === rareza)?.id,
    tipo: tipos.find((opcion) => opcion === tipo),
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
