import api from "../api/axios";

import type {
    Posicion
} from "../types/Posicion";

export async function obtenerPosiciones():
Promise<Posicion[]> {

    const response =
        await api.get("/posiciones");

    return response.data;
}