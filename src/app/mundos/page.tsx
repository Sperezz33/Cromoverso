import { notFound, redirect } from "next/navigation";
import { obtenerMundos } from "@/lib/api";
import { rutas } from "@/lib/rutas";

/** "Mundos" en la navegación lleva al catálogo del primer mundo que entrega la API. */
export default async function Mundos() {
  const { datos } = await obtenerMundos();
  const primero = datos[0];
  if (!primero) notFound();
  redirect(rutas.mundo(primero.id));
}
