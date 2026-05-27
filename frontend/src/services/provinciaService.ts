import api from "../api/axios";

import type {
    Provincia
} from "../types/Provincia";

import type {
    ProvinciaRequest
} from "../types/ProvinciaRequest";

export async function obtenerProvincias():
Promise<Provincia[]> {

    const response =
        await api.get(
            "/provincias"
        );

    return response.data;
}

export async function crearProvincia(
    data: ProvinciaRequest
) {

    const response =
        await api.post(
            "/provincias",
            data
        );

    return response.data;
}

export async function actualizarProvincia(

    id: number,
    data: ProvinciaRequest
) {

    const response =
        await api.put(
            `/provincias/${id}`,
            data
        );

    return response.data;
}

export async function eliminarProvincia(
    id: number
) {

    await api.delete(
        `/provincias/${id}`
    );
}