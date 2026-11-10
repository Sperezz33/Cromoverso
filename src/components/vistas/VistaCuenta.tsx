"use client";

import { Etiqueta } from "@/components/ui/Etiqueta";
import { usePreferencias } from "@/contexto/Preferencias";
import { useTituloDePagina } from "@/hooks/useTituloDePagina";
import estilos from "./VistaCuenta.module.css";

type Props = {
  /** Clave de la página en textos.paginas: "ingresar" o "registro". */
  pagina: "ingresar" | "registro";
  etiqueta: string;
};

/**
 * Presentación de Iniciar sesión y Crear cuenta. Los formularios se construyen en
 * los siguientes sprints; en este sprint la navegación ya llega a estas rutas.
 */
export function VistaCuenta({ pagina, etiqueta }: Props) {
  const { t } = usePreferencias();
  const base = `paginas.${pagina}`;
  useTituloDePagina(pagina);

  return (
    <div className={estilos.vista}>
      <section className={estilos.presentacion}>
        <div className="contenedor">
          <Etiqueta variante="acento">
            {t(`${base}.presentacion.etiquetas.${etiqueta}`)}
          </Etiqueta>
          <h1 className={estilos.titulo}>{t(`${base}.presentacion.titulo`)}</h1>
          <p className={estilos.texto}>{t(`${base}.presentacion.texto`)}</p>
        </div>
      </section>
      <section className="contenedor" aria-labelledby={`${pagina}-formulario`}>
        <div className={estilos.formulario}>
          <h2 id={`${pagina}-formulario`} className={estilos.subtitulo}>
            {t(`${base}.formulario.titulo`)}
          </h2>
          <p className={estilos.texto}>{t(`${base}.formulario.subtitulo`)}</p>
        </div>
      </section>
    </div>
  );
}
