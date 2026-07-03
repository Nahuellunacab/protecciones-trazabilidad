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
    CircularProgress,
    Box,
    Tooltip,
} from "@mui/material";

import PictureAsPdfIcon
from "@mui/icons-material/PictureAsPdf";

interface Props {

    reles: Rele[];

    filtroEstado:
        "ACTIVOS"
        |
        "INACTIVOS"
        |
        "TODOS";

    setFiltroEstado:
        (
            value:
                "ACTIVOS"
                |
                "INACTIVOS"
                |
                "TODOS"
        ) => void;

    onEditar: (
        rele: Rele
    ) => void;
}

function ReleTable({
    reles,
    onEditar,
    filtroEstado,
    setFiltroEstado
}: Props) {

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
        
    const getEstadoColor = (estado: string) => {

        switch (estado?.toUpperCase()) {

            case "EN STOCK":
                return "success";

            case "ENSAYO":
                return "info";

            case "APROBADO":
                return "primary";

            case "REPARACION":
                return "warning";

            case "INSTALADO":
                return "secondary";

            case "BAJA":
                return "error";

            case "SIN HISTORIAL":
                return "default";

            default:
                return "default";
        }
    };
        
    
    
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
                    value={filtroEstado}
                    onChange={(_, value) => {

                        if (value) {
                            setFiltroEstado(value);
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
                                Cod. Config
                            </TableCell>

                            <TableCell>
                                Marca
                            </TableCell>

                            <TableCell>
                                Modelo
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

                            <TableCell align="center">
                                Documentación
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
                            reles.map(
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

                                            <Typography
                                                sx={{
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {rele.numeroSerie}
                                            </Typography>

                                        </TableCell>

                                        <TableCell>

                                        {
                                            rele.codigoConfiguracion
                                                || "-"
                                        }

                                        </TableCell>

                                        <TableCell>
                                            {rele.marca}
                                        </TableCell>

                                        <TableCell>
                                            {rele.modelo}
                                        </TableCell>

                                        <TableCell>

                                            <Chip
                                                label={
                                                    rele.estadoActual ||
                                                    "SIN HISTORIAL"
                                                }
                                                color={
                                                    getEstadoColor(
                                                        rele.estadoActual
                                                    )
                                                }
                                                size="small"                                                variant="outlined"
                                            />

                                        </TableCell>

                                        <TableCell>

                                            {
                                                rele.localidadActual
                                                    ? (
                                                        <Chip
                                                            label={
                                                                rele.localidadActual
                                                            }
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    )
                                                    : "-"
                                            }

                                        </TableCell>

                                        <TableCell>

                                            <Chip
                                                label={
                                                    rele.posicionActual ||
                                                    "NO ASIGNADA"
                                                }
                                                size="small"
                                                color={
                                                    rele.posicionActual ===
                                                    "NO ASIGNADA"
                                                        ? "default"
                                                        : "primary"
                                                }
                                                variant={
                                                    rele.posicionActual ===
                                                    "NO ASIGNADA"
                                                        ? "outlined"
                                                        : "filled"
                                                }
                                            />

                                        </TableCell>

                                        <TableCell>

                                        {
                                            rele.estadoGarantia === "SIN GARANTIA" ? (

                                                <Chip
                                                    label="SIN GARANTÍA"
                                                    size="small"
                                                    color="default"
                                                />

                                            ) : rele.estadoGarantia === "VENCIDA" ? (

                                                <Chip
                                                    label="VENCIDA"
                                                    size="small"
                                                    color="error"
                                                />

                                            ) : rele.estadoGarantia === "POR VENCER" ? (

                                                <Chip
                                                    label={`${rele.mesesRestantesGarantia} meses`}
                                                    size="small"
                                                    color="warning"
                                                />

                                            ) : (

                                                <Chip
                                                    label={`${rele.mesesRestantesGarantia} meses`}
                                                    size="small"
                                                    color="success"
                                                />

                                            )
                                        }

                                    </TableCell>

                                        <TableCell align="center">

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    gap: 1,
                                                    justifyContent: "center"
                                                }}
                                            >

                                                {
                                                    rele.remitoId && (

                                                        <Tooltip title="Ver Remito">

                                                            <Button
                                                                size="small"
                                                                variant="text"
                                                                startIcon={<PictureAsPdfIcon />}
                                                                onClick={() =>
                                                                    window.open(
                                                                        `http://localhost:8080/api/remitos/${rele.remitoId}/archivo`,
                                                                        "_blank"
                                                                    )
                                                                }
                                                            >
                                                                REM
                                                            </Button>

                                                        </Tooltip>

                                                    )
                                                }

                                                {
                                                    rele.ordenProvisionId && (

                                                        <Tooltip title="Ver Orden de Provisión">

                                                            <Button
                                                                size="small"
                                                                variant="text"
                                                                startIcon={<PictureAsPdfIcon />}
                                                                onClick={() =>
                                                                    window.open(
                                                                        `http://localhost:8080/api/ordenes-provision/${rele.ordenProvisionId}/archivo`,
                                                                        "_blank"
                                                                    )
                                                                }
                                                            >
                                                                OP
                                                            </Button>

                                                        </Tooltip>
                                                    )
                                                }

                                                {
                                                    !rele.remitoId &&
                                                    !rele.ordenProvisionId &&
                                                    "-"
                                                }

                                            </Box>

                                        </TableCell>

                                        <TableCell>

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    gap: 1,
                                                    justifyContent: "center"
                                                }}
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

                                            </Box>

                                        </TableCell>

                                    </TableRow>
                                )
                            )
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

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: 1,
                                    justifyContent: "center"
                                }}
                            >

                                <CircularProgress />

                            </Box>

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
