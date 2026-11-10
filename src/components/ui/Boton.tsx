import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icono } from "./Icono";
import estilos from "./Boton.module.css";

type Variante = "primario" | "secundario" | "acento" | "inverso";
type Tamano = "normal" | "pequeno";

type Apariencia = {
  variante?: Variante;
  tamano?: Tamano;
  anchoCompleto?: boolean;
  className?: string;
};

type Comunes = Apariencia & { icono?: string; children: ReactNode };

type PropsBoton = Comunes &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

type PropsEnlace = Comunes & {
  href: string;
  deshabilitado?: boolean;
  onClick?: () => void;
};

function clases({
  variante = "primario",
  tamano = "normal",
  anchoCompleto,
  className,
}: Apariencia) {
  return [
    estilos.boton,
    estilos[variante],
    estilos[tamano],
    anchoCompleto ? estilos.anchoCompleto : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

function Contenido({
  icono,
  tamano,
  children,
}: Pick<Comunes, "icono" | "tamano" | "children">) {
  return (
    <>
      {icono && (
        <Icono nombre={icono} tamano={tamano === "pequeno" ? "pequeno" : "normal"} />
      )}
      <span>{children}</span>
    </>
  );
}

/** Botón del sistema de diseño. */
export function Boton({
  variante,
  tamano,
  anchoCompleto,
  className,
  icono,
  children,
  type = "button",
  ...resto
}: PropsBoton) {
  return (
    <button
      className={clases({ variante, tamano, anchoCompleto, className })}
      type={type}
      {...resto}
    >
      <Contenido icono={icono} tamano={tamano}>
        {children}
      </Contenido>
    </button>
  );
}

/** Enlace con el aspecto del botón. Deshabilitado deja de ser navegable. */
export function BotonEnlace({
  href,
  deshabilitado,
  onClick,
  variante,
  tamano,
  anchoCompleto,
  className,
  icono,
  children,
}: PropsEnlace) {
  const clase = clases({ variante, tamano, anchoCompleto, className });
  const contenido = (
    <Contenido icono={icono} tamano={tamano}>
      {children}
    </Contenido>
  );

  if (deshabilitado) {
    return (
      <a className={clase} aria-disabled="true" role="link">
        {contenido}
      </a>
    );
  }

  return (
    <Link className={clase} href={href} onClick={onClick}>
      {contenido}
    </Link>
  );
}
