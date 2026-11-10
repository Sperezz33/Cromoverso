import { metadatosDePagina } from "@/lib/seo";

export function generateMetadata() {
  return metadatosDePagina("inicio");
}

export default function Inicio() {
  return <div className="contenedor" />;
}
