"use client";

import { useState } from "react";
import { ID_CONTENIDO } from "@/components/layout/SaltarAlContenido";
import { Boton } from "@/components/ui/Boton";
import { usePreferencias } from "@/contexto/Preferencias";
import { useSesion } from "@/contexto/Sesion";
import estilos from "./BotonCerrarSesion.module.css";

type Props = { texto: string; alCerrar?: () => void };

export function BotonCerrarSesion({ texto, alCerrar }: Props) {
  const { t } = usePreferencias();
  const { cerrarSesion } = useSesion();
  const [cerrando, setCerrando] = useState(false);
  const [fallo, setFallo] = useState(false);

  async function alHacerClic() {
    if (cerrando) return;
    setCerrando(true);
    setFallo(false);
    try {
      await cerrarSesion();
      alCerrar?.();
      // El botón desaparece: el foco pasa al contenido para no perderse.
      document.getElementById(ID_CONTENIDO)?.focus();
    } catch {
      setFallo(true);
    } finally {
      setCerrando(false);
    }
  }

  return (
    <>
      <Boton
        variante="secundario"
        icono="salir"
        anchoCompleto
        cargando={cerrando}
        onClick={alHacerClic}
      >
        {texto}
      </Boton>
      <p role="alert" className={estilos.error}>
        {fallo && t("errores.generico")}
      </p>
    </>
  );
}
