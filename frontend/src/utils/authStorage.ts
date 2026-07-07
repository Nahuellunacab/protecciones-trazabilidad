import type { Usuario } from "../types/Usuario";

const TOKEN_KEY = "protecciones-auth-token";
const USUARIO_KEY = "protecciones-auth-usuario";

export function obtenerToken() {

    return localStorage.getItem(TOKEN_KEY);
}

export function obtenerUsuarioGuardado(): Usuario | null {

    const guardado =
        localStorage.getItem(USUARIO_KEY);

    if (!guardado) {

        return null;
    }

    try {

        return JSON.parse(guardado) as Usuario;

    } catch {

        return null;
    }
}

export function guardarSesion(
    token: string,
    usuario: Usuario
) {

    localStorage.setItem(TOKEN_KEY, token);

    localStorage.setItem(
        USUARIO_KEY,
        JSON.stringify(usuario)
    );
}

export function limpiarSesion() {

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
}
