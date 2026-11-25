import { guardarToken, llamarSesion, reenviarError } from "@/lib/sesion-servidor";
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
