import api from "../api/axios";

import type { Modelo } from "../types/Modelo";

export const obtenerModelos =
    async (): Promise<Modelo[]> => {

        const response =
            await api.get("/modelos");

        return response.data;
    };