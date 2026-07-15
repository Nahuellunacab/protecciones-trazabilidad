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
    IconButton,

} from "@mui/material";

import type {
    Remito
} from "../../types/Remito";

import type {
    RemitoRequest
} from "../../types/RemitoRequest";

import type {
    Proveedor
} from "../../types/Proveedor";

import {

    crearRemito,
    actualizarRemito,
    eliminarRemito,
    subirArchivoRemito,
    abrirArchivoRemito,
    obtenerRemitosPaginados

} from "../../services/remitoService";

import {
    obtenerProveedores
} from "../../services/proveedorService";

import PictureAsPdfIcon
from "@mui/icons-material/PictureAsPdf";

import EditIcon
from "@mui/icons-material/Edit";

import DeleteIcon
from "@mui/icons-material/Delete";

import { useAuth } from "../../context/AuthContext";

import SelectorArchivoAdjunto
from "../../components/common/SelectorArchivoAdjunto";

import BuscadorTexto
from "../../components/common/BuscadorTexto";

import useDebouncedValue
from "../../hooks/useDebouncedValue";

function RemitoPage() {

    const { canWrite } = useAuth();

    const [remitos, setRemitos] =
        useState<Remito[]>([]);

    const [totalRemitos, setTotalRemitos] =
        useState(0);

    const [page, setPage] =
        useState(0);

    const [rowsPerPage, setRowsPerPage] =
        useState(10);

    const [texto, setTexto] =
        useState("");

    const textoDebounced =
        useDebouncedValue(texto);

    const [proveedorIdFiltro, setProveedorIdFiltro] =
        useState<number | "">("");

    const [asociadoFiltro, setAsociadoFiltro] =
        useState<"" | "true" | "false">("");

    const [proveedores, setProveedores] =
        useState<Proveedor[]>([]);

    const [numeroRemito, setNumeroRemito] =
        useState("");

    const [fecha, setFecha] =
        useState("");

    const [proveedorId, setProveedorId] =
        useState("");

    const [editandoId, setEditandoId] =
        useState<number | null>(null);

    const [archivo, setArchivo] =
        useState<File | null>(null);

    const [guardando, setGuardando] =
        useState(false);

    const [mensaje, setMensaje] =
        useState("");

    const [tipoMensaje, setTipoMensaje] =
        useState<"success" | "error">(
            "success"
        );

    const [openSnackbar, setOpenSnackbar] =
        useState(false);

    function mostrarMensaje(
        texto: string,
        tipo: "success" | "error"
    ) {

        setMensaje(texto);

        setTipoMensaje(tipo);

        setOpenSnackbar(true);
    }

    async function cargarRemitos() {

        try {

            const data =
                await obtenerRemitosPaginados(
                    page,
                    rowsPerPage,
                    textoDebounced,
                    "fecha,desc",
                    {
                        proveedorId:
                            proveedorIdFiltro === ""
                                ? undefined
                                : proveedorIdFiltro,

                        asociado:
                            asociadoFiltro === ""
                                ? undefined
                                : asociadoFiltro === "true"
                    }
                );

            setRemitos(
                data.content
            );

            setTotalRemitos(
                data.totalElements
            );

        } catch {

            mostrarMensaje(
                "Error al cargar remitos",
                "error"
            );
        }
    }

    async function cargarProveedores() {

        const proveedoresData =
            await obtenerProveedores();

        setProveedores(
            proveedoresData
        );
    }

    async function cargarDatos() {

        await Promise.all([

            cargarRemitos(),

            cargarProveedores()
        ]);
    }

    useEffect(() => {

        cargarProveedores();

    }, []);

    useEffect(() => {

        setPage(0);

    }, [texto]);

    useEffect(() => {

        cargarRemitos();

    }, [
        page,
        rowsPerPage,
        textoDebounced,
        proveedorIdFiltro,
        asociadoFiltro
    ]);

    async function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault();

        if (!proveedorId) {

            mostrarMensaje(
                "Seleccione un proveedor antes de guardar",
                "error"
            );

            return;
        }

        setGuardando(true);

        try {

            const data:
            RemitoRequest = {

                numeroRemito,

                fecha,

                proveedorId:
                    Number(proveedorId)
            };

            if (editandoId !== null) {

                await actualizarRemito(

                    editandoId,
                    data
                );

                if (archivo) {

                    await subirArchivoRemito(
                        editandoId,
                        archivo
                    );
                }

                mostrarMensaje(
                    "Remito actualizado correctamente",
                    "success"
                );

            } else {

                const nuevoRemito =
                    await crearRemito(data);

                if (archivo) {

                    await subirArchivoRemito(
                        nuevoRemito.id,
                        archivo
                    );
                }

                mostrarMensaje(
                    "Remito creado correctamente",
                    "success"
                );
            }

            limpiarFormulario();

            await cargarDatos();

        } catch (error: any) {

            mostrarMensaje(

                error.response?.data?.message ||

                "Error al guardar remito",

                "error"
            );

        } finally {

            setGuardando(false);
        }
    }

    async function handleEliminar(
        id: number
    ) {

        try {

            await eliminarRemito(id);

            await cargarDatos();

        } catch (error: any) {

            mostrarMensaje(

                error.response?.data?.message ||

                "Ocurrió un error",

                "error"
            );
        }
    }

    function handleEditar(
        remito: Remito
    ) {

        setEditandoId(
            remito.id
        );

        setNumeroRemito(
            remito.numeroRemito
        );

        setFecha(
            remito.fecha
        );

        setProveedorId(
            remito.proveedorId.toString()
        );
    }

    function limpiarFormulario() {

        setNumeroRemito("");

        setFecha("");

        setProveedorId("");

        setArchivo(null);

        setEditandoId(null);
    }

    return (

        <Box>

            <Typography
                variant="h3"
                sx={{ fontWeight: 700, mb: 2 }}
            >
                Remitos
            </Typography>

            <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 5 }}
            >
                Gestión de remitos de
                ingreso utilizados para
                trazabilidad logística
                y recepción de equipos.
            </Typography>

            {canWrite && (

            <Paper
                sx={{
                    p: 3,
                    mb: 4
                }}
            >

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >

                    <Grid
                        container
                        spacing={2}
                    >

                        <Grid size={{ xs: 12, md: 3 }}>

                            <TextField
                                fullWidth
                                label="Número Remito"
                                value={numeroRemito}
                                onChange={(e) =>
                                    setNumeroRemito(
                                        e.target.value
                                    )
                                }
                            />

                        </Grid>

                        <Grid size={{ xs: 12, md: 2 }}>

                            <TextField
                                type="date"
                                fullWidth
                                label="Fecha"
                                slotProps={{
                                    inputLabel: { shrink: true }
                                }}
                                value={fecha}
                                onChange={(e) =>
                                    setFecha(
                                        e.target.value
                                    )
                                }
                            />

                        </Grid>

                        <Grid size={{ xs: 12, md: 3 }}>

                            <TextField
                                select
                                fullWidth
                                label="Proveedor"
                                value={proveedorId}
                                onChange={(e) =>
                                    setProveedorId(
                                        e.target.value
                                    )
                                }
                                error={!proveedorId}
                                helperText={
                                    !proveedorId
                                        ? "Seleccione un proveedor"
                                        : ""
                                }
                            >

                                {proveedores.map(
                                    (proveedor) => (

                                        <MenuItem
                                            key={
                                                proveedor.id
                                            }
                                            value={
                                                proveedor.id
                                            }
                                        >

                                            {proveedor.nombre}

                                        </MenuItem>
                                    )
                                )}

                            </TextField>

                        </Grid>

                        <Grid size={{ xs: 12, md: 2 }}>

                            <SelectorArchivoAdjunto
                                label="SUBIR PDF"
                                labelSeleccionado="PDF/FOTO OK"
                                value={archivo}
                                onChange={setArchivo}
                                height={56}
                            />

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

                    </Grid>

                    {
                        archivo && (

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 2 }}
                            >

                                Archivo: {archivo.name}

                            </Typography>
                        )
                    }

                </Box>

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

                    <Grid size={{ xs: 12, md: 5 }}>

                        <BuscadorTexto
                            label="Buscar remito"
                            placeholder="Número o proveedor"
                            value={texto}
                            onChange={setTexto}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>

                        <FormControl fullWidth>

                            <InputLabel id="filtro-proveedor-label">
                                Proveedor
                            </InputLabel>

                            <Select
                                labelId="filtro-proveedor-label"
                                label="Proveedor"
                                value={proveedorIdFiltro}
                                onChange={(e) => {

                                    setProveedorIdFiltro(
                                        e.target.value as number | ""
                                    );

                                    setPage(0);
                                }}
                            >

                                <MenuItem value="">
                                    Todos
                                </MenuItem>

                                {proveedores.map(
                                    (proveedor) => (

                                        <MenuItem
                                            key={proveedor.id}
                                            value={proveedor.id}
                                        >

                                            {proveedor.nombre}

                                        </MenuItem>
                                    )
                                )}

                            </Select>

                        </FormControl>

                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>

                        <FormControl fullWidth>

                            <InputLabel id="filtro-asociado-label">
                                Estado
                            </InputLabel>

                            <Select
                                labelId="filtro-asociado-label"
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
                                    Todos
                                </MenuItem>

                                <MenuItem value="true">
                                    Asociados
                                </MenuItem>

                                <MenuItem value="false">
                                    Libres
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
                                Fecha
                            </TableCell>

                            <TableCell>
                                Proveedor
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

                        {remitos.map(
                            (remito) => (

                                <TableRow
                                    key={remito.id}
                                    hover
                                >

                                    <TableCell>
                                        {remito.numeroRemito}
                                    </TableCell>

                                    <TableCell>
                                        {remito.fecha}
                                    </TableCell>

                                    <TableCell>
                                        {remito.proveedor}
                                    </TableCell>

                                    <TableCell>

                                        {
                                            remito.tieneArchivo ? (

                                                <IconButton
                                                    color="error"
                                                    onClick={() =>
                                                        abrirArchivoRemito(
                                                            remito.id
                                                        ).catch(() =>
                                                            mostrarMensaje(
                                                                "No se pudo abrir el PDF del remito",
                                                                "error"
                                                            )
                                                        )
                                                    }
                                                >

                                                    <PictureAsPdfIcon />

                                                </IconButton>

                                            ) : (

                                                <Chip
                                                    label="Sin PDF"
                                                    size="small"
                                                />
                                            )
                                        }

                                    </TableCell>

                                    <TableCell>

                                        {
                                            remito.cantidadReles > 0 ? (

                                                <Chip
                                                    label="ASOCIADO"
                                                    color="success"
                                                    size="small"
                                                />

                                            ) : (

                                                <Chip
                                                    label="LIBRE"
                                                    size="small"
                                                    variant="outlined"
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
                                                            remito
                                                        )
                                                    }
                                                >

                                                    <EditIcon />

                                                </IconButton>

                                                <IconButton
                                                    color="error"
                                                    onClick={() =>
                                                        handleEliminar(
                                                            remito.id
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
                    count={totalRemitos}
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
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >

                <Alert
                    severity={tipoMensaje}
                    onClose={() =>
                        setOpenSnackbar(false)
                    }
                >

                    {mensaje}

                </Alert>

            </Snackbar>

        </Box>
    );
}

export default RemitoPage;
