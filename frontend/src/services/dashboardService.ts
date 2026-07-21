import api from "../api/axios";

import type {
    DashboardKpi
} from "../types/DashboardKpi";

import type {
    Movimiento
} from "../types/Movimiento";

import type { MarcaCantidad } from "../types/MarcaCantidad";

import type { ModeloCantidad } from "../types/ModeloCantidad";

import type { EstadoCantidad } from "../types/EstadoCantidad";

import type { DestinoCantidad } from "../types/DestinoCantidad";

import type { ProveedorCantidad } from "../types/ProveedorCantidad";

import type { UsuarioCantidad } from "../types/UsuarioCantidad";

import type { ResumenIA } from "../types/ResumenIA";

import type { EstadoSistema } from "../types/EstadoSistema";

export async function
obtenerDashboardKpis():
Promise<DashboardKpi> {

    const response =
        await api.get(
            "/dashboard/kpis"
        );

    return response.data;
}

export async function
obtenerEstadoSistema():
Promise<EstadoSistema> {

    const response =
        await api.get(
            "/dashboard/estado-sistema"
        );

    return response.data;
}

export async function
obtenerResumenIA(
    forzar?: boolean
):
Promise<ResumenIA> {

    const response =
        await api.get(
            "/dashboard/resumen-ia",
            {
                params: {
                    forzar
                }
            }
        );

    return response.data;
}

export async function
obtenerUltimosMovimientos(
    limite?: number,
    desde?: string,
    hasta?: string
):
Promise<Movimiento[]> {

    const response =
        await api.get(
            "/dashboard/movimientos",
            {
                params: {
                    limite,
                    desde,
                    hasta
                }
            }
        );

    return response.data;
}

export const obtenerRelesPorMarca =
    async (): Promise<MarcaCantidad[]> => {

        const response =
            await api.get(
                "/dashboard/marcas"
            );

        return response.data;
    };

export const obtenerRelesPorModelo =
    async (): Promise<ModeloCantidad[]> => {

        const response =
            await api.get(
                "/dashboard/modelos"
            );

        return response.data;
    };

export const obtenerRelesPorEstado =
    async (): Promise<EstadoCantidad[]> => {

        const response =
            await api.get(
                "/dashboard/estados"
            );

        return response.data;
    };

export const obtenerRelesPorDestino =
    async (): Promise<DestinoCantidad[]> => {

        const response =
            await api.get(
                "/dashboard/destinos"
            );

        return response.data;
    };

export const obtenerRelesPorProveedor =
    async (): Promise<ProveedorCantidad[]> => {

        const response =
            await api.get(
                "/dashboard/proveedores"
            );

        return response.data;
    };

export const obtenerMovimientosPorUsuario =
    async (): Promise<UsuarioCantidad[]> => {

        const response =
            await api.get(
                "/dashboard/usuarios"
            );

        return response.data;
    };

const descargarBlob =
    (
        data: BlobPart,
        nombreArchivo: string
    ) => {

        const fileUrl =
            window.URL.createObjectURL(
                new Blob([data])
            );

        const link =
            document.createElement("a");

        link.href = fileUrl;

        link.setAttribute(
            "download",
            nombreArchivo
        );

        document.body.appendChild(
            link
        );

        link.click();

        link.remove();
    };

export const exportarDashboardExcel =
    async () => {

        const response =
            await api.get(
                "/dashboard/exportar",
                {
                    responseType: "blob"
                }
            );

        descargarBlob(response.data, "dashboard.xlsx");
    };

export const exportarDashboardPdf =
    async () => {

        const response =
            await api.get(
                "/dashboard/exportar-pdf",
                {
                    responseType: "blob"
                }
            );

        descargarBlob(response.data, "dashboard.pdf");
    };
