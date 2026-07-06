import {

    Paper,
    Typography,
    Grid,
    Stack,
    Box,
    Chip,
    Divider,
    CircularProgress,
    LinearProgress,
    TextField,
    MenuItem,
    Button

} from "@mui/material";

import FileDownloadIcon
from "@mui/icons-material/FileDownload";

import PictureAsPdfIcon
from "@mui/icons-material/PictureAsPdf";

import {

    ResponsiveContainer,
    Tooltip,
    BarChart,
    Bar,
    YAxis,
    XAxis,
    CartesianGrid

} from "recharts";

import {
    useEffect,
    useState
} from "react";

import type {
    DashboardKpi
} from "../types/DashboardKpi";

import type {
    Movimiento
} from "../types/Movimiento";

import {

    obtenerDashboardKpis,
    obtenerUltimosMovimientos,
    obtenerRelesPorMarca,
    obtenerRelesPorModelo,
    obtenerRelesPorEstado,
    obtenerRelesPorDestino,
    obtenerRelesPorProveedor,
    obtenerMovimientosPorUsuario,
    exportarDashboardExcel,
    exportarDashboardPdf

} from "../services/dashboardService";

import type { MarcaCantidad } from "../types/MarcaCantidad";

import type { ModeloCantidad } from "../types/ModeloCantidad";

import type { EstadoCantidad } from "../types/EstadoCantidad";

import type { DestinoCantidad } from "../types/DestinoCantidad";

import type { ProveedorCantidad } from "../types/ProveedorCantidad";

import type { UsuarioCantidad } from "../types/UsuarioCantidad";

// Colores por estado operativo vigente (ver maquina de estados en
// V20__actualizar_transiciones_estado.sql). Cualquier estado que no
// figure aca (legado o nuevo, agregado por una migracion futura) cae
// en el color por defecto en vez de romper o mostrarse "sin color".
const COLOR_POR_ESTADO: Record<string, "default" | "primary" | "secondary" | "success" | "warning" | "error" | "info"> = {

    "EN STOCK": "info",
    "ENSAYO": "secondary",
    "GARANTIA_PROVEEDOR": "warning",
    "APROBADO": "success",
    "RESERVA": "info",
    "EN_SERVICIO": "primary",
    "EN REPARACION": "warning",
    "BAJA": "error"
};

function colorPorEstado(
    estado: string
) {

    return COLOR_POR_ESTADO[estado] ?? "default";
}

const OPCIONES_LIMITE = [10, 20, 50, 100];

