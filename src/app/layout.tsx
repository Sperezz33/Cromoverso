import "@/styles/tokens.css";
import "@/styles/fuentes.css";
import "./globals.css";
import { rubik, unbounded } from "@/styles/fuentes";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${unbounded.variable} ${rubik.variable}`}>
      <body>{children}</body>
    </html>
  );
}
