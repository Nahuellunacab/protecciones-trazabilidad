import { useEffect, useState } from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    Box,
    Paper,
    Tabs,
    Tab,
    Typography,
    Chip,
    Grid,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert,
    Snackbar,
    Stack,
    Divider
} from "@mui/material";

import ArrowBackIcon
from "@mui/icons-material/ArrowBack";

import PictureAsPdfIcon
from "@mui/icons-material/PictureAsPdf";

import EditIcon
from "@mui/icons-material/Edit";

import SwapHorizIcon
from "@mui/icons-material/SwapHoriz";

import AccessTimeIcon
from "@mui/icons-material/AccessTime";

import ApartmentIcon
from "@mui/icons-material/Apartment";

import RoomIcon
from "@mui/icons-material/Room";

import PersonOutlineIcon
from "@mui/icons-material/PersonOutlineOutlined";

import NotesIcon
from "@mui/icons-material/Notes";

import type { Rele }
from "../types/Rele";

import type { Movimiento }
from "../types/Movimiento";

import { obtenerRelePorId }
from "../services/releService";

import { obtenerHistorialPorRele }
from "../services/movimientoService";

import { abrirArchivoRemito }
from "../services/remitoService";

import { abrirArchivoOP }
from "../services/ordenProvisionService";

import PageHeader
from "../components/common/PageHeader";

import EmptyState
from "../components/common/EmptyState";

import { useAuth } from "../context/AuthContext";

function getEstadoColor(estado: string) {

    switch (estado?.toUpperCase()) {

        case "EN STOCK":
            return "success" as const;

        case "ENSAYO":
            return "info" as const;

        case "APROBADO":
            return "primary" as const;

        case "REPARACION":
            return "warning" as const;

        case "INSTALADO":
            return "secondary" as const;

        case "BAJA":
            return "error" as const;

        default:
            return "default" as const;
    }
}

function formatearFecha(fecha: string) {

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
}

