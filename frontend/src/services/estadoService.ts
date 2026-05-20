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