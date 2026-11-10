import type { IdIdioma } from "./tipos";

/** Nombres de las cookies que guarda el frontend (contrato, sección 2). */
export const COOKIE_CONSENTIMIENTO = "consentimiento";
export const COOKIE_IDIOMA = "idioma";

export type Consentimiento = "aceptado" | "rechazado";

/** Seis meses, en segundos. */
const DURACION = 60 * 60 * 24 * 180;

export const IDIOMAS_VALIDOS: readonly IdIdioma[] = ["es", "en"];

export function esIdioma(valor: unknown): valor is IdIdioma {
  return (
    typeof valor === "string" && (IDIOMAS_VALIDOS as readonly string[]).includes(valor)
  );
}

export function esConsentimiento(valor: unknown): valor is Consentimiento {
  return valor === "aceptado" || valor === "rechazado";
}

export function guardarCookie(nombre: string, valor: string) {
  const segura = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${nombre}=${encodeURIComponent(valor)}; Path=/; Max-Age=${DURACION}; SameSite=Lax${segura}`;
}

export function borrarCookie(nombre: string) {
  document.cookie = `${nombre}=; Path=/; Max-Age=0; SameSite=Lax`;
}
