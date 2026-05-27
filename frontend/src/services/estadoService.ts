import api from "../api/axios";

import type {
    Estado
} from "../types/Estado";

export async function obtenerEstados():
Promise<Estado[]> {

    const response =
        await api.get("/estados");

    return response.data;
}

export async function
obtenerEstadosPermitidos(
    releId: number
): Promise<Estado[]> {

    const response =
        await api.get(
            `/estados/transiciones/${releId}`
        );

    return response.data;
}