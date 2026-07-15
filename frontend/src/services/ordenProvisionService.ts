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

interface OrdenProvisionPageResponse {

    content: OrdenProvision[];

    totalElements: number;
}

export interface FiltrosOrdenProvision {

    asociado?: boolean;
}

export async function
obtenerOrdenesProvisionPaginadas(
    page: number,
    size: number,
    texto: string,
    sort: string = "id,desc",
    filtros: FiltrosOrdenProvision = {}
): Promise<OrdenProvisionPageResponse> {

    const response =
        await api.get(
            "/ordenes-provision/paginado",
            {
                params: {
                    page,
                    size,
                    sort,
                    texto,
                    asociado: filtros.asociado
                }
            }
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

// Igual que abrirArchivoRemito (ver remitoService.ts): no se puede usar
// window.open directo a `/api/...` porque esa ruta requiere el header
// Authorization que solo agrega el interceptor de axios. Se pide el
// archivo como blob autenticado y se abre como object URL.
export async function abrirArchivoOP(
    opId: number
): Promise<void> {

    const ventana =
        window.open(
            "",
            "_blank"
        );

    try {

        const response =
            await api.get(
                `/ordenes-provision/${opId}/archivo`,
                {
                    responseType: "blob"
                }
            );

        const blobUrl =
            URL.createObjectURL(
                response.data
            );

        if (ventana) {

            ventana.location.href =
                blobUrl;

        } else {

            window.open(
                blobUrl,
                "_blank"
            );
        }

    } catch (err) {

        if (ventana) {

            ventana.close();
        }

        throw err;
    }
}