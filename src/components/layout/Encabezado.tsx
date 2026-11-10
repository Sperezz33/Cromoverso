"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { BotonEnlace } from "@/components/ui/Boton";
import { Icono } from "@/components/ui/Icono";
import { usePreferencias } from "@/contexto/Preferencias";
import { enlacesPrincipales, estaActivo, rutas } from "@/lib/rutas";
import { Idioma } from "./Idioma";
import { Marca } from "./Marca";
import { MenuMovil } from "./MenuMovil";
import estilos from "./Encabezado.module.css";

const ID_MENU = "menu-movil";

export function Encabezado() {
  const { t } = usePreferencias();
  const rutaActual = usePathname();
  const [abierto, setAbierto] = useState(false);
  const botonMenu = useRef<HTMLButtonElement>(null);

  // Al navegar a otra vista el menú se cierra.
  const [rutaAnterior, setRutaAnterior] = useState(rutaActual);
  if (rutaActual !== rutaAnterior) {
    setRutaAnterior(rutaActual);
    setAbierto(false);
  }

  useEffect(() => {
    if (!abierto) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

  const cerrarMenu = useCallback(({ devolverFoco }: { devolverFoco: boolean }) => {
    setAbierto(false);
    if (devolverFoco) botonMenu.current?.focus();
  }, []);

  return (
    <header className={estilos.encabezado}>
      <div className={`contenedor ${estilos.barra}`}>
        <Marca
          etiqueta={t("navbar.logo.aria")}
          onClick={() => cerrarMenu({ devolverFoco: false })}
        />

        <nav className={estilos.navegacion}>
          <ul className={estilos.enlaces}>
            {enlacesPrincipales.map((enlace) => {
              const activo = estaActivo(enlace.href, rutaActual);
              return (
                <li key={enlace.clave}>
                  <Link
                    href={enlace.href}
                    className={estilos.enlace}
                    aria-current={activo ? "page" : undefined}
                  >
                    {t(`navbar.enlaces.${enlace.clave}`)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={estilos.acciones}>
          <div className={estilos.soloEscritorio}>
            <Idioma />
          </div>
          <BotonEnlace href={rutas.ingresar} variante="secundario" tamano="pequeno">
            {t("navbar.botones.ingresar")}
          </BotonEnlace>
          <BotonEnlace
            href={rutas.registro}
            variante="primario"
            tamano="pequeno"
            className={estilos.soloEscritorio}
          >
            {t("navbar.botones.crearCuenta")}
          </BotonEnlace>
          <button
            ref={botonMenu}
            type="button"
            className={estilos.botonMenu}
            aria-expanded={abierto}
            aria-controls={ID_MENU}
            aria-label={abierto ? t("menuMovil.cerrar") : t("menuMovil.abrir")}
            onClick={() => setAbierto((valor) => !valor)}
          >
            <Icono nombre={abierto ? "cerrar" : "menu"} tamano="grande" />
          </button>
        </div>
      </div>

      <MenuMovil
        id={ID_MENU}
        abierto={abierto}
        onCerrar={cerrarMenu}
        extra={
          <div className={estilos.idiomaMovil}>
            <span className={estilos.etiquetaMovil} aria-hidden="true">
              {t("menuMovil.secciones.idioma")}
            </span>
            <Idioma tamano="grande" />
          </div>
        }
      />
    </header>
  );
}
