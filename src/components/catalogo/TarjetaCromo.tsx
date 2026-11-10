"use client";

import Link from "next/link";
import { usePreferencias } from "@/contexto/Preferencias";
import { rutas } from "@/lib/rutas";
import type { Cromo, Rareza } from "@/lib/tipos";
import { IlustracionCromo } from "./IlustracionCromo";
import { InsigniaRareza } from "./InsigniaRareza";
import estilos from "./TarjetaCromo.module.css";

type Props = {
  cromo: Cromo;
  rareza?: Rareza;
  /** Sin enlace en el abanico decorativo del inicio. */
  conEnlace?: boolean;
  className?: string;
};

export function numeroDeCromo(numero: number) {
  return String(numero).padStart(3, "0");
}

/** Carta de un cromo. Enlaza a su detalle (vista 3, sprint 2). */
export function TarjetaCromo({ cromo, rareza, conEnlace = true, className }: Props) {
  const { t } = usePreferencias();
  const tipo = t(`paginas.albumMundo.filtros.tipo.opciones.${cromo.tipo}`);
  const descripcion = t("paginas.albumMundo.tarjeta.tipo", {
    mundo: cromo.mundoNombre,
    tipo,
  });

  const contenido = (
    <>
      <span className={estilos.numero}>{numeroDeCromo(cromo.numero)}</span>
      <IlustracionCromo ilustracion={cromo.ilustracion} holografico={cromo.holografico} />
      <span className={estilos.nombre}>{cromo.nombre}</span>
      <span className={estilos.tipo}>{descripcion}</span>
      {rareza && <InsigniaRareza rareza={rareza} className={estilos.rareza} />}
    </>
  );

  const clases = [
    estilos.tarjeta,
    cromo.holografico ? estilos.holografica : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (!conEnlace) {
    return <div className={clases}>{contenido}</div>;
  }

  return (
    <Link href={rutas.cromo(cromo.id)} className={`${clases} ${estilos.enlace}`}>
      {contenido}
    </Link>
  );
}
