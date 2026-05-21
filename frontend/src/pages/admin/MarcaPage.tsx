import {
    useEffect,
    useState
} from "react";

import {
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from "@mui/material";

import PageHeader
from "../../components/common/PageHeader";

import MarcaForm
from "../../components/admin/marca/MarcaForm";

import MarcaTable
from "../../components/admin/marca/MarcaTable";

import {
    obtenerMarcas,
    crearMarca,
    actualizarMarca,
    eliminarMarca
} from "../../services/marcaService";

import type { Marca }
from "../../types/Marca";

import axios from "axios";

function MarcaPage() {

    const [marcas, setMarcas] =
        useState<Marca[]>([]);

    const [marcaEditando,
        setMarcaEditando] =
            useState<Marca | null>(null);

    const [mensaje, setMensaje] =
        useState("");

    const [error, setError] =
        useState("");

    const [openDialog,
        setOpenDialog] =
            useState(false);

    const [marcaEliminar,
        setMarcaEliminar] =
            useState<number | null>(null);

    useEffect(() => {

        cargarMarcas();

    }, []);

    const cargarMarcas = async () => {

        const data =
            await obtenerMarcas();

        setMarcas(data);
    };

    const handleSubmit =
        async (nombre: string) => {

        try {

            if (marcaEditando) {

                await actualizarMarca(
                    marcaEditando.id,
                    { nombre }
                );

                setMensaje(
                    "Marca actualizada correctamente"
                );

                setMarcaEditando(null);

            } else {

                await crearMarca({
                    nombre
                });

                setMensaje(
                    "Marca creada correctamente"
                );
            }

            await cargarMarcas();

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

    const abrirDialogEliminar =
        (id: number) => {

        setMarcaEliminar(id);

        setOpenDialog(true);
    };

    const confirmarEliminar =
        async () => {

        if (!marcaEliminar) {
            return;
        }

        try {

            await eliminarMarca(
                marcaEliminar
            );

            setMensaje(
                "Marca eliminada correctamente"
            );

            await cargarMarcas();

        } catch (err) {

            if (
                axios.isAxiosError(err)
            ) {

                setError(
                    err.response?.data?.message
                    || "No se pudo eliminar"
                );
            }

        } finally {

            setOpenDialog(false);

            setMarcaEliminar(null);
        }
    };

    return (

        <div>

            <PageHeader
                title="Administración de Marcas"
                subtitle="Gestión de fabricantes y marcas de relés."
            />

            <MarcaForm
                onSubmit={handleSubmit}
                marcaEditando={marcaEditando}
                cancelarEdicion={() =>
                    setMarcaEditando(null)
                }
            />

            <MarcaTable
                marcas={marcas}
                onEditar={setMarcaEditando}
                onEliminar={abrirDialogEliminar}
            />

            <Dialog
                open={openDialog}
                onClose={() =>
                    setOpenDialog(false)
                }
                maxWidth="xs"
                fullWidth
            >

                <DialogTitle>
                    Confirmar eliminación
                </DialogTitle>

                <DialogContent>

                    <DialogContentText>

                        ¿Desea eliminar esta marca?

                    </DialogContentText>

                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        pb: 2
                    }}
                >

                    <Button
                        onClick={() =>
                            setOpenDialog(false)
                        }
                    >
                        Cancelar
                    </Button>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={confirmarEliminar}
                    >
                        Eliminar
                    </Button>

                </DialogActions>

            </Dialog>

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

export default MarcaPage;