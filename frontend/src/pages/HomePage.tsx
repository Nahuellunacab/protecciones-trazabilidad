import {

    Paper,
    Typography,
    Grid,
    Stack,
    Box,
    Chip,
    Divider,
    CircularProgress,
    LinearProgress

} from "@mui/material";

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
    obtenerRelesPorMarca

} from "../services/dashboardService";

import type { MarcaCantidad } from "../types/MarcaCantidad";

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

    useEffect(() => {

        cargarDashboard();

    }, []);

    const [
        marcasData,
        setMarcasData
    ] =
        useState<MarcaCantidad[]>([]);

    const cargarDashboard =
    async () => {

        try {

            const kpiData =
                await obtenerDashboardKpis();

            const movimientosData =
                await obtenerUltimosMovimientos();

            const marcas =
                await obtenerRelesPorMarca();

            setKpis(
                kpiData
            );

            setMovimientos(
                movimientosData
            );

            setMarcasData(
                marcas
            );

        } catch (error) {

            console.error(
                error
            );

        } finally {

            setLoading(
                false
            );
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

    const cardsOperativas = [

        {
            title: "En Stock",
            value: kpis.relesEnStock,
            color: "#00695C"
        },

        {
            title: "Instalados",
            value: kpis.relesInstalados,
            color: "#1976D2"
        },

        {
            title: "En Reparación",
            value: kpis.relesReparacion,
            color: "#EF6C00"
        },

        {
            title: "Ensayo",
            value: kpis.relesEnsayo,
            color: "#8E24AA"
        },

        {
            title: "Garantías Vencidas",
            value: kpis.garantiasVencidas,
            color: "#C62828"
        }
    ];

    const estadosData = [

        {
            name: "En Stock",
            value: kpis.relesEnStock
        },

        {
            name: "Instalados",
            value: kpis.relesInstalados
        },

        {
            name: "Reparación",
            value: kpis.relesReparacion
        },

        {
            name: "Ensayo",
            value: kpis.relesEnsayo
        },

        {
            name: "Baja",
            value: kpis.relesBaja
        }
    ];

    return (

        <Stack spacing={4}>

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
                        item
                        xs={12}
                        sm={6}
                        md
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
                                fontWeight={700}
                            >

                                {card.value}

                            </Typography>

                        </Paper>

                    </Grid>
                ))}

            </Grid>
            
            <Typography
                variant="subtitle2"
                sx={{
                    mt: 4,
                    mb: 2,
                    fontWeight: 600,
                    color: "#616161"
                }}
            >
                Estado Operativo
            </Typography>

            <Grid
                container
                spacing={2}
            >

                {cardsOperativas.map((card) => (

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md
                        key={card.title}
                        sx={{
                            flexGrow: 1,
                            display: "flex"
                        }}
                    >

                        <Paper
                            elevation={2}
                            sx={{
                                p: 2,
                                width: "100%",
                                minHeight: 110,
                                borderLeft: `5px solid ${card.color}`,
                                borderRadius: 3
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
                                variant="h5"
                                fontWeight={700}
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
            <Grid container spacing={3} sx={{ mb: 4 }}>
            
                {/*Grafico de estados de relés*/}
                <Grid item xs={12} md={6}>

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

                                <XAxis dataKey="name" />

                                <YAxis />

                                <Tooltip />

                                <Bar
                                    dataKey="value"
                                    fill="#00695C"
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </Paper>

                </Grid>

                {/* Gráfico de cantidad de relés por marca*/}
                <Grid item xs={12} md={6}>

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
                                    width={80}
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

                <Grid item xs={12} md={3}>

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

                <Grid item xs={12} md={3}>
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

                <Grid item xs={12} md={3}>

                    <Paper sx={{ p: 3, borderRadius: 3 }}>

                        <Typography variant="body2">
                            Remitos cargados
                        </Typography>

                        <Typography
                            variant="h4"
                            color="info.main"
                        >
                            {kpis.remitosPendientes}
                        </Typography>

                    </Paper>

                </Grid>

                <Grid item xs={12} md={3}>

                    <Paper sx={{ p: 3, borderRadius: 3 }}>

                        <Typography variant="body2">
                            Ordenes de Provisión cargadas
                        </Typography>

                        <Typography
                            variant="h4"
                            color="success.main"
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
                    fontWeight={600}
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
                    maxHeight: 550,
                    overflowY: "auto",
                    borderRadius: 3
                }}
            >

                <Typography
                    variant="h6"
                    gutterBottom
                    fontWeight={600}
                >

                    Últimos Movimientos

                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Stack spacing={2}>

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
                                    fontWeight={700}
                                    variant="body1"
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

                            </Box>


                            {/* Estado */}

                            <Box sx={{ width: "20%" }}>

                                <Chip
                                    label={mov.estado}

                                    color={
                                        mov.estado === "INSTALADO"

                                            ? "primary"

                                            : mov.estado === "EN REPARACION"

                                                ? "warning"

                                                : mov.estado === "EN ENSAYO"

                                                    ? "secondary"

                                                    : "success"
                                    }

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