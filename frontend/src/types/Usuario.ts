export type Rol = "ADMIN" | "OPERADOR" | "AUDITOR";

export interface Usuario {

    id: number;

    nombre: string;

    apellido: string;

    email: string;

    rol: Rol;

    activo: boolean;

    numeroSobre: string;
}
