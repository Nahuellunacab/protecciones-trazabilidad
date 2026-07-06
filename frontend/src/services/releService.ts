import api from "../api/axios";

import type { Rele } from "../types/Rele";
import type { ReleRequest } from "../types/ReleRequest";
import type { ReleOption } from "../types/ReleOption";

interface RelePageResponse {

    content: Rele[];

    totalElements: number;
}

export const obtenerReles = async (
    page: number,
    size: number,
    texto: string,
    filtroEstado: "ACTIVOS" | "INACTIVOS" | "TODOS",
    sort: string = "id,desc"
): Promise<RelePageResponse> => {

    const response =
        await api.get(
            "/reles",
            {
                params: {
                    page,
                    size,
                    texto,
                    filtroEstado,
                    sort
                }
            }
        );

    return response.data;
};

export const crearRele = async (
    rele: ReleRequest
): Promise<Rele> => {

    const response =
        await api.post(
            "/reles",
            rele
        );

    return response.data;
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

export async function obtenerRelePorId(
    id: number
): Promise<Rele> {

    const response =
        await api.get(
            `/reles/${id}`
        );

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
