import { VistaCuenta } from "@/components/vistas/VistaCuenta";
import { metadatosDePagina } from "@/lib/seo";

export function generateMetadata() {
  return metadatosDePagina("ingresar");
}

export default function Ingresar() {
  return <VistaCuenta pagina="ingresar" etiqueta="temporada" />;
}
