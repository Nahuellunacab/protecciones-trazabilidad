import {
    useEffect,
    useState
} from "react";

import {
    Snackbar,
    Alert,
    Paper,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TablePagination
} from "@mui/material";

import PageHeader
from "../../components/common/PageHeader";

import UsuarioForm
from "../../components/admin/usuario/UsuarioForm";

import UsuarioTable
from "../../components/admin/usuario/UsuarioTable";

import ResetPasswordDialog
from "../../components/admin/usuario/ResetPasswordDialog";

import {
    crearUsuario,
    actualizarUsuario,
    obtenerUsuariosPaginados
} from "../../services/usuarioService";

import type { Usuario }
from "../../types/Usuario";

import type { UsuarioRequest }
from "../../types/UsuarioRequest";

import { extraerMensajeError }
from "../../utils/errorUtils";

import { useAuth } from "../../context/AuthContext";

import BuscadorTexto
from "../../components/common/BuscadorTexto";

import useDebouncedValue
from "../../hooks/useDebouncedValue";

function UsuarioPage() {

    const { isAdmin } = useAuth();

    const [usuarios, setUsuarios] =
        useState<Usuario[]>([]);

    const [totalUsuarios, setTotalUsuarios] =
        useState(0);

    const [page, setPage] =
        useState(0);

    const [rowsPerPage, setRowsPerPage] =
        useState(10);

    const [texto, setTexto] =
        useState("");

    const textoDebounced =
        useDebouncedValue(texto);

    const [filtroEstado, setFiltroEstado] =
        useState<"ACTIVOS" | "INACTIVOS" | "TODOS">(
            "ACTIVOS"
        );

    const [rol, setRol] =
        useState("");

    const [usuarioEditando,
        setUsuarioEditando] =
            useState<Usuario | null>(null);

    const [usuarioReseteando,
        setUsuarioReseteando] =
            useState<Usuario | null>(null);

    const [mensaje, setMensaje] =
        useState("");

    const [error, setError] =
        useState("");

    const cargarUsuarios = async () => {

        try {

            const data =
                await obtenerUsuariosPaginados(
                    page,
                    rowsPerPage,
                    textoDebounced,
                    filtroEstado,
                    "id,asc",
                    {
                        rol: rol === "" ? undefined : rol
                    }
                );

            setUsuarios(data.content);

            setTotalUsuarios(data.totalElements);

        } catch (err) {

            setError(
                extraerMensajeError(
                    err,
                    "No se pudieron cargar los usuarios. Intente nuevamente."
                )
            );
        }
    };

    useEffect(() => {

        setPage(0);

    }, [texto]);

    useEffect(() => {

        cargarUsuarios();

    }, [
        page,
        rowsPerPage,
        textoDebounced,
        filtroEstado,
        rol
    ]);

    const handleSubmit =
        async (data: UsuarioRequest) => {

        try {

            if (usuarioEditando) {

                await actualizarUsuario(
                    usuarioEditando.id,
                    data
                );

                setMensaje(
                    "Usuario actualizado correctamente"
                );

                setUsuarioEditando(null);

            } else {

                await crearUsuario(data);

                setMensaje(
                    "Usuario creado correctamente"
                );
            }

            await cargarUsuarios();

        } catch (err) {

            setError(
                extraerMensajeError(
                    err,
                    "No se pudo guardar el usuario. Intente nuevamente."
                )
            );
        }
    };

    const handleResetPassword =
        async (passwordNueva: string) => {

        if (!usuarioReseteando) {
            return;
        }

        try {

            await actualizarUsuario(
                usuarioReseteando.id,
                {
                    nombre: usuarioReseteando.nombre,
                    apellido: usuarioReseteando.apellido,
                    email: usuarioReseteando.email,
                    numeroSobre: usuarioReseteando.numeroSobre,
                    rol: usuarioReseteando.rol,
                    activo: usuarioReseteando.activo,
                    password: passwordNueva
                }
            );

            setMensaje(
                "Contraseña reseteada correctamente"
            );

            setUsuarioReseteando(null);

            await cargarUsuarios();

        } catch (err) {

            setError(
                extraerMensajeError(
                    err,
                    "No se pudo resetear la contraseña. Intente nuevamente."
                )
            );
        }
    };

    return (

        <div>

            <PageHeader
                title="Gestión de Usuarios"
                subtitle="Administración de cuentas y roles de acceso al sistema."
            />

            {isAdmin && (

                <UsuarioForm
                    onSubmit={handleSubmit}
                    usuarioEditando={usuarioEditando}
                    cancelarEdicion={() =>
                        setUsuarioEditando(null)
                    }
                />
            )}

            <Paper
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3
                }}
            >

                <Grid
                    container
                    spacing={2}
                >

                    <Grid size={{ xs: 12, md: 5 }}>

                        <BuscadorTexto
                            label="Buscar usuario"
                            placeholder="Nombre, apellido, email o nº de sobre"
                            value={texto}
                            onChange={setTexto}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>

                        <FormControl fullWidth>

                            <InputLabel id="filtro-rol-label">
                                Rol
                            </InputLabel>

                            <Select
                                labelId="filtro-rol-label"
                                label="Rol"
                                value={rol}
                                onChange={(e) => {

                                    setRol(
                                        e.target.value
                                    );

                                    setPage(0);
                                }}
                            >

                                <MenuItem value="">
                                    Todos
                                </MenuItem>

                                <MenuItem value="ADMIN">
                                    ADMIN
                                </MenuItem>

                                <MenuItem value="OPERADOR">
                                    OPERADOR
                                </MenuItem>

                                <MenuItem value="AUDITOR">
                                    AUDITOR
                                </MenuItem>

                            </Select>

                        </FormControl>

                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>

                        <FormControl fullWidth>

                            <InputLabel id="filtro-estado-usuario-label">
                                Estado
                            </InputLabel>

                            <Select
                                labelId="filtro-estado-usuario-label"
                                label="Estado"
                                value={filtroEstado}
                                onChange={(e) => {

                                    setFiltroEstado(
                                        e.target.value as
                                            "ACTIVOS" | "INACTIVOS" | "TODOS"
                                    );

                                    setPage(0);
                                }}
                            >

                                <MenuItem value="ACTIVOS">
                                    Activos
                                </MenuItem>

                                <MenuItem value="INACTIVOS">
                                    Inactivos
                                </MenuItem>

                                <MenuItem value="TODOS">
                                    Todos
                                </MenuItem>

                            </Select>

                        </FormControl>

                    </Grid>

                </Grid>

            </Paper>

            <UsuarioTable
                usuarios={usuarios}
                isAdmin={isAdmin}
                onEditar={setUsuarioEditando}
                onResetPassword={setUsuarioReseteando}
            />

            <TablePagination
                component="div"
                count={totalUsuarios}
                page={page}
                onPageChange={(_, nuevaPagina) =>
                    setPage(nuevaPagina)
                }
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {

                    setRowsPerPage(
                        Number(e.target.value)
                    );

                    setPage(0);
                }}
                rowsPerPageOptions={[10, 25, 50]}
            />

            <ResetPasswordDialog
                usuario={usuarioReseteando}
                open={!!usuarioReseteando}
                onClose={() =>
                    setUsuarioReseteando(null)
                }
                onConfirm={handleResetPassword}
            />

            <Snackbar
                open={!!mensaje}
                autoHideDuration={4000}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center"
                }}
                onClose={() =>
                    setMensaje("")
                }
            >

                <Alert
                    severity="success"
                    variant="filled"
                    sx={{
                        width: "100%",
                        minWidth: { xs: "auto", sm: 420 },
                        maxWidth: "calc(100vw - 32px)",
                        fontSize: 16,
                        alignItems: "center",
                        boxShadow: 3
                    }}
                >

                    {mensaje}

                </Alert>

            </Snackbar>

            <Snackbar
                open={!!error}
                autoHideDuration={5000}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center"
                }}
                onClose={() =>
                    setError("")
                }
            >

                <Alert
                    severity="error"
                    variant="filled"
                    sx={{
                        width: "100%",
                        minWidth: { xs: "auto", sm: 450 },
                        maxWidth: "calc(100vw - 32px)",
                        fontSize: 16,
                        alignItems: "center",
                        boxShadow: 3
                    }}
                >

                    {error}

                </Alert>

            </Snackbar>

        </div>
    );
}

export default UsuarioPage;
