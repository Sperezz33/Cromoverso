"use client";

import Link from "next/link";
import { BotonEnlace } from "@/components/ui/Boton";
import { Icono } from "@/components/ui/Icono";
import { usePreferencias } from "@/contexto/Preferencias";
import { enlaceConFiltros, type Filtros } from "@/lib/filtros";
import { nombreDeRareza } from "@/lib/rarezas";
import { rutas } from "@/lib/rutas";
import type { Rareza } from "@/lib/tipos";
import estilos from "./FiltrosActivos.module.css";

type Props = {
  idMundo: string;
  rarezas: Rareza[];
  filtros: Filtros;
  /** Al quitar un filtro su chip desaparece: aquí se lleva el foco a otro lugar. */
  onQuitar: () => void;
};

/** Un chip con «×» por cada filtro activo y «Quitar filtros». Todo cambia en la URL. */
export function FiltrosActivos({ idMundo, rarezas, filtros, onQuitar }: Props) {
  const { t, textos } = usePreferencias();
  const base = "paginas.albumMundo.filtros";
  const rareza = rarezas.find((opcion) => opcion.id === filtros.rareza);

  const chips: { clave: keyof Filtros; texto: string }[] = [];
  if (rareza) {
    const nombre = nombreDeRareza(textos, rareza);
    chips.push({ clave: "rareza", texto: t(`${base}.rareza.valor`, { rareza: nombre }) });
  }
  if (filtros.tipo) {
    const nombre = t(`${base}.tipo.opciones.${filtros.tipo}`);
    chips.push({ clave: "tipo", texto: t(`${base}.tipo.valor`, { tipo: nombre }) });
  }
  if (chips.length === 0) return null;

  const quitar = t("general.acciones.quitarFiltros");

  return (
    <div className={estilos.activos}>
      <ul className={estilos.chips}>
        {chips.map(({ clave, texto }) => (
          <li key={clave}>
            <Link
              href={enlaceConFiltros(idMundo, { ...filtros, [clave]: undefined })}
              className={estilos.chip}
              aria-label={`${quitar}: ${texto}`}
              scroll={false}
              onClick={onQuitar}
            >
              {texto}
              <Icono nombre="cerrar" tamano="pequeno" />
            </Link>
          </li>
        ))}
      </ul>
      <BotonEnlace
        href={rutas.mundo(idMundo)}
        variante="secundario"
        tamano="pequeno"
        scroll={false}
        onClick={onQuitar}
      >
        {quitar}
      </BotonEnlace>
    </div>
  );
}
