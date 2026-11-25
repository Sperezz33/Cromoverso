import type { IdIdioma } from "./tipos";

export type FiltrosCromos = { mundo?: string; rareza?: string; tipo?: string };

/** Rutas de la API que usa el sitio. */
export const rutasApi = {
  idiomas: "/idiomas",
  textos: (idioma: IdIdioma) => `/textos?idioma=${idioma}`,
  mundos: "/mundos",
  mundo: (id: string) => `/mundos/${encodeURIComponent(id)}`,
  rarezas: "/rarezas",
  cromo: (id: string) => `/cromos/${encodeURIComponent(id)}`,
  cromos: (filtros: FiltrosCromos) => {
    const parametros = new URLSearchParams();
    for (const [clave, valor] of Object.entries(filtros)) {
      if (valor) parametros.set(clave, valor);
    }
    return `/cromos?${parametros}`;
  },
} as const;
