import "@/styles/tokens.css";
import "@/styles/fuentes.css";
import "./globals.css";
import { Encabezado } from "@/components/layout/Encabezado";
import { Pie } from "@/components/layout/Pie";
import { ID_CONTENIDO, SaltarAlContenido } from "@/components/layout/SaltarAlContenido";
import { ProveedorPreferencias } from "@/contexto/Preferencias";
import { obtenerTextos } from "@/lib/api";
import type { IdIdioma } from "@/lib/tipos";
import { rubik, unbounded } from "@/styles/fuentes";

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const idioma: IdIdioma = "es";
  const { textos } = await obtenerTextos(idioma);

  return (
    <html lang={idioma} className={`${unbounded.variable} ${rubik.variable}`}>
      <body>
        <ProveedorPreferencias idioma={idioma} textos={textos}>
          <SaltarAlContenido />
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
