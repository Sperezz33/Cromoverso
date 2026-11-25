"use client";

import { useRouter } from "next/navigation";
import { useId } from "react";
import { Icono } from "@/components/ui/Icono";
import { usePreferencias } from "@/contexto/Preferencias";
import { enlaceConFiltros, type Filtros } from "@/lib/filtros";
import { nombreDeRareza } from "@/lib/rarezas";
import type { Rareza } from "@/lib/tipos";
import estilos from "./FiltrosMovil.module.css";

type Props = {
  idMundo: string;
  rarezas: Rareza[];
  tipos: string[];
  filtros: Filtros;
};

/** En móvil los filtros son dos listas desplegables; el cambio también va a la URL. */
export function FiltrosMovil({ idMundo, rarezas, tipos, filtros }: Props) {
  const { t, textos } = usePreferencias();
  const router = useRouter();
  const idRareza = useId();
  const idTipo = useId();

  function cambiar(nuevos: Filtros) {
    router.push(enlaceConFiltros(idMundo, { ...filtros, ...nuevos }), { scroll: false });
  }

  return (
    <div className={estilos.filtros}>
      <div className={estilos.campo}>
        <label htmlFor={idRareza} className="solo-lectores">
          {t("paginas.albumMundo.filtros.rareza.titulo")}
        </label>
        <select
          id={idRareza}
          className={estilos.lista}
          value={filtros.rareza ?? ""}
          onChange={(evento) => cambiar({ rareza: evento.target.value || undefined })}
        >
          <option value="">{t("paginas.albumMundo.filtros.rareza.todas")}</option>
          {rarezas.map((rareza) => (
            <option key={rareza.id} value={rareza.id}>
              {t("paginas.albumMundo.filtros.rareza.valor", {
                rareza: nombreDeRareza(textos, rareza),
              })}
            </option>
          ))}
        </select>
        <Icono nombre="chevronabajo" tamano="pequeno" className={estilos.flecha} />
      </div>

      <div className={estilos.campo}>
        <label htmlFor={idTipo} className="solo-lectores">
          {t("paginas.albumMundo.filtros.tipo.titulo")}
        </label>
        <select
          id={idTipo}
          className={estilos.lista}
          value={filtros.tipo ?? ""}
          onChange={(evento) => cambiar({ tipo: evento.target.value || undefined })}
        >
          <option value="">{t("paginas.albumMundo.filtros.tipo.todos")}</option>
          {tipos.map((tipo) => (
            <option key={tipo} value={tipo}>
              {t("paginas.albumMundo.filtros.tipo.valor", {
                tipo: t(`paginas.albumMundo.filtros.tipo.opciones.${tipo}`),
              })}
            </option>
          ))}
        </select>
        <Icono nombre="chevronabajo" tamano="pequeno" className={estilos.flecha} />
      </div>
    </div>
  );
}
