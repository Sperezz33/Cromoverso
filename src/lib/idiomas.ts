import { obtenerIdiomas } from "./api-servidor";
import { esIdioma } from "./cookies";
import { buscarTexto } from "./textos";
import type { IdIdioma, Idioma, RespuestaIdiomas, Textos } from "./tipos";

/** Idioma que usa GET /textos cuando no se pide otro (contrato, sección 2). */
export const IDIOMA_DE_RESPALDO: IdIdioma = "es";

/** GET /idiomas, o null si falla: el selector puede armarse con los textos. */
export async function obtenerIdiomasSiHay(): Promise<RespuestaIdiomas | null> {
  try {
    return await obtenerIdiomas();
  } catch (error) {
    console.error("GET /idiomas falló; se usan las opciones de textos.idioma.", error);
    return null;
  }
}

/** Opciones del selector desde textos.idioma.opciones cuando GET /idiomas no responde. */
export function idiomasDesdeTextos(textos: Textos): Idioma[] {
  const opciones = buscarTexto(textos, "idioma.opciones");
  if (!opciones || typeof opciones === "string") return [];
  return Object.entries(opciones).flatMap(([codigo, nombre]) =>
    esIdioma(codigo) && typeof nombre === "string" ? [{ codigo, nombre }] : [],
  );
}
