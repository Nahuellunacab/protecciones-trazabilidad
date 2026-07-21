import {

    Box,
    Typography,
    Grid,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    Stack,
    Skeleton,
    Button,
    Paper

} from "@mui/material";

import { useTheme, alpha } from "@mui/material/styles";

import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { useRecentReles } from "../hooks/useRecentReles";

import { tiempoRelativo } from "../utils/tiempoRelativo";

import BuscadorGlobal from "../components/inicio/BuscadorGlobal";

import {

    obtenerDashboardKpis,
    obtenerRelesPorDestino,
    obtenerRelesPorEstado,
    obtenerUltimosMovimientos

} from "../services/dashboardService";

import { obtenerDestinos } from "../services/destinoService";

import type { DashboardKpi } from "../types/DashboardKpi";

import type { DestinoCantidad } from "../types/DestinoCantidad";

import type { EstadoCantidad } from "../types/EstadoCantidad";

import type { Movimiento } from "../types/Movimiento";

import type { Destino } from "../types/Destino";

import AddCircleOutlineIcon
from "@mui/icons-material/AddCircleOutlined";

import SwapHorizIcon
from "@mui/icons-material/SwapHoriz";

import SearchIcon
from "@mui/icons-material/Search";

import SpaceDashboardOutlinedIcon
from "@mui/icons-material/SpaceDashboardOutlined";

import ApartmentOutlinedIcon
from "@mui/icons-material/ApartmentOutlined";

import ReceiptLongOutlinedIcon
from "@mui/icons-material/ReceiptLongOutlined";

import MemoryOutlinedIcon
from "@mui/icons-material/MemoryOutlined";

import AssignmentOutlinedIcon
from "@mui/icons-material/AssignmentOutlined";

import DescriptionOutlinedIcon
from "@mui/icons-material/DescriptionOutlined";

import EventBusyOutlinedIcon
from "@mui/icons-material/EventBusyOutlined";

import ScienceOutlinedIcon
from "@mui/icons-material/ScienceOutlined";

import ArrowForwardIcon
from "@mui/icons-material/ArrowForward";

import AccessTimeIcon
from "@mui/icons-material/AccessTime";

import CalendarTodayIcon
from "@mui/icons-material/CalendarToday";

import HistoryIcon
from "@mui/icons-material/History";

import SellOutlinedIcon
from "@mui/icons-material/SellOutlined";

import CategoryOutlinedIcon
from "@mui/icons-material/CategoryOutlined";

import LocalShippingOutlinedIcon
from "@mui/icons-material/LocalShippingOutlined";

import PinDropOutlinedIcon
from "@mui/icons-material/PinDropOutlined";

import PublicOutlinedIcon
from "@mui/icons-material/PublicOutlined";

import LocationCityOutlinedIcon
from "@mui/icons-material/LocationCityOutlined";

import GroupOutlinedIcon
from "@mui/icons-material/GroupOutlined";

type ColorSemantico =
    "primary" | "secondary" | "success" | "warning" | "error" | "info";

function saludoSegunHora(hora: number): string {

    if (hora < 12) {

        return "Buenos días";
    }

    if (hora < 20) {

        return "Buenas tardes";
    }

    return "Buenas noches";
}

function irASeccion(idSeccion: string) {

    document
        .getElementById(idSeccion)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function enfocarBuscador() {

    irASeccion("buscador-global");

    window.setTimeout(() => {

        document
            .getElementById("buscador-global-input")
            ?.focus();

    }, 400);
}

interface SeccionTituloProps {

    icono: React.ReactNode;

    titulo: string;
}

function SeccionTitulo({ icono, titulo }: SeccionTituloProps) {

    return (

        <Stack
            direction="row"
            spacing={1.5}
            sx={{ alignItems: "center", mb: 2.5 }}
        >

            <Box sx={{ color: "primary.main", display: "flex" }}>
                {icono}
            </Box>

            <Typography
                variant="h6"
                sx={{ fontWeight: 700 }}
            >
                {titulo}
            </Typography>

        </Stack>
    );
}

interface AccionRapida {

    titulo: string;

    descripcion: string;

    icon: React.ReactNode;

    to?: string;

    onClick?: () => void;
}

function AccionRapidaCard(
    { titulo, descripcion, icon, to, onClick }: AccionRapida
) {

    const contenido = (

        <CardContent
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                height: "100%"
            }}
        >

            <Box
                sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: (theme) =>
                        alpha(theme.palette.primary.main, 0.12),
                    color: "primary.main"
                }}
            >
                {icon}
            </Box>

            <Box>

                <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700 }}
                >
                    {titulo}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    {descripcion}
                </Typography>

            </Box>

        </CardContent>
    );

    return (

        <Card
            elevation={0}
            sx={{
                height: "100%",
                border: "1px solid",
                borderColor: "divider",
                transition: "transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                    backgroundColor: "action.hover"
                }
            }}
        >

            {to ? (

                <CardActionArea
                    component={Link}
                    to={to}
                    sx={{ height: "100%" }}
                >
                    {contenido}
                </CardActionArea>

            ) : (

                <CardActionArea
                    onClick={onClick}
                    sx={{ height: "100%" }}
                >
                    {contenido}
                </CardActionArea>
            )}

        </Card>
    );
}

interface NotificacionItemProps {

    icono: React.ReactNode;

    titulo: string;

    valor: number;

    to?: string;

    color: ColorSemantico;
}

function NotificacionItem(
    { icono, titulo, valor, to, color }: NotificacionItemProps
) {

    if (valor <= 0) return null;

    const fila = (

        <Stack
            direction="row"
            spacing={1.5}
            sx={{
                alignItems: "center",
                px: 2,
                py: 1.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                "&:hover": to ? {
                    backgroundColor: "action.hover"
                } : undefined
            }}
        >

            <Box sx={{ color: `${color}.main`, display: "flex" }}>
                {icono}
            </Box>

            <Typography
                variant="body2"
                sx={{ flexGrow: 1 }}
            >
                {titulo}
            </Typography>

            <Chip
                label={valor}
                size="small"
                color={color}
                sx={{ fontWeight: 700 }}
            />

        </Stack>
    );

    return fila;
}

function InicioPage() {

    const theme = useTheme();

    const { usuario, isAdmin } = useAuth();

    const recientes = useRecentReles();

    const [ahora, setAhora] = useState(new Date());

    const [kpis, setKpis] =
        useState<DashboardKpi | null>(null);

    const [destinosCantidad, setDestinosCantidad] =
        useState<DestinoCantidad[]>([]);

    const [estadosCantidad, setEstadosCantidad] =
        useState<EstadoCantidad[]>([]);

    const [movimientosRecientes, setMovimientosRecientes] =
        useState<Movimiento[]>([]);

    const [destinosCatalogo, setDestinosCatalogo] =
        useState<Destino[]>([]);

    const [cargando, setCargando] =
        useState(true);

    useEffect(() => {

        const intervalo = setInterval(
            () => setAhora(new Date()),
            30 * 1000
        );

        return () => clearInterval(intervalo);

    }, []);

    useEffect(() => {

        Promise.all([
            obtenerDashboardKpis(),
            obtenerRelesPorDestino(),
            obtenerRelesPorEstado(),
            obtenerUltimosMovimientos(8),
            obtenerDestinos()
        ])
            .then(([
                kpisData,
                destinosData,
                estadosData,
                movimientosData,
                destinosCatalogoData
            ]) => {

                setKpis(kpisData);
                setDestinosCantidad(destinosData);
                setEstadosCantidad(estadosData);
                setMovimientosRecientes(movimientosData);
                setDestinosCatalogo(destinosCatalogoData);
            })
            .catch(() => {

                // Degradación agraciada: si algo falla, las secciones
                // dependientes simplemente no muestran datos en vez de
                // romper el resto de Inicio.
            })
            .finally(() => setCargando(false));

    }, []);

    // Patrón abstracto de grilla/circuito eléctrico para el fondo del hero,
    // generado en SVG (sin imagen externa), usando el color primario del
    // tema actual para que se acople al modo claro/oscuro vigente.
    const patronHeroSvg = encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220">
            <g stroke="${theme.palette.primary.main}" stroke-width="1" fill="none" opacity="0.18">
                <path d="M0 44 L220 44" />
                <path d="M0 110 L220 110" />
                <path d="M0 176 L220 176" />
                <path d="M44 0 L44 220" />
                <path d="M110 0 L110 220" />
                <path d="M176 0 L176 220" />
                <circle cx="44" cy="44" r="4" />
                <circle cx="110" cy="110" r="4" />
                <circle cx="176" cy="176" r="4" />
                <circle cx="176" cy="44" r="4" />
                <circle cx="44" cy="176" r="4" />
            </g>
        </svg>`
    );

    const relesEnEnsayo =
        estadosCantidad.find(
            (e) => e.estado.toUpperCase().includes("EN_ENSAYO")
        )?.cantidad ?? 0;

    const accionesRapidas: AccionRapida[] = [

        {
            titulo: "Nuevo Relé",
            descripcion: "Dar de alta un relé al stock",
            icon: <AddCircleOutlineIcon />,
            to: "/reles?nuevo=true"
        },
        {
            titulo: "Registrar Movimiento",
            descripcion: "Cargar un movimiento operativo",
            icon: <SwapHorizIcon />,
            to: "/movimientos"
        },
        {
            titulo: "Buscar Relé",
            descripcion: "Ir al buscador global",
            icon: <SearchIcon />,
            onClick: enfocarBuscador
        },
        {
            titulo: "Dashboard",
            descripcion: "KPIs, gráficos y resumen con IA",
            icon: <SpaceDashboardOutlinedIcon />,
            to: "/dashboard"
        },
        {
            titulo: "Estaciones",
            descripcion: "Ver Estaciones Transformadoras",
            icon: <ApartmentOutlinedIcon />,
            onClick: () => irASeccion("seccion-estaciones")
        },
        {
            titulo: "Documentación",
            descripcion: "Remitos y órdenes de provisión",
            icon: <ReceiptLongOutlinedIcon />,
            to: "/admin/remitos"
        }
    ];

    const modulos: AccionRapida[] = [

        {
            titulo: "Dashboard",
            descripcion: "KPIs, gráficos y resumen ejecutivo con IA",
            icon: <SpaceDashboardOutlinedIcon sx={{ fontSize: 32 }} />,
            to: "/dashboard"
        },
        {
            titulo: "Relés",
            descripcion: "Inventario, trazabilidad y estado de cada relé",
            icon: <MemoryOutlinedIcon sx={{ fontSize: 32 }} />,
            to: "/reles"
        },
        {
            titulo: "Movimientos",
            descripcion: "Registrar y consultar movimientos operativos",
            icon: <SwapHorizIcon sx={{ fontSize: 32 }} />,
            to: "/movimientos"
        }
    ];

    const accesosAdministracion = [

        { titulo: "Marcas", to: "/admin/marcas", icon: <SellOutlinedIcon fontSize="small" /> },
        { titulo: "Modelos", to: "/admin/modelos", icon: <CategoryOutlinedIcon fontSize="small" /> },
        { titulo: "Proveedores", to: "/admin/proveedores", icon: <LocalShippingOutlinedIcon fontSize="small" /> },
        { titulo: "Destinos", to: "/admin/destinos", icon: <ApartmentOutlinedIcon fontSize="small" /> },
        { titulo: "Posiciones", to: "/admin/posiciones", icon: <PinDropOutlinedIcon fontSize="small" /> },
        { titulo: "Provincias", to: "/admin/provincias", icon: <PublicOutlinedIcon fontSize="small" /> },
        { titulo: "Localidades", to: "/admin/localidades", icon: <LocationCityOutlinedIcon fontSize="small" /> },
        { titulo: "Remitos", to: "/admin/remitos", icon: <ReceiptLongOutlinedIcon fontSize="small" /> },
        { titulo: "Órdenes de Provisión", to: "/admin/ordenes-provision", icon: <AssignmentOutlinedIcon fontSize="small" /> },

        ...(isAdmin
            ? [{ titulo: "Usuarios", to: "/admin/usuarios", icon: <GroupOutlinedIcon fontSize="small" /> }]
            : [])
    ];

    return (

        <Box>

            {/* HERO */}
            <Paper
                elevation={0}
                sx={{
                    position: "relative",
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                    backgroundImage: (t) =>
                        `linear-gradient(135deg, ${alpha(t.palette.primary.main, t.palette.mode === "dark" ? 0.32 : 0.10)} 0%, transparent 70%), url("data:image/svg+xml,${patronHeroSvg}")`,
                    backgroundSize: "cover, 220px 220px",
                    px: { xs: 3, sm: 5, md: 6 },
                    py: { xs: 4, sm: 5 },
                    mb: 4
                }}
            >

                <Box sx={{ position: "relative", maxWidth: 900 }}>

                    <Typography
                        variant="overline"
                        color="primary"
                        sx={{ letterSpacing: 2, fontWeight: 700 }}
                    >
                        EPEC TRANSMISIÓN · CENTRO DE OPERACIONES
                    </Typography>

                    <Typography
                        variant="h4"
                        sx={{ fontWeight: 800, mt: 1 }}
                    >
                        {saludoSegunHora(ahora.getHours())}
                        {usuario ? `, ${usuario.nombre}` : ""}
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        Trazabilidad de relés de protección · Departamento de Teleoperaciones y Protecciones
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={3}
                        sx={{ alignItems: "center", mt: 3, flexWrap: "wrap", gap: 1.5 }}
                    >

                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{ alignItems: "center" }}
                        >
                            <CalendarTodayIcon
                                color="primary"
                                sx={{ fontSize: 18 }}
                            />
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ textTransform: "capitalize" }}
                            >
                                {ahora.toLocaleDateString("es-AR", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric"
                                })}
                            </Typography>
                        </Stack>

                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{ alignItems: "center" }}
                        >
                            <AccessTimeIcon
                                color="primary"
                                sx={{ fontSize: 18 }}
                            />
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {ahora.toLocaleTimeString("es-AR", {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </Typography>
                        </Stack>

                        {usuario && (

                            <Chip
                                label={`${usuario.rol} · ${usuario.nombre} ${usuario.apellido}`}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ fontWeight: 600 }}
                            />
                        )}

                    </Stack>

                </Box>

            </Paper>

            {/* BUSCADOR GLOBAL */}
            <Box sx={{ mb: 5 }}>

                <BuscadorGlobal destinos={destinosCatalogo} />

            </Box>

            {/* ACCIONES RÁPIDAS */}
            <Box sx={{ mb: 5 }}>

                <SeccionTitulo
                    icono={<AddCircleOutlineIcon />}
                    titulo="Acciones Rápidas"
                />

                <Grid container spacing={2}>

                    {accionesRapidas.map((accion) => (

                        <Grid
                            size={{ xs: 12, sm: 6, md: 4, lg: 2 }}
                            key={accion.titulo}
                        >
                            <AccionRapidaCard {...accion} />
                        </Grid>
                    ))}

                </Grid>

            </Box>

            {/* CONTINUAR TRABAJANDO */}
            {recientes.length > 0 && (

                <Box sx={{ mb: 5 }}>

                    <SeccionTitulo
                        icono={<HistoryIcon />}
                        titulo="Continuar Trabajando"
                    />

                    <Grid container spacing={2}>

                        {recientes.map((rele) => (

                            <Grid
                                size={{ xs: 12, sm: 6, md: 3 }}
                                key={rele.id}
                            >

                                <Card
                                    elevation={0}
                                    sx={{
                                        border: "1px solid",
                                        borderColor: "divider",
                                        p: 2
                                    }}
                                >

                                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>

                                        <MemoryOutlinedIcon color="primary" />

                                        <Box sx={{ minWidth: 0, flexGrow: 1 }}>

                                            <Typography
                                                variant="subtitle2"
                                                noWrap
                                                sx={{ fontWeight: 700 }}
                                            >
                                                {rele.numeroSerie}
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                noWrap
                                                color="text.secondary"
                                                sx={{ display: "block" }}
                                            >
                                                {rele.marca} · {rele.modelo}
                                            </Typography>

                                        </Box>

                                    </Stack>

                                    <Stack
                                        direction="row"
                                        sx={{ alignItems: "center", justifyContent: "space-between", mt: 1.5 }}
                                    >

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {tiempoRelativo(rele.visitadoEn)}
                                        </Typography>

                                        <Button
                                            component={Link}
                                            to={`/reles/${rele.id}`}
                                            size="small"
                                            endIcon={<ArrowForwardIcon />}
                                        >
                                            Continuar
                                        </Button>

                                    </Stack>

                                </Card>

                            </Grid>
                        ))}

                    </Grid>

                </Box>
            )}

            <Grid container spacing={4} sx={{ mb: 5 }}>

                {/* ESTACIONES TRANSFORMADORAS */}
                <Grid size={{ xs: 12, lg: 7 }}>

                    <Box id="seccion-estaciones">

                        <SeccionTitulo
                            icono={<ApartmentOutlinedIcon />}
                            titulo="Estaciones Transformadoras"
                        />

                        {cargando ? (

                            <Grid container spacing={2}>
                                {[1, 2, 3, 4].map((i) => (
                                    <Grid size={{ xs: 12, sm: 6 }} key={i}>
                                        <Skeleton
                                            variant="rounded"
                                            height={120}
                                        />
                                    </Grid>
                                ))}
                            </Grid>

                        ) : (

                            <Grid container spacing={2}>

                                {destinosCantidad.map((destino) => (

                                    <Grid
                                        size={{ xs: 12, sm: 6 }}
                                        key={destino.destino}
                                    >

                                        <Card
                                            elevation={0}
                                            sx={{
                                                border: "1px solid",
                                                borderColor: "divider",
                                                p: 2.5,
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 1.5,
                                                transition: "background-color 0.18s ease",
                                                "&:hover": { backgroundColor: "action.hover" }
                                            }}
                                        >

                                            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>

                                                <ApartmentOutlinedIcon color="primary" />

                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{ fontWeight: 700 }}
                                                >
                                                    {destino.destino}
                                                </Typography>

                                            </Stack>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {destino.cantidad} {destino.cantidad === 1 ? "relé" : "relés"}
                                            </Typography>

                                            <Button
                                                component={Link}
                                                to={`/reles?destino=${encodeURIComponent(destino.destino)}`}
                                                size="small"
                                                endIcon={<ArrowForwardIcon />}
                                                sx={{ alignSelf: "flex-start", mt: "auto" }}
                                            >
                                                Ver relés
                                            </Button>

                                        </Card>

                                    </Grid>
                                ))}

                            </Grid>
                        )}

                    </Box>

                </Grid>

                {/* NOTIFICACIONES */}
                <Grid size={{ xs: 12, lg: 5 }}>

                    <SeccionTitulo
                        icono={<DescriptionOutlinedIcon />}
                        titulo="Notificaciones"
                    />

                    {cargando ? (

                        <Skeleton
                            variant="rounded"
                            height={220}
                        />

                    ) : (

                        <Stack spacing={1.5}>

                            <NotificacionItem
                                icono={<EventBusyOutlinedIcon />}
                                titulo="Garantías próximas a vencer (30 días)"
                                valor={kpis?.garantiasProximasAVencer ?? 0}
                                color="warning"
                            />

                            <NotificacionItem
                                icono={<DescriptionOutlinedIcon />}
                                titulo="Documentación pendiente"
                                valor={
                                    (kpis?.relesSinDocumentacion ?? 0)
                                    + (kpis?.relesDocumentacionSinArchivo ?? 0)
                                }
                                color="warning"
                            />

                            <Box
                                component={Link}
                                to="/admin/remitos"
                                sx={{ textDecoration: "none" }}
                            >
                                <NotificacionItem
                                    icono={<ReceiptLongOutlinedIcon />}
                                    titulo="Remitos pendientes de asociar"
                                    valor={kpis?.remitosPendientes ?? 0}
                                    to="/admin/remitos"
                                    color="info"
                                />
                            </Box>

                            <Box
                                component={Link}
                                to="/admin/ordenes-provision"
                                sx={{ textDecoration: "none" }}
                            >
                                <NotificacionItem
                                    icono={<AssignmentOutlinedIcon />}
                                    titulo="Órdenes de provisión pendientes"
                                    valor={kpis?.ordenesPendientes ?? 0}
                                    to="/admin/ordenes-provision"
                                    color="info"
                                />
                            </Box>

                            <Box
                                component={Link}
                                to="/reles?estadoNombre=EN_ENSAYO"
                                sx={{ textDecoration: "none" }}
                            >
                                <NotificacionItem
                                    icono={<ScienceOutlinedIcon />}
                                    titulo="Relés en ensayo"
                                    valor={relesEnEnsayo}
                                    to="/reles?estadoNombre=EN_ENSAYO"
                                    color="secondary"
                                />
                            </Box>

                        </Stack>
                    )}

                </Grid>

            </Grid>

            {/* ACTIVIDAD RECIENTE */}
            <Box sx={{ mb: 5 }}>

                <SeccionTitulo
                    icono={<HistoryIcon />}
                    titulo="Actividad Reciente"
                />

                {cargando ? (

                    <Skeleton
                        variant="rounded"
                        height={260}
                    />

                ) : movimientosRecientes.length === 0 ? (

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Todavía no hay movimientos registrados.
                    </Typography>

                ) : (

                    <Stack spacing={0}>

                        {movimientosRecientes.map((movimiento, index) => {

                            const esAlta =
                                movimiento.notas === "Ingreso inicial del relé";

                            return (

                                <Stack
                                    key={movimiento.id}
                                    direction="row"
                                    spacing={2}
                                    component={Link}
                                    to={`/reles/${movimiento.releId}`}
                                    sx={{
                                        textDecoration: "none",
                                        color: "inherit",
                                        py: 1.5,
                                        borderBottom:
                                            index < movimientosRecientes.length - 1
                                                ? "1px solid"
                                                : "none",
                                        borderColor: "divider",
                                        "&:hover": { backgroundColor: "action.hover" },
                                        px: 1,
                                        borderRadius: 1
                                    }}
                                >

                                    <Box
                                        sx={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: (t) =>
                                                alpha(t.palette.primary.main, 0.12),
                                            color: "primary.main",
                                            flexShrink: 0
                                        }}
                                    >
                                        {esAlta
                                            ? <AddCircleOutlineIcon fontSize="small" />
                                            : <SwapHorizIcon fontSize="small" />}
                                    </Box>

                                    <Box sx={{ minWidth: 0, flexGrow: 1 }}>

                                        <Typography
                                            variant="body2"
                                            sx={{ fontWeight: 600 }}
                                        >
                                            {esAlta
                                                ? "Alta de relé"
                                                : `Movimiento a ${movimiento.estado}`}
                                            {" · "}
                                            {movimiento.rele}
                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {movimiento.destino} - {movimiento.posicion} · {movimiento.responsable}
                                        </Typography>

                                    </Box>

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ flexShrink: 0, whiteSpace: "nowrap" }}
                                    >
                                        {tiempoRelativo(movimiento.fechaMovimiento)}
                                    </Typography>

                                </Stack>
                            );
                        })}

                    </Stack>
                )}

            </Box>

            {/* MÓDULOS */}
            <Box sx={{ mb: 5 }}>

                <SeccionTitulo
                    icono={<SpaceDashboardOutlinedIcon />}
                    titulo="Módulos"
                />

                <Grid container spacing={2.5}>

                    {modulos.map((modulo) => (

                        <Grid
                            size={{ xs: 12, sm: 4 }}
                            key={modulo.titulo}
                        >
                            <AccionRapidaCard {...modulo} />
                        </Grid>
                    ))}

                </Grid>

            </Box>

            {/* ADMINISTRACIÓN */}
            <Box>

                <SeccionTitulo
                    icono={<AssignmentOutlinedIcon />}
                    titulo="Administración"
                />

                <Grid container spacing={1.5}>

                    {accesosAdministracion.map((acceso) => (

                        <Grid
                            size={{ xs: 12, sm: 6, md: 3 }}
                            key={acceso.titulo}
                        >

                            <Card
                                elevation={0}
                                sx={{
                                    border: "1px solid",
                                    borderColor: "divider"
                                }}
                            >

                                <CardActionArea
                                    component={Link}
                                    to={acceso.to}
                                    sx={{
                                        px: 2,
                                        py: 1.5,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                        justifyContent: "flex-start"
                                    }}
                                >

                                    <Box sx={{ color: "primary.main", display: "flex" }}>
                                        {acceso.icon}
                                    </Box>

                                    <Typography
                                        variant="body2"
                                        sx={{ fontWeight: 600 }}
                                    >
                                        {acceso.titulo}
                                    </Typography>

                                </CardActionArea>

                            </Card>

                        </Grid>
                    ))}

                </Grid>

            </Box>

        </Box>
    );
}

export default InicioPage;
