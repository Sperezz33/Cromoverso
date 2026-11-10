"use client";

import { Estado } from "@/components/estados/Estado";
import { BotonEnlace } from "@/components/ui/Boton";
import { usePreferencias } from "@/contexto/Preferencias";
import { rutas } from "@/lib/rutas";

export default function NoEncontrado() {
  const { t } = usePreferencias();
  return (
    <div className="contenedor">
      <Estado
        icono="buscar"
        nivel="h1"
        titulo={t("estados.noEncontrado.titulo")}
        texto={t("estados.noEncontrado.texto")}
      >
        <BotonEnlace href={rutas.inicio} icono="inicio">
          {t("estados.noEncontrado.botones.irAlInicio")}
        </BotonEnlace>
      </Estado>
    </div>
  );
}
