import {
  borrarToken,
  guardarToken,
  leerToken,
  llamarSesion,
  reenviarError,
} from "@/lib/sesion-servidor";
import type { Usuario } from "@/lib/tipos";

/**
 * Ingresar: pide POST /sesion a la API y guarda el token en una cookie httpOnly.
 * Al navegador solo le llega la persona, nunca el token.
 */
export async function POST(peticion: Request) {
  const datos = (await peticion.json().catch(() => null)) as {
    correo?: unknown;
    clave?: unknown;
    mantener?: unknown;
  } | null;

  const respuesta = await llamarSesion("POST", {
    cuerpo: { correo: datos?.correo, clave: datos?.clave },
  });
  if (!respuesta?.ok) return reenviarError(respuesta);

  const { usuario, token } = (await respuesta.json()) as {
    usuario: Usuario;
    token: string;
  };
  await guardarToken(token, datos?.mantener === true);
  return Response.json({ usuario }, { status: 201 });
}

/** Quién inició sesión. Si la API dice que venció (401), la cookie ya no sirve. */
export async function GET() {
  const token = await leerToken();
  if (!token) {
    return Response.json({ error: { codigo: "no_autenticado" } }, { status: 401 });
  }

  const respuesta = await llamarSesion("GET", { token });
  if (respuesta?.ok) {
    const { usuario } = (await respuesta.json()) as { usuario: Usuario };
    return Response.json({ usuario }, { headers: { "Cache-Control": "no-store" } });
  }
  if (respuesta?.status === 401) await borrarToken();
  return reenviarError(respuesta);
}

/** Cerrar sesión. La cookie se borra aunque la API falle: la persona pidió salir. */
export async function DELETE() {
  const token = await leerToken();
  if (token) await llamarSesion("DELETE", { token });
  await borrarToken();
  return new Response(null, { status: 204 });
}
