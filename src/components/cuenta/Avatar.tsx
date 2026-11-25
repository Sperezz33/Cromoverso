import estilos from "./Avatar.module.css";

/** Primeras letras del nombre y del apellido: "Laura Cardona" → "LC". */
function iniciales(nombre: string) {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join("");
}

type Props = { nombre: string; tamano?: "normal" | "grande" };

/** Decorativo: el nombre siempre se muestra al lado. */
export function Avatar({ nombre, tamano = "normal" }: Props) {
  return (
    <span className={`${estilos.avatar} ${estilos[tamano]}`} aria-hidden="true">
      {iniciales(nombre)}
    </span>
  );
}
