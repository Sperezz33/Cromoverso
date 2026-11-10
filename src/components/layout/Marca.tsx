import Link from "next/link";
import estilos from "./Marca.module.css";

type Props = {
  etiqueta: string;
  inversa?: boolean;
  onClick?: () => void;
};

/** Logo de Cromoverso que lleva al inicio. El texto accesible viene de la API. */
export function Marca({ etiqueta, inversa, onClick }: Props) {
  return (
    <Link href="/" className={estilos.marca} aria-label={etiqueta} onClick={onClick}>
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG del sistema de diseño */}
      <img
        src={inversa ? "/logos/logo-inverso.svg" : "/logos/logo-normal.svg"}
        alt=""
        className={estilos.logo}
      />
    </Link>
  );
}
