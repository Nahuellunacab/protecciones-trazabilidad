import api from "../api/axios";

import type { Rele } from "../types/Rele";
import type { ReleRequest } from "../types/ReleRequest";
import type { ReleOption } from "../types/ReleOption";

export const obtenerReles = async (): Promise<Rele[]> => {

    const response = await api.get("/reles");

    return response.data.content;
};

export const crearRele = async (
    rele: ReleRequest
): Promise<void> => {

    await api.post("/reles", rele);
};

export async function actualizar(
    id: number,
    rele: ReleRequest
) {

    const response =
        await api.put(
            `/reles/${id}`,
            rele
        );

    return response.data;
}

export async function obtenerOpciones():
Promise<ReleOption[]> {

    const response =
        await api.get("/reles/opciones");

    return response.data;
}

export async function darDeBaja(
    id: number,
    motivo: string
): Promise<void> {

    await api.patch(
        `/reles/${id}/baja`,
        {
            motivo
        }
    );
}