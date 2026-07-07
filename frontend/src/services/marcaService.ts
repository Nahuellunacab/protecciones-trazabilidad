import api from "../api/axios";

import type { Marca } from "../types/Marca";
import type { MarcaRequest } from "../types/MarcaRequest";

export async function obtenerMarcas() {

    const response =
        await api.get<Marca[]>("/marcas");

    return response.data;
}

export async function crearMarca(
    data: MarcaRequest
) {

    const response =
        await api.post(
            "/marcas",
            data
        );

    return response.data;
}

export async function actualizarMarca(
    id: number,
    data: MarcaRequest
) {

    const response =
        await api.put(
            `/marcas/${id}`,
            data
        );

    return response.data;
}

export async function eliminarMarca(
    id: number
) {

    await api.delete(
        `/marcas/${id}`
    );
}