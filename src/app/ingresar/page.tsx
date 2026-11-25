import { VistaIngresar } from "@/components/vistas/VistaIngresar";
import { metadatosDePagina } from "@/lib/seo";

export function generateMetadata() {
  return metadatosDePagina("ingresar");
}

export default function Ingresar() {
  return <VistaIngresar />;
}
