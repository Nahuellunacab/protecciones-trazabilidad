import api from "../api/axios";

import type { Rele } from "../types/Rele";
import type { ReleRequest } from "../types/ReleRequest";
import type { ReleOption } from "../types/ReleOption";

// Se traen 5000 relés páginados del Backend.
export const obtenerReles = async (): Promise<Rele[]> => {

    const response =
        // await = esperar hasta que responda
        await api.get(
            "/reles?page=0&size=5000"
        );

    return response.data.content;
};

// Crear un rele con formato ReleRequest
export const crearRele = async (
    rele: ReleRequest
): Promise<void> => {

    await api.post("/reles", rele);
};

// Actualizar rele con id y demas datos
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

// Obtener catalogos de reles, se muestran los reles de las opciones.
export async function obtenerOpciones():
Promise<ReleOption[]> {

    const response =
        await api.get("/reles/opciones");

    return response.data;
}

// Obtener reles por ID
export async function obtenerRelePorId(
    id: number
): Promise<Rele> {

    const response =
        await api.get(
            `/reles/${id}`
        );

    return response.data;
}

// Dar de baja un rele con id y motivo
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