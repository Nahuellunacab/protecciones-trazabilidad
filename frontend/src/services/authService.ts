import api from "../api/axios";

import type { LoginRequest } from "../types/auth/LoginRequest";
import type { LoginResponse } from "../types/auth/LoginResponse";
import type { Usuario } from "../types/Usuario";

export async function login(
    data: LoginRequest
) {

    const response =
        await api.post<LoginResponse>(
            "/auth/login",
            data
        );

    return response.data;
}

export async function obtenerUsuarioActual() {

    const response =
        await api.get<Usuario>("/auth/me");

    return response.data;
}

export async function cambiarPassword(
    passwordActual: string,
    passwordNueva: string
) {

    await api.put("/auth/password", {
        passwordActual,
        passwordNueva
    });
}
