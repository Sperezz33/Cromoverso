import { VistaInicio } from "@/components/vistas/VistaInicio";
import { metadatosDePagina } from "@/lib/seo";

export function generateMetadata() {
  return metadatosDePagina("inicio");
}

export default function Inicio() {
  return <VistaInicio />;
}
