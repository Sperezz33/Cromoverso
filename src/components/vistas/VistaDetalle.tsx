"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { BarraAtributo } from "@/components/catalogo/BarraAtributo";
import { InsigniaRareza } from "@/components/catalogo/InsigniaRareza";
import { numeroDeCromo, TarjetaCromo } from "@/components/catalogo/TarjetaCromo";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { Icono } from "@/components/ui/Icono";
import { usePreferencias } from "@/contexto/Preferencias";
import { useTituloDePagina } from "@/hooks/useTituloDePagina";
import { rutas } from "@/lib/rutas";
import type { Cromo, Rareza } from "@/lib/tipos";
import estilos from "./VistaDetalle.module.css";

type Props = {
  cromo: Cromo;
  rarezas: Rareza[];
  /** Cromos del mismo mundo, en orden, para llegar al anterior y al siguiente. */
  cromosDelMundo: Cromo[];
};

export function VistaDetalle({ cromo, rarezas, cromosDelMundo }: Props) {
  const { t } = usePreferencias();
  useTituloDePagina("detalleCromo", { nombre: cromo.nombre });

  const base = "paginas.detalleCromo";
  const rareza = rarezas.find((opcion) => opcion.id === cromo.rareza);
  const atributos = Object.entries(cromo.atributos);
  const total = atributos.reduce((suma, [, valor]) => suma + valor, 0);

  const lugar = cromosDelMundo.findIndex((otro) => otro.id === cromo.id);
  const anterior = lugar > 0 ? cromosDelMundo[lugar - 1] : undefined;
  const siguiente = lugar >= 0 ? cromosDelMundo[lugar + 1] : undefined;
  const nombreDe = (otro: Cromo) =>
    t("general.formatos.numeroYNombre", {
      numero: numeroDeCromo(otro.numero),
      nombre: otro.nombre,
    });

  const estilo = { "--color-cromo": cromo.ilustracion.colorBase } as CSSProperties;

  return (
    <div className={estilos.fondo} style={estilo}>
      <article className={estilos.panel} aria-labelledby="nombre-cromo">
        <div className={estilos.carta}>
          <TarjetaCromo cromo={cromo} conEnlace={false} tamano="grande" />
        </div>

        <header className={estilos.encabezado}>
          <div className={estilos.etiquetas}>
            {rareza && <InsigniaRareza rareza={rareza} />}
            <Etiqueta variante="marca">{cromo.mundoNombre}</Etiqueta>
            <Etiqueta>{t(`${base}.encabezado.tipos.${cromo.tipo}`)}</Etiqueta>
          </div>
          {cromo.posicion !== null && (
            <p className={estilos.ubicacion}>
              {t(`${base}.encabezado.ubicacion`, {
                id: cromo.id,
                mundo: cromo.mundoNombre,
                posicion: cromo.posicion,
              })}
            </p>
          )}
          <h1 id="nombre-cromo" className={estilos.nombre}>
            {cromo.nombre}
          </h1>
        </header>

        <div className={estilos.contenido}>
          <section className={estilos.poder} aria-labelledby="titulo-poder">
            <span className={estilos.simbolo}>
              <Icono nombre="rayo" />
            </span>
            <div>
              <h2 id="titulo-poder" className={estilos.tituloPoder}>
                {t(`${base}.poder.titulo`)}
              </h2>
              <p className={estilos.textoPoder}>{cromo.poder}</p>
            </div>
          </section>

          <p className={estilos.descripcion}>{cromo.descripcion}</p>

          <section className={estilos.atributos} aria-labelledby="titulo-atributos">
            <div className={estilos.cabeceraAtributos}>
              <h2 id="titulo-atributos" className={estilos.tituloAtributos}>
                {t(`${base}.atributos.titulo`)}
              </h2>
              <p className={estilos.total}>{t(`${base}.atributos.total`, { total })}</p>
            </div>
            <ul className={estilos.barras}>
              {atributos.map(([clave, valor]) => (
                <li key={clave}>
                  <BarraAtributo
                    nombre={t(`${base}.atributos.nombres.${clave}`)}
                    valor={valor}
                  />
                </li>
              ))}
            </ul>
            <p className={estilos.escala}>{t(`${base}.atributos.escala`)}</p>
          </section>

          {(anterior || siguiente) && (
            <div className={estilos.vecinos}>
              {anterior && (
                <Link
                  href={rutas.cromo(anterior.id)}
                  className={estilos.vecino}
                  aria-label={`${t(`${base}.navegacion.anterior`)}: ${nombreDe(anterior)}`}
                >
                  <Icono nombre="chevronizq" tamano="pequeno" />
                  {nombreDe(anterior)}
                </Link>
              )}
              {siguiente && (
                <Link
                  href={rutas.cromo(siguiente.id)}
                  className={`${estilos.vecino} ${estilos.siguiente}`}
                  aria-label={`${t(`${base}.navegacion.siguiente`)}: ${nombreDe(siguiente)}`}
                >
                  {nombreDe(siguiente)}
                  <Icono nombre="chevronder" tamano="pequeno" />
                </Link>
              )}
            </div>
          )}
        </div>

        <Link
          href={rutas.mundo(cromo.mundo)}
          className={estilos.cerrar}
          aria-label={t(`${base}.botones.cerrar`)}
        >
          <Icono nombre="cerrar" />
        </Link>
      </article>
    </div>
  );
}
