"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { FiltrosMovil } from "@/components/catalogo/FiltrosMovil";
import { InsigniaRareza } from "@/components/catalogo/InsigniaRareza";
import { numeroDeCromo, TarjetaCromo } from "@/components/catalogo/TarjetaCromo";
import { Estado } from "@/components/estados/Estado";
import { BotonEnlace } from "@/components/ui/Boton";
import { Icono } from "@/components/ui/Icono";
import { usePreferencias } from "@/contexto/Preferencias";
import { useTituloDePagina } from "@/hooks/useTituloDePagina";
import { enlaceConFiltros, type Filtros } from "@/lib/filtros";
import { rutas } from "@/lib/rutas";
import {
  TIPOS_DE_CROMO,
  type Cromo,
  type Mundo,
  type MundoConCromos,
  type Rareza,
} from "@/lib/tipos";
import estilos from "./VistaCatalogo.module.css";

type Props = {
  mundo: MundoConCromos;
  mundos: Mundo[];
  rarezas: Rareza[];
  cromos: Cromo[];
  filtros: Filtros;
};

export function VistaCatalogo({ mundo, mundos, rarezas, cromos, filtros }: Props) {
  const { t } = usePreferencias();
  useTituloDePagina("albumMundo", { mundo: mundo.nombre });

  const base = "paginas.albumMundo";
  const numeroMundo = mundos.findIndex((otro) => otro.id === mundo.id) + 1;
  const rarezaDe = (id: string) => rarezas.find((rareza) => rareza.id === id);
  const cantidadPorTipo = (tipo: string) =>
    mundo.cromos.filter((cromo) => cromo.tipo === tipo).length;
  const estiloMundo = { "--color-mundo": mundo.color } as CSSProperties;

  return (
    <>
      <section
        className={estilos.cabecera}
        style={estiloMundo}
        aria-labelledby="titulo-mundo"
      >
        <div className={`contenedor ${estilos.cabeceraInterior}`}>
          <ol className={estilos.migas}>
            <li>
              <Link href={rutas.inicio}>{t(`${base}.migas.inicio`)}</Link>
            </li>
            <li aria-current="page">{mundo.nombre}</li>
          </ol>
          <Link
            href={rutas.inicio}
            className={estilos.volver}
            aria-label={t("general.acciones.volver")}
          >
            <Icono nombre="flechaizq" tamano="grande" />
          </Link>
          <div className={estilos.encabezado}>
            <h1 id="titulo-mundo" className={estilos.titulo}>
              {mundo.nombre}
            </h1>
            <p className={estilos.tema}>{mundo.tema}</p>
            <p className={estilos.rango}>
              {t(`${base}.encabezado.rango`, {
                numero: numeroMundo,
                desde: numeroDeCromo(mundo.numeros.desde),
                hasta: numeroDeCromo(mundo.numeros.hasta),
              })}
            </p>
          </div>
        </div>
      </section>

      <div className={`contenedor ${estilos.cuerpo}`}>
        <aside className={estilos.columna}>
          <section className={estilos.panel} aria-labelledby="panel-mundos">
            <h2 id="panel-mundos" className={estilos.tituloPanel}>
              {t(`${base}.mundos.titulo`)}
            </h2>
            <ul className={estilos.opciones}>
              {mundos.map((otro) => {
                const actual = otro.id === mundo.id;
                return (
                  <li key={otro.id}>
                    <Link
                      href={rutas.mundo(otro.id)}
                      className={estilos.opcion}
                      aria-current={actual ? "page" : undefined}
                      style={{ "--color-mundo": otro.color } as CSSProperties}
                    >
                      <span className={estilos.punto} aria-hidden="true" />
                      <span className={estilos.opcionTexto}>
                        {otro.nombre}
                        {actual && (
                          <span className={estilos.actual}>
                            {t(`${base}.mundos.aria.paginaActual`)}
                          </span>
                        )}
                      </span>
                      <span className={estilos.cantidad}>
                        {t(`${base}.mundos.cromos`, { cantidad: otro.totalCromos })}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className={estilos.panel} aria-labelledby="panel-rareza">
            <h2 id="panel-rareza" className={estilos.tituloPanel}>
              {t(`${base}.filtros.rareza.titulo`)}
            </h2>
            <ul className={estilos.opciones}>
              <li>
                <Link
                  href={enlaceConFiltros(mundo.id, { ...filtros, rareza: undefined })}
                  className={estilos.opcion}
                  aria-current={!filtros.rareza ? "true" : undefined}
                  scroll={false}
                >
                  <span className={estilos.opcionTexto}>
                    {t(`${base}.filtros.rareza.todas`)}
                  </span>
                </Link>
              </li>
              {rarezas.map((rareza) => {
                const activo = filtros.rareza === rareza.id;
                return (
                  <li key={rareza.id}>
                    <Link
                      href={enlaceConFiltros(mundo.id, {
                        ...filtros,
                        rareza: activo ? undefined : rareza.id,
                      })}
                      className={estilos.opcion}
                      aria-current={activo ? "true" : undefined}
                      scroll={false}
                    >
                      <span className={estilos.opcionTexto}>
                        <InsigniaRareza rareza={rareza} />
                      </span>
                      <span className={estilos.cantidad}>
                        {t(`${base}.filtros.cantidad`, {
                          cantidad: mundo.porRareza[rareza.id] ?? 0,
                        })}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className={estilos.panel} aria-labelledby="panel-tipo">
            <h2 id="panel-tipo" className={estilos.tituloPanel}>
              {t(`${base}.filtros.tipo.titulo`)}
            </h2>
            <ul className={estilos.opciones}>
              <li>
                <Link
                  href={enlaceConFiltros(mundo.id, { ...filtros, tipo: undefined })}
                  className={estilos.opcion}
                  aria-current={!filtros.tipo ? "true" : undefined}
                  scroll={false}
                >
                  <span className={estilos.opcionTexto}>
                    {t(`${base}.filtros.tipo.todos`)}
                  </span>
                </Link>
              </li>
              {TIPOS_DE_CROMO.map((tipo) => {
                const activo = filtros.tipo === tipo;
                return (
                  <li key={tipo}>
                    <Link
                      href={enlaceConFiltros(mundo.id, {
                        ...filtros,
                        tipo: activo ? undefined : tipo,
                      })}
                      className={estilos.opcion}
                      aria-current={activo ? "true" : undefined}
                      scroll={false}
                    >
                      <span className={estilos.opcionTexto}>
                        {t(`${base}.filtros.tipo.opciones.${tipo}`)}
                      </span>
                      <span className={estilos.cantidad}>
                        {t(`${base}.filtros.cantidad`, {
                          cantidad: cantidadPorTipo(tipo),
                        })}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </aside>

        <section className={estilos.album} aria-labelledby="titulo-cromos">
          <div className={estilos.barra}>
            <h2 id="titulo-cromos" className={estilos.resultados} aria-live="polite">
              {t(`${base}.filtros.cantidad`, { cantidad: cromos.length })}
            </h2>
            <div className={estilos.soloMovil}>
              <FiltrosMovil idMundo={mundo.id} rarezas={rarezas} filtros={filtros} />
            </div>
            <span className={estilos.orden}>
              {t(`${base}.orden.etiqueta`, { orden: t(`${base}.orden.opciones.numero`) })}
            </span>
          </div>

          {cromos.length === 0 ? (
            <Estado
              icono="filtro"
              titulo={t(`${base}.vacio.titulo`)}
              texto={t(`${base}.vacio.texto`)}
            >
              <BotonEnlace href={rutas.mundo(mundo.id)} variante="secundario">
                {t(`${base}.vacio.botones.limpiar`)}
              </BotonEnlace>
            </Estado>
          ) : (
            <ul className={estilos.rejilla}>
              {cromos.map((cromo) => (
                <li key={cromo.id}>
                  <TarjetaCromo cromo={cromo} rareza={rarezaDe(cromo.rareza)} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
