import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetalleDeCromo } from "@/components/vistas/DetalleDeCromo";
import { obtenerCromo } from "@/lib/api-servidor";
import { ErrorApi } from "@/lib/peticion";
import { metadatosDePagina } from "@/lib/seo";

/** Título y descripción con el nombre y el poder del cromo. */
export async function generateMetadata({
  params,
}: PageProps<"/cromos/[id]">): Promise<Metadata> {
  const { id } = await params;
  let valores: { nombre: string; poder: string };
  try {
    const { nombre, poder } = await obtenerCromo(id);
    valores = { nombre, poder };
  } catch (error) {
    if (error instanceof ErrorApi && error.estado === 404) notFound();
    return {};
  }
  return metadatosDePagina("detalleCromo", valores);
}

export default async function PaginaDeCromo({ params }: PageProps<"/cromos/[id]">) {
  const { id } = await params;
  return <DetalleDeCromo key={id} id={id} />;
}
