import {

    Box,
    Typography,
    Grid,
    Paper

} from "@mui/material";

import PrecisionManufacturingIcon
    from "@mui/icons-material/PrecisionManufacturing";

import ElectricBoltIcon
    from "@mui/icons-material/ElectricBolt";

import TimelineIcon
    from "@mui/icons-material/Timeline";

function HomePage() {

    return (

        <Box>

            <Box
                sx={{
                    mb: 6
                }}
            >

                <Typography
                    variant="h4"
                    gutterBottom
                >
                    Sistema de Gestión y
                    Trazabilidad de Relés
                </Typography>

                <Typography
                    variant="h6"
                    color="text.secondary"
                >
                    EPEC Transmisión
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        mt: 2,
                        maxWidth: "900px"
                    }}
                >
                    Plataforma interna para
                    administración, seguimiento
                    y trazabilidad de relés de
                    protección utilizados por
                    el Departamento de
                    Teleoperaciones y
                    Protecciones.
                </Typography>

            </Box>

            <Grid
                container
                spacing={4}
            >

                <Grid size={{ xs: 12, md: 4 }}>

                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            height: "100%"
                        }}
                    >

                        <PrecisionManufacturingIcon
                            color="primary"
                            sx={{
                                fontSize: 50,
                                mb: 2
                            }}
                        />

                        <Typography
                            variant="h6"
                            gutterBottom
                        >
                            Gestión de Relés
                        </Typography>

                        <Typography
                            color="text.secondary"
                        >
                            Administración de
                            equipos de protección,
                            modelos, marcas y
                            datos operativos.
                        </Typography>

                    </Paper>

                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>

                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            height: "100%"
                        }}
                    >

                        <TimelineIcon
                            color="primary"
                            sx={{
                                fontSize: 50,
                                mb: 2
                            }}
                        />

                        <Typography
                            variant="h6"
                            gutterBottom
                        >
                            Trazabilidad
                        </Typography>

                        <Typography
                            color="text.secondary"
                        >
                            Historial completo de
                            movimientos, estados,
                            ubicaciones y cambios
                            operativos.
                        </Typography>

                    </Paper>

                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>

                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            height: "100%"
                        }}
                    >

                        <ElectricBoltIcon
                            color="primary"
                            sx={{
                                fontSize: 50,
                                mb: 2
                            }}
                        />

                        <Typography
                            variant="h6"
                            gutterBottom
                        >
                            Operación Técnica
                        </Typography>

                        <Typography
                            color="text.secondary"
                        >
                            Herramienta diseñada
                            para soporte operativo
                            y gestión técnica de
                            activos críticos de
                            transmisión eléctrica.
                        </Typography>

                    </Paper>

                </Grid>

            </Grid>

        </Box>
    );
}

export default HomePage;