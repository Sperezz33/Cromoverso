"use client";

import { InsigniaRareza } from "@/components/catalogo/InsigniaRareza";
import { TarjetaCromo } from "@/components/catalogo/TarjetaCromo";
import { TarjetaMundo } from "@/components/catalogo/TarjetaMundo";
import { BotonEnlace } from "@/components/ui/Boton";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { Icono } from "@/components/ui/Icono";
import { usePreferencias } from "@/contexto/Preferencias";
import { useTituloDePagina } from "@/hooks/useTituloDePagina";
import { rutas } from "@/lib/rutas";
import type { Cromo, Mundo, Rareza } from "@/lib/tipos";
import estilos from "./VistaInicio.module.css";

type Props = {
  mundos: Mundo[];
  rarezas: Rareza[];
  /** Cromos holográficos para el abanico de la portada (puede venir vacío). */
  destacados: Cromo[];
};

const ID_MUNDOS = "mundos";

export function VistaInicio({ mundos, rarezas, destacados }: Props) {
  const { t } = usePreferencias();
  useTituloDePagina("inicio");
  const primerMundo = mundos[0];

  return (
    <>
      <section className={estilos.portada} aria-labelledby="titulo-inicio">
        <div className={`contenedor ${estilos.portadaInterior}`}>
          <div className={estilos.mensaje}>
            <h1 id="titulo-inicio" className={estilos.titulo}>
              {t("paginas.inicio.hero.titulo")}
            </h1>
            <p className={`${estilos.subtitulo} ${estilos.soloMovil}`}>
              {t("paginas.inicio.hero.subtituloMovil")}
            </p>
            <div className={estilos.botones}>
              <BotonEnlace href={rutas.registro} variante="acento" icono="usuario">
                {t("paginas.inicio.hero.botones.crearCuentaGratis")}
              </BotonEnlace>
              <BotonEnlace href={`#${ID_MUNDOS}`} variante="secundario" icono="cartas">
                {t("paginas.inicio.hero.botones.explorarMundos")}
              </BotonEnlace>
            </div>
            <p className={`${estilos.nota} ${estilos.soloEscritorio}`}>
              <Icono nombre="destellos" tamano="pequeno" />
              {t("paginas.inicio.hero.subtitulo")}
            </p>
          </div>

          {destacados.length > 0 && (
            <div className={estilos.abanico}>
              <Etiqueta variante="acento" icono="destellos" className={estilos.guardiana}>
                {t("paginas.inicio.hero.etiquetas.guardiana")}
              </Etiqueta>
              {destacados.map((cromo) => (
                <TarjetaCromo
                  key={cromo.id}
                  cromo={cromo}
                  conEnlace={false}
                  className={estilos.carta}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section id={ID_MUNDOS} className={estilos.mundos} aria-labelledby="titulo-mundos">
        <div className="contenedor">
          <div className={estilos.cabecera}>
            <div>
              <h2 id="titulo-mundos" className={estilos.tituloSeccion}>
                {t("paginas.inicio.mundos.titulo")}
              </h2>
              <p className={estilos.subtituloSeccion}>
                {t("paginas.inicio.mundos.subtitulo")}
              </p>
            </div>
            {primerMundo && (
              <BotonEnlace
                href={rutas.mundo(primerMundo.id)}
                variante="secundario"
                tamano="pequeno"
                icono="flechader"
              >
                {t("paginas.inicio.mundos.enlaces.ver", { mundo: primerMundo.nombre })}
              </BotonEnlace>
            )}
          </div>

          <ul
            className={estilos.rarezas}
            aria-label={t("formularios.campos.rareza.label")}
          >
            {rarezas.map((rareza) => (
              <li key={rareza.id}>
                <InsigniaRareza
                  rareza={rareza}
                  extra={t("general.formatos.porcentaje", { valor: rareza.porcentaje })}
                />
              </li>
            ))}
          </ul>

          <ul className={estilos.listaMundos}>
            {mundos.map((mundo, indice) => (
              <li key={mundo.id}>
                <TarjetaMundo mundo={mundo} numero={indice + 1} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
