"use client";

import type { CSSProperties } from "react";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { Icono } from "@/components/ui/Icono";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { usePreferencias } from "@/contexto/Preferencias";
import { rutas } from "@/lib/rutas";
import type { Mundo } from "@/lib/tipos";
import estilos from "./TarjetaMundo.module.css";

type Props = { mundo: Mundo; numero: number };

/** Un mundo del álbum con su total de cromos. Lleva a su catálogo. */
export function TarjetaMundo({ mundo, numero }: Props) {
  const { t } = usePreferencias();
  const estilo = {
    "--color-mundo": mundo.color,
    "--fondo-mundo": `var(--mundo-${mundo.id}-suave, var(--fondo-superficie))`,
  } as CSSProperties;

  return (
    <Tarjeta href={rutas.mundo(mundo.id)} className={estilos.tarjeta} style={estilo}>
      <span className={estilos.cabecera}>
        <span className={estilos.insignia}>
          <Icono nombre={mundo.figura} />
        </span>
        <Etiqueta variante="acento">
          {t("paginas.inicio.mundos.etiquetas.mundo", { numero })}
        </Etiqueta>
      </span>
      <span className={estilos.nombre}>{mundo.nombre}</span>
      <span className={estilos.total}>
        {t("paginas.inicio.mundos.etiquetas.cromos", { cantidad: mundo.totalCromos })}
      </span>
    </Tarjeta>
  );
}
