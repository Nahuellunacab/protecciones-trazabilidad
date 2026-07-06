import type { Rol } from "../Usuario";

export interface LoginResponse {

    token: string;

    id: number;

    nombre: string;

    apellido: string;

    email: string;

    rol: Rol;

    numeroSobre: string;
}
