import api from "../api/axios";

import type { Tipo }
from "../types/Tipo";

export async function obtenerTipos() {

    const response =
        await api.get<Tipo[]>(
            "/tipos"
        );

    return response.data;
}