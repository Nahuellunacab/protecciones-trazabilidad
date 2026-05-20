import api from "../api/axios";

import type { Modelo }
    from "../types/Modelo";

export const obtenerModelos =
    async (
        marcaId?: number
    ): Promise<Modelo[]> => {

        const response =
            await api.get("/modelos", {
                params: {
                    marcaId
                }
            });

        return response.data;
    };