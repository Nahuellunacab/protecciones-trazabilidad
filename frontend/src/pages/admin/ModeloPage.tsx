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

import ModeloForm
from "../../components/admin/modelo/ModeloForm";

import ModeloTable
from "../../components/admin/modelo/ModeloTable";

import BuscadorTexto
from "../../components/common/BuscadorTexto";

import {
    obtenerModelos,
    crearModelo,
    actualizarModelo,
    eliminarModelo
} from "../../services/modeloService";

import {
    obtenerMarcas
} from "../../services/marcaService";

import type { Modelo }
from "../../types/Modelo";

import type { Marca }
from "../../types/Marca";

import { extraerMensajeError }
from "../../utils/errorUtils";

import { useAuth } from "../../context/AuthContext";

function ModeloPage() {

    const { canWrite } = useAuth();

    const [modelos, setModelos] =
        useState<Modelo[]>([]);

    const [marcas, setMarcas] =
        useState<Marca[]>([]);

    const [texto, setTexto] =
        useState("");

    const [modeloEditando,
        setModeloEditando] =
            useState<Modelo | null>(null);

    const [mensaje, setMensaje] =
        useState("");

    const [error, setError] =
        useState("");

    const [openDialog,
        setOpenDialog] =
            useState(false);

    const [modeloEliminar,
        setModeloEliminar] =
            useState<number | null>(null);

    useEffect(() => {

        cargarDatos();

    }, []);

    const cargarDatos = async () => {

        try {

            const [
                modelosData,
                marcasData
            ] = await Promise.all([

                obtenerModelos(),

                obtenerMarcas()
            ]);

            setModelos(modelosData);

            setMarcas(marcasData);

        } catch (err) {

            setError(
                extraerMensajeError(
                    err,
                    "No se pudieron cargar los modelos. Intente nuevamente."
                )
            );
        }
    };

    const handleSubmit =
        async (data: {
            nombre: string;
            marcaId: number;
        }) => {

        try {

            if (modeloEditando) {

                await actualizarModelo(
                    modeloEditando.id,
                    data
                );

                setMensaje(
                    "Modelo actualizado correctamente"
                );

                setModeloEditando(null);

            } else {

                await crearModelo(data);

                setMensaje(
                    "Modelo creado correctamente"
                );
            }

            await cargarDatos();

        } catch (err) {

            setError(
                extraerMensajeError(
                    err,
                    "No se pudo guardar el modelo. Intente nuevamente."
                )
            );
        }
    };

    const abrirDialogEliminar =
        (id: number) => {

        setModeloEliminar(id);

        setOpenDialog(true);
    };

    const modelosFiltrados =

        modelos.filter((modelo) => {

            const textoLower =
                texto.toLowerCase();

            return (

                modelo.nombre
                    .toLowerCase()
                    .includes(textoLower)

                || modelo.marca
                    .toLowerCase()
                    .includes(textoLower)
            );
        });

    const confirmarEliminar =
        async () => {

        if (!modeloEliminar) {
            return;
        }

        try {

            await eliminarModelo(
                modeloEliminar
            );

            setMensaje(
                "Modelo eliminado correctamente"
            );

            await cargarDatos();

        } catch (err) {

            setError(
                extraerMensajeError(
                    err,
                    "No se pudo eliminar el modelo. Intente nuevamente."
                )
            );

        } finally {

            setOpenDialog(false);

            setModeloEliminar(null);
        }
    };

    return (

        <div>

            <PageHeader
                title="Administración de Modelos"
                subtitle="Gestión de modelos de relés."
            />

            {canWrite && (

                <ModeloForm
                    onSubmit={handleSubmit}
                    modeloEditando={modeloEditando}
                    marcas={marcas}
                    cancelarEdicion={() =>
                        setModeloEditando(null)
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
                    label="Buscar modelo"
                    value={texto}
                    onChange={setTexto}
                />

            </Paper>

            <ModeloTable
                modelos={modelosFiltrados}
                canWrite={canWrite}
                onEditar={setModeloEditando}
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

                        ¿Desea eliminar este modelo?

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

export default ModeloPage;