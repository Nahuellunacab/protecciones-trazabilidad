import api from "../api/axios";

import type { Marca }
    from "../types/Marca";

export const obtenerMarcas =
    async (): Promise<Marca[]> => {

        const response =
            await api.get("/marcas");

        return response.data;
    };