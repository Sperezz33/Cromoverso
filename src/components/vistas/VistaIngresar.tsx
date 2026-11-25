"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AbanicoCromos } from "@/components/catalogo/AbanicoCromos";
import { FormularioIngreso } from "@/components/formularios/FormularioIngreso";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { usePreferencias } from "@/contexto/Preferencias";
import { useSesion } from "@/contexto/Sesion";
import { useListaCompleta } from "@/hooks/usePeticion";
import { useTituloDePagina } from "@/hooks/useTituloDePagina";
import { rutas } from "@/lib/rutas";
import { rutasApi } from "@/lib/rutas-api";
import type { Cromo } from "@/lib/tipos";
import estilos from "./VistaIngresar.module.css";

const BASE = "paginas.ingresar";

export function VistaIngresar() {
  const { t } = usePreferencias();
  const { usuario } = useSesion();
  const router = useRouter();
  useTituloDePagina("ingresar");
  const legendarios = useListaCompleta<Cromo>(rutasApi.cromos({ rareza: "legendaria" }));

  // Con la sesión iniciada (al ingresar o si ya lo estaba) se vuelve al inicio.
  useEffect(() => {
    if (usuario) router.replace(rutas.inicio);
  }, [usuario, router]);

  return (
    <div className={estilos.vista}>
      <section className={estilos.presentacion} aria-labelledby="titulo-presentacion">
        <AbanicoCromos className={estilos.abanico} cromos={legendarios.datos?.datos} />
        <div className={estilos.mensaje}>
          <Etiqueta variante="marca">
            {t(`${BASE}.presentacion.etiquetas.temporada`)}
          </Etiqueta>
          <p id="titulo-presentacion" className={estilos.lema}>
            {t(`${BASE}.presentacion.titulo`)}
          </p>
          <p className={estilos.texto}>{t(`${BASE}.presentacion.texto`)}</p>
        </div>
      </section>

      <section className={estilos.acceso} aria-labelledby="titulo-ingreso">
        <div className={estilos.columna}>
          <h1 id="titulo-ingreso" className={estilos.titulo}>
            {t(`${BASE}.formulario.titulo`)}
          </h1>
          <p className={estilos.subtitulo}>{t(`${BASE}.formulario.subtitulo`)}</p>
          <FormularioIngreso />
        </div>
      </section>
    </div>
  );
}