function HomePage() {

    const [loading, setLoading] =
        useState(true);

    const [kpis, setKpis] =
        useState<DashboardKpi | null>(
            null
        );

    const [
        movimientos,
        setMovimientos
    ] =
        useState<Movimiento[]>([]);

    const [
        marcasData,
        setMarcasData
    ] =
        useState<MarcaCantidad[]>([]);

    const [
        modelosData,
        setModelosData
    ] =
        useState<ModeloCantidad[]>([]);

    const [
        estadosData,
        setEstadosData
    ] =
        useState<EstadoCantidad[]>([]);

    const [
        destinosData,
        setDestinosData
    ] =
        useState<DestinoCantidad[]>([]);

    const [
        proveedoresData,
        setProveedoresData
    ] =
        useState<ProveedorCantidad[]>([]);

    const [
        usuariosData,
        setUsuariosData
    ] =
        useState<UsuarioCantidad[]>([]);

    // Filtros de la lista "Últimos Movimientos": rango de fechas +
    // límite configurable (antes era un top 10 fijo, sin filtro).
    const [desde, setDesde] =
        useState("");

    const [hasta, setHasta] =
        useState("");

    const [limite, setLimite] =
        useState(10);

    const [exportando, setExportando] =
        useState(false);

    const [exportandoPdf, setExportandoPdf] =
        useState(false);

    useEffect(() => {

        cargarResumenGeneral();

    }, []);

    useEffect(() => {

        cargarMovimientos();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limite, desde, hasta]);

    const cargarResumenGeneral =
    async () => {

        try {

            // Se piden en paralelo (antes eran varios await en serie):
            // el spinner tarda lo que tarda el más lento, no la suma
            // de todas las llamadas.
            const [
                kpiData,
                marcas,
                modelos,
                estados,
                destinos,
                proveedores,
                usuarios
            ] = await Promise.all([
                obtenerDashboardKpis(),
                obtenerRelesPorMarca(),
                obtenerRelesPorModelo(),
                obtenerRelesPorEstado(),
                obtenerRelesPorDestino(),
                obtenerRelesPorProveedor(),
                obtenerMovimientosPorUsuario()
            ]);

            setKpis(kpiData);

            setMarcasData(marcas);

            setModelosData(modelos);

            setEstadosData(estados);

            setDestinosData(destinos);

            setProveedoresData(proveedores);

            setUsuariosData(usuarios);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    };

    const cargarMovimientos =
    async () => {

        try {

            const movimientosData =
                await obtenerUltimosMovimientos(
                    limite,
                    desde || undefined,
                    hasta || undefined
                );

            setMovimientos(movimientosData);

        } catch (error) {

            console.error(error);
        }
    };

    const handleExportar =
    async () => {

        setExportando(true);

        try {

            await exportarDashboardExcel();

        } catch (error) {

            console.error(error);

        } finally {

            setExportando(false);
        }
    };

    const handleExportarPdf =
    async () => {

        setExportandoPdf(true);

        try {

            await exportarDashboardPdf();

        } catch (error) {

            console.error(error);

        } finally {

            setExportandoPdf(false);
        }
    };

    if (loading || !kpis) {

        return (

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 10
                }}
            >

                <CircularProgress />

            </Box>
        );
    }

    const totalReles =
            kpis.totalReles;

    const activos =
            kpis.relesActivos;

    const inactivos =
            kpis.relesBaja;

    const relesConHistorial =

        totalReles

        -

        kpis.relesSinHistorial;


    const porcentajeTrazabilidad =

        totalReles > 0

            ?

            (relesConHistorial / totalReles) * 100

            :

            0;

    const cardsGenerales = [

        {
            title: "Total Relés",
            value: totalReles,
            color: "#455A64"
        },

        {
            title: "Activos",
            value: activos,
            color: "#2E7D32"
        },

        {
            title: "Inactivos",
            value: inactivos,
            color: "#616161"
        },

        {
            title: "Pendientes de Trazar",
            value: kpis.relesSinHistorial,
            color: "#6D4C41"
        }
    ];

    return (

        <Stack spacing={4}>

            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                sx={{
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", md: "center" }
                }}
            >

                <Box>

                    <Typography
                        variant="h4"
                        gutterBottom
                    >

                        Trazabilidad Operativa de Relés

                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                    >

                        Estado operativo, movimientos y
                        trazabilidad del stock de relés
                        de protección.

                    </Typography>

                </Box>

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                >

                    <Button
                        variant="outlined"
                        startIcon={<FileDownloadIcon />}
                        onClick={handleExportar}
                        disabled={exportando}
                    >

                        {
                            exportando
                                ? "Exportando..."
                                : "Exportar Excel"
                        }

                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={handleExportarPdf}
                        disabled={exportandoPdf}
                    >

                        {
                            exportandoPdf
                                ? "Exportando..."
                                : "Exportar PDF"
                        }

                    </Button>

                </Stack>

            </Stack>

             {/* Sección de KPIs de parte superior*/}
            <Typography
                variant="subtitle2"
                sx={{
                    mt: 3,
                    mb: 2,
                    fontWeight: 600,
                    color: "#616161"
                }}
            >
                Resumen General
            </Typography>

            <Grid
                container
                spacing={2}
            >

                {cardsGenerales.map((card) => (

                    <Grid
                        size={{ xs: 12, sm: 6, md: "grow" }}
                        key={card.title}
                        sx={{
                            flexGrow: 1,
                            display: "flex"
                        }}
                    >

                        <Paper
                            elevation={2}
                            sx={{
                                p: 2.5,
                                width: "100%",
                                minHeight: 110,
                                borderLeft:
                                    `5px solid ${card.color}`,
                                borderRadius: 3,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center"
                            }}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                            >

                                {card.title}

                            </Typography>

                            <Typography
                                variant="h4"
                                sx={{ fontWeight: 700 }}
                            >

                                {card.value}

                            </Typography>

                        </Paper>

                    </Grid>
                ))}

            </Grid>

            {/* Ultima actividad*/}
            <Paper
                sx={{
                    p: 3,
                    borderRadius: 3
                }}
            >

                <Typography
                    variant="body1"
                >
                    Última actividad
                </Typography>

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600
                    }}
                >
                    {
                        movimientos.length > 0
                            ? new Date(
                                movimientos[0].fechaMovimiento
                            ).toLocaleString("es-AR")
                            : "-"
                    }
                </Typography>

            </Paper>

            {/*Graficos de zona media*/}
            <Typography
                variant="subtitle2"
                sx={{
                    mt: 2,
                    mb: -1,
                    fontWeight: 600,
                    color: "#616161"
                }}
            >
                Distribución del Stock
            </Typography>

            <Grid container spacing={3} sx={{ mb: 1 }}>

                {/*Grafico de estados de relés (dinámico: sale de la
                    tabla estado real, no de nombres hardcodeados)*/}
                <Grid size={{ xs: 12, md: 4 }}>

                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 4,
                            height: 380
                        }}
                    >

                        <Typography
                            variant="h6"
                            sx={{ mb: 3 }}
                        >
                            Estado de Relés
                        </Typography>

                        <ResponsiveContainer
                            width="100%"
                            height={280}
                        >

                            <BarChart
                                data={estadosData}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="estado"
                                    tick={{ fontSize: 11 }}
                                />

                                <YAxis />

                                <Tooltip />

                                <Bar
                                    dataKey="cantidad"
                                    fill="#00695C"
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </Paper>

                </Grid>

                {/* Gráfico de cantidad de relés por marca*/}
                <Grid size={{ xs: 12, md: 4 }}>

                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 4,
                            height: 380
                        }}
                    >

                        <Typography
                            variant="h6"
                            sx={{ mb: 3 }}
                        >
                            Distribución por Marca
                        </Typography>

                        <ResponsiveContainer
                            width="100%"
                            height={280}
                        >

                            <BarChart
                                data={marcasData}
                                layout="vertical"
                                margin={{
                                    top: 5,
                                    right: 20,
                                    left: 20,
                                    bottom: 5
                                }}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    type="number"
                                />

                                <YAxis
                                    type="category"
                                    dataKey="marca"
                                    width={160}
                                    tick={{ fontSize: 12, fill: "#37474F" }}
                                />

                                <Tooltip />

                                <Bar
                                    dataKey="cantidad"
                                    fill="#1976D2"
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </Paper>

                </Grid>

                {/* Gráfico de cantidad de relés por modelo*/}
                <Grid size={{ xs: 12, md: 4 }}>

                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 4,
                            height: 380
                        }}
                    >

                        <Typography
                            variant="h6"
                            sx={{ mb: 3 }}
                        >
                            Distribución por Modelo
                        </Typography>

                        <ResponsiveContainer
                            width="100%"
                            height={280}
                        >

                            <BarChart
                                data={modelosData}
                                layout="vertical"
                                margin={{
                                    top: 5,
                                    right: 20,
                                    left: 20,
                                    bottom: 5
                                }}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    type="number"
                                />

                                <YAxis
                                    type="category"
                                    dataKey="modelo"
                                    width={160}
                                    tick={{ fontSize: 12, fill: "#37474F" }}
                                />

                                <Tooltip />

                                <Bar
                                    dataKey="cantidad"
                                    fill="#F57C00"
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </Paper>

                </Grid>

            </Grid>

            {/* Segunda fila de gráficos: destino, proveedor, usuario */}
            <Grid container spacing={3} sx={{ mb: 4 }}>

                {/* Gráfico de cantidad de relés por destino */}
                <Grid size={{ xs: 12, md: 4 }}>

                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 4,
                            height: 380
                        }}
                    >

                        <Typography
                            variant="h6"
                            sx={{ mb: 3 }}
                        >
                            Distribución por Destino
                        </Typography>

                        <ResponsiveContainer
                            width="100%"
                            height={280}
                        >

                            <BarChart
                                data={destinosData}
                                layout="vertical"
                                margin={{
                                    top: 5,
                                    right: 20,
                                    left: 20,
                                    bottom: 5
                                }}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    type="number"
                                />

                                <YAxis
                                    type="category"
                                    dataKey="destino"
                                    width={160}
                                    tick={{ fontSize: 12, fill: "#37474F" }}
                                />

                                <Tooltip />

                                <Bar
                                    dataKey="cantidad"
                                    fill="#00838F"
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </Paper>

                </Grid>

                {/* Gráfico de cantidad de relés por proveedor */}
                <Grid size={{ xs: 12, md: 4 }}>

                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 4,
                            height: 380
                        }}
                    >

                        <Typography
                            variant="h6"
                            sx={{ mb: 3 }}
                        >
                            Distribución por Proveedor
                        </Typography>

                        <ResponsiveContainer
                            width="100%"
                            height={280}
                        >

                            <BarChart
                                data={proveedoresData}
                                layout="vertical"
                                margin={{
                                    top: 5,
                                    right: 20,
                                    left: 20,
                                    bottom: 5
                                }}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    type="number"
                                />

                                <YAxis
                                    type="category"
                                    dataKey="proveedor"
                                    width={160}
                                    tick={{ fontSize: 12, fill: "#37474F" }}
                                />

                                <Tooltip />

                                <Bar
                                    dataKey="cantidad"
                                    fill="#6A1B9A"
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </Paper>

                </Grid>

                {/* Gráfico de movimientos registrados por usuario */}
                <Grid size={{ xs: 12, md: 4 }}>

                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 4,
                            height: 380
                        }}
                    >

                        <Typography
                            variant="h6"
                            sx={{ mb: 3 }}
                        >
                            Movimientos por Usuario
                        </Typography>

                        <ResponsiveContainer
                            width="100%"
                            height={280}
                        >

                            <BarChart
                                data={usuariosData}
                                layout="vertical"
                                margin={{
                                    top: 5,
                                    right: 20,
                                    left: 20,
                                    bottom: 5
                                }}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    type="number"
                                />

                                <YAxis
                                    type="category"
                                    dataKey="usuario"
                                    width={160}
                                    tick={{ fontSize: 12, fill: "#37474F" }}
                                />

                                <Tooltip />

                                <Bar
                                    dataKey="cantidad"
                                    fill="#455A64"
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </Paper>

                </Grid>

            </Grid>

            {/*Alertas operativas*/}
            <Typography
                variant="subtitle2"
                sx={{
                    mt: 4,
                    mb: 2,
                    fontWeight: 600,
                    color: "#616161"
                }}
            >
                Estado Documental
            </Typography>
            <Grid
                container
                spacing={3}
                sx={{ mb: 4 }}
            >

                <Grid size={{ xs: 12, md: 3 }}>

                    <Paper sx={{ p: 3, borderRadius: 3 }}>

                        <Typography variant="body2">
                            Garantías vencidas
                        </Typography>

                        <Typography
                            variant="h4"
                            color="error"
                        >
                            {kpis.garantiasVencidas}
                        </Typography>

                    </Paper>

                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>

                    <Paper sx={{ p: 3, borderRadius: 3 }}>

                        <Typography variant="body2">
                            Relés migrados sin trazabilidad documental
                        </Typography>

                        <Typography
                            variant="h4"
                            color="warning.main"
                        >
                            {kpis.relesSinDocumentacion}
                        </Typography>

                    </Paper>

                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>

                    <Paper sx={{ p: 3, borderRadius: 3 }}>

                        <Typography variant="body2">
                            Documentación vinculada sin archivo adjunto
                        </Typography>

                        <Typography
                            variant="h4"
                            color="warning.main"
                        >
                            {kpis.relesDocumentacionSinArchivo}
                        </Typography>

                    </Paper>

                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>

                    <Paper sx={{ p: 3, borderRadius: 3 }}>

                        <Typography variant="body2">
                            Remitos sin asociar
                        </Typography>

                        <Typography
                            variant="h4"
                            color="info.main"
                        >
                            {kpis.remitosPendientes}
                        </Typography>

                    </Paper>

                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>

                    <Paper sx={{ p: 3, borderRadius: 3 }}>

                        <Typography variant="body2">
                            Órdenes de Provisión sin asociar
                        </Typography>

                        <Typography
                            variant="h4"
                            color="info.main"
                        >
                            {kpis.ordenesPendientes}
                        </Typography>

                    </Paper>

                </Grid>

            </Grid>

            {/* Barra de progreso de trazabilidad */}

            <Paper
                elevation={2}
                sx={{
                    p: 4,
                    mt: 4,
                    borderRadius: 3
                }}
            >

                <Typography
                    variant="h6"
                    sx={{ fontWeight: 600 }}
                >

                    Nivel de Trazabilidad

                </Typography>

                <LinearProgress
                    variant="determinate"
                    value={porcentajeTrazabilidad}
                    sx={{
                        height: 12,
                        borderRadius: 2,
                        mt: 2
                    }}
                />

                <Typography
                    variant="body2"
                    sx={{
                        mt: 2,
                        fontWeight: 500
                    }}
                >

                    Cobertura actual: {" "}

                    {porcentajeTrazabilidad.toFixed(1)}%

                    {" "}de trazabilidad operativa

                </Typography>

                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        display: "block",
                        mt: 1
                    }}
                >

                    {relesConHistorial}

                    {" "}de{" "}

                    {totalReles}

                    {" "}relés poseen historial operativo registrado

                </Typography>

            </Paper>


            {/*Ultimos movimientos*/}
            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    mt: 4,
                    borderRadius: 3
                }}
            >

                <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 2 }}
                >

                    Últimos Movimientos

                </Typography>

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{ mb: 3 }}
                >

                    <TextField
                        label="Desde"
                        type="date"
                        size="small"
                        slotProps={{ inputLabel: { shrink: true } }}
                        value={desde}
                        onChange={(e) => setDesde(e.target.value)}
                    />

                    <TextField
                        label="Hasta"
                        type="date"
                        size="small"
                        slotProps={{ inputLabel: { shrink: true } }}
                        value={hasta}
                        onChange={(e) => setHasta(e.target.value)}
                    />

                    <TextField
                        label="Mostrar"
                        select
                        size="small"
                        sx={{ minWidth: 120 }}
                        value={limite}
                        onChange={(e) => setLimite(Number(e.target.value))}
                    >

                        {OPCIONES_LIMITE.map((opcion) => (

                            <MenuItem
                                key={opcion}
                                value={opcion}
                            >
                                {opcion}
                            </MenuItem>
                        ))}

                    </TextField>

                </Stack>

                <Divider sx={{ mb: 3 }} />

                <Stack
                    spacing={2}
                    sx={{
                        maxHeight: 550,
                        overflowY: "auto"
                    }}
                >

                    {movimientos.length === 0 && (

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            No hay movimientos para el rango seleccionado.
                        </Typography>
                    )}

                    {movimientos.map((mov) => (

                        <Box
                            key={mov.id}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                p: 2.5,
                                borderRadius: 3,
                                backgroundColor: "#F8F9FA",
                                border: "1px solid #ECEFF1"
                            }}
                        >

                            {/* Información del relé */}

                            <Box sx={{ width: "35%" }}>

                                <Typography
                                    variant="body1"
                                    sx={{ fontWeight: 700 }}
                                >

                                    {mov.rele}

                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >

                                    {mov.marca}
                                    {" | "}
                                    {mov.modelo}

                                </Typography>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >

                                    {mov.destino}
                                    {" | "}
                                    {mov.posicion}

                                </Typography>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: "block" }}
                                >

                                    Responsable: {mov.responsable}

                                </Typography>

                            </Box>


                            {/* Estado */}

                            <Box sx={{ width: "20%" }}>

                                <Chip
                                    label={mov.estado}

                                    color={colorPorEstado(mov.estado)}

                                    sx={{
                                        minWidth: 120,
                                        fontWeight: 600
                                    }}
                                />

                            </Box>


                            {/* Fecha */}

                            <Box
                                sx={{
                                    width: "25%",
                                    textAlign: "right"
                                }}
                            >

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >

                                    {
                                        mov.fechaMovimiento

                                            ?

                                            new Date(
                                                mov.fechaMovimiento
                                            ).toLocaleDateString(
                                                "es-AR"
                                            )

                                            :

                                            "-"
                                    }

                                </Typography>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >

                                    {
                                        mov.fechaMovimiento

                                            ?

                                            new Date(
                                                mov.fechaMovimiento
                                            ).toLocaleTimeString(
                                                "es-AR"
                                            )

                                            :

                                            "-"
                                    }

                                </Typography>

                            </Box>

                        </Box>
                    ))}

                </Stack>

            </Paper>

        </Stack>
    );
}

export default HomePage;
