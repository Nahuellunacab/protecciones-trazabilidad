import api from "../api/axios";

import type {
    Proveedor
} from "../types/Proveedor";

import type {
    ProveedorRequest
} from "../types/ProveedorRequest";

export async function obtenerProveedores():
Promise<Proveedor[]> {

    const response =
        await api.get(
            "/proveedores"
        );

    return response.data;
}

export async function crearProveedor(
    data: ProveedorRequest
) {

    const response =
        await api.post(
            "/proveedores",
            data
        );

    return response.data;
}

export async function actualizarProveedor(

    id: number,
    data: ProveedorRequest
) {

    const response =
        await api.put(
            `/proveedores/${id}`,
            data
        );

    return response.data;
}

export async function eliminarProveedor(
    id: number
) {

    await api.delete(
        `/proveedores/${id}`
    );
}