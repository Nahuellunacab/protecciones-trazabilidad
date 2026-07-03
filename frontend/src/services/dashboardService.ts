import api from "../api/axios";

import type {
    DashboardKpi
} from "../types/DashboardKpi";

import type {
    Movimiento
} from "../types/Movimiento";

import type { MarcaCantidad } from "../types/MarcaCantidad";
import type { ModeloCantidad } from "../types/ModeloCantidad";

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
obtenerUltimosMovimientos():
Promise<Movimiento[]> {

    const response =
        await api.get(
            "/dashboard/movimientos"
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