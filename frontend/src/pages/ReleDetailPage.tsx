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
    Snackbar
} from "@mui/material";

import ArrowBackIcon
from "@mui/icons-material/ArrowBack";

import PictureAsPdfIcon
from "@mui/icons-material/PictureAsPdf";

import EditIcon
from "@mui/icons-material/Edit";

import SwapHorizIcon
from "@mui/icons-material/SwapHoriz";

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

                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Typography variant="overline" color="text.secondary">
                                        Cód. Configuración
                                    </Typography>
                                    <Typography variant="body1">
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
