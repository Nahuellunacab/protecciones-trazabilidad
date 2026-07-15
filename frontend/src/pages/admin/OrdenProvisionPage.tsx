import {

    useEffect,
    useState

} from "react";

import {

    Alert,
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    Typography,
    Chip,
    Grid,
    IconButton

} from "@mui/material";

import EditIcon
from "@mui/icons-material/Edit";

import DeleteIcon
from "@mui/icons-material/Delete";

import type {
    OrdenProvision
} from "../../types/OrdenProvision";

import PictureAsPdfIcon
from "@mui/icons-material/PictureAsPdf";

import {

    crearOrdenProvision,
    actualizarOrdenProvision,
    eliminarOrdenProvision,
    subirArchivoOP,
    obtenerOrdenesProvisionPaginadas

} from "../../services/ordenProvisionService";

import { extraerMensajeError }
from "../../utils/errorUtils";

import { useAuth } from "../../context/AuthContext";

import SelectorArchivoAdjunto
from "../../components/common/SelectorArchivoAdjunto";

import BuscadorTexto
from "../../components/common/BuscadorTexto";

import useDebouncedValue
from "../../hooks/useDebouncedValue";

function OrdenProvisionPage() {

    const { canWrite } = useAuth();

    const [ordenes, setOrdenes] =
        useState<OrdenProvision[]>([]);

    const [totalOrdenes, setTotalOrdenes] =
        useState(0);

    const [page, setPage] =
        useState(0);

    const [rowsPerPage, setRowsPerPage] =
        useState(10);

    const [texto, setTexto] =
        useState("");

    const textoDebounced =
        useDebouncedValue(texto);

    const [asociadoFiltro, setAsociadoFiltro] =
        useState<"" | "true" | "false">("");

    const [numero, setNumero] =
        useState("");

    const [observaciones, setObservaciones] =
        useState("");

    const [editandoId, setEditandoId] =
        useState<number | null>(null);

    const [archivo, setArchivo] =
        useState<File | null>(null);

    const [archivoActual, setArchivoActual] =
        useState("");

    const [mensaje, setMensaje] =
        useState("");

    const [tipoMensaje, setTipoMensaje] =
        useState<"success" | "error">(
            "success"
        );

    const [openSnackbar, setOpenSnackbar] =
        useState(false);

    const [guardando, setGuardando] =
        useState(false);

    function mostrarMensaje(
        texto: string,
        tipo: "success" | "error"
    ) {

        setMensaje(texto);

        setTipoMensaje(tipo);

        setOpenSnackbar(true);
    }

    async function cargarDatos() {

        try {

            const data =
                await obtenerOrdenesProvisionPaginadas(
                    page,
                    rowsPerPage,
                    textoDebounced,
                    "id,desc",
                    {
                        asociado:
                            asociadoFiltro === ""
                                ? undefined
                                : asociadoFiltro === "true"
                    }
                );

            setOrdenes(
                data.content
            );

            setTotalOrdenes(
                data.totalElements
            );

        } catch (err) {

            mostrarMensaje(
                extraerMensajeError(
                    err,
                    "No se pudieron cargar las órdenes de provisión. Intente nuevamente."
                ),
                "error"
            );
        }
    }

    useEffect(() => {

        setPage(0);

    }, [texto]);

    useEffect(() => {

        cargarDatos();

    }, [
        page,
        rowsPerPage,
        textoDebounced,
        asociadoFiltro
    ]);

    const handleSubmit =
    async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (!numero.trim()) {

            mostrarMensaje(
                "Ingrese el número de orden antes de guardar",
                "error"
            );

            return;
        }

        setGuardando(true);

        try {

            const data = {

                numero,

                observaciones
            };

            if (editandoId !== null) {

                await actualizarOrdenProvision(

                    editandoId,

                    data
                );

                if (archivo) {

                    await subirArchivoOP(
                        editandoId,
                        archivo
                    );
                }

                mostrarMensaje(
                    "Orden actualizada correctamente",
                    "success"
                );

            } else {

                const nuevaOrden =

                    await crearOrdenProvision(
                        data
                    );

                if (archivo) {

                    await subirArchivoOP(

                        nuevaOrden.id,

                        archivo
                    );
                }

                mostrarMensaje(
                    "Orden creada correctamente",
                    "success"
                );
            }

            limpiarFormulario();

            await cargarDatos();

        } catch (error) {

            mostrarMensaje(
                extraerMensajeError(
                    error,
                    "No se pudo guardar la orden de provisión. Intente nuevamente."
                ),
                "error"
            );

        } finally {

            setGuardando(false);
        }
    };

    async function handleEliminar(
        id: number
    ) {

        const confirmar =
            window.confirm(
                `¿Eliminar orden ${id}?`
            );

        if (!confirmar) return;

        try {

            await eliminarOrdenProvision(
                id
            );

            await cargarDatos();

            mostrarMensaje(
                "Orden eliminada correctamente",
                "success"
            );

        } catch (error) {

            mostrarMensaje(
                extraerMensajeError(
                    error,
                    "No se pudo eliminar la orden. Puede que esté asignada a un relé."
                ),
                "error"
            );
        }
    }

    function handleEditar(
        orden: OrdenProvision
    ) {

        setEditandoId(
            orden.id
        );

        setNumero(
            orden.numero
        );

        setObservaciones(
            orden.observaciones
        );

        setArchivo(null);

        setArchivoActual(
            orden.nombreArchivo || ""
        );
    }

    function limpiarFormulario() {

        setNumero("");

        setObservaciones("");

        setArchivo(null);

        setArchivoActual("");

        setEditandoId(null);
    }

    return (

        <Box>

            <Typography
                variant="h3"
                sx={{
                    fontWeight: 700,
                    mb: 2
                }}
            >
                Órdenes de Provisión
            </Typography>

            <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                    mb: 5
                }}
            >
                Gestión de órdenes de provisión
                asociadas a ingresos de relés.
            </Typography>

            {canWrite && (

            <Paper
                sx={{
                    p: 3,
                    mb: 4
                }}
            >

                <Typography
                    variant="h6"
                    sx={{ mb: 3 }}
                >
                    {
                        editandoId !== null
                            ? "Editar Orden de Provisión"
                            : "Nueva Orden de Provisión"
                    }
                </Typography>

                <form onSubmit={handleSubmit}>

                    <Grid container spacing={2}>

                        <Grid size={{ xs: 12, md: 4 }}>

                            <TextField
                                fullWidth
                                label="Número"
                                value={numero}
                                onChange={(e) =>
                                    setNumero(
                                        e.target.value
                                    )
                                }
                                error={!numero.trim()}
                                helperText={
                                    !numero.trim()
                                        ? "Ingrese un número"
                                        : ""
                                }
                            />

                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>

                            <TextField
                                fullWidth
                                label="Observaciones"
                                value={observaciones}
                                onChange={(e) =>
                                    setObservaciones(
                                        e.target.value
                                    )
                                }
                            />

                        </Grid>

                        <Grid size={{ xs: 12, md: 2 }}>

                            <SelectorArchivoAdjunto
                                label={
                                    editandoId !== null
                                        ? "SUBIR/REEMPLAZAR PDF"
                                        : "SUBIR PDF"
                                }
                                labelSeleccionado="PDF/FOTO CARGADO"
                                value={archivo}
                                onChange={setArchivo}
                                height={56}
                            />

                            {
                                archivo ? (

                                    <Typography
                                        variant="caption"
                                        sx={{ display: "block", mt: 1 }}
                                    >
                                        Archivo seleccionado: {archivo.name}
                                    </Typography>

                                ) : editandoId !== null && archivoActual ? (

                                    <Typography
                                        variant="caption"
                                        sx={{ display: "block", mt: 1 }}
                                    >
                                        Archivo actual: {archivoActual}
                                    </Typography>

                                ) : null
                            }

                        </Grid>

                        <Grid size={{ xs: 12, md: 2 }}>

                            <Button
                                fullWidth
                                type="submit"
                                disabled={guardando}
                                variant="contained"
                                sx={{ height: 56 }}
                            >

                                {
                                    guardando
                                        ? "GUARDANDO..."
                                        : editandoId
                                            ? "GUARDAR"
                                            : "CREAR"
                                }

                            </Button>

                        </Grid>

                        {
                            editandoId !== null && (

                                <Grid size={{ xs: 12, md: 2 }}>

                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="secondary"
                                        sx={{ height: 56 }}
                                        onClick={() => {
                                            limpiarFormulario();
                                        }}
                                    >
                                        Cancelar
                                    </Button>

                                </Grid>
                            )
                        }

                    </Grid>

                </form>

            </Paper>

            )}

            <Paper
                sx={{
                    p: 3,
                    mb: 3
                }}
            >

                <Grid
                    container
                    spacing={2}
                >

                    <Grid size={{ xs: 12, md: 8 }}>

                        <BuscadorTexto
                            label="Buscar Orden de Provisión"
                            placeholder="Número u observaciones"
                            value={texto}
                            onChange={setTexto}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>

                        <FormControl fullWidth>

                            <InputLabel id="filtro-asociado-op-label">
                                Estado
                            </InputLabel>

                            <Select
                                labelId="filtro-asociado-op-label"
                                label="Estado"
                                value={asociadoFiltro}
                                onChange={(e) => {

                                    setAsociadoFiltro(
                                        e.target.value as
                                            "" | "true" | "false"
                                    );

                                    setPage(0);
                                }}
                            >

                                <MenuItem value="">
                                    Todas
                                </MenuItem>

                                <MenuItem value="true">
                                    Asociadas
                                </MenuItem>

                                <MenuItem value="false">
                                    Pendientes
                                </MenuItem>

                            </Select>

                        </FormControl>

                    </Grid>

                </Grid>

            </Paper>

            <TableContainer
                component={Paper}
            >

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>
                                Número
                            </TableCell>

                            <TableCell>
                                Observaciones
                            </TableCell>

                            <TableCell>
                                Documento
                            </TableCell>

                            <TableCell>
                                Estado
                            </TableCell>

                            <TableCell align="right">
                                Acciones
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {ordenes.map(
                            (orden) => (

                                <TableRow
                                    key={orden.id}
                                    hover
                                >

                                    <TableCell>
                                        {orden.numero}
                                    </TableCell>

                                    <TableCell>
                                        {
                                            orden.observaciones
                                            || "-"
                                        }
                                    </TableCell>

                                    <TableCell>

                                        {
                                            orden.nombreArchivo ? (

                                                <IconButton
                                                    color="error"
                                                    onClick={() =>
                                                        window.open(
                                                            `/api/ordenes-provision/${orden.id}/archivo`,
                                                            "_blank"
                                                        )
                                                    }
                                                >

                                                    <PictureAsPdfIcon />

                                                </IconButton>

                                            ) : (

                                                <Chip
                                                    label="Sin PDF"
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            )
                                        }

                                    </TableCell>

                                    <TableCell>

                                        {
                                            orden.cantidadReles > 0 ? (

                                                <Chip
                                                    label="ASOCIADA"
                                                    color="success"
                                                    size="small"
                                                />

                                            ) : (

                                                <Chip
                                                    label="PENDIENTE"
                                                    color="warning"
                                                    size="small"
                                                />
                                            )
                                        }

                                    </TableCell>

                                    <TableCell align="right">

                                        {canWrite && (
                                            <>

                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>
                                                        handleEditar(
                                                            orden
                                                        )
                                                    }
                                                >

                                                    <EditIcon />

                                                </IconButton>

                                                <IconButton
                                                    color="error"
                                                    onClick={() =>
                                                        handleEliminar(
                                                            orden.id
                                                        )
                                                    }
                                                >

                                                    <DeleteIcon />

                                                </IconButton>

                                            </>
                                        )}

                                    </TableCell>

                                </TableRow>
                            )
                        )}

                    </TableBody>

                </Table>

                <TablePagination
                    component="div"
                    count={totalOrdenes}
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

            </TableContainer>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() =>
                    setOpenSnackbar(false)
                }
            >

                <Alert
                    severity={tipoMensaje}
                    onClose={() =>
                        setOpenSnackbar(false)
                    }
                    sx={{ width: "100%" }}
                >

                    {mensaje}

                </Alert>

            </Snackbar>

        </Box>
    );
}

export default OrdenProvisionPage;
