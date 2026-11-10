import type { Metadata } from "next";
import { obtenerTextos } from "./api";
import { traducir, type Valores } from "./textos";
import type { IdIdioma } from "./tipos";

/** Título y descripción de una vista desde textos.paginas.<pagina>.seo. */
export async function metadatosDePagina(
  pagina: string,
  idioma: IdIdioma = "es",
  valores?: Valores,
): Promise<Metadata> {
  const { textos } = await obtenerTextos(idioma);
  return {
    title: traducir(textos, `paginas.${pagina}.seo.titulo`, valores),
    description: traducir(textos, `paginas.${pagina}.seo.descripcion`, valores),
  };
}
