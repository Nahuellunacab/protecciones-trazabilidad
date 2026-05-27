import {

    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
    Divider

} from "@mui/material";

import {

    Link,
    Outlet

} from "react-router-dom";

import epecLogo
    from "../assets/epec-logo.png";

function MainLayout() {

    return (

        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#F4F6F8"
            }}
        >

            <AppBar
                position="static"
                color="primary"
                elevation={2}
            >

                <Toolbar
                    sx={{
                        minHeight: "80px",
                        display: "flex",
                        gap: 2
                    }}
                >

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            flexGrow: 1
                        }}
                    >

                        <Box
                            component="img"
                            src={epecLogo}
                            alt="EPEC"
                            sx={{
                                height: 48
                            }}
                        />

                        <Box>

                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    lineHeight: 1.1
                                }}
                            >
                                EPEC Transmisión
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    opacity: 0.9
                                }}
                            >
                                Departamento de
                                Teleoperaciones y
                                Protecciones
                            </Typography>

                        </Box>

                    </Box>

                    <Button
                        color="inherit"
                        component={Link}
                        to="/"
                    >
                        Inicio
                    </Button>

                    <Button
                        color="inherit"
                        component={Link}
                        to="/reles"
                    >
                        Relés
                    </Button>

                    <Button
                        color="inherit"
                        component={Link}
                        to="/movimientos"
                    >
                        Movimientos
                    </Button>

                    <Divider
                        orientation="vertical"
                        flexItem
                        sx={{
                            borderColor:
                                "rgba(255,255,255,0.3)"
                        }}
                    />

                    <Button
                        color="inherit"
                        component={Link}
                        to="/admin/marcas"
                    >
                        Marcas
                    </Button>

                    <Button
                        color="inherit"
                        component={Link}
                        to="/admin/modelos"
                    >
                        Modelos
                    </Button>

                    <Button
                        color="inherit"
                        component={Link}
                        to="/admin/destinos"
                    >
                        Destinos
                    </Button>

                    <Button
                        color="inherit"
                        component={Link}
                        to="/admin/posiciones"
                    >
                        Posiciones
                    </Button>

                </Toolbar>

            </AppBar>

            <Container
                maxWidth="xl"
                sx={{
                    mt: 5,
                    mb: 5
                }}
            >

                <Outlet />

            </Container>

        </Box>
    );
}

export default MainLayout;