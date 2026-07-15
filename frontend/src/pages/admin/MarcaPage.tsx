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
    Button,
    Paper
} from "@mui/material";

import PageHeader
from "../../components/common/PageHeader";

import MarcaForm
from "../../components/admin/marca/MarcaForm";

import MarcaTable
from "../../components/admin/marca/MarcaTable";

import BuscadorTexto
from "../../components/common/BuscadorTexto";

import {
    obtenerMarcas,
    crearMarca,
    actualizarMarca,
    eliminarMarca
} from "../../services/marcaService";

import type { Marca }
from "../../types/Marca";

import { extraerMensajeError }
from "../../utils/errorUtils";

import { useAuth } from "../../context/AuthContext";

function MarcaPage() {

    const { canWrite } = useAuth();

    const [marcas, setMarcas] =
        useState<Marca[]>([]);

    const [texto, setTexto] =
        useState("");

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

        try {

            const data =
                await obtenerMarcas();

            setMarcas(data);

        } catch (err) {

            setError(
                extraerMensajeError(
                    err,
                    "No se pudieron cargar las marcas. Intente nuevamente."
                )
            );
        }
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

            setError(
                extraerMensajeError(
                    err,
                    "No se pudo guardar la marca. Intente nuevamente."
                )
            );
        }
    };

    const abrirDialogEliminar =
        (id: number) => {

        setMarcaEliminar(id);

        setOpenDialog(true);
    };

    const marcasFiltradas =

        marcas.filter((marca) =>

            marca.nombre
                .toLowerCase()
                .includes(
                    texto.toLowerCase()
                )
        );

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

            setError(
                extraerMensajeError(
                    err,
                    "No se pudo eliminar la marca. Intente nuevamente."
                )
            );

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

            {canWrite && (

                <MarcaForm
                    onSubmit={handleSubmit}
                    marcaEditando={marcaEditando}
                    cancelarEdicion={() =>
                        setMarcaEditando(null)
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

                <BuscadorTexto
                    label="Buscar marca"
                    value={texto}
                    onChange={setTexto}
                />

            </Paper>

            <MarcaTable
                marcas={marcasFiltradas}
                canWrite={canWrite}
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

export default MarcaPage;