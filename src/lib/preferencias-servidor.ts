import { cookies } from "next/headers";
import {
  COOKIE_CONSENTIMIENTO,
  COOKIE_IDIOMA,
  esConsentimiento,
  esIdioma,
  type Consentimiento,
} from "./cookies";
import type { IdIdioma } from "./tipos";

export type PreferenciasGuardadas = {
  consentimiento: Consentimiento | null;
  /** Idioma recordado. Solo cuenta si la persona aceptó las cookies. */
  idioma: IdIdioma | null;
};

export async function leerPreferencias(): Promise<PreferenciasGuardadas> {
  const almacen = await cookies();
  const consentimiento = almacen.get(COOKIE_CONSENTIMIENTO)?.value;
  const idioma = almacen.get(COOKIE_IDIOMA)?.value;
  const valido = esConsentimiento(consentimiento) ? consentimiento : null;
  return {
    consentimiento: valido,
    idioma: valido === "aceptado" && esIdioma(idioma) ? idioma : null,
  };
}
