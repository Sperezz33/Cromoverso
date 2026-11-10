"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { BotonEnlace } from "@/components/ui/Boton";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { Icono } from "@/components/ui/Icono";
import { usePreferencias } from "@/contexto/Preferencias";
import { enlacesPrincipales, estaActivo, rutas } from "@/lib/rutas";
import estilos from "./MenuMovil.module.css";

type Props = {
  id: string;
  abierto: boolean;
  onCerrar: (opciones: { devolverFoco: boolean }) => void;
  /** Contenido extra del menú (por ejemplo, el selector de idioma). */
  extra?: ReactNode;
};

const ENFOCABLES = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MenuMovil({ id, abierto, onCerrar, extra }: Props) {
  const { t } = usePreferencias();
  const rutaActual = usePathname();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const contenedor = panel.current;
    contenedor?.querySelector<HTMLElement>(ENFOCABLES)?.focus();

    function alPresionar(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        evento.preventDefault();
        onCerrar({ devolverFoco: true });
        return;
      }
      if (evento.key !== "Tab" || !contenedor) return;

      // El foco se queda entre el botón del menú y el panel mientras está abierto.
      const boton = document.querySelector<HTMLElement>(`[aria-controls="${id}"]`);
      const elementos = [
        ...(boton ? [boton] : []),
        ...contenedor.querySelectorAll<HTMLElement>(ENFOCABLES),
      ];
      const primero = elementos[0];
      const ultimo = elementos[elementos.length - 1];
      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo?.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero?.focus();
      }
    }

    document.addEventListener("keydown", alPresionar);
    return () => document.removeEventListener("keydown", alPresionar);
  }, [abierto, id, onCerrar]);

  return (
    <div id={id} ref={panel} className={estilos.menu} hidden={!abierto}>
      <div className={`contenedor ${estilos.interior}`}>
        <nav>
          <ul className={estilos.enlaces}>
            {enlacesPrincipales.map((enlace) => {
              const activo = estaActivo(enlace.href, rutaActual);
              return (
                <li key={enlace.clave}>
                  <Link
                    href={enlace.href}
                    className={estilos.enlace}
                    aria-current={activo ? "page" : undefined}
                    onClick={() => onCerrar({ devolverFoco: false })}
                  >
                    <Icono nombre={enlace.icono} tamano="grande" />
                    <span className={estilos.texto}>
                      {t(`menuMovil.enlaces.${enlace.clave}`)}
                    </span>
                    {activo ? (
                      <Etiqueta variante="inversa">
                        {t("menuMovil.aria.estasAqui")}
                      </Etiqueta>
                    ) : (
                      <Icono nombre="chevronder" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {extra}

        <div className={estilos.botones}>
          <BotonEnlace
            href={rutas.ingresar}
            variante="secundario"
            anchoCompleto
            onClick={() => onCerrar({ devolverFoco: false })}
          >
            {t("menuMovil.botones.ingresar")}
          </BotonEnlace>
          <BotonEnlace
            href={rutas.registro}
            variante="primario"
            anchoCompleto
            onClick={() => onCerrar({ devolverFoco: false })}
          >
            {t("menuMovil.botones.crearCuenta")}
          </BotonEnlace>
        </div>
      </div>
    </div>
  );
}
