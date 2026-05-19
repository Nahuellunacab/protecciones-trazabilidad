import api from "../api/axios";

import type { Rele } from "../types/Rele";
import type { ReleRequest } from "../types/ReleRequest";

export const obtenerReles = async (): Promise<Rele[]> => {

    const response = await api.get("/reles");

    return response.data.content;
};

export const crearRele = async (
    rele: ReleRequest
): Promise<void> => {

    await api.post("/reles", rele);
};