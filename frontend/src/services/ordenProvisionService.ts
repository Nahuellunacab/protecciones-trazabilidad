import api from "../api/axios";

import type {
    OrdenProvision
} from "../types/OrdenProvision";

import type {
    OrdenProvisionRequest
} from "../types/OrdenProvisionRequest";

export async function
obtenerOrdenesProvision() {

    const response =
        await api.get<OrdenProvision[]>(

            "/ordenes-provision"
        );

    return response.data;
}

export async function
obtenerOrdenesProvisionDisponibles() {

    const response =
        await api.get<OrdenProvision[]>(

            "/ordenes-provision/disponibles"
        );

    return response.data;
}

export async function
crearOrdenProvision(
    data: OrdenProvisionRequest
) {

    const response =
        await api.post(

            "/ordenes-provision",

            data
        );

    return response.data;
}

export async function
actualizarOrdenProvision(

    id: number,

    data: OrdenProvisionRequest

) {

    const response =
        await api.put(

            `/ordenes-provision/${id}`,

            data
        );

    return response.data;
}

export async function
eliminarOrdenProvision(
    id: number
) {

    await api.delete(

        `/ordenes-provision/${id}`
    );
}

export async function subirArchivoOP(
    opId: number,
    archivo: File
) {

    const formData =
        new FormData();

    formData.append(
        "archivo",
        archivo
    );

    await api.post(
        `/ordenes-provision/${opId}/archivo`,
        formData
    );
}