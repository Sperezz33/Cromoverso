export type IdIdioma = "es" | "en";

export type Idioma = { codigo: IdIdioma; nombre: string };

export type RespuestaIdiomas = { predeterminado: IdIdioma; datos: Idioma[] };

export type IdRareza = "comun" | "rara" | "epica" | "legendaria";

export type TipoCromo = "heroe" | "aliado" | "villano";

export type Rareza = {
  id: IdRareza;
  nombre: string;
  icono: string;
  color: string;
  probabilidad: number;
  porcentaje: number;
};

export type Mundo = {
  id: string;
  nombre: string;
  numeros: { desde: number; hasta: number };
  color: string;
  tema: string;
  descripcion: string;
  figura: string;
  totalCromos: number;
  porRareza: Record<IdRareza, number>;
};

export type Cromo = {
  id: string;
  numero: number;
  nombre: string;
  mundo: string;
  mundoNombre: string;
  posicion: number | null;
  rareza: IdRareza;
  tipo: TipoCromo;
  holografico: boolean;
  edicion: "album" | "especial";
  atributos: { fuerza: number; velocidad: number; mente: number; energia: number };
  poder: string;
  descripcion: string;
  ilustracion: { colorBase: string; figura: string };
};

export type MundoConCromos = Mundo & { cromos: Cromo[]; especiales: Cromo[] };

export type Paginacion = {
  pagina: number;
  porPagina: number;
  total: number;
  paginas: number;
};

export type Lista<T> = { datos: T[] };

export type ListaPaginada<T> = Lista<T> & { paginacion: Paginacion };

/** Los textos llegan anidados; cada hoja es un texto o un plural { uno, otro }. */
export type Textos = { [clave: string]: Textos | string };

export type RespuestaTextos = { idioma: IdIdioma; version: string; textos: Textos };
