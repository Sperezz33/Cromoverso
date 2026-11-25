"use client";

import { AbanicoCromos } from "@/components/catalogo/AbanicoCromos";
import { InsigniaRareza } from "@/components/catalogo/InsigniaRareza";
import { TarjetaCromo } from "@/components/catalogo/TarjetaCromo";
import { TarjetaMundo } from "@/components/catalogo/TarjetaMundo";
import { EstadoPeticiones } from "@/components/estados/EstadoPeticiones";
import { BotonEnlace } from "@/components/ui/Boton";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { Icono } from "@/components/ui/Icono";
import { usePreferencias } from "@/contexto/Preferencias";
import { useSesion } from "@/contexto/Sesion";
import { useListaCompleta, usePeticion } from "@/hooks/usePeticion";
import { useTituloDePagina } from "@/hooks/useTituloDePagina";
import { rutas } from "@/lib/rutas";
import { rutasApi } from "@/lib/rutas-api";
import type { Cromo, Lista, Mundo, Rareza } from "@/lib/tipos";
import estilos from "./VistaInicio.module.css";

const ID_MUNDOS = "mundos";

/** Los mundos, las rarezas y los cromos se piden a la API desde el navegador. */
export function VistaInicio() {
  const { t } = usePreferencias();
  const { usuario, cargando } = useSesion();
  const esVisitante = !usuario && !cargando;
  useTituloDePagina("inicio");

  const mundos = usePeticion<Lista<Mundo>>(rutasApi.mundos);
  const rarezas = usePeticion<Lista<Rareza>>(rutasApi.rarezas);
  const legendarios = useListaCompleta<Cromo>(rutasApi.cromos({ rareza: "legendaria" }));

  const primerMundo = mundos.datos?.datos[0];
  const rarezaDe = (id: string) =>
    rarezas.datos?.datos.find((rareza) => rareza.id === id);

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
              {esVisitante && (
                <BotonEnlace href={rutas.registro} variante="acento" icono="usuario">
                  {t("paginas.inicio.hero.botones.crearCuentaGratis")}
                </BotonEnlace>
              )}
              <BotonEnlace href={`#${ID_MUNDOS}`} variante="secundario" icono="cartas">
                {t("paginas.inicio.hero.botones.explorarMundos")}
              </BotonEnlace>
            </div>
            {esVisitante && (
              <p className={`${estilos.nota} ${estilos.soloEscritorio}`}>
                <Icono nombre="destellos" tamano="pequeno" />
                {t("paginas.inicio.hero.subtitulo")}
              </p>
            )}
          </div>

          <AbanicoCromos
            className={estilos.abanico}
            cromos={legendarios.datos?.datos}
            etiqueta={
              <Etiqueta variante="acento" icono="destellos" className={estilos.guardiana}>
                {t("paginas.inicio.hero.etiquetas.guardiana")}
              </Etiqueta>
            }
          />
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

          {mundos.datos && rarezas.datos ? (
            <>
              <ul
                className={estilos.rarezas}
                aria-label={t("formularios.campos.rareza.label")}
              >
                {rarezas.datos.datos.map((rareza) => (
                  <li key={rareza.id}>
                    <InsigniaRareza
                      rareza={rareza}
                      extra={t("general.formatos.porcentaje", {
                        valor: rareza.porcentaje,
                      })}
                    />
                  </li>
                ))}
              </ul>

              <ul className={estilos.listaMundos}>
                {mundos.datos.datos.map((mundo, indice) => (
                  <li key={mundo.id}>
                    <TarjetaMundo mundo={mundo} numero={indice + 1} />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <EstadoPeticiones peticiones={[mundos, rarezas]} />
          )}
        </div>
      </section>

      <section
        className={estilos.legendarios}
        aria-labelledby={legendarios.datos && "titulo-legendarios"}
      >
        <div className="contenedor">
          {legendarios.datos ? (
            <>
              <h2 id="titulo-legendarios" className={estilos.tituloSeccion}>
                {t("paginas.ranking.tabla.etiquetas.legendarias", {
                  cantidad: legendarios.datos.paginacion.total,
                })}
              </h2>
              <ul className={estilos.listaLegendarios}>
                {legendarios.datos.datos.map((cromo) => (
                  <li key={cromo.id}>
                    <TarjetaCromo
                      cromo={cromo}
                      rareza={rarezaDe(cromo.rareza)}
                      tamano="mediano"
                    />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <EstadoPeticiones peticiones={[legendarios]} />
          )}
        </div>
      </section>
    </>
  );
}
