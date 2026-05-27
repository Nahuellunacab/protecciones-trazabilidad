import api from "../api/axios";

import type {
    Localidad
} from "../types/Localidad";

import type {
    LocalidadRequest
} from "../types/LocalidadRequest";

export async function obtenerLocalidades():
Promise<Localidad[]> {

    const response =
        await api.get(
            "/localidades"
        );

    return response.data;
}

export async function crearLocalidad(
    data: LocalidadRequest
) {

    const response =
        await api.post(
            "/localidades",
            data
        );

    return response.data;
}

export async function actualizarLocalidad(

    id: number,
    data: LocalidadRequest
) {

    const response =
        await api.put(
            `/localidades/${id}`,
            data
        );

    return response.data;
}

export async function eliminarLocalidad(
    id: number
) {

    await api.delete(
        `/localidades/${id}`
    );
}