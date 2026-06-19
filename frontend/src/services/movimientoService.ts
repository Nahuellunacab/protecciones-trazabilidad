import api from "../api/axios";

import type { Movimiento }
from "../types/Movimiento";

import type { MovimientoRequest }
from "../types/MovimientoRequest";

export const obtenerMovimientos =
    async (): Promise<Movimiento[]> => {

        const response =
            await api.get("/movimientos");

        return response.data;
    };

export const obtenerHistorialPorRele =
    async (
        releId: number
    ): Promise<Movimiento[]> => {

        const response =
            await api.get(
                `/reles/${releId}/movimientos`
            );

        return response.data;
    };

export const crearMovimiento =
    async (
        movimiento: MovimientoRequest
    ): Promise<void> => {

        await api.post(
            "/movimientos",
            movimiento
        );
    };

export const exportarMovimientosExcel =
    async () => {

        const response =
            await api.get(
                "/movimientos/exportar",
                {
                    responseType: "blob"
                }
            );

        const url =
            window.URL.createObjectURL(
                new Blob([response.data])
            );

        const link =
            document.createElement("a");

        link.href = url;

        link.setAttribute(
            "download",
            "movimientos.xlsx"
        );

        document.body.appendChild(
            link
        );

        link.click();

        link.remove();
    };