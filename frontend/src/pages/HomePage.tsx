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
    Button,
    Skeleton

} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import type { ReactNode } from "react";

import FileDownloadIcon
from "@mui/icons-material/FileDownload";

import PictureAsPdfIcon
from "@mui/icons-material/PictureAsPdf";

import Inventory2OutlinedIcon
from "@mui/icons-material/Inventory2Outlined";

import CheckCircleOutlineIcon
from "@mui/icons-material/CheckCircleOutlined";

import CancelOutlinedIcon
from "@mui/icons-material/CancelOutlined";

import HistoryToggleOffIcon
from "@mui/icons-material/HistoryToggleOff";

import AccessTimeIcon
from "@mui/icons-material/AccessTime";

import ErrorOutlineIcon
from "@mui/icons-material/ErrorOutlined";

import DescriptionOutlinedIcon
from "@mui/icons-material/DescriptionOutlined";

import AttachFileIcon
from "@mui/icons-material/AttachFile";

import ReceiptLongOutlinedIcon
from "@mui/icons-material/ReceiptLongOutlined";

import AssignmentOutlinedIcon
from "@mui/icons-material/AssignmentOutlined";

import AutoAwesomeIcon
from "@mui/icons-material/AutoAwesome";

import RefreshIcon
from "@mui/icons-material/Refresh";

import InsightsIcon
from "@mui/icons-material/Insights";

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
    obtenerResumenIA,
    exportarDashboardExcel,
    exportarDashboardPdf

} from "../services/dashboardService";

import type { MarcaCantidad } from "../types/MarcaCantidad";

import type { ModeloCantidad } from "../types/ModeloCantidad";

import type { EstadoCantidad } from "../types/EstadoCantidad";

import type { DestinoCantidad } from "../types/DestinoCantidad";

import type { ProveedorCantidad } from "../types/ProveedorCantidad";

import CopilotoIACard
from "../components/dashboard/CopilotoIACard";

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

// El backend le pide a la IA un formato fijo: primera línea = encabezado,
// líneas siguientes que empiezan con "- " = hallazgos puntuales. Si el
// modelo no respeta el formato (pasa igual, es texto libre de un LLM),
// se degrada a mostrar todo el texto como encabezado sin viñetas.
function parsearResumenIA(
    texto: string
) {

    const lineas =
        texto
            .split("\n")
            .map((linea) => linea.trim())
            .filter(Boolean);

    const puntos =
        lineas
            .filter((linea) => linea.startsWith("- "))
            .map((linea) => linea.replace(/^-\s*/, ""));

    const encabezado =
        lineas.find((linea) => !linea.startsWith("- "))
        ?? lineas[0]
        ?? "";

    return { encabezado, puntos };
}

// Fecha/hora en que el frontend recibió el resumen (no la genera el
// backend): es la mejor referencia honesta de "cuándo se generó" sin
// tocar la API, ya que el resumen se cachea 4 horas en el servidor.
function formatearFechaHoraResumen(
    fecha: Date
) {

    const fechaTexto =
        fecha.toLocaleDateString("es-AR");

    const horaTexto =
        fecha.toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit"
        });

    return `${fechaTexto} · ${horaTexto} hs`;
}

interface MetricCardProps {
    title: string;
    value: ReactNode;
    icon: ReactNode;
    accent: string;
}

function MetricCard(
    { title, value, icon, accent }: MetricCardProps
) {

    return (

        <Paper
            elevation={2}
            sx={{
                p: 2.5,
                width: "100%",
                height: "100%",
                minHeight: 112,
                borderLeft: `4px solid ${accent}`,
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 0.5
            }}
        >

            <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: "center", color: accent }}
            >

                {icon}

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    {title}
                </Typography>

            </Stack>

            <Typography
                variant="h4"
                sx={{ fontWeight: 700 }}
            >

                {value}

            </Typography>

        </Paper>
    );
}

