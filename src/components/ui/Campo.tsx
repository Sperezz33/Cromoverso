import { useId, type InputHTMLAttributes } from "react";
import { Icono } from "./Icono";
import estilos from "./Campo.module.css";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  etiqueta: string;
  ayuda?: string;
  error?: string;
  icono?: string;
};

/** Campo de texto con su etiqueta, ayuda y mensaje de error asociados. */
export function Campo({ etiqueta, ayuda, error, icono, id, className, ...resto }: Props) {
  const generado = useId();
  const idCampo = id ?? generado;
  const idAyuda = ayuda ? `${idCampo}-ayuda` : undefined;
  const idError = error ? `${idCampo}-error` : undefined;
  const descripcion = [idAyuda, idError].filter(Boolean).join(" ");

  return (
    <div className={[estilos.campo, className].filter(Boolean).join(" ")}>
      <label className={estilos.etiqueta} htmlFor={idCampo}>
        {etiqueta}
      </label>
      <div className={estilos.control}>
        {icono && <Icono nombre={icono} className={estilos.icono} />}
        <input
          id={idCampo}
          className={estilos.entrada}
          aria-invalid={error ? true : undefined}
          aria-describedby={descripcion || undefined}
          {...resto}
        />
      </div>
      {ayuda && (
        <p id={idAyuda} className={estilos.ayuda}>
          {ayuda}
        </p>
      )}
      {error && (
        <p id={idError} className={estilos.error}>
          <Icono nombre="alerta" tamano="pequeno" />
          {error}
        </p>
      )}
    </div>
  );
}
