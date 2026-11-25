import { VistaInicio } from "@/components/vistas/VistaInicio";
import { obtenerCromos, obtenerMundos, obtenerRarezas } from "@/lib/api";
import { metadatosDePagina } from "@/lib/seo";
import type { Cromo } from "@/lib/tipos";

export function generateMetadata() {
  return metadatosDePagina("inicio");
}

/** Cromos legendarios de todos los mundos. Si fallan, el inicio se muestra sin ellos. */
async function cromosLegendarios(): Promise<{ cromos: Cromo[]; total: number }> {
  try {
    // 100 es el máximo por página de GET /cromos.
    const { datos, paginacion } = await obtenerCromos({
      rareza: "legendaria",
      porPagina: 100,
    });
    return { cromos: datos, total: paginacion.total };
  } catch {
    return { cromos: [], total: 0 };
  }
}

export default async function Inicio() {
  const [mundos, rarezas, legendarios] = await Promise.all([
    obtenerMundos(),
    obtenerRarezas(),
    cromosLegendarios(),
  ]);

  // El abanico de la portada usa tres de los legendarios holográficos.
  const destacados = legendarios.cromos.filter((cromo) => cromo.holografico).slice(0, 3);

  return (
    <VistaInicio
      mundos={mundos.datos}
      rarezas={rarezas.datos}
      destacados={destacados}
      legendarios={legendarios.cromos}
      totalLegendarios={legendarios.total}
    />
  );
}
