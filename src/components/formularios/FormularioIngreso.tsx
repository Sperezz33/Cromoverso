"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Alerta } from "@/components/ui/Alerta";
import { Boton } from "@/components/ui/Boton";
import { Campo } from "@/components/ui/Campo";
import { CampoClave } from "@/components/ui/CampoClave";
import { usePreferencias } from "@/contexto/Preferencias";
import { useSesion } from "@/contexto/Sesion";
import { useCuentaRegresiva } from "@/hooks/useCuentaRegresiva";
import { ErrorApi } from "@/lib/peticion";
import { rutas } from "@/lib/rutas";
import { buscarTexto } from "@/lib/textos";
import estilos from "./FormularioIngreso.module.css";

const BASE = "paginas.ingresar";
const ERRORES = `${BASE}.errores`;

/** Si el 429 llega sin Retry-After. */
const ESPERA_POR_DEFECTO = 60;

type Problema =
  | { tipo: "camposObligatorios" | "credenciales" | "conexion" }
  | { tipo: "demasiadosIntentos"; segundos: number }
  | { tipo: "otro"; codigo: string };

/** Aviso al llegar aquí porque la sesión venció. */
const SESION_VENCIDA: Problema = { tipo: "otro", codigo: "no_autenticado" };

/** Rutas de los textos de error: así cambian de idioma con el resto de la vista. */
type ErroresDeCampo = { correo?: string; clave?: string };

/** Traduce lo que falló a lo que debe mostrar el formulario. */
function aProblema(error: unknown): Problema {
  if (!(error instanceof ErrorApi) || error.codigo === "sin_conexion") {
    return { tipo: "conexion" };
  }
  if (error.codigo === "credenciales_invalidas") return { tipo: "credenciales" };
  if (error.codigo === "demasiadas_peticiones") {
    return {
      tipo: "demasiadosIntentos",
      segundos: error.detalle.espera ?? ESPERA_POR_DEFECTO,
    };
  }
  return { tipo: "otro", codigo: error.codigo };
}

/** 422: la API dice qué campos revisar. */
function aErroresDeCampo(error: unknown): ErroresDeCampo {
  const campos = error instanceof ErrorApi ? error.detalle.campos : undefined;
  return {
    correo: campos?.correo ? "formularios.validacion.correoInvalido" : undefined,
    clave: campos?.clave ? `${ERRORES}.claveObligatoria` : undefined,
  };
}

