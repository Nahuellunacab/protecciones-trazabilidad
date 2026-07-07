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

    // Resumen ejecutivo generado con IA: se pide aparte, en paralelo al
    // resto del dashboard, para no bloquear la carga de KPIs si Anthropic
    // tarda o no esta configurado (resumen queda en null y no se muestra).
    const [resumenIA, setResumenIA] =
        useState<string | null>(null);

    const [resumenIALoading, setResumenIALoading] =
        useState(true);

    useEffect(() => {

        cargarResumenGeneral();

        cargarResumenIA();

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

    const cargarResumenIA =
    async () => {

        try {

            const data =
                await obtenerResumenIA();

            setResumenIA(data.resumen);

        } catch (error) {

            console.error(error);

            setResumenIA(null);

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

            {/* Resumen ejecutivo generado con IA. Se oculta por completo si
                no hay clave de Anthropic configurada o si la llamada falla:
                es un agregado informativo, nunca un requisito del dashboard. */}
            {(resumenIALoading || resumenIA) && (

                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: (theme) =>
                            theme.palette.mode === "dark"
                                ? "rgba(124, 214, 200, 0.25)"
                                : "rgba(0, 105, 92, 0.18)",
                        background: (theme) =>
                            theme.palette.mode === "dark"
                                ? "linear-gradient(135deg, rgba(0,105,92,0.12), rgba(0,105,92,0.02))"
                                : "linear-gradient(135deg, rgba(0,105,92,0.06), rgba(0,105,92,0.01))"
                    }}
                >

                    <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{ alignItems: "flex-start" }}
                    >

                        <AutoAwesomeIcon
                            color="primary"
                            sx={{ mt: 0.25 }}
                        />

                        <Box sx={{ flex: 1 }}>

                            <Typography
                                variant="overline"
                                color="primary"
                                sx={{ fontWeight: 700, letterSpacing: 0.5 }}
                            >
                                Resumen ejecutivo · Generado por IA
                            </Typography>

                            {resumenIALoading ? (

                                <Stack spacing={0.75} sx={{ mt: 0.75 }}>
                                    <Skeleton variant="text" width="85%" />
                                    <Skeleton variant="text" width="60%" />
                                    <Skeleton variant="text" width="70%" />
                                    <Skeleton variant="text" width="50%" />
                                </Stack>

                            ) : (

                                (() => {

                                    const { encabezado, puntos } =
                                        parsearResumenIA(resumenIA ?? "");

                                    return (

                                        <>

                                            <Typography
                                                variant="body1"
                                                sx={{ mt: 0.5, fontWeight: 600 }}
                                            >
                                                {encabezado}
                                            </Typography>

                                            {puntos.length > 0 && (

                                                <Stack
                                                    spacing={0.75}
                                                    sx={{ mt: 1.5 }}
                                                >

                                                    {puntos.map((punto, index) => (

                                                        <Stack
                                                            key={index}
                                                            direction="row"
                                                            spacing={1.25}
                                                            sx={{ alignItems: "flex-start" }}
                                                        >

                                                            <Box
                                                                sx={{
                                                                    width: 6,
                                                                    height: 6,
                                                                    borderRadius: "50%",
                                                                    bgcolor: "primary.main",
                                                                    mt: 0.9,
                                                                    flexShrink: 0
                                                                }}
                                                            />

                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
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
                            )}

                        </Box>

                    </Stack>

                </Paper>
            )}

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
