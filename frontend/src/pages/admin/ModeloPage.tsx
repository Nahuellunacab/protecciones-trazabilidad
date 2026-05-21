import {
    useEffect,
    useState
} from "react";

import axios from "axios";

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

import ModeloForm
from "../../components/admin/modelo/ModeloForm";

import ModeloTable
from "../../components/admin/modelo/ModeloTable";

import {
    obtenerModelos,
    crearModelo,
    actualizarModelo,
    eliminarModelo
} from "../../services/modeloService";

import {
    obtenerMarcas
} from "../../services/marcaService";

import {
    obtenerTipos
} from "../../services/tipoService";

import type { Modelo }
from "../../types/Modelo";

import type { Marca }
from "../../types/Marca";

import type { Tipo }
from "../../types/Tipo";

function ModeloPage() {

    const [modelos, setModelos] =
        useState<Modelo[]>([]);

    const [marcas, setMarcas] =
        useState<Marca[]>([]);

    const [tipos, setTipos] =
        useState<Tipo[]>([]);

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

        const [
            modelosData,
            marcasData,
            tiposData
        ] = await Promise.all([

            obtenerModelos(),

            obtenerMarcas(),

            obtenerTipos()
        ]);

        setModelos(modelosData);

        setMarcas(marcasData);

        setTipos(tiposData);
    };

    const handleSubmit =
        async (data: {
            nombre: string;
            tensionDesde: number;
            tensionHasta: number;
            tipoTension: string;
            marcaId: number;
            tipoId: number;
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

        setModeloEliminar(id);

        setOpenDialog(true);
    };

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

            setModeloEliminar(null);
        }
    };

    return (

        <div>

            <PageHeader
                title="Administración de Modelos"
                subtitle="Gestión de modelos de relés, tensiones y tipos."
            />

            <ModeloForm
                onSubmit={handleSubmit}
                modeloEditando={modeloEditando}
                marcas={marcas}
                tipos={tipos}
                cancelarEdicion={() =>
                    setModeloEditando(null)
                }
            />

            <ModeloTable
                modelos={modelos}
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

export default ModeloPage;