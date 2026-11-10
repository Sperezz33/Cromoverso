import { notFound } from "next/navigation";
import { VistaCatalogo } from "@/components/vistas/VistaCatalogo";
import {
  ErrorApi,
  obtenerCromos,
  obtenerMundo,
  obtenerMundos,
  obtenerRarezas,
} from "@/lib/api";
import { leerFiltros } from "@/lib/filtros";
import { metadatosDePagina } from "@/lib/seo";

async function mundoONoEncontrado(id: string) {
  try {
    return await obtenerMundo(id);
  } catch (error) {
    if (error instanceof ErrorApi && error.estado === 404) notFound();
    throw error;
  }
}

export async function generateMetadata({ params }: PageProps<"/mundos/[id]">) {
  const { id } = await params;
  const mundo = await mundoONoEncontrado(id);
  return metadatosDePagina("albumMundo", { mundo: mundo.nombre });
}

export default async function CatalogoDeMundo({
  params,
  searchParams,
}: PageProps<"/mundos/[id]">) {
  const { id } = await params;
  const [mundo, mundos, rarezas] = await Promise.all([
    mundoONoEncontrado(id),
    obtenerMundos(),
    obtenerRarezas(),
  ]);

  const filtros = leerFiltros(await searchParams, rarezas.datos);
  const hayFiltros = Boolean(filtros.rareza || filtros.tipo);

  // Sin filtros bastan los 20 cromos de GET /mundos/:id; con filtros se piden a GET /cromos.
  const cromos = hayFiltros
    ? (await obtenerCromos({ mundo: mundo.id, ...filtros, porPagina: 20 })).datos
    : mundo.cromos;

  return (
    <VistaCatalogo
      mundo={mundo}
      mundos={mundos.datos}
      rarezas={rarezas.datos}
      cromos={cromos}
      filtros={filtros}
    />
  );
}
