import { VistaInicio } from "@/components/vistas/VistaInicio";
import { obtenerCromos, obtenerMundos, obtenerRarezas } from "@/lib/api";
import { metadatosDePagina } from "@/lib/seo";
import type { Cromo } from "@/lib/tipos";

export function generateMetadata() {
  return metadatosDePagina("inicio");
}

/** Cromos legendarios de los seis mundos. Si fallan, el inicio se muestra sin ellos. */
async function cromosLegendarios(): Promise<Cromo[]> {
  try {
    const { datos } = await obtenerCromos({ rareza: "legendaria", porPagina: 50 });
    return datos;
  } catch {
    return [];
  }
}

export default async function Inicio() {
  const [mundos, rarezas, legendarios] = await Promise.all([
    obtenerMundos(),
    obtenerRarezas(),
    cromosLegendarios(),
  ]);

  // El abanico de la portada usa tres de los legendarios holográficos.
  const destacados = legendarios.filter((cromo) => cromo.holografico).slice(0, 3);

  return (
    <VistaInicio
      mundos={mundos.datos}
      rarezas={rarezas.datos}
      destacados={destacados}
      legendarios={legendarios}
    />
  );
}
