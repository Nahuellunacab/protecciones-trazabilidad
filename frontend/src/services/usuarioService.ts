import api from "../api/axios";

import type { Usuario } from "../types/Usuario";
import type { UsuarioRequest } from "../types/UsuarioRequest";

export async function obtenerUsuarios() {

    const response =
        await api.get<Usuario[]>("/usuarios");

    return response.data;
}

export async function crearUsuario(
    data: UsuarioRequest
) {

    const response =
        await api.post(
            "/usuarios",
            data
        );

    return response.data;
}

export async function actualizarUsuario(
    id: number,
    data: UsuarioRequest
) {

    const response =
        await api.put(
            `/usuarios/${id}`,
            data
        );

    return response.data;
}
