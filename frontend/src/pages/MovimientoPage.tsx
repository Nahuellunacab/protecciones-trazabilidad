import { useEffect, useState } from "react";

import {
    Box,
    Button,
    ToggleButton,
    ToggleButtonGroup
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

    const [filtroFecha, setFiltroFecha] =
        useState<
            "HOY"
            |
            "SEMANA"
            |
            "MES"
            |
            "TODOS"
        >("TODOS");

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

            const hoy =
                new Date();

            let nombreArchivo =
                "movimientos_completo.xlsx";

            let desde:
                string | undefined;

            let hasta:
                string | undefined;

            if (
                filtroFecha === "HOY"
            ) {

                const fecha =
                    hoy.toISOString()
                        .split("T")[0];

                desde = fecha;
                hasta = fecha;

                nombreArchivo =
                    "movimientos_hoy.xlsx";
            }

            if (
                filtroFecha === "SEMANA"
            ) {

                const hace7Dias =
                    new Date();

                hace7Dias.setDate(
                    hoy.getDate() - 7
                );

                desde =
                    hace7Dias
                        .toISOString()
                        .split("T")[0];

                hasta =
                    hoy
                        .toISOString()
                        .split("T")[0];

                nombreArchivo =
                    "movimientos_semana.xlsx";
            }

            if (
                filtroFecha === "MES"
            ) {

                const primerDia =
                    new Date(
                        hoy.getFullYear(),
                        hoy.getMonth(),
                        1
                    );

                desde =
                    primerDia
                        .toISOString()
                        .split("T")[0];

                hasta =
                    hoy
                        .toISOString()
                        .split("T")[0];

                nombreArchivo =
                    "movimientos_mes.xlsx";
            }

            await exportarMovimientosExcel(
                nombreArchivo,
                desde,
                hasta
            );
    };
    const movimientosFiltrados =
        movimientos.filter(
            (movimiento) => {

                if (
                    filtroFecha === "TODOS"
                ) {

                    return true;
                }

                const fecha =
                    new Date(
                        movimiento.fechaMovimiento
                    );

                const hoy =
                    new Date();

                if (
                    filtroFecha === "HOY"
                ) {

                    return (

                        fecha.toDateString()

                        ===

                        hoy.toDateString()
                    );
                }

                if (
                    filtroFecha === "SEMANA"
                ) {

                    const hace7Dias =
                        new Date();

                    hace7Dias.setDate(
                        hoy.getDate() - 7
                    );

                    return fecha >= hace7Dias;
                }

                if (
                    filtroFecha === "MES"
                ) {

                    return (

                        fecha.getMonth()

                        ===

                        hoy.getMonth()

                        &&

                        fecha.getFullYear()

                        ===

                        hoy.getFullYear()
                    );
                }

                return true;
            }
        );

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

                <ToggleButtonGroup

                    value={filtroFecha}

                    exclusive

                    onChange={(_, value) => {

                        if (value) {

                            setFiltroFecha(
                                value
                            );
                        }
                    }}

                    sx={{
                        mb: 2
                    }}
                >

                    <ToggleButton value="HOY">
                        Hoy
                    </ToggleButton>

                    <ToggleButton value="SEMANA">
                        Semana
                    </ToggleButton>

                    <ToggleButton value="MES">
                        Mes
                    </ToggleButton>

                    <ToggleButton value="TODOS">
                        Todos
                    </ToggleButton>

                </ToggleButtonGroup>

                <Button
                    variant="contained"
                    startIcon={<FileDownloadIcon />}
                    onClick={handleExportarExcel}
                >

                    Exportar Informe

                </Button>

            </Box>

            <MovimientoTable
                movimientos={
                    movimientosFiltrados
                }
            />

        </div>
    );
}

export default MovimientoPage;