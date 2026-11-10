import type { Metadata } from "next";
import { obtenerIdiomas, obtenerTextos } from "./api";
import { leerPreferencias } from "./preferencias-servidor";
import { traducir, type Valores } from "./textos";

/** Título y descripción de una vista desde textos.paginas.<pagina>.seo. */
export async function metadatosDePagina(
  pagina: string,
  valores?: Valores,
): Promise<Metadata> {
  const [preferencias, idiomas] = await Promise.all([
    leerPreferencias(),
    obtenerIdiomas(),
  ]);
  const { textos } = await obtenerTextos(preferencias.idioma ?? idiomas.predeterminado);
  return {
    title: traducir(textos, `paginas.${pagina}.seo.titulo`, valores),
    description: traducir(textos, `paginas.${pagina}.seo.descripcion`, valores),
  };
}
