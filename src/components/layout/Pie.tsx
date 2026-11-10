"use client";

import Link from "next/link";
import { useId } from "react";
import { usePreferencias } from "@/contexto/Preferencias";
import { rutas } from "@/lib/rutas";
import { Marca } from "./Marca";
import estilos from "./Pie.module.css";

type Columna = {
  clave: string;
  enlaces: { clave: string; href?: string }[];
};

const COLUMNAS: Columna[] = [
  {
    clave: "explora",
    enlaces: [
      { clave: "inicio", href: rutas.inicio },
      { clave: "mundos", href: rutas.mundos },
    ],
  },
  {
    clave: "cuenta",
    enlaces: [
      { clave: "ingresar", href: rutas.ingresar },
      { clave: "crearCuenta", href: rutas.registro },
    ],
  },
  // Términos y accesibilidad todavía no tienen vista en el curso: se muestran sin enlace.
  { clave: "legal", enlaces: [{ clave: "terminos" }, { clave: "accesibilidad" }] },
];

function ColumnaPie({ columna }: { columna: Columna }) {
  const { t } = usePreferencias();
  const idTitulo = useId();
  const base = `footer.columnas.${columna.clave}`;

  return (
    <nav aria-labelledby={idTitulo} className={estilos.columna}>
      <h2 id={idTitulo} className={estilos.tituloColumna}>
        {t(`${base}.titulo`)}
      </h2>
      <ul className={estilos.lista}>
        {columna.enlaces.map((enlace) => (
          <li key={enlace.clave}>
            {enlace.href ? (
              <Link href={enlace.href} className={estilos.enlace}>
                {t(`${base}.enlaces.${enlace.clave}`)}
              </Link>
            ) : (
              <span>{t(`${base}.enlaces.${enlace.clave}`)}</span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Pie() {
  const { t } = usePreferencias();

  return (
    <footer className={estilos.pie}>
      <div className={`contenedor ${estilos.interior}`}>
        <div className={estilos.superior}>
          <div className={estilos.presentacion}>
            <Marca etiqueta={t("navbar.logo.aria")} inversa />
            <p className={estilos.lema}>{t("footer.lema")}</p>
          </div>
          <div className={estilos.columnas}>
            {COLUMNAS.map((columna) => (
              <ColumnaPie key={columna.clave} columna={columna} />
            ))}
          </div>
        </div>
        <div className={estilos.legal}>
          <p>{t("footer.legal.derechos", { anio: new Date().getFullYear() })}</p>
          <p>{t("footer.legal.nota")}</p>
        </div>
      </div>
    </footer>
  );
}