export function FormularioIngreso() {
  const { t, textos } = usePreferencias();
  const { ingresar, vencida } = useSesion();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [mantener, setMantener] = useState(true);
  const [errores, setErrores] = useState<ErroresDeCampo>({});
  const [problema, setProblema] = useState<Problema | null>(null);
  const [enviando, setEnviando] = useState(false);
  const { segundos, empezar } = useCuentaRegresiva();
  const campoCorreo = useRef<HTMLInputElement>(null);
  const campoClave = useRef<HTMLInputElement>(null);
  const aviso = useRef<HTMLDivElement>(null);
  // Un ref y no solo el estado: dos envíos seguidos ocurren antes del siguiente pintado.
  const enCurso = useRef(false);

  const bloqueado = segundos > 0;
  // Al terminar la espera, el aviso de demasiados intentos deja de ser cierto.
  const esperaCumplida = problema?.tipo === "demasiadosIntentos" && !bloqueado;
  const problemaVisible = esperaCumplida
    ? null
    : (problema ?? (vencida && !enviando ? SESION_VENCIDA : null));

  // Al bloquear, los campos pierden el foco: pasa al aviso y vuelve al desbloquear.
  useEffect(() => {
    if (!bloqueado) return;
    const contenedor = aviso.current;
    const campo = campoClave.current;
    contenedor?.focus();
    return () => {
      if (document.activeElement === contenedor) {
        requestAnimationFrame(() => campo?.focus());
      }
    };
  }, [bloqueado]);

  function enfocarPrimero(conError: ErroresDeCampo) {
    const campo = conError.correo ? campoCorreo.current : campoClave.current;
    campo?.focus();
    // En móvil el aviso de cookies puede tapar la parte baja de la pantalla.
    campo?.scrollIntoView({ block: "center" });
  }

  async function alEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (enCurso.current || bloqueado) return;

    const faltantes: ErroresDeCampo = {
      correo: correo.trim() ? undefined : `${ERRORES}.correoObligatorio`,
      clave: clave ? undefined : `${ERRORES}.claveObligatoria`,
    };
    setErrores(faltantes);
    if (faltantes.correo || faltantes.clave) {
      setProblema({ tipo: "camposObligatorios" });
      enfocarPrimero(faltantes);
      return;
    }

    enCurso.current = true;
    setEnviando(true);
    setProblema(null);
    try {
      // Al quedar la sesión iniciada, la vista lleva al inicio (y el envío sigue cerrado).
      await ingresar({ correo: correo.trim(), clave, mantener });
    } catch (error) {
      enCurso.current = false;
      setEnviando(false);

      const nuevo = aProblema(error);
      setProblema(nuevo);
      if (nuevo.tipo === "demasiadosIntentos") empezar(nuevo.segundos);

      const rechazados = aErroresDeCampo(error);
      setErrores(rechazados);
      if (rechazados.correo || rechazados.clave) enfocarPrimero(rechazados);
    }
  }

  function mostrarProblema(actual: Problema) {
    if (actual.tipo === "otro") {
      const mensaje = buscarTexto(textos, `errores.${actual.codigo}`);
      return (
        <Alerta titulo={typeof mensaje === "string" ? mensaje : t("errores.generico")} />
      );
    }
    const base = `${ERRORES}.${actual.tipo}`;
    if (actual.tipo === "demasiadosIntentos") {
      // Los lectores oyen la espera una vez; los segundos que bajan son solo visuales.
      return (
        <Alerta
          icono="reloj"
          titulo={t(`${base}.titulo`)}
          texto={
            <>
              <span className="solo-lectores">
                {t(`${base}.texto`, { segundos: actual.segundos })}
              </span>
              <span aria-hidden="true">{t(`${base}.texto`, { segundos })}</span>
            </>
          }
        />
      );
    }
    return (
      <Alerta
        icono={actual.tipo === "conexion" ? "wifioff" : undefined}
        titulo={t(`${base}.titulo`)}
        texto={t(`${base}.texto`)}
      />
    );
  }

  const textoDelBoton = enviando
    ? `${BASE}.formulario.mensajes.ingresando`
    : problemaVisible?.tipo === "conexion"
      ? `${ERRORES}.conexion.botones.reintentar`
      : `${BASE}.formulario.botones.ingresar`;

  return (
    // method="post": si el envío ocurre antes de cargar el JavaScript, la clave no va a la URL.
    <form method="post" noValidate className={estilos.formulario} onSubmit={alEnviar}>
      <div ref={aviso} role="alert" tabIndex={-1} className={estilos.aviso}>
        {problemaVisible && mostrarProblema(problemaVisible)}
      </div>

      <fieldset className={estilos.campos} disabled={bloqueado} aria-busy={enviando}>
        <Campo
          ref={campoCorreo}
          type="email"
          name="correo"
          autoComplete="username"
          etiqueta={t(`${BASE}.formulario.etiquetas.correo`)}
          placeholder={t(`${BASE}.formulario.placeholders.correo`)}
          value={correo}
          readOnly={enviando}
          error={errores.correo && t(errores.correo)}
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
          readOnly={enviando}
          error={errores.clave && t(errores.clave)}
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

        <Boton type="submit" anchoCompleto cargando={enviando}>
          {t(textoDelBoton)}
        </Boton>
      </fieldset>

      <p role="status" className="solo-lectores">
        {enviando && t(`${BASE}.formulario.mensajes.ingresando`)}
      </p>

      <p className={estilos.sinCuenta}>
        {t(`${BASE}.formulario.mensajes.sinCuenta`)}{" "}
        <Link href={rutas.registro} className={estilos.enlace}>
          {t(`${BASE}.formulario.enlaces.crearCuenta`)}
        </Link>
      </p>
    </form>
  );
}
