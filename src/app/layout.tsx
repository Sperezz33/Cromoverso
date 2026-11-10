import "@/styles/tokens.css";
import "@/styles/fuentes.css";
import "./globals.css";
import { Encabezado } from "@/components/layout/Encabezado";
import { GestorCookies } from "@/components/layout/GestorCookies";
import { Pie } from "@/components/layout/Pie";
import { ID_CONTENIDO, SaltarAlContenido } from "@/components/layout/SaltarAlContenido";
import { ProveedorPreferencias } from "@/contexto/Preferencias";
import { obtenerTextos } from "@/lib/api";
import {
  IDIOMA_DE_RESPALDO,
  idiomasDesdeTextos,
  obtenerIdiomasSiHay,
} from "@/lib/idiomas";
import { leerPreferencias } from "@/lib/preferencias-servidor";
import { rubik, unbounded } from "@/styles/fuentes";

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [preferencias, idiomas] = await Promise.all([
    leerPreferencias(),
    obtenerIdiomasSiHay(),
  ]);
  const idioma = preferencias.idioma ?? idiomas?.predeterminado ?? IDIOMA_DE_RESPALDO;
  // Si GET /textos falla tras los reintentos, lo atrapa app/global-error.tsx.
  const { textos } = await obtenerTextos(idioma);

  return (
    <html lang={idioma} className={`${unbounded.variable} ${rubik.variable}`}>
      <body>
        <ProveedorPreferencias
          idioma={idioma}
          idiomas={idiomas?.datos ?? idiomasDesdeTextos(textos)}
          textos={textos}
          consentimiento={preferencias.consentimiento}
        >
          <SaltarAlContenido />
          <GestorCookies />
          <Encabezado />
          <main id={ID_CONTENIDO} tabIndex={-1}>
            {children}
          </main>
          <Pie />
        </ProveedorPreferencias>
      </body>
    </html>
  );
}
