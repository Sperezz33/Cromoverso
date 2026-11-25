"use client";

import { Estado } from "@/components/estados/Estado";
import { BotonEnlace } from "@/components/ui/Boton";
import { usePreferencias } from "@/contexto/Preferencias";
import { useTituloDePagina } from "@/hooks/useTituloDePagina";
import { rutas } from "@/lib/rutas";

/** Presentación de "Restablece tu contraseña". El formulario es del sprint 3. */
export function VistaRecuperar() {
  const { t } = usePreferencias();
  useTituloDePagina("recuperarClave");
  const base = "paginas.recuperarClave.solicitud";
  return (
    <div className="contenedor">
      <Estado
        icono="candado"
        nivel="h1"
        titulo={t(`${base}.titulo`)}
        texto={t(`${base}.texto`)}
      >
        <BotonEnlace href={rutas.ingresar} variante="secundario" icono="flechaizq">
          {t(`${base}.enlaces.volver`)}
        </BotonEnlace>
      </Estado>
    </div>
  );
}
