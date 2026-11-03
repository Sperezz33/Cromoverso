export type Usuario = { nombre: String};







export type Sesion = {
    usuario: Usuario|null;
    iniciarSesion: () => void;
    cerrarSesion: () => void;
    cambiarContraseña: () => void; 
}