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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    Avatar,
    Chip,
} from "@mui/material";

import LogoutIcon
from "@mui/icons-material/Logout";

import LockResetIcon
from "@mui/icons-material/LockReset";

import axios
from "axios";

import { cambiarPassword }
from "../services/authService";

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

import { useAuth }
from "../context/AuthContext";

import { useNavigate }
from "react-router-dom";

function MainLayout() {

    const { mode, toggleColorMode } =
        useColorMode();

    const { usuario, isAdmin, logout } =
        useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {

        logout();

        navigate("/login", { replace: true });
    };

    const [passwordDialogOpen, setPasswordDialogOpen] =
        useState(false);

    const [passwordActual, setPasswordActual] =
        useState("");

    const [passwordNueva, setPasswordNueva] =
        useState("");

    const [passwordConfirmar, setPasswordConfirmar] =
        useState("");

    const [passwordError, setPasswordError] =
        useState("");

    const [passwordExito, setPasswordExito] =
        useState("");

    const [passwordGuardando, setPasswordGuardando] =
        useState(false);

    const abrirDialogPassword = () => {

        setPasswordActual("");
        setPasswordNueva("");
        setPasswordConfirmar("");
        setPasswordError("");
        setPasswordExito("");
        setPasswordDialogOpen(true);
    };

    const cerrarDialogPassword = () => {

        setPasswordDialogOpen(false);
    };

    const handleCambiarPassword = async () => {

        setPasswordError("");

        if (!passwordActual || !passwordNueva || !passwordConfirmar) {

            setPasswordError(
                "Completá los tres campos"
            );

            return;
        }

        if (passwordNueva !== passwordConfirmar) {

            setPasswordError(
                "La confirmación no coincide con la nueva contraseña"
            );

            return;
        }

        try {

            setPasswordGuardando(true);

            await cambiarPassword(
                passwordActual,
                passwordNueva
            );

            setPasswordExito(
                "Contraseña actualizada correctamente"
            );

            setPasswordActual("");
            setPasswordNueva("");
            setPasswordConfirmar("");

        } catch (err) {

            if (axios.isAxiosError(err)) {

                setPasswordError(
                    err.response?.data?.message
                    || "No se pudo cambiar la contraseña"
                );

            } else {

                setPasswordError(
                    "No se pudo cambiar la contraseña"
                );
            }

        } finally {

            setPasswordGuardando(false);
        }
    };

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

    const [accountMenuAnchor, setAccountMenuAnchor] =
        useState<null | HTMLElement>(
            null
        );

    const abrirAccountMenu = (
        event: React.MouseEvent<HTMLElement>
    ) => {

        setAccountMenuAnchor(
            event.currentTarget
        );
    };

    const cerrarAccountMenu = () => {

        setAccountMenuAnchor(
            null
        );
    };

    const iniciales = usuario
        ? `${usuario.nombre.charAt(0)}${usuario.apellido.charAt(0)}`.toUpperCase()
        : "";

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
                sx={{
                    background:
                        "linear-gradient(90deg, #00695C 0%, #004D40 100%)"
                }}
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
                                        : 500,

                                borderRadius: 2,
                                px: 1.5,

                                backgroundColor:
                                    isActive("/")
                                        ? "rgba(255,255,255,0.18)"
                                        : "transparent",

                                "&:hover": {
                                    backgroundColor:
                                        "rgba(255,255,255,0.12)"
                                }
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
                                        : 500,

                                borderRadius: 2,
                                px: 1.5,

                                backgroundColor:
                                    isActive("/reles")
                                        ? "rgba(255,255,255,0.18)"
                                        : "transparent",

                                "&:hover": {
                                    backgroundColor:
                                        "rgba(255,255,255,0.12)"
                                }
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
                                        : 500,

                                borderRadius: 2,
                                px: 1.5,

                                backgroundColor:
                                    isActive("/movimientos")
                                        ? "rgba(255,255,255,0.18)"
                                        : "transparent",

                                "&:hover": {
                                    backgroundColor:
                                        "rgba(255,255,255,0.12)"
                                }
                            }}
                        >
                            Movimientos
                        </Button>

                        <Divider
                            orientation="vertical"
                            flexItem
                            sx={{
                                borderColor:
                                    "rgba(255,255,255,0.3)",
                                my: 1.5
                            }}
                        />

                        <Button
                            color="inherit"
                            onClick={abrirAdminMenu}
                            endIcon={
                                <ArrowDropDownIcon />
                            }
                            sx={{
                                borderRadius: 2,
                                px: 1.5,
                                fontWeight: 500,

                                backgroundColor:
                                    Boolean(anchorEl)
                                        ? "rgba(255,255,255,0.18)"
                                        : "transparent",

                                "&:hover": {
                                    backgroundColor:
                                        "rgba(255,255,255,0.12)"
                                }
                            }}
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

                            {isAdmin && (

                                <MenuItem
                                    component={Link}
                                    to="/admin/usuarios"
                                    onClick={cerrarMenu}
                                >
                                    Usuarios
                                </MenuItem>
                            )}

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

                    {usuario && (

                        <>

                            <IconButton
                                onClick={abrirAccountMenu}
                                size="small"
                                aria-label="Cuenta"
                                aria-controls={
                                    accountMenuAnchor
                                        ? "account-menu"
                                        : undefined
                                }
                                aria-haspopup="true"
                                sx={{ ml: 0.5 }}
                            >

                                <Avatar
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        bgcolor: "rgba(255,255,255,0.25)",
                                        color: "#fff",
                                        fontSize: "0.9rem",
                                        fontWeight: 700
                                    }}
                                >
                                    {iniciales}
                                </Avatar>

                            </IconButton>

                            <Menu
                                id="account-menu"
                                anchorEl={accountMenuAnchor}
                                open={Boolean(accountMenuAnchor)}
                                onClose={cerrarAccountMenu}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right"
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right"
                                }}
                                slotProps={{
                                    paper: {
                                        sx: { minWidth: 260, mt: 1 }
                                    }
                                }}
                            >

                                <Box
                                    sx={{
                                        px: 2,
                                        py: 1.5,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5
                                    }}
                                >

                                    <Avatar
                                        sx={{
                                            width: 44,
                                            height: 44,
                                            bgcolor: "primary.main",
                                            fontWeight: 700
                                        }}
                                    >
                                        {iniciales}
                                    </Avatar>

                                    <Box sx={{ minWidth: 0 }}>

                                        <Typography
                                            variant="subtitle2"
                                            noWrap
                                            sx={{ fontWeight: 700 }}
                                        >
                                            {usuario.nombre}
                                            {" "}
                                            {usuario.apellido}
                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            noWrap
                                            sx={{ display: "block" }}
                                        >
                                            {usuario.email}
                                        </Typography>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.75,
                                                mt: 0.5
                                            }}
                                        >

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                N° Sobre: {usuario.numeroSobre}
                                            </Typography>

                                            <Chip
                                                label={usuario.rol}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                                sx={{
                                                    height: 20,
                                                    fontSize: "0.65rem"
                                                }}
                                            />

                                        </Box>

                                    </Box>

                                </Box>

                                <Divider />

                                <MenuItem
                                    onClick={() => {

                                        cerrarAccountMenu();
                                        abrirDialogPassword();
                                    }}
                                >

                                    <LockResetIcon
                                        fontSize="small"
                                        sx={{ mr: 1.5 }}
                                    />
                                    Cambiar contraseña

                                </MenuItem>

                                <MenuItem
                                    onClick={() => {

                                        cerrarAccountMenu();
                                        handleLogout();
                                    }}
                                >

                                    <LogoutIcon
                                        fontSize="small"
                                        sx={{ mr: 1.5 }}
                                    />
                                    Cerrar sesión

                                </MenuItem>

                            </Menu>

                        </>
                    )}

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

                        {isAdmin && (

                            <ListItemButton
                                component={Link}
                                to="/admin/usuarios"
                                onClick={cerrarDrawer}
                            >

                                <ListItemText
                                    primary="Usuarios"
                                />

                            </ListItemButton>
                        )}

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

            <Dialog
                open={passwordDialogOpen}
                onClose={cerrarDialogPassword}
                maxWidth="xs"
                fullWidth
            >

                <DialogTitle>
                    Cambiar contraseña
                </DialogTitle>

                <DialogContent>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            mt: 1
                        }}
                    >

                        <TextField
                            label="Contraseña actual"
                            type="password"
                            value={passwordActual}
                            onChange={(e) =>
                                setPasswordActual(e.target.value)
                            }
                            fullWidth
                        />

                        <TextField
                            label="Nueva contraseña"
                            type="password"
                            value={passwordNueva}
                            onChange={(e) =>
                                setPasswordNueva(e.target.value)
                            }
                            fullWidth
                        />

                        <TextField
                            label="Confirmar nueva contraseña"
                            type="password"
                            value={passwordConfirmar}
                            onChange={(e) =>
                                setPasswordConfirmar(e.target.value)
                            }
                            fullWidth
                        />

                        {passwordError && (

                            <Alert severity="error">
                                {passwordError}
                            </Alert>
                        )}

                        {passwordExito && (

                            <Alert severity="success">
                                {passwordExito}
                            </Alert>
                        )}

                    </Box>

                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        pb: 2
                    }}
                >

                    <Button
                        onClick={cerrarDialogPassword}
                    >
                        Cerrar
                    </Button>

                    <Button
                        variant="contained"
                        disabled={passwordGuardando}
                        onClick={handleCambiarPassword}
                    >
                        Guardar
                    </Button>

                </DialogActions>

            </Dialog>

        </Box>
    );
}

export default MainLayout;
