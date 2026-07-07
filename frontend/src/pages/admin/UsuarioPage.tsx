import {
    useEffect,
    useState
} from "react";

import {
    Snackbar,
    Alert
} from "@mui/material";

import PageHeader
from "../../components/common/PageHeader";

import UsuarioForm
from "../../components/admin/usuario/UsuarioForm";

import UsuarioTable
from "../../components/admin/usuario/UsuarioTable";

import {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario
} from "../../services/usuarioService";

import type { Usuario }
from "../../types/Usuario";

import type { UsuarioRequest }
from "../../types/UsuarioRequest";

import axios from "axios";

import { useAuth } from "../../context/AuthContext";

function UsuarioPage() {

    const { isAdmin } = useAuth();

    const [usuarios, setUsuarios] =
        useState<Usuario[]>([]);

    const [usuarioEditando,
        setUsuarioEditando] =
            useState<Usuario | null>(null);

    const [mensaje, setMensaje] =
        useState("");

    const [error, setError] =
        useState("");

    useEffect(() => {

        cargarUsuarios();

    }, []);

    const cargarUsuarios = async () => {

        const data =
            await obtenerUsuarios();

        setUsuarios(data);
    };

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

            if (
                axios.isAxiosError(err)
            ) {

                setError(
                    err.response?.data?.message
                    || "Error inesperado"
                );
            }
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

            <UsuarioTable
                usuarios={usuarios}
                isAdmin={isAdmin}
                onEditar={setUsuarioEditando}
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
                        minWidth: 420,
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
                        minWidth: 450,
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
