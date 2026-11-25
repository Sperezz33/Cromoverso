"use client";

import { Estado } from "@/components/estados/Estado";
import { BotonEnlace } from "@/components/ui/Boton";
import { usePreferencias } from "@/contexto/Preferencias";
import { rutas } from "@/lib/rutas";

export default function CromoNoEncontrado() {
  const { t } = usePreferencias();
  const base = "paginas.detalleCromo.noEncontrado";
  return (
    <div className="contenedor">
      <Estado
        icono="buscar"
        nivel="h1"
        titulo={t(`${base}.titulo`)}
        texto={t(`${base}.texto`)}
      >
        <BotonEnlace href={rutas.mundos} icono="mundo">
          {t(`${base}.botones.volver`)}
        </BotonEnlace>
      </Estado>
    </div>
  );
}
