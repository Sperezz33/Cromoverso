"use client";

import { SelectorIdioma } from "@/components/ui/SelectorIdioma";
import { usePreferencias } from "@/contexto/Preferencias";
import estilos from "./Idioma.module.css";

type Props = { tamano?: "normal" | "grande" };

/** Selector ES | EN conectado al idioma de la interfaz. */
export function Idioma({ tamano }: Props) {
  const { idioma, idiomas, t, cambiarIdioma, cambiandoIdioma, errorIdioma } =
    usePreferencias();

  return (
    <div className={estilos.idioma} aria-busy={cambiandoIdioma}>
      <SelectorIdioma
        opciones={idiomas.map((opcion) => ({
          codigo: opcion.codigo,
          corto: t(`idioma.codigos.${opcion.codigo}`),
          nombre: opcion.nombre,
        }))}
        actual={idioma}
        etiqueta={t("navbar.aria.idioma")}
        onCambiar={(nuevo) => {
          if (!cambiandoIdioma) cambiarIdioma(nuevo);
        }}
        tamano={tamano}
      />
      {errorIdioma && (
        <p role="alert" className={estilos.error}>
          {t("errores.generico")}
        </p>
      )}
    </div>
  );
}
