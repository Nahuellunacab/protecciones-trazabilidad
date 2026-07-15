import { useEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";

import {
    Alert,
    Button,
    Paper,
    Snackbar,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";

import TodayIcon
from "@mui/icons-material/Today";

import DateRangeIcon
from "@mui/icons-material/DateRange";

import CalendarMonthIcon
from "@mui/icons-material/CalendarMonth";

import AllInclusiveIcon
from "@mui/icons-material/AllInclusive";

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

import { extraerMensajeError }
from "../utils/errorUtils";

import {
    exportarMovimientosExcel
}
from "../services/movimientoService";

import FileDownloadIcon
from "@mui/icons-material/FileDownload";

import { useAuth } from "../context/AuthContext";

function MovimientoPage() {

    const { canWrite } = useAuth();

    const [searchParams] =
        useSearchParams();

    const releIdPreseleccionado =
        searchParams.get("releId");

    const [movimientos, setMovimientos] =
        useState<Movimiento[]>([]);

    const [cargando, setCargando] =
        useState(true);

    const [errorCarga, setErrorCarga] =
        useState("");

    const [errorExport, setErrorExport] =
        useState("");

    type FiltroFecha =
        "HOY" | "SEMANA" | "MES" | "TODOS";

    const [filtroFecha, setFiltroFecha] =
        useState<FiltroFecha>("TODOS");

    const NOMBRES_ARCHIVO:
        Record<FiltroFecha, string> = {
            HOY: "movimientos_hoy.xlsx",
            SEMANA: "movimientos_semana.xlsx",
            MES: "movimientos_mes.xlsx",
            TODOS: "movimientos_completo.xlsx"
        };

    const DESCRIPCION_RANGO:
        Record<FiltroFecha, string> = {
            HOY: "Movimientos de hoy",
            SEMANA: "Últimos 7 días",
            MES: "Mes en curso",
            TODOS: "Todo el historial"
        };

    const obtenerRangoFecha = (
        filtro: FiltroFecha
    ): {
        desde?: Date;
        hasta?: Date;
    } => {

        const hoy = new Date();

        if (filtro === "HOY") {

            const inicio =
                new Date(
                    hoy.getFullYear(),
                    hoy.getMonth(),
                    hoy.getDate()
                );

            const fin =
                new Date(
                    hoy.getFullYear(),
                    hoy.getMonth(),
                    hoy.getDate(),
                    23, 59, 59, 999
                );

            return { desde: inicio, hasta: fin };
        }

        if (filtro === "SEMANA") {

            const inicio =
                new Date(hoy);

            inicio.setDate(
                hoy.getDate() - 7
            );

            return { desde: inicio, hasta: hoy };
        }

        if (filtro === "MES") {

            const inicio =
                new Date(
                    hoy.getFullYear(),
                    hoy.getMonth(),
                    1
                );

            return { desde: inicio, hasta: hoy };
        }

        return {};
    };

    const formatearISO = (fecha: Date) =>
        fecha.toISOString().split("T")[0];

    const cargarMovimientos =
        async () => {

        try {

            setCargando(true);

            const data =
                await obtenerMovimientos();

            setMovimientos(data);

            setErrorCarga("");

        } catch (error) {

            setErrorCarga(
                extraerMensajeError(
                    error,
                    "No se pudo cargar el listado de movimientos. Intente nuevamente."
                )
            );

        } finally {

            setCargando(false);
        }
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

        try {

            const { desde, hasta } =
                obtenerRangoFecha(filtroFecha);

            await exportarMovimientosExcel(
                NOMBRES_ARCHIVO[filtroFecha],
                desde && formatearISO(desde),
                hasta && formatearISO(hasta)
            );

        } catch (error) {

            setErrorExport(
                extraerMensajeError(
                    error,
                    "No se pudo generar el informe. Intentá nuevamente."
                )
            );
        }
    };

    const { desde: desdeFiltro, hasta: hastaFiltro } =
        obtenerRangoFecha(filtroFecha);

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

                if (desdeFiltro && fecha < desdeFiltro) {

                    return false;
                }

                if (hastaFiltro && fecha > hastaFiltro) {

                    return false;
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

            {canWrite && (

                <MovimientoForm
                    onCreate={handleCreate}
                    releIdPreseleccionado={
                        releIdPreseleccionado
                            ? Number(releIdPreseleccionado)
                            : undefined
                    }
                />
            )}

            <Snackbar
                open={!!errorCarga}
                autoHideDuration={4000}
                onClose={() =>
                    setErrorCarga("")
                }
            >

                <Alert severity="error">

                    {errorCarga}

                </Alert>

            </Snackbar>

            <Snackbar
                open={!!errorExport}
                autoHideDuration={4000}
                onClose={() =>
                    setErrorExport("")
                }
            >

                <Alert severity="error">

                    {errorExport}

                </Alert>

            </Snackbar>

            <Paper
                variant="outlined"
                sx={{
                    p: 2,
                    mb: 2,
                    mt: 3,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2
                }}
            >

                <Stack spacing={0.5}>

                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                    >
                        Período
                    </Typography>

                    <ToggleButtonGroup

                        value={filtroFecha}

                        exclusive

                        size="small"

                        onChange={(_, value) => {

                            if (value) {

                                setFiltroFecha(
                                    value
                                );
                            }
                        }}
                    >

                        <ToggleButton value="HOY">
                            <TodayIcon
                                fontSize="small"
                                sx={{ mr: 0.5 }}
                            />
                            Hoy
                        </ToggleButton>

                        <ToggleButton value="SEMANA">
                            <DateRangeIcon
                                fontSize="small"
                                sx={{ mr: 0.5 }}
                            />
                            Semana
                        </ToggleButton>

                        <ToggleButton value="MES">
                            <CalendarMonthIcon
                                fontSize="small"
                                sx={{ mr: 0.5 }}
                            />
                            Mes
                        </ToggleButton>

                        <ToggleButton value="TODOS">
                            <AllInclusiveIcon
                                fontSize="small"
                                sx={{ mr: 0.5 }}
                            />
                            Todos
                        </ToggleButton>

                    </ToggleButtonGroup>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >

                        {DESCRIPCION_RANGO[filtroFecha]}
                        {" · "}
                        {movimientosFiltrados.length}
                        {" "}
                        {
                            movimientosFiltrados.length === 1
                                ? "movimiento"
                                : "movimientos"
                        }

                    </Typography>

                </Stack>

                <Button
                    variant="contained"
                    startIcon={<FileDownloadIcon />}
                    onClick={handleExportarExcel}
                    disabled={movimientosFiltrados.length === 0}
                >

                    Exportar Informe

                </Button>

            </Paper>

            <MovimientoTable
                movimientos={
                    movimientosFiltrados
                }
                cargando={cargando}
            />

        </div>
    );
}

export default MovimientoPage;