import type { Metadata } from "next";
import { obtenerTextos } from "./api";
import { IDIOMA_DE_RESPALDO, obtenerIdiomasSiHay } from "./idiomas";
import { leerPreferencias } from "./preferencias-servidor";
import { traducir, type Valores } from "./textos";

/**
 * Título y descripción de una vista desde textos.paginas.<pagina>.seo.
 * Si la API no responde, la vista se muestra igual sin estos metadatos.
 */
export async function metadatosDePagina(
  pagina: string,
  valores?: Valores,
): Promise<Metadata> {
  try {
    const [preferencias, idiomas] = await Promise.all([
      leerPreferencias(),
      obtenerIdiomasSiHay(),
    ]);
    const idioma = preferencias.idioma ?? idiomas?.predeterminado ?? IDIOMA_DE_RESPALDO;
    const { textos } = await obtenerTextos(idioma);
    return {
      title: traducir(textos, `paginas.${pagina}.seo.titulo`, valores),
      description: traducir(textos, `paginas.${pagina}.seo.descripcion`, valores),
    };
  } catch {
    return {};
  }
}
