import { useState } from "react";

import { useNavigate } from "react-router-dom";

import type { Rele }
from "../../types/Rele";

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
    ToggleButton,
    ToggleButtonGroup,
    Box,
    Tooltip,
    IconButton,
    Skeleton,
} from "@mui/material";

import PictureAsPdfIcon
from "@mui/icons-material/PictureAsPdf";

import EmptyState
from "../common/EmptyState";

import ContentCopyIcon
from "@mui/icons-material/ContentCopy";

import CheckIcon
from "@mui/icons-material/Check";

import EditIcon
from "@mui/icons-material/Edit";

import HistoryIcon
from "@mui/icons-material/History";

interface Props {

    reles: Rele[];

    cargando: boolean;

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

    canWrite: boolean;
}

function ReleTable({
    reles,
    cargando,
    onEditar,
    filtroEstado,
    setFiltroEstado,
    canWrite
}: Props) {

    const navigate = useNavigate();

    const [
        copiedId,
        setCopiedId
    ] = useState<number | null>(null);

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

    const handleCopy = async (
        texto: string | undefined,
        id: number
    ) => {

        if (!texto) return;

        try {

            if (
                navigator &&
                navigator.clipboard &&
                navigator.clipboard.writeText
            ) {

                await navigator.clipboard.writeText(texto);

            } else {

                const ta = document.createElement("textarea");
                ta.value = texto;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                document.body.removeChild(ta);
            }

            setCopiedId(id);

            setTimeout(
                () => setCopiedId(null),
                1500
            );

        } catch (err) {

            console.error(
                "Error copying text",
                err
            );
        }
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
                            cargando && (

                                Array.from(
                                    { length: 5 }
                                ).map(
                                    (_, indice) => (

                                        <TableRow
                                            key={
                                                `skeleton-${indice}`
                                            }
                                        >

                                            {
                                                Array.from(
                                                    { length: 10 }
                                                ).map(
                                                    (_, columna) => (

                                                        <TableCell
                                                            key={columna}
                                                        >

                                                            <Skeleton
                                                                variant="text"
                                                            />

                                                        </TableCell>
                                                    )
                                                )
                                            }

                                        </TableRow>
                                    )
                                )
                            )
                        }

                        {
                            !cargando
                            &&
                            reles.length === 0 && (

                                <TableRow>

                                    <TableCell colSpan={10}>

                                        <EmptyState
                                            titulo="No se encontraron relés"
                                            subtitulo="Probá ajustar la búsqueda o el filtro de estado."
                                        />

                                    </TableCell>

                                </TableRow>
                            )
                        }

                        {
                            !cargando
                            &&
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

                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                                                {
                                                    rele.codigoConfiguracion
                                                        ? (
                                                            <>
                                                                <Typography>
                                                                    {rele.codigoConfiguracion}
                                                                </Typography>

                                                                <Tooltip title={copiedId === rele.id ? "Copiado" : "Copiar"}>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() =>
                                                                            handleCopy(
                                                                                rele.codigoConfiguracion ?? undefined,
                                                                                rele.id
                                                                            )
                                                                        }
                                                                    >
                                                                        {
                                                                            copiedId === rele.id
                                                                                ? <CheckIcon fontSize="small" color="success" />
                                                                                : <ContentCopyIcon fontSize="small" />
                                                                        }
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </>
                                                        )
                                                        : "-"
                                                }

                                            </Box>

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
                                                                        `/api/remitos/${rele.remitoId}/archivo`,
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
                                                                        `/api/ordenes-provision/${rele.ordenProvisionId}/archivo`,
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

                                        <TableCell align="center">

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    gap: 0.5,
                                                    justifyContent: "center"
                                                }}
                                            >

                                                {canWrite && (

                                                    <Tooltip title="Editar">

                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() =>
                                                                onEditar(
                                                                    rele
                                                                )
                                                            }
                                                        >

                                                            <EditIcon fontSize="small" />

                                                        </IconButton>

                                                    </Tooltip>
                                                )}

                                                <Tooltip title="Ver detalle">

                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() =>
                                                            navigate(
                                                                `/reles/${rele.id}`
                                                            )
                                                        }
                                                    >

                                                        <HistoryIcon fontSize="small" />

                                                    </IconButton>

                                                </Tooltip>

                                            </Box>

                                        </TableCell>

                                    </TableRow>
                                )
                            )
                        }

                    </TableBody>

                </Table>

            </TableContainer>

        </>
    );
}

export default ReleTable;
