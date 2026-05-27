import api from "../api/axios";

import type {
    Localidad
} from "../types/Localidad";

export async function obtenerLocalidades():
Promise<Localidad[]> {

    const response =
        await api.get(
            "/localidades"
        );

    return response.data;
}