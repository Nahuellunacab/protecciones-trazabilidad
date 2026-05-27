import api from "../api/axios";

import type {
    Destino
} from "../types/Destino";

import type {
    DestinoRequest
} from "../types/DestinoRequest";

export async function
obtenerDestinos() {

    const response =
        await api.get<Destino[]>(
            "/destinos"
        );

    return response.data;
}

export async function
crearDestino(
    data: DestinoRequest
) {

    const response =
        await api.post(
            "/destinos",
            data
        );

    return response.data;
}

export async function
actualizarDestino(
    id: number,
    data: DestinoRequest
) {

    const response =
        await api.put(
            `/destinos/${id}`,
            data
        );

    return response.data;
}

export async function
eliminarDestino(
    id: number
) {

    await api.delete(
        `/destinos/${id}`
    );
}