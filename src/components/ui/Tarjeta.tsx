import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import estilos from "./Tarjeta.module.css";

type Props = {
  children: ReactNode;
  href?: string;
  etiquetaAccesible?: string;
  className?: string;
  style?: CSSProperties;
};

/** Superficie con borde y sombra del diseño. Con `href` toda la tarjeta es un enlace. */
export function Tarjeta({ children, href, etiquetaAccesible, className, style }: Props) {
  const clases = [estilos.tarjeta, href ? estilos.interactiva : "", className]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={clases} style={style} aria-label={etiquetaAccesible}>
        {children}
      </Link>
    );
  }

  return (
    <div className={clases} style={style}>
      {children}
    </div>
  );
}
