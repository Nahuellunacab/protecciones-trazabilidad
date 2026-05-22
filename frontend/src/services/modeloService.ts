import api from "../api/axios";

import type { Modelo }
from "../types/Modelo";

import type { ModeloRequest }
from "../types/ModeloRequest";

export async function obtenerModelos() {

    const response =
        await api.get<Modelo[]>(
            "/modelos"
        );

    return response.data;
}

export async function crearModelo(
    data: ModeloRequest
) {

    const response =
        await api.post(
            "/modelos",
            data
        );

    return response.data;
}

export async function actualizarModelo(
    id: number,
    data: ModeloRequest
) {

    const response =
        await api.put(
            `/modelos/${id}`,
            data
        );

    return response.data;
}

export async function eliminarModelo(
    id: number
) {

    await api.delete(
        `/modelos/${id}`
    );
}

export async function obtenerModelosPorMarca(
    marcaId: number
) {

    const response = await api.get(
        `/modelos?marcaId=${marcaId}`
    );

    return response.data;
}