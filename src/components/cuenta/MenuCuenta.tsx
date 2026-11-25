"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icono } from "@/components/ui/Icono";
import { usePreferencias } from "@/contexto/Preferencias";
import type { Usuario } from "@/lib/tipos";
import { Avatar } from "./Avatar";
import { BotonCerrarSesion } from "./BotonCerrarSesion";
import estilos from "./MenuCuenta.module.css";

/** Nombre de la persona en la barra y, al abrirlo, sus datos y "Cerrar sesión". */
export function MenuCuenta({ usuario }: { usuario: Usuario }) {
  const { t } = usePreferencias();
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);
  const idPanel = useId();

  useEffect(() => {
    if (!abierto) return;

    function alSalir(evento: Event) {
      if (!contenedor.current?.contains(evento.target as Node)) setAbierto(false);
    }
    function alPresionar(evento: KeyboardEvent) {
      if (evento.key !== "Escape") return;
      setAbierto(false);
      boton.current?.focus();
    }

    // Se cierra con clic fuera, al salir con Tab o con Escape.
    document.addEventListener("pointerdown", alSalir);
    document.addEventListener("focusin", alSalir);
    document.addEventListener("keydown", alPresionar);
    return () => {
      document.removeEventListener("pointerdown", alSalir);
      document.removeEventListener("focusin", alSalir);
      document.removeEventListener("keydown", alPresionar);
    };
  }, [abierto]);

  return (
    <div ref={contenedor} className={estilos.cuenta}>
      <button
        ref={boton}
        type="button"
        className={estilos.boton}
        aria-expanded={abierto}
        aria-controls={idPanel}
        onClick={() => setAbierto((valor) => !valor)}
      >
        <Avatar nombre={usuario.nombre} />
        <span className={estilos.nombreCorto}>{usuario.nombre}</span>
        <span className="solo-lectores">, {t("navbar.usuario.menu")}</span>
        <Icono nombre="chevronabajo" tamano="pequeno" />
      </button>

      <div id={idPanel} className={estilos.panel} hidden={!abierto}>
        <div className={estilos.persona}>
          <Avatar nombre={usuario.nombre} tamano="grande" />
          <div className={estilos.datos}>
            <p className={estilos.nombre}>{usuario.nombre}</p>
            <p className={estilos.correo}>{usuario.correo}</p>
          </div>
        </div>
        <BotonCerrarSesion texto={t("navbar.usuario.cerrarSesion")} />
      </div>
    </div>
  );
}