function HomePage() {

    const theme = useTheme();

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

    // Resumen ejecutivo generado con IA: ya no se pide automáticamente al
    // cargar el dashboard (consumía cuota de Gemini en cada visita). Se
    // pide solo cuando el usuario aprieta el botón "Generar/Actualizar",
    // y cada click fuerza al backend a regenerarlo salteando su cache de
    // 4 horas (GET .../resumen-ia?forzar=true).
    const [resumenIA, setResumenIA] =
        useState<string | null>(null);

    const [resumenIALoading, setResumenIALoading] =
        useState(false);

    // Si ya se intentó generar el resumen al menos una vez y no hay
    // texto, distingue "todavía no se pidió" de "se pidió y no hay
    // resumen disponible" (sin clave configurada o falló la llamada).
    const [resumenIASolicitado, setResumenIASolicitado] =
        useState(false);

    // Momento en que el frontend recibió el resumen actual (ver
    // formatearFechaHoraResumen más arriba).
    const [resumenGeneradoEn, setResumenGeneradoEn] =
        useState<Date | null>(null);

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
                proveedores
            ] = await Promise.all([
                obtenerDashboardKpis(),
                obtenerRelesPorMarca(),
                obtenerRelesPorModelo(),
                obtenerRelesPorEstado(),
                obtenerRelesPorDestino(),
                obtenerRelesPorProveedor()
            ]);

            setKpis(kpiData);

            setMarcasData(marcas);

            setModelosData(modelos);

            setEstadosData(estados);

            setDestinosData(destinos);

            setProveedoresData(proveedores);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    };

    // Botón "Generar resumen"/"Actualizar" del panel: siempre fuerza al
    // backend a regenerar el resumen salteando su cache de 4 horas
    // (GET .../resumen-ia?forzar=true), tanto la primera vez como en
    // actualizaciones posteriores.
    const cargarResumenIA =
    async () => {

        setResumenIALoading(true);

        setResumenIASolicitado(true);

        try {

            const data =
                await obtenerResumenIA(true);

            setResumenIA(data.resumen);

            setResumenGeneradoEn(
                data.resumen ? new Date() : null
            );

        } catch (error) {

            console.error(error);

            setResumenIA(null);

            setResumenGeneradoEn(null);

        } finally {

            setResumenIALoading(false);
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

    const ultimaActividad =

        movimientos.length > 0

            ?

            new Date(
                movimientos[0].fechaMovimiento
            ).toLocaleDateString("es-AR")

            :

            "-";

    const cardsGenerales: MetricCardProps[] = [

        {
            title: "Total Relés",
            value: totalReles,
            icon: <Inventory2OutlinedIcon fontSize="small" />,
            accent: theme.palette.primary.main
        },

        {
            title: "Activos",
            value: activos,
            icon: <CheckCircleOutlineIcon fontSize="small" />,
            accent: theme.palette.success.main
        },

        {
            title: "Inactivos",
            value: inactivos,
            icon: <CancelOutlinedIcon fontSize="small" />,
            accent: theme.palette.text.secondary
        },

        {
            title: "Pendientes de Trazar",
            value: kpis.relesSinHistorial,
            icon: <HistoryToggleOffIcon fontSize="small" />,
            accent: theme.palette.warning.main
        },

        {
            title: "Última Actividad",
            value: ultimaActividad,
            icon: <AccessTimeIcon fontSize="small" />,
            accent: theme.palette.info.main
        }
    ];

    const cardsDocumentales: MetricCardProps[] = [

        {
            title: "Garantías vencidas",
            value: kpis.garantiasVencidas,
            icon: <ErrorOutlineIcon fontSize="small" />,
            accent: theme.palette.error.main
        },

        {
            title: "Sin trazabilidad documental",
            value: kpis.relesSinDocumentacion,
            icon: <DescriptionOutlinedIcon fontSize="small" />,
            accent: theme.palette.warning.main
        },

        {
            title: "Documentación sin archivo",
            value: kpis.relesDocumentacionSinArchivo,
            icon: <AttachFileIcon fontSize="small" />,
            accent: theme.palette.warning.main
        },

        {
            title: "Remitos sin asociar",
            value: kpis.remitosPendientes,
            icon: <ReceiptLongOutlinedIcon fontSize="small" />,
            accent: theme.palette.info.main
        },

        {
            title: "Órdenes sin asociar",
            value: kpis.ordenesPendientes,
            icon: <AssignmentOutlinedIcon fontSize="small" />,
            accent: theme.palette.info.main
        }
    ];

    const graficos: {
        titulo: string;
        data: Array<Record<string, string | number>>;
        dataKeyCategoria: string;
        color: string;
    }[] = [

        {
            titulo: "Estado de Relés",
            data: estadosData as unknown as Array<Record<string, string | number>>,
            dataKeyCategoria: "estado",
            color: theme.palette.primary.main
        },

        {
            titulo: "Distribución por Marca",
            data: marcasData as unknown as Array<Record<string, string | number>>,
            dataKeyCategoria: "marca",
            color: "#1976D2"
        },

        {
            // El backend devuelve todos los modelos (pueden ser decenas)
            // ya ordenados por cantidad descendente; para el gráfico solo
            // tiene sentido mostrar los más representativos. El listado
            // completo sigue disponible en el Excel/PDF exportado.
            titulo: "Distribución por Modelo (Top 10)",
            data: modelosData.slice(0, 10) as unknown as Array<Record<string, string | number>>,
            dataKeyCategoria: "modelo",
            color: "#F57C00"
        },

        {
            titulo: "Distribución por Destino",
            data: destinosData as unknown as Array<Record<string, string | number>>,
            dataKeyCategoria: "destino",
            color: "#00838F"
        },

        {
            titulo: "Distribución por Proveedor",
            data: proveedoresData as unknown as Array<Record<string, string | number>>,
            dataKeyCategoria: "proveedor",
            color: "#6A1B9A"
        }
    ];

    const tooltipContentStyle = {
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 8,
        color: theme.palette.text.primary
    };

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

            {/* Resumen ejecutivo generado con IA. Ya no se pide solo al
                cargar el dashboard: el usuario lo dispara con el botón
                "Generar"/"Actualizar" para no consumir cuota de Gemini en
                cada visita. El backend igual mantiene su cache de 4 horas
                por si se aprieta el botón varias veces seguidas. */}
            <Paper
                elevation={2}
                sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: (theme) =>
                        theme.palette.mode === "dark"
                            ? "rgba(124, 214, 200, 0.25)"
                            : "rgba(0, 105, 92, 0.18)"
                }}
            >

                {/* Encabezado tipo panel ejecutivo: icono en badge,
                    título + subtítulo, y a la derecha el botón de
                    generar/actualizar + fecha de la última generación. */}
                <Box
                    sx={{
                        px: 3,
                        py: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        flexWrap: "wrap",
                        borderBottom: "1px solid",
                        borderColor: (theme) =>
                            theme.palette.mode === "dark"
                                ? "rgba(124, 214, 200, 0.18)"
                                : "rgba(0, 105, 92, 0.12)",
                        background: (theme) =>
                            theme.palette.mode === "dark"
                                ? "linear-gradient(135deg, rgba(0,105,92,0.20), rgba(0,105,92,0.04))"
                                : "linear-gradient(135deg, rgba(0,105,92,0.10), rgba(0,105,92,0.02))"
                    }}
                >

                    <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{ alignItems: "center" }}
                    >

                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                bgcolor: "primary.main",
                                color: "primary.contrastText"
                            }}
                        >
                            <AutoAwesomeIcon fontSize="small" />
                        </Box>

                        <Box>

                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 700, lineHeight: 1.2 }}
                            >
                                Resumen Ejecutivo
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                    display: "block",
                                    letterSpacing: 0.3,
                                    textTransform: "uppercase",
                                    fontWeight: 600
                                }}
                            >
                                Generado por Inteligencia Artificial
                            </Typography>

                        </Box>

                    </Stack>

                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{ alignItems: "center" }}
                    >

                        {!resumenIALoading && resumenGeneradoEn && (

                            <Stack
                                direction="row"
                                spacing={0.5}
                                sx={{ alignItems: "center", color: "text.secondary" }}
                            >

                                <AccessTimeIcon sx={{ fontSize: 15 }} />

                                <Typography variant="caption">
                                    {formatearFechaHoraResumen(resumenGeneradoEn)}
                                </Typography>

                            </Stack>
                        )}

                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<RefreshIcon />}
                            onClick={cargarResumenIA}
                            disabled={resumenIALoading}
                        >

                            {
                                resumenIASolicitado
                                    ? "Actualizar"
                                    : "Generar resumen"
                            }

                        </Button>

                    </Stack>

                </Box>

                {/* Contenido: mismo texto que genera Gemini, solo se
                    mejora tipografía/espaciado y se agrega un icono por
                    punto en vez del punto de color plano anterior. */}
                <Box sx={{ px: 3, py: 2.5 }}>

                    {resumenIALoading ? (

                        <Stack spacing={2}>

                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ alignItems: "center" }}
                            >

                                <CircularProgress size={16} thickness={5} />

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Generando resumen ejecutivo con IA…
                                </Typography>

                            </Stack>

                            <Stack spacing={0.75}>
                                <Skeleton variant="text" width="85%" />
                                <Skeleton variant="text" width="60%" />
                                <Skeleton variant="text" width="70%" />
                                <Skeleton variant="text" width="50%" />
                            </Stack>

                        </Stack>

                    ) : resumenIA ? (

                        (() => {

                            const { encabezado, puntos } =
                                parsearResumenIA(resumenIA);

                            return (

                                <>

                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: 600,
                                            mb: puntos.length > 0 ? 2 : 0
                                        }}
                                    >
                                        {encabezado}
                                    </Typography>

                                    {puntos.length > 0 && (

                                        <Stack spacing={1.5}>

                                            {puntos.map((punto, index) => (

                                                <Stack
                                                    key={index}
                                                    direction="row"
                                                    spacing={1.5}
                                                    sx={{ alignItems: "flex-start" }}
                                                >

                                                    <InsightsIcon
                                                        color="primary"
                                                        sx={{ fontSize: 18, mt: 0.25 }}
                                                    />

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{ lineHeight: 1.6 }}
                                                    >
                                                        {punto}
                                                    </Typography>

                                                </Stack>
                                            ))}

                                        </Stack>
                                    )}

                                </>
                            );
                        })()

                    ) : (

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >

                            {
                                resumenIASolicitado
                                    ? "No se pudo generar el resumen (sin clave de Gemini configurada o falló la llamada)."
                                    : "Todavía no se generó. Apretá \"Generar resumen\" para pedirle a la IA un análisis del stock actual."
                            }

                        </Typography>
                    )}

                </Box>

            </Paper>

            {/* Copiloto IA: tarjeta independiente, no reemplaza ni
                modifica ningun contenido existente del dashboard. */}
            <CopilotoIACard />

            {/* Sección de KPIs de parte superior*/}
            <Box>

                <Typography
                    variant="subtitle2"
                    sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: "text.secondary"
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

                            <MetricCard {...card} />

                        </Grid>
                    ))}

                </Grid>

            </Box>

            {/* Nivel de trazabilidad */}
            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    borderRadius: 3
                }}
            >

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", sm: "center" },
                        mb: 2
                    }}
                >

                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 600 }}
                    >

                        Nivel de Trazabilidad

                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >

                        {relesConHistorial} de {totalReles} relés
                        poseen historial operativo registrado

                    </Typography>

                </Stack>

                <LinearProgress
                    variant="determinate"
                    value={porcentajeTrazabilidad}
                    sx={{
                        height: 12,
                        borderRadius: 2
                    }}
                />

                <Typography
                    variant="body2"
                    sx={{
                        mt: 1.5,
                        fontWeight: 500
                    }}
                >

                    Cobertura actual: {" "}

                    {porcentajeTrazabilidad.toFixed(1)}%

                    {" "}de trazabilidad operativa

                </Typography>

            </Paper>

            {/*Graficos de zona media*/}
            <Box>

                <Typography
                    variant="subtitle2"
                    sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: "text.secondary"
                    }}
                >
                    Distribución del Stock
                </Typography>

                <Grid container spacing={3}>

                    {graficos.map((grafico) => (

                        <Grid
                            size={{ xs: 12, md: 6, lg: 4 }}
                            key={grafico.titulo}
                        >

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
                                    {grafico.titulo}
                                </Typography>

                                <ResponsiveContainer
                                    width="100%"
                                    height={280}
                                >

                                    <BarChart
                                        data={grafico.data}
                                        layout={
                                            grafico.dataKeyCategoria === "estado"
                                                ? "horizontal"
                                                : "vertical"
                                        }
                                        margin={{
                                            top: 5,
                                            right: 20,
                                            left: 20,
                                            bottom: 5
                                        }}
                                    >

                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke={theme.palette.divider}
                                        />

                                        {grafico.dataKeyCategoria === "estado" ? (

                                            <>
                                                <XAxis
                                                    dataKey={grafico.dataKeyCategoria}
                                                    tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                                                />

                                                <YAxis
                                                    tick={{ fill: theme.palette.text.secondary }}
                                                />
                                            </>

                                        ) : (

                                            <>
                                                <XAxis
                                                    type="number"
                                                    tick={{ fill: theme.palette.text.secondary }}
                                                />

                                                <YAxis
                                                    type="category"
                                                    dataKey={grafico.dataKeyCategoria}
                                                    width={160}
                                                    tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                                                />
                                            </>
                                        )}

                                        <Tooltip
                                            contentStyle={tooltipContentStyle}
                                            labelStyle={{ color: theme.palette.text.primary }}
                                            cursor={{ fill: theme.palette.action.hover }}
                                        />

                                        <Bar
                                            dataKey="cantidad"
                                            fill={grafico.color}
                                            radius={
                                                grafico.dataKeyCategoria === "estado"
                                                    ? [4, 4, 0, 0]
                                                    : [0, 4, 4, 0]
                                            }
                                        />

                                    </BarChart>

                                </ResponsiveContainer>

                            </Paper>

                        </Grid>
                    ))}

                </Grid>

            </Box>

            {/*Alertas operativas*/}
            <Box>

                <Typography
                    variant="subtitle2"
                    sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: "text.secondary"
                    }}
                >
                    Estado Documental
                </Typography>

                <Grid
                    container
                    spacing={2}
                >

                    {cardsDocumentales.map((card) => (

                        <Grid
                            size={{ xs: 12, sm: 6, md: "grow" }}
                            key={card.title}
                            sx={{
                                flexGrow: 1,
                                display: "flex"
                            }}
                        >

                            <MetricCard {...card} />

                        </Grid>
                    ))}

                </Grid>

            </Box>

            {/*Ultimos movimientos*/}
            <Paper
                elevation={2}
                sx={{
                    p: 3,
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
                                bgcolor: "action.hover",
                                border: "1px solid",
                                borderColor: "divider"
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
