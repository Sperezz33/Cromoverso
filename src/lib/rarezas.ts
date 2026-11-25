import { buscarTexto } from "./textos";
import type { Rareza, Textos } from "./tipos";

/** GET /rarezas no cambia con el idioma; el nombre traducido viene en GET /textos. */
export function nombreDeRareza(textos: Textos, rareza: Rareza): string {
  const nombre = buscarTexto(textos, `componentes.cromo.rarezas.${rareza.id}`);
  return typeof nombre === "string" ? nombre : rareza.nombre;
}
