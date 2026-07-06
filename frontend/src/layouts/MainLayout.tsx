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
    IconButton,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    ListSubheader,
} from "@mui/material";

import ArrowDropDownIcon
from "@mui/icons-material/ArrowDropDown";

import MenuIcon
from "@mui/icons-material/Menu";

import Brightness4Icon
from "@mui/icons-material/Brightness4";

import Brightness7Icon
from "@mui/icons-material/Brightness7";

import epecLogo
    from "../assets/epec-logo.png";

import { useState } from "react";

import {
    Link,
    Outlet,
    useLocation
} from "react-router-dom";

import { useColorMode }
from "../theme/ColorModeContext";

function MainLayout() {

    const { mode, toggleColorMode } =
        useColorMode();

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

    const [drawerOpen, setDrawerOpen] =
        useState(false);

    const abrirDrawer = () => {

        setDrawerOpen(true);
    };

    const cerrarDrawer = () => {

        setDrawerOpen(false);
    };

    return (

        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "background.default"
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
                            flexGrow: 1,
                            minWidth: 0
                        }}
                    >

                        <Box
                            component="img"
                            src={epecLogo}
                            alt="EPEC"
                            sx={{
                                height: 48,
                                flexShrink: 0
                            }}
                        />

                        <Box
                            sx={{
                                minWidth: 0
                            }}
                        >

                            <Typography
                                variant="h6"
                                noWrap
                                sx={{
                                    fontWeight: 700,
                                    lineHeight: 1.1
                                }}
                            >
                                EPEC Transmisión
                            </Typography>

                            <Typography
                                variant="body2"
                                noWrap
                                sx={{
                                    opacity: 0.9,
                                    display: {
                                        xs: "none",
                                        sm: "block"
                                    }
                                }}
                            >
                                Depto. de
                                Teleoperaciones y
                                Protecciones
                            </Typography>

                        </Box>

                    </Box>

                    <Box
                        sx={{
                            display: {
                                xs: "none",
                                md: "flex"
                            },
                            alignItems: "center",
                            gap: 2
                        }}
                    >

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

                    </Box>

                    <IconButton
                        color="inherit"
                        onClick={toggleColorMode}
                        aria-label={
                            mode === "dark"
                                ? "Cambiar a modo claro"
                                : "Cambiar a modo oscuro"
                        }
                    >

                        {
                            mode === "dark"
                                ? <Brightness7Icon />
                                : <Brightness4Icon />
                        }

                    </IconButton>

                    <IconButton
                        color="inherit"
                        onClick={abrirDrawer}
                        aria-label="Abrir menú"
                        sx={{
                            display: {
                                xs: "flex",
                                md: "none"
                            }
                        }}
                    >

                        <MenuIcon />

                    </IconButton>

                </Toolbar>

            </AppBar>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={cerrarDrawer}
            >

                <Box
                    sx={{
                        width: 280
                    }}
                    role="presentation"
                >

                    <List>

                        <ListItemButton
                            component={Link}
                            to="/"
                            selected={isActive("/")}
                            onClick={cerrarDrawer}
                        >

                            <ListItemText
                                primary="Dashboard"
                            />

                        </ListItemButton>

                        <ListItemButton
                            component={Link}
                            to="/reles"
                            selected={isActive("/reles")}
                            onClick={cerrarDrawer}
                        >

                            <ListItemText
                                primary="Relés"
                            />

                        </ListItemButton>

                        <ListItemButton
                            component={Link}
                            to="/movimientos"
                            selected={isActive("/movimientos")}
                            onClick={cerrarDrawer}
                        >

                            <ListItemText
                                primary="Movimientos"
                            />

                        </ListItemButton>

                        <Divider />

                        <ListSubheader>
                            GESTIÓN
                        </ListSubheader>

                        <ListItemButton
                            component={Link}
                            to="/admin/marcas"
                            onClick={cerrarDrawer}
                        >

                            <ListItemText
                                primary="Marcas"
                            />

                        </ListItemButton>

                        <ListItemButton
                            component={Link}
                            to="/admin/modelos"
                            onClick={cerrarDrawer}
                        >

                            <ListItemText
                                primary="Modelos"
                            />

                        </ListItemButton>

                        <ListItemButton
                            component={Link}
                            to="/admin/proveedores"
                            onClick={cerrarDrawer}
                        >

                            <ListItemText
                                primary="Proveedores"
                            />

                        </ListItemButton>

                        <Divider />

                        <ListSubheader>
                            UBICACIONES
                        </ListSubheader>

                        <ListItemButton
                            component={Link}
                            to="/admin/destinos"
                            onClick={cerrarDrawer}
                        >

                            <ListItemText
                                primary="Destinos"
                            />

                        </ListItemButton>

                        <ListItemButton
                            component={Link}
                            to="/admin/posiciones"
                            onClick={cerrarDrawer}
                        >

                            <ListItemText
                                primary="Posiciones"
                            />

                        </ListItemButton>

                        <ListItemButton
                            component={Link}
                            to="/admin/provincias"
                            onClick={cerrarDrawer}
                        >

                            <ListItemText
                                primary="Provincias"
                            />

                        </ListItemButton>

                        <ListItemButton
                            component={Link}
                            to="/admin/localidades"
                            onClick={cerrarDrawer}
                        >

                            <ListItemText
                                primary="Localidades"
                            />

                        </ListItemButton>

                        <Divider />

                        <ListSubheader>
                            DOCUMENTACIÓN
                        </ListSubheader>

                        <ListItemButton
                            component={Link}
                            to="/admin/remitos"
                            onClick={cerrarDrawer}
                        >

                            <ListItemText
                                primary="Remitos"
                            />

                        </ListItemButton>

                        <ListItemButton
                            component={Link}
                            to="/admin/ordenes-provision"
                            onClick={cerrarDrawer}
                        >

                            <ListItemText
                                primary="Órdenes de Provisión"
                            />

                        </ListItemButton>

                    </List>

                </Box>

            </Drawer>

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
