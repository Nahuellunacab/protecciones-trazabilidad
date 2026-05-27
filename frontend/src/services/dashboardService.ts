import api from "../api/axios";

import type {
    DashboardKpi
} from "../types/DashboardKpi";

import type {
    Movimiento
} from "../types/Movimiento";

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