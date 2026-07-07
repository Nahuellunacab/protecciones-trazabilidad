import type { Rol } from "./Usuario";

export interface UsuarioRequest {

    nombre: string;

    apellido: string;

    email: string;

    // Opcional al editar: si viene vacio, el backend conserva la contrasena actual.
    password?: string;

    rol: Rol;

    activo: boolean;

    numeroSobre: string;
}
