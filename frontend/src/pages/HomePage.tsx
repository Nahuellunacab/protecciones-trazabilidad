import {

    Paper,
    Typography,
    Grid,
    Stack,
    Box,
    Chip,
    Divider,
    CircularProgress

} from "@mui/material";

import {

    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip

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
    obtenerUltimosMovimientos

} from "../services/dashboardService";

const pieColors = [

    "#1976D2",
    "#00695C",
    "#EF6C00",
    "#8E24AA"
];

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

    const cargarDashboard =
    async () => {

        try {

            const kpiData =
                await obtenerDashboardKpis();

            const movimientosData =
                await obtenerUltimosMovimientos();

            setKpis(kpiData);

            setMovimientos(
                movimientosData
            );

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
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

    const cards = [

        {
            title: "Relés Activos",
            value: kpis.relesActivos,
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

            <Grid
                container
                spacing={3}
            >

                {cards.map((card) => (

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={2}
                        key={card.title}
                    >

                        <Paper
                            elevation={2}
                            sx={{
                                p: 2,
                                minHeight: 110,
                                borderLeft:
                                    `6px solid ${card.color}`,
                                height: "100%"
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

            <Grid
                container
                spacing={3}
            >

                <Grid
                    item
                    xs={12}
                    md={5}
                >

                    <Paper
                        elevation={2}
                        sx={{
                            p: 3,
                            height: 320
                        }}
                    >

                        <Typography
                            variant="h6"
                            gutterBottom
                        >

                            Estado del Stock Operativo

                        </Typography>

                        <ResponsiveContainer
                            width="100%"
                            height="90%"
                        >

                            <PieChart>

                                <Pie
                                    data={estadosData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={100}
                                    label
                                >

                                    {estadosData.map(
                                        (_, index) => (

                                        <Cell
                                            key={index}
                                            fill={
                                                pieColors[index]
                                            }
                                        />
                                    ))}

                                </Pie>

                                <Tooltip />

                            </PieChart>

                        </ResponsiveContainer>

                    </Paper>

                </Grid>

                <Grid
                    item
                    xs={12}
                    md={7}
                >

                    <Paper
                        elevation={2}
                        sx={{
                            p: 3,
                            height: 320
                        }}
                    >

                        <Typography
                            variant="h6"
                            gutterBottom
                        >

                            Resumen Operativo

                        </Typography>

                        <Stack
                            spacing={2}
                            sx={{ mt: 3 }}
                        >

                            <Box>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >

                                    Relés dados de baja

                                </Typography>

                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                >

                                    {kpis.relesBaja}

                                </Typography>

                            </Box>

                            <Divider />

                            <Box>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >

                                    Movimientos registrados

                                </Typography>

                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                >

                                    {movimientos.length}

                                </Typography>

                            </Box>

                            <Divider />

                            <Box>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >

                                    Última actualización

                                </Typography>

                                <Typography
                                    variant="body1"
                                    fontWeight={600}
                                >

                                    {
                                        new Date()
                                            .toLocaleString(
                                                "es-AR"
                                            )
                                    }

                                </Typography>

                            </Box>

                        </Stack>

                    </Paper>

                </Grid>

            </Grid>

            <Paper
                elevation={2}
                sx={{ p: 3 }}
            >

                <Typography
                    variant="h6"
                    gutterBottom
                >

                    Últimos Movimientos

                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Stack spacing={2}>

                    {movimientos.map(
                        (mov) => (

                        <Box
                            key={mov.id}
                            sx={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems: "center",
                                p: 2,
                                borderRadius: 2,
                                backgroundColor:
                                    "#F8F9FA"
                            }}
                        >

                            <Stack spacing={0.5}>

                                <Typography
                                    fontWeight={600}
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
                                    variant="body2"
                                    color="text.secondary"
                                >

                                    {mov.destino}
                                    {" | "}
                                    {mov.posicion}

                                </Typography>

                            </Stack>

                            <Chip
                                label={mov.estado}
                                color={
                                    mov.estado ===
                                    "INSTALADO"

                                        ? "primary"

                                        : mov.estado ===
                                          "EN REPARACION"

                                            ? "warning"

                                            : "success"
                                }
                            />

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >

                                {
                                    mov.fechaMovimiento
                                        ? new Date(
                                            mov.fechaMovimiento
                                          ).toLocaleString(
                                            "es-AR"
                                          )
                                        : "-"
                                }

                            </Typography>

                        </Box>
                    ))}

                </Stack>

            </Paper>

        </Stack>
    );
}

export default HomePage;