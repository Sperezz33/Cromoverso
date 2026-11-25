import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogoDeMundo } from "@/components/vistas/CatalogoDeMundo";
import { obtenerMundo } from "@/lib/api-servidor";
import { ErrorApi } from "@/lib/peticion";
import { metadatosDePagina } from "@/lib/seo";

/** El nombre del mundo para el título. Los datos de la vista los pide el navegador. */
export async function generateMetadata({
  params,
}: PageProps<"/mundos/[id]">): Promise<Metadata> {
  const { id } = await params;
  let nombre: string;
  try {
    nombre = (await obtenerMundo(id)).nombre;
  } catch (error) {
    if (error instanceof ErrorApi && error.estado === 404) notFound();
    return {};
  }
  return metadatosDePagina("albumMundo", { mundo: nombre });
}

export default async function PaginaDeMundo({ params }: PageProps<"/mundos/[id]">) {
  const { id } = await params;
  return <CatalogoDeMundo key={id} id={id} />;
}
