import type { Textos } from "./tipos";

export type Valores = Record<string, string | number>;

/** Busca un texto por su ruta con puntos, por ejemplo "navbar.enlaces.inicio". */
export function buscarTexto(textos: Textos, ruta: string): Textos | string | undefined {
  let actual: Textos | string | undefined = textos;
  for (const parte of ruta.split(".")) {
    if (actual === undefined || typeof actual === "string") return undefined;
    actual = actual[parte];
  }
  return actual;
}

/** Reemplaza los marcadores {nombre}, {cantidad}... de un texto. */
export function rellenar(plantilla: string, valores?: Valores): string {
  if (!valores) return plantilla;
  return plantilla.replace(/\{(\w+)\}/g, (marcador, clave: string) =>
    clave in valores ? String(valores[clave]) : marcador,
  );
}

/**
 * Devuelve el texto listo para mostrar. Si el texto es un plural { uno, otro },
 * elige la forma con `valores.cantidad`. Si la ruta no existe, devuelve la ruta
 * para que el faltante se note al revisar la vista.
 */
export function traducir(textos: Textos, ruta: string, valores?: Valores): string {
  const encontrado = buscarTexto(textos, ruta);
  if (typeof encontrado === "string") return rellenar(encontrado, valores);
  if (
    encontrado &&
    typeof encontrado.uno === "string" &&
    typeof encontrado.otro === "string"
  ) {
    const forma = valores?.cantidad === 1 ? encontrado.uno : encontrado.otro;
    return rellenar(forma, valores);
  }
  return ruta;
}
