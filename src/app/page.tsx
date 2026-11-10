import { VistaInicio } from "@/components/vistas/VistaInicio";
import { obtenerCromos, obtenerMundos, obtenerRarezas } from "@/lib/api";
import { metadatosDePagina } from "@/lib/seo";
import type { Cromo } from "@/lib/tipos";

export function generateMetadata() {
  return metadatosDePagina("inicio");
}

/** Cromos holográficos para la portada. Si fallan, la portada se muestra sin ellos. */
async function cromosDestacados(): Promise<Cromo[]> {
  try {
    const { datos } = await obtenerCromos({ rareza: "legendaria", porPagina: 20 });
    return datos.filter((cromo) => cromo.holografico).slice(0, 3);
  } catch {
    return [];
  }
}

export default async function Inicio() {
  const [mundos, rarezas, destacados] = await Promise.all([
    obtenerMundos(),
    obtenerRarezas(),
    cromosDestacados(),
  ]);

  return (
    <VistaInicio mundos={mundos.datos} rarezas={rarezas.datos} destacados={destacados} />
  );
}
