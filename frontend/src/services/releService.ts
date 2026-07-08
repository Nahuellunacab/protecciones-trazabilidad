import api from "../api/axios";

import type { Rele } from "../types/Rele";
import type { ReleRequest } from "../types/ReleRequest";
import type { ReleOption } from "../types/ReleOption";

interface RelePageResponse {

    content: Rele[];

    totalElements: number;
}

export interface FiltrosRele {

    marcaId?: number;

    modeloId?: number;

    estadoNombre?: string;

    destinoId?: number;
}

export const obtenerReles = async (
    page: number,
    size: number,
    texto: string,
    filtroEstado: "ACTIVOS" | "INACTIVOS" | "TODOS",
    sort: string = "id,desc",
    filtros: FiltrosRele = {}
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
                    sort,
                    marcaId: filtros.marcaId,
                    modeloId: filtros.modeloId,
                    estadoNombre: filtros.estadoNombre,
                    destinoId: filtros.destinoId
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

// Usado por la accion ABRIR_RELE del Copiloto IA: resuelve un numero de
// serie al rele correspondiente (mismo endpoint que ya usa la busqueda
// puntual por serie), para poder navegar a /reles/{id}.
export async function buscarRelePorSerie(
    numeroSerie: string
): Promise<Rele> {

    const response =
        await api.get(
            `/reles/serial/${encodeURIComponent(numeroSerie)}`
        );

    return response.data;
}
