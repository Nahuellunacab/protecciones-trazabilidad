import api from "../api/axios";

import type {
    Remito
} from "../types/Remito";

import type {
    RemitoRequest
} from "../types/RemitoRequest";

export async function obtenerRemitos():
Promise<Remito[]> {

    const response =
        await api.get(
            "/remitos"
        );

    return response.data;
}

export async function crearRemito(
    data: RemitoRequest
) {

    const response =
        await api.post(
            "/remitos",
            data
        );

    return response.data;
}

export async function actualizarRemito(

    id: number,
    data: RemitoRequest
) {

    const response =
        await api.put(
            `/remitos/${id}`,
            data
        );

    return response.data;
}

export async function eliminarRemito(
    id: number
) {

    await api.delete(
        `/remitos/${id}`
    );
}