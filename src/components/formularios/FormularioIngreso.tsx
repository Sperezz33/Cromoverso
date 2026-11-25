"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { Alerta } from "@/components/ui/Alerta";
import { Boton } from "@/components/ui/Boton";
import { Campo } from "@/components/ui/Campo";
import { CampoClave } from "@/components/ui/CampoClave";
import { usePreferencias } from "@/contexto/Preferencias";
import { useSesion } from "@/contexto/Sesion";
import { rutas } from "@/lib/rutas";
import estilos from "./FormularioIngreso.module.css";

const BASE = "paginas.ingresar";

/** Claves de texto de lo que hay que mostrar; el texto sale de la API al pintar. */
type Problema = { tipo: "camposObligatorios" | "generico" };
type ErroresDeCampo = { correo?: string; clave?: string };

export function FormularioIngreso() {
  const { t } = usePreferencias();
  const { ingresar } = useSesion();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [mantener, setMantener] = useState(true);
  const [errores, setErrores] = useState<ErroresDeCampo>({});
  const [problema, setProblema] = useState<Problema | null>(null);
  const campoCorreo = useRef<HTMLInputElement>(null);
  const campoClave = useRef<HTMLInputElement>(null);

  function enfocarPrimero(conError: ErroresDeCampo) {
    const campo = conError.correo ? campoCorreo.current : campoClave.current;
    campo?.focus();
    // En móvil el aviso de cookies puede tapar la parte baja de la pantalla.
    campo?.scrollIntoView({ block: "center" });
  }

  async function alEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const faltantes: ErroresDeCampo = {};
    if (!correo.trim()) faltantes.correo = t(`${BASE}.errores.correoObligatorio`);
    if (!clave) faltantes.clave = t(`${BASE}.errores.claveObligatoria`);
    setErrores(faltantes);
    if (faltantes.correo || faltantes.clave) {
      setProblema({ tipo: "camposObligatorios" });
      enfocarPrimero(faltantes);
      return;
    }

    setProblema(null);
    try {
      // Al quedar la sesión iniciada, la vista lleva al inicio.
      await ingresar({ correo: correo.trim(), clave, mantener });
    } catch {
      setProblema({ tipo: "generico" });
    }
  }

  return (
    // method="post": si el envío ocurre antes de cargar el JavaScript, la clave no va a la URL.
    <form method="post" noValidate className={estilos.formulario} onSubmit={alEnviar}>
      <div role="alert">
        {problema && (
          <Alerta
            titulo={
              problema.tipo === "camposObligatorios"
                ? t(`${BASE}.errores.camposObligatorios.titulo`)
                : t("errores.generico")
            }
            texto={
              problema.tipo === "camposObligatorios"
                ? t(`${BASE}.errores.camposObligatorios.texto`)
                : undefined
            }
          />
        )}
      </div>

      <Campo
        ref={campoCorreo}
        type="email"
        name="correo"
        autoComplete="username"
        etiqueta={t(`${BASE}.formulario.etiquetas.correo`)}
        placeholder={t(`${BASE}.formulario.placeholders.correo`)}
        value={correo}
        error={errores.correo}
        onChange={(evento) => setCorreo(evento.target.value)}
      />
      <CampoClave
        ref={campoClave}
        name="clave"
        autoComplete="current-password"
        etiqueta={t(`${BASE}.formulario.etiquetas.clave`)}
        mostrar={t(`${BASE}.formulario.botones.mostrarClave`)}
        ocultar={t(`${BASE}.formulario.botones.ocultarClave`)}
        value={clave}
        error={errores.clave}
        onChange={(evento) => setClave(evento.target.value)}
      />

      <div className={estilos.opciones}>
        <label className={estilos.casilla}>
          <input
            type="checkbox"
            name="mantener"
            checked={mantener}
            onChange={(evento) => setMantener(evento.target.checked)}
          />
          {t(`${BASE}.formulario.etiquetas.mantenerSesion`)}
        </label>
        <Link href={rutas.recuperar} className={estilos.enlace}>
          {t(`${BASE}.formulario.enlaces.olvidasteClave`)}
        </Link>
      </div>

      <Boton type="submit" anchoCompleto>
        {t(`${BASE}.formulario.botones.ingresar`)}
      </Boton>

      <p className={estilos.sinCuenta}>
        {t(`${BASE}.formulario.mensajes.sinCuenta`)}{" "}
        <Link href={rutas.registro} className={estilos.enlace}>
          {t(`${BASE}.formulario.enlaces.crearCuenta`)}
        </Link>
      </p>
    </form>
  );
}
