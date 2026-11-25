import { VistaRecuperar } from "@/components/vistas/VistaRecuperar";
import { metadatosDePagina } from "@/lib/seo";

export function generateMetadata() {
  return metadatosDePagina("recuperarClave");
}

export default function Recuperar() {
  return <VistaRecuperar />;
}
