import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
    Divider,
    Menu,
    MenuItem,
} from "@mui/material";

import ArrowDropDownIcon
from "@mui/icons-material/ArrowDropDown";

import epecLogo
    from "../assets/epec-logo.png";

import { useState } from "react";

import {
    Link,
    Outlet,
    useLocation
} from "react-router-dom";

function MainLayout() {

    const location = useLocation();

    const isActive = (
        path: string
    ) =>
        location.pathname === path;

    const [anchorEl, setAnchorEl] =
        useState<null | HTMLElement>(
            null
        );

    const abrirAdminMenu = (
        event: React.MouseEvent<HTMLElement>
    ) => {

        setAnchorEl(
            event.currentTarget
        );
    };

    const cerrarMenu = () => {

        setAnchorEl(
            null
        );
    };

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
                                Depto. de
                                Teleoperaciones y
                                Protecciones
                            </Typography>

                        </Box>

                    </Box>

                    <Button
                        color="inherit"
                        component={Link}
                        to="/"
                        sx={{
                            fontWeight:
                                isActive("/")
                                    ? 700
                                    : 400,

                            borderBottom:
                                isActive("/")
                                    ? "2px solid white"
                                    : "none"
                        }}
                    >
                        Dashboard
                    </Button>

                    <Button
                        color="inherit"
                        component={Link}
                        to="/reles"
                        sx={{
                            fontWeight:
                                isActive("/reles")
                                    ? 700
                                    : 400,

                            borderBottom:
                                isActive("/reles")
                                    ? "2px solid white"
                                    : "none"
                        }}
                    >
                        Relés
                    </Button>

                    <Button
                        color="inherit"
                        component={Link}
                        to="/movimientos"
                        sx={{
                            fontWeight:
                                isActive("/movimientos")
                                    ? 700
                                    : 400,

                            borderBottom:
                                isActive("/movimientos")
                                    ? "2px solid white"
                                    : "none"
                        }}
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
                        onClick={abrirAdminMenu}
                        endIcon={
                            <ArrowDropDownIcon />
                        }
                    >
                        Administración
                    </Button>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={cerrarMenu}
                    >

                        <Typography
                            sx={{
                                px: 2,
                                pt: 1,
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                color: "text.secondary"
                            }}
                        >
                            GESTIÓN
                        </Typography>

                        <MenuItem
                            component={Link}
                            to="/admin/marcas"
                            onClick={cerrarMenu}
                        >
                            Marcas
                        </MenuItem>

                        <MenuItem
                            component={Link}
                            to="/admin/modelos"
                            onClick={cerrarMenu}
                        >
                            Modelos
                        </MenuItem>

                        <MenuItem
                            component={Link}
                            to="/admin/proveedores"
                            onClick={cerrarMenu}
                        >
                            Proveedores
                        </MenuItem>

                        <Divider />

                        <Typography
                            sx={{
                                px: 2,
                                pt: 1,
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                color: "text.secondary"
                            }}
                        >
                            UBICACIONES
                        </Typography>

                        <MenuItem
                            component={Link}
                            to="/admin/destinos"
                            onClick={cerrarMenu}
                        >
                            Destinos
                        </MenuItem>

                        <MenuItem
                            component={Link}
                            to="/admin/posiciones"
                            onClick={cerrarMenu}
                        >
                            Posiciones
                        </MenuItem>

                        <MenuItem
                            component={Link}
                            to="/admin/provincias"
                            onClick={cerrarMenu}
                        >
                            Provincias
                        </MenuItem>

                        <MenuItem
                            component={Link}
                            to="/admin/localidades"
                            onClick={cerrarMenu}
                        >
                            Localidades
                        </MenuItem>

                        <Divider />

                        <Typography
                            sx={{
                                px: 2,
                                pt: 1,
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                color: "text.secondary"
                            }}
                        >
                            DOCUMENTACIÓN
                        </Typography>

                        <MenuItem
                            component={Link}
                            to="/admin/remitos"
                            onClick={cerrarMenu}
                        >
                            Remitos
                        </MenuItem>

                        <MenuItem
                            component={Link}
                            to="/admin/ordenes-provision"
                            onClick={cerrarMenu}
                        >
                            Órdenes
                        </MenuItem>

                    </Menu>

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