"use client";

import { notFound, useSearchParams } from "next/navigation";
import { EsqueletoCatalogo } from "@/components/estados/EsqueletoCatalogo";
import { EstadoPeticiones } from "@/components/estados/EstadoPeticiones";
import { usePreferencias } from "@/contexto/Preferencias";
import { useListaCompleta, usePeticion } from "@/hooks/usePeticion";
import { leerFiltros, tiposDeCromo } from "@/lib/filtros";
import { ErrorApi } from "@/lib/peticion";
import { rutasApi } from "@/lib/rutas-api";
import type { Cromo, Lista, Mundo, MundoConCromos, Rareza } from "@/lib/tipos";
import { VistaCatalogo } from "./VistaCatalogo";

type Props = { id: string };

/** Pide desde el navegador los datos del catálogo según el mundo y los filtros de la URL. */
export function CatalogoDeMundo({ id }: Props) {
  const { textos } = usePreferencias();
  const parametros = useSearchParams();

  const mundo = usePeticion<MundoConCromos>(rutasApi.mundo(id));
  const mundos = usePeticion<Lista<Mundo>>(rutasApi.mundos);
  const rarezas = usePeticion<Lista<Rareza>>(rutasApi.rarezas);

  // Para validar ?rareza= hacen falta las rarezas; sin ese filtro se pide de una vez.
  const tipos = tiposDeCromo(textos);
  const filtros = leerFiltros(parametros, rarezas.datos?.datos ?? [], tipos);
  const esperarRarezas = parametros.has("rareza") && !rarezas.datos;
  const cromos = useListaCompleta<Cromo>(
    esperarRarezas ? null : rutasApi.cromos({ mundo: id, ...filtros }),
  );

  if (mundo.error instanceof ErrorApi && mundo.error.estado === 404) notFound();

  if (!mundo.datos || !mundos.datos || !rarezas.datos) {
    return (
      <EstadoPeticiones
        peticiones={[mundo, mundos, rarezas]}
        nivel="h1"
        cargando={<EsqueletoCatalogo />}
      />
    );
  }

  return (
    <VistaCatalogo
      mundo={mundo.datos}
      mundos={mundos.datos.datos}
      rarezas={rarezas.datos.datos}
      tipos={tipos}
      cromos={cromos}
      filtros={filtros}
    />
  );
}
