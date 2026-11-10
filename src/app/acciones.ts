"use server";

import { obtenerTextos } from "@/lib/api";
import { esIdioma } from "@/lib/cookies";
import type { IdIdioma, Textos } from "@/lib/tipos";

/** Pide a la API los textos de la interfaz en otro idioma. */
export async function cargarTextos(idioma: IdIdioma): Promise<Textos> {
  if (!esIdioma(idioma)) throw new Error("idioma_no_soportado");
  const respuesta = await obtenerTextos(idioma);
  return respuesta.textos;
}
