import api from "../api/axios";

import type {
    Posicion
} from "../types/Posicion";

import type {
    PosicionRequest
} from "../types/PosicionRequest";

export async function obtenerPosiciones():
Promise<Posicion[]> {

    const response =
        await api.get(
            "/posiciones"
        );

    return response.data;
}

export async function
obtenerPosicionesPorDestino(
    destinoId: number
): Promise<Posicion[]> {

    const response =
        await api.get(

            `/posiciones/destino/${destinoId}`
        );

    return response.data;
}

export async function crearPosicion(
    data: PosicionRequest
) {

    const response =
        await api.post(
            "/posiciones",
            data
        );

    return response.data;
}

export async function actualizarPosicion(

    id: number,

    data: PosicionRequest

) {

    const response =
        await api.put(

            `/posiciones/${id}`,

            data
        );

    return response.data;
}

export async function eliminarPosicion(
    id: number
) {

    await api.delete(
        `/posiciones/${id}`
    );
}