import { useEffect, useState } from "react";

import {
    Box,
    Button
} from "@mui/material";

import {
    obtenerMovimientos,
    crearMovimiento
} from "../services/movimientoService";

import type {
    Movimiento
} from "../types/Movimiento";

import type {
    MovimientoRequest
} from "../types/MovimientoRequest";

import MovimientoForm from "../components/movimiento/MovimientoForm";

import MovimientoTable from "../components/movimiento/MovimientoTable";

import PageHeader from "../components/common/PageHeader";

import {
    exportarMovimientosExcel
}
from "../services/movimientoService";

import FileDownloadIcon
from "@mui/icons-material/FileDownload";

function MovimientoPage() {

    const [movimientos, setMovimientos] =
        useState<Movimiento[]>([]);

    const cargarMovimientos =
        async () => {

        const data =
            await obtenerMovimientos();

        setMovimientos(data);
    };

    useEffect(() => {

        cargarMovimientos();

    }, []);

    const handleCreate = async (
        data: MovimientoRequest
    ) => {

        await crearMovimiento(data);

        await cargarMovimientos();
    };

    const handleExportarExcel =
        async () => {

            await exportarMovimientosExcel();
        };

    return (

        <div>

            <PageHeader
                title="Movimientos"
                subtitle="
                Gestión operativa y
                trazabilidad de relés.
                "
            />

            <MovimientoForm
                onCreate={handleCreate}
            />

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mb: 2,
                    mt: 3
                }}
            >

                <Button
                    variant="contained"
                    startIcon={<FileDownloadIcon />}
                    onClick={handleExportarExcel}
                >

                    Exportar Informe

                </Button>

            </Box>

            <MovimientoTable
                movimientos={movimientos}
            />

        </div>
    );
}

export default MovimientoPage;