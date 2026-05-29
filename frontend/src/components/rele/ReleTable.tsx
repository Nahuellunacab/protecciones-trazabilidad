import { useState } from "react";

import type { Rele }
from "../../types/Rele";

import type { Movimiento }
from "../../types/Movimiento";

import {

    obtenerHistorialPorRele

} from "../../services/movimientoService";

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    Stack,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    ToggleButton,
    ToggleButtonGroup,
    CircularProgress
} from "@mui/material";

interface Props {

    reles: Rele[];

    onEditar: (
        rele: Rele
    ) => void;
}

function ReleTable({
    reles,
    onEditar
}: Props) {

    const [
        filtro,
        setFiltro
    ] = useState<
        "ACTIVOS"
        |
        "INACTIVOS"
        |
        "TODOS"
    >("ACTIVOS");

    const [
        historialOpen,
        setHistorialOpen
    ] = useState(false);

    const [
        historial,
        setHistorial
    ] = useState<Movimiento[]>([]);

    const [
        historialLoading,
        setHistorialLoading
    ] = useState(false);

    const [
        releHistorial,
        setReleHistorial
    ] = useState<Rele | null>(null);

    const relesFiltrados =
        reles.filter((rele) => {

            if (filtro === "ACTIVOS") {
                return rele.activo;
            }

            if (filtro === "INACTIVOS") {
                return !rele.activo;
            }

            return true;
        });

    const handleVerHistorial =
    async (
        rele: Rele
    ) => {

        try {

            setHistorialLoading(true);

            setReleHistorial(rele);

            const data =
                await obtenerHistorialPorRele(
                    rele.id
                );

            setHistorial(data);

            setHistorialOpen(true);

        } catch (error) {

            console.error(error);

        } finally {

            setHistorialLoading(false);
        }
    };

    const formatearFecha = (
        fecha: string
    ) => {

        return new Date(fecha)
            .toLocaleString(
                "es-AR",
                {

                    day: "2-digit",

                    month: "2-digit",

                    year: "numeric",

                    hour: "2-digit",

                    minute: "2-digit"
                }
            );
    };

    return (

        <>

            <Stack
                direction="row"
                spacing={2}
                sx={{ mb: 2 }}
            >

                <ToggleButtonGroup
                    exclusive
                    value={filtro}
                    onChange={(_, value) => {

                        if (value) {
                            setFiltro(value);
                        }
                    }}
                >

                    <ToggleButton value="ACTIVOS">
                        Activos
                    </ToggleButton>

                    <ToggleButton value="INACTIVOS">
                        Inactivos
                    </ToggleButton>

                    <ToggleButton value="TODOS">
                        Todos
                    </ToggleButton>

                </ToggleButtonGroup>

            </Stack>

            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: 4
                }}
            >

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>
                                Serie
                            </TableCell>

                            <TableCell>
                                Marca
                            </TableCell>

                            <TableCell>
                                Modelo
                            </TableCell>

                            <TableCell>
                                Tensión
                            </TableCell>

                            <TableCell>
                                Estado
                            </TableCell>

                            <TableCell>
                                Ubicación
                            </TableCell>

                            <TableCell>
                                Posición
                            </TableCell>

                            <TableCell>
                                Garantía
                            </TableCell>

                            <TableCell
                                align="center"
                            >
                                Acciones
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {
                            relesFiltrados.map(
                                (rele) => (

                                <TableRow
                                    key={rele.id}
                                    hover
                                    sx={{

                                        opacity:
                                            rele.activo
                                                ? 1
                                                : 0.55
                                    }}
                                >

                                    <TableCell>
                                        {
                                            rele.numeroSerie
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {rele.marca}
                                    </TableCell>

                                    <TableCell>
                                        {rele.modelo}
                                    </TableCell>

                                    <TableCell>

                                        {
                                            rele.tension
                                            || "-"
                                        }

                                    </TableCell>

                                    <TableCell>

                                        <Chip
                                            label={
                                                rele.estadoActual
                                                ||
                                                "Sin estado"
                                            }
                                            color={
                                                rele.activo
                                                    ? "success"
                                                    : "default"
                                            }
                                            size="small"
                                        />

                                    </TableCell>

                                    <TableCell>

                                        {
                                            rele.localidadActual
                                            ||
                                            "-"
                                        }

                                    </TableCell>

                                    <TableCell>

                                        {
                                            rele.posicionActual
                                            ||
                                            "-"
                                        }

                                    </TableCell>

                                    <TableCell>

                                        {
                                            rele.finGarantia
                                                ? formatearFecha(
                                                    rele.finGarantia
                                                )
                                                : "-"
                                        }

                                    </TableCell>

                                    <TableCell>

                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            justifyContent="center"
                                        >

                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() =>
                                                    onEditar(
                                                        rele
                                                    )
                                                }
                                            >

                                                EDITAR

                                            </Button>

                                            <Button
                                                size="small"
                                                variant="contained"
                                                onClick={() =>
                                                    handleVerHistorial(
                                                        rele
                                                    )
                                                }
                                            >

                                                HISTORIAL

                                            </Button>

                                        </Stack>

                                    </TableCell>

                                </TableRow>
                            ))
                        }

                    </TableBody>

                </Table>

            </TableContainer>

            <Dialog
                open={historialOpen}
                onClose={() =>
                    setHistorialOpen(false)
                }
                maxWidth="md"
                fullWidth
            >

                <DialogTitle>

                    Historial de Movimientos

                    {
                        releHistorial && (
                            <>
                                {" - "}
                                {
                                    releHistorial.numeroSerie
                                }
                            </>
                        )
                    }

                </DialogTitle>

                <DialogContent dividers>

                    {
                        historialLoading ? (

                            <Stack
                                alignItems="center"
                                py={4}
                            >

                                <CircularProgress />

                            </Stack>

                        ) : historial.length === 0 ? (

                            <Typography>

                                No hay movimientos registrados.

                            </Typography>

                        ) : (

                            <Table size="small">

                                <TableHead>

                                    <TableRow>

                                        <TableCell>
                                            Fecha
                                        </TableCell>

                                        <TableCell>
                                            Estado
                                        </TableCell>

                                        <TableCell>
                                            Ubicación
                                        </TableCell>

                                        <TableCell>
                                            Posición
                                        </TableCell>

                                        <TableCell>
                                            Responsable
                                        </TableCell>

                                        <TableCell>
                                            Notas
                                        </TableCell>

                                    </TableRow>

                                </TableHead>

                                <TableBody>

                                    {
                                        historial.map(
                                            (movimiento) => (

                                            <TableRow
                                                key={
                                                    movimiento.id
                                                }
                                            >

                                                <TableCell>

                                                    {
                                                        formatearFecha(
                                                            movimiento.fechaMovimiento
                                                        )
                                                    }

                                                </TableCell>

                                                <TableCell>

                                                    {
                                                        movimiento.estado
                                                    }

                                                </TableCell>

                                                <TableCell>

                                                    {
                                                        movimiento.localidad
                                                        ||
                                                        "-"
                                                    }

                                                </TableCell>

                                                <TableCell>

                                                    {
                                                        movimiento.posicion
                                                        ||
                                                        "-"
                                                    }

                                                </TableCell>

                                                <TableCell>

                                                    {
                                                        movimiento.responsable
                                                    }

                                                </TableCell>

                                                <TableCell>

                                                    {
                                                        movimiento.notas
                                                        ||
                                                        "-"
                                                    }

                                                </TableCell>

                                            </TableRow>
                                        ))
                                    }

                                </TableBody>

                            </Table>
                        )
                    }

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={() =>
                            setHistorialOpen(false)
                        }
                    >

                        CERRAR

                    </Button>

                </DialogActions>

            </Dialog>

        </>
    );
}

export default ReleTable;