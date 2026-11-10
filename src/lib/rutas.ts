/** Rutas de las vistas del curso. */
export const rutas = {
  inicio: "/",
  mundos: "/mundos",
  mundo: (id: string) => `/mundos/${encodeURIComponent(id)}`,
  cromo: (id: string) => `/cromos/${encodeURIComponent(id)}`,
  ingresar: "/ingresar",
  registro: "/registro",
} as const;

/** Enlaces de la navegación principal. `clave` es la clave del texto en la API. */
export const enlacesPrincipales = [
  { clave: "inicio", href: rutas.inicio, icono: "inicio" },
  { clave: "mundos", href: rutas.mundos, icono: "mundo" },
] as const;

export function estaActivo(href: string, rutaActual: string): boolean {
  if (href === rutas.inicio) return rutaActual === rutas.inicio;
  return rutaActual === href || rutaActual.startsWith(`${href}/`);
}
