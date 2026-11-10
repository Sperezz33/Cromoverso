import { VistaCuenta } from "@/components/vistas/VistaCuenta";
import { metadatosDePagina } from "@/lib/seo";

export function generateMetadata() {
  return metadatosDePagina("registro");
}

export default function Registro() {
  return <VistaCuenta pagina="registro" etiqueta="bienvenida" />;
}
