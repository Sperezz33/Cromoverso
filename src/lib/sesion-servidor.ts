import { cookies } from "next/headers";
import { configuracionApi } from "./api-servidor";

/** Cookie httpOnly del sitio con el token de la API. El navegador no puede leerla. */
const COOKIE_SESION = "sesion";

/** Con "Mantener la sesión iniciada". Quien decide cuándo vence es la API (401). */
const DURACION_SEGUNDOS = 60 * 60 * 24 * 7;

export async function leerToken(): Promise<string | null> {
  return (await cookies()).get(COOKIE_SESION)?.value ?? null;
}

export async function guardarToken(token: string, mantener: boolean) {
  (await cookies()).set(COOKIE_SESION, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // Sin duración, la cookie se borra al cerrar el navegador.
    maxAge: mantener ? DURACION_SEGUNDOS : undefined,
  });
}

type Opciones = { token?: string | null; cuerpo?: unknown };

/** Llama a /sesion de la API desde el servidor. null si la API no respondió. */
export async function llamarSesion(
  metodo: "GET" | "POST" | "DELETE",
  { token, cuerpo }: Opciones = {},
): Promise<Response | null> {
  const { base, cabeceras } = configuracionApi();
  try {
    return await fetch(`${base}/sesion`, {
      method: metodo,
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(cuerpo === undefined ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...cabeceras,
      },
      body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
    });
  } catch (error) {
    console.error(`${metodo} /sesion no respondió.`, error);
    return null;
  }
}

/** Entrega al navegador el mismo estado y cuerpo que respondió la API. */
export async function reenviarError(respuesta: Response | null): Promise<Response> {
  if (!respuesta) {
    return Response.json({ error: { codigo: "sin_conexion" } }, { status: 502 });
  }
  const cuerpo: unknown = await respuesta.json().catch(() => null);
  const espera = respuesta.headers.get("Retry-After");
  return Response.json(cuerpo, {
    status: respuesta.status,
    headers: espera ? { "Retry-After": espera } : undefined,
  });
}
