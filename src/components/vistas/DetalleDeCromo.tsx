"use client";

import { notFound } from "next/navigation";
import { EsqueletoDetalle } from "@/components/estados/EsqueletoDetalle";
import { EstadoPeticiones } from "@/components/estados/EstadoPeticiones";
import { usePeticion } from "@/hooks/usePeticion";
import { ErrorApi } from "@/lib/peticion";
import { rutasApi } from "@/lib/rutas-api";
import type { Cromo, Lista, MundoConCromos, Rareza } from "@/lib/tipos";
import { VistaDetalle } from "./VistaDetalle";

type Props = { id: string };

/** Pide desde el navegador el cromo, las rarezas y el mundo (para anterior y siguiente). */
export function DetalleDeCromo({ id }: Props) {
  const cromo = usePeticion<Cromo>(rutasApi.cromo(id));
  const rarezas = usePeticion<Lista<Rareza>>(rutasApi.rarezas);
  const mundo = usePeticion<MundoConCromos>(
    cromo.datos ? rutasApi.mundo(cromo.datos.mundo) : null,
  );

  if (cromo.error instanceof ErrorApi && cromo.error.estado === 404) notFound();

  if (!cromo.datos || !rarezas.datos) {
    return (
      <EstadoPeticiones
        peticiones={[cromo, rarezas]}
        nivel="h1"
        cargando={<EsqueletoDetalle />}
      />
    );
  }

  return (
    <VistaDetalle
      cromo={cromo.datos}
      rarezas={rarezas.datos.datos}
      // Si el mundo falla, el detalle se muestra sin anterior ni siguiente.
      cromosDelMundo={mundo.datos?.cromos ?? []}
    />
  );
}