function ReleDetailPage() {

    const { canWrite } = useAuth();

    const { id } = useParams();

    const navigate = useNavigate();

    const [tab, setTab] = useState(0);

    const [rele, setRele] =
        useState<Rele | null>(null);

    const [historial, setHistorial] =
        useState<Movimiento[]>([]);

    const [cargando, setCargando] =
        useState(true);

    const [error, setError] =
        useState("");

    // Error transitorio al intentar abrir un PDF (remito/OP): se muestra en
    // un Snackbar aparte, sin reemplazar toda la página como hace `error`
    // (que indica que el relé en sí no se pudo cargar).
    const [errorDocumento, setErrorDocumento] =
        useState("");

    useEffect(() => {

        if (!id) return;

        setCargando(true);

        setError("");

        Promise.all([
            obtenerRelePorId(Number(id)),
            obtenerHistorialPorRele(Number(id))
        ])
            .then(([releData, historialData]) => {

                setRele(releData);

                setHistorial(historialData);
            })
            .catch(() => {

                setError(
                    "No se pudo cargar la información del relé."
                );
            })
            .finally(() => {

                setCargando(false);
            });

    }, [id]);

    if (cargando) {

        return (

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    py: 8
                }}
            >

                <CircularProgress />

            </Box>
        );
    }

    if (error || !rele) {

        return (

            <Box>

                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/reles")}
                    sx={{ mb: 2 }}
                >
                    Volver a Relés
                </Button>

                <Alert severity="error">
                    {error || "Relé no encontrado."}
                </Alert>

            </Box>
        );
    }

    return (

        <div>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 2
                }}
            >

                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/reles")}
                >
                    Volver a Relés
                </Button>

                {canWrite && (

                    <Box sx={{ display: "flex", gap: 1 }}>

                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() =>
                                navigate(`/reles?editar=${rele.id}`)
                            }
                        >
                            Editar
                        </Button>

                        {
                            rele.activo && (

                                <Button
                                    variant="contained"
                                    startIcon={<SwapHorizIcon />}
                                    onClick={() =>
                                        navigate(`/movimientos?releId=${rele.id}`)
                                    }
                                >
                                    Cargar Movimiento
                                </Button>
                            )
                        }

                    </Box>
                )}

            </Box>

            <PageHeader
                title={`Relé ${rele.numeroSerie}`}
                subtitle={`${rele.marca} · ${rele.modelo}`}
            />

            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    mb: 3,
                    flexWrap: "wrap"
                }}
            >

                <Chip
                    label={rele.estadoActual || "SIN HISTORIAL"}
                    color={getEstadoColor(rele.estadoActual)}
                />

                <Chip
                    label={rele.posicionActual || "NO ASIGNADA"}
                    variant="outlined"
                />

                <Chip
                    label={rele.localidadActual || "NO DEFINIDA"}
                    variant="outlined"
                />

                {
                    !rele.activo && (

                        <Chip
                            label="DADO DE BAJA"
                            color="error"
                            variant="outlined"
                        />
                    )
                }

            </Box>

            <Paper
                variant="outlined"
                sx={{ borderRadius: 3 }}
            >

                <Tabs
                    value={tab}
                    onChange={(_, value) => setTab(value)}
                    sx={{
                        px: 2,
                        borderBottom: 1,
                        borderColor: "divider"
                    }}
                >

                    <Tab label="Datos" />

                    <Tab label={`Historial (${historial.length})`} />

                    <Tab label="Documentación" />

                    <Tab label="Historial Operativo" />

                </Tabs>

                <Box sx={{ p: 3 }}>

                    {
                        tab === 0 && (

                            <Grid container spacing={3}>

                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Typography variant="overline" color="text.secondary">
                                        Número de Serie
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {rele.numeroSerie}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                    <Typography variant="overline" color="text.secondary">
                                        Cód. Configuración
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{ overflowWrap: "anywhere" }}
                                    >
                                        {rele.codigoConfiguracion || "-"}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Typography variant="overline" color="text.secondary">
                                        Marca
                                    </Typography>
                                    <Typography variant="body1">
                                        {rele.marca}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Typography variant="overline" color="text.secondary">
                                        Modelo
                                    </Typography>
                                    <Typography variant="body1">
                                        {rele.modelo}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Typography variant="overline" color="text.secondary">
                                        Tipo de Ingreso
                                    </Typography>
                                    <Typography variant="body1">
                                        {rele.tipoIngreso}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Typography variant="overline" color="text.secondary">
                                        Garantía
                                    </Typography>
                                    <Typography variant="body1">
                                        {
                                            rele.estadoGarantia === "SIN GARANTIA"
                                                ? "Sin garantía"
                                                : `${rele.estadoGarantia} ${
                                                    rele.mesesRestantesGarantia !== null
                                                        ? `(${rele.mesesRestantesGarantia} meses)`
                                                        : ""
                                                }`
                                        }
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Typography variant="overline" color="text.secondary">
                                        Inicio Garantía
                                    </Typography>
                                    <Typography variant="body1">
                                        {rele.inicioGarantia || "-"}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Typography variant="overline" color="text.secondary">
                                        Fin Garantía
                                    </Typography>
                                    <Typography variant="body1">
                                        {rele.finGarantia || "-"}
                                    </Typography>
                                </Grid>

                                {
                                    !rele.activo && (

                                        <>

                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                <Typography variant="overline" color="text.secondary">
                                                    Fecha de Baja
                                                </Typography>
                                                <Typography variant="body1">
                                                    {
                                                        rele.fechaBaja
                                                            ? formatearFecha(rele.fechaBaja)
                                                            : "-"
                                                    }
                                                </Typography>
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                                <Typography variant="overline" color="text.secondary">
                                                    Motivo de Baja
                                                </Typography>
                                                <Typography variant="body1">
                                                    {rele.motivoBaja || "-"}
                                                </Typography>
                                            </Grid>

                                        </>
                                    )
                                }

                            </Grid>
                        )
                    }

                    {
                        tab === 1 && (

                            historial.length === 0 ? (

                                <EmptyState
                                    titulo="Sin movimientos registrados"
                                />

                            ) : (

                                <TableContainer>

                                    <Table size="small">

                                        <TableHead>

                                            <TableRow>
                                                <TableCell>Fecha</TableCell>
                                                <TableCell>Estado</TableCell>
                                                <TableCell>Destino</TableCell>
                                                <TableCell>Posición</TableCell>
                                                <TableCell>Responsable</TableCell>
                                                <TableCell>Notas</TableCell>
                                            </TableRow>

                                        </TableHead>

                                        <TableBody>

                                            {
                                                historial.map((movimiento) => (

                                                    <TableRow key={movimiento.id}>

                                                        <TableCell>
                                                            {formatearFecha(movimiento.fechaMovimiento)}
                                                        </TableCell>

                                                        <TableCell>

                                                            <Chip
                                                                size="small"
                                                                variant="outlined"
                                                                label={movimiento.estado}
                                                                color={getEstadoColor(movimiento.estado)}
                                                            />

                                                        </TableCell>

                                                        <TableCell>
                                                            {movimiento.destino || "-"}
                                                        </TableCell>

                                                        <TableCell>
                                                            {movimiento.posicion || "-"}
                                                        </TableCell>

                                                        <TableCell>
                                                            {movimiento.responsable}
                                                        </TableCell>

                                                        <TableCell>
                                                            {movimiento.notas || "-"}
                                                        </TableCell>

                                                    </TableRow>
                                                ))
                                            }

                                        </TableBody>

                                    </Table>

                                </TableContainer>
                            )
                        )
                    }

                    {
                        tab === 2 && (

                            <Grid container spacing={2}>

                                <Grid size={{ xs: 12, sm: 6 }}>

                                    <Paper
                                        variant="outlined"
                                        sx={{ p: 2, borderRadius: 2 }}
                                    >

                                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                            Remito
                                        </Typography>

                                        {
                                            rele.remitoId ? (

                                                <Button
                                                    variant="outlined"
                                                    startIcon={<PictureAsPdfIcon />}
                                                    onClick={() =>
                                                        abrirArchivoRemito(
                                                            rele.remitoId!
                                                        ).catch(() =>
                                                            setErrorDocumento(
                                                                "No se pudo abrir el PDF del remito"
                                                            )
                                                        )
                                                    }
                                                >
                                                    Ver Remito
                                                </Button>

                                            ) : (

                                                <Typography variant="body2" color="text.secondary">
                                                    Sin remito asociado.
                                                </Typography>
                                            )
                                        }

                                    </Paper>

                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>

                                    <Paper
                                        variant="outlined"
                                        sx={{ p: 2, borderRadius: 2 }}
                                    >

                                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                            Orden de Provisión
                                        </Typography>

                                        {
                                            rele.ordenProvisionId ? (

                                                <Button
                                                    variant="outlined"
                                                    startIcon={<PictureAsPdfIcon />}
                                                    onClick={() =>
                                                        abrirArchivoOP(
                                                            rele.ordenProvisionId!
                                                        ).catch(() =>
                                                            setErrorDocumento(
                                                                "No se pudo abrir el PDF de la orden de provisión"
                                                            )
                                                        )
                                                    }
                                                >
                                                    Ver Orden de Provisión
                                                </Button>

                                            ) : (

                                                <Typography variant="body2" color="text.secondary">
                                                    Sin orden de provisión asociada.
                                                </Typography>
                                            )
                                        }

                                    </Paper>

                                </Grid>

                            </Grid>
                        )
                    }

                    {
                        tab === 3 && (

                            historial.length === 0 ? (

                                <EmptyState
                                    titulo="Sin movimientos registrados"
                                    subtitulo="Este relé todavía no tiene historial operativo cargado."
                                />

                            ) : (

                                <Box sx={{ position: "relative", pl: 4 }}>

                                    {/* Linea vertical continua de la timeline, detras de las tarjetas */}
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            left: 15,
                                            top: 8,
                                            bottom: 8,
                                            width: 2,
                                            bgcolor: "divider"
                                        }}
                                    />

                                    <Stack spacing={3}>

                                        {
                                            // El backend devuelve el historial mas reciente primero
                                            // (findByReleIdOrderByFechaMovimientoDescIdDesc); para una
                                            // linea de tiempo cronologica se muestra en orden inverso
                                            // (mas antiguo arriba, mas reciente abajo), sin pedirle al
                                            // backend un orden distinto.
                                            [...historial]
                                                .reverse()
                                                .map((movimiento) => (

                                                    <Box
                                                        key={movimiento.id}
                                                        sx={{ position: "relative" }}
                                                    >

                                                        <Box
                                                            sx={{
                                                                position: "absolute",
                                                                left: -32,
                                                                top: 10,
                                                                width: 16,
                                                                height: 16,
                                                                borderRadius: "50%",
                                                                bgcolor: `${getEstadoColor(movimiento.estado)}.main`,
                                                                border: "3px solid",
                                                                borderColor: "background.paper",
                                                                boxShadow: 1,
                                                                zIndex: 1
                                                            }}
                                                        />

                                                        <Paper
                                                            variant="outlined"
                                                            sx={{
                                                                p: 2,
                                                                borderRadius: 2,
                                                                borderLeft: "4px solid",
                                                                borderLeftColor: `${getEstadoColor(movimiento.estado)}.main`
                                                            }}
                                                        >

                                                            <Stack
                                                                direction="row"
                                                                spacing={1}
                                                                sx={{
                                                                    alignItems: "center",
                                                                    justifyContent: "space-between",
                                                                    flexWrap: "wrap",
                                                                    mb: 1.5
                                                                }}
                                                            >

                                                                <Chip
                                                                    size="small"
                                                                    label={movimiento.estado}
                                                                    color={getEstadoColor(movimiento.estado)}
                                                                />

                                                                <Stack
                                                                    direction="row"
                                                                    spacing={0.5}
                                                                    sx={{ alignItems: "center", color: "text.secondary" }}
                                                                >
                                                                    <AccessTimeIcon sx={{ fontSize: 15 }} />
                                                                    <Typography variant="caption">
                                                                        {formatearFecha(movimiento.fechaMovimiento)}
                                                                    </Typography>
                                                                </Stack>

                                                            </Stack>

                                                            <Grid container spacing={1.5}>

                                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                                    <Stack
                                                                        direction="row"
                                                                        spacing={1}
                                                                        sx={{ alignItems: "center" }}
                                                                    >
                                                                        <ApartmentIcon
                                                                            fontSize="small"
                                                                            color="action"
                                                                        />
                                                                        <Typography variant="body2">
                                                                            {movimiento.destino || "-"}
                                                                        </Typography>
                                                                    </Stack>
                                                                </Grid>

                                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                                    <Stack
                                                                        direction="row"
                                                                        spacing={1}
                                                                        sx={{ alignItems: "center" }}
                                                                    >
                                                                        <RoomIcon
                                                                            fontSize="small"
                                                                            color="action"
                                                                        />
                                                                        <Typography variant="body2">
                                                                            {movimiento.posicion || "-"}
                                                                        </Typography>
                                                                    </Stack>
                                                                </Grid>

                                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                                    <Stack
                                                                        direction="row"
                                                                        spacing={1}
                                                                        sx={{ alignItems: "center" }}
                                                                    >
                                                                        <PersonOutlineIcon
                                                                            fontSize="small"
                                                                            color="action"
                                                                        />
                                                                        <Typography variant="body2">
                                                                            {movimiento.responsable || "-"}
                                                                        </Typography>
                                                                    </Stack>
                                                                </Grid>

                                                            </Grid>

                                                            {
                                                                movimiento.notas && (

                                                                    <>

                                                                        <Divider sx={{ my: 1.5 }} />

                                                                        <Stack
                                                                            direction="row"
                                                                            spacing={1}
                                                                            sx={{ alignItems: "flex-start" }}
                                                                        >
                                                                            <NotesIcon
                                                                                fontSize="small"
                                                                                color="action"
                                                                                sx={{ mt: 0.25 }}
                                                                            />
                                                                            <Typography
                                                                                variant="body2"
                                                                                color="text.secondary"
                                                                            >
                                                                                {movimiento.notas}
                                                                            </Typography>
                                                                        </Stack>

                                                                    </>
                                                                )
                                                            }

                                                        </Paper>

                                                    </Box>
                                                ))
                                        }

                                    </Stack>

                                </Box>
                            )
                        )
                    }

                </Box>

            </Paper>

            <Snackbar
                open={Boolean(errorDocumento)}
                autoHideDuration={4000}
                onClose={() =>
                    setErrorDocumento("")
                }
            >

                <Alert severity="error">

                    {errorDocumento}

                </Alert>

            </Snackbar>

        </div>
    );
}

export default ReleDetailPage;
