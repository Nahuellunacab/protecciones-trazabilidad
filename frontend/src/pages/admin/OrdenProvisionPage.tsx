import {

    useEffect,
    useState

} from "react";

import {

    Alert,
    Box,
    Button,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Chip,
    Grid,
    IconButton,
    InputAdornment

} from "@mui/material";

import EditIcon
from "@mui/icons-material/Edit";

import DeleteIcon
from "@mui/icons-material/Delete";

import SearchIcon
from "@mui/icons-material/Search";

import type {
    OrdenProvision
} from "../../types/OrdenProvision";

import PictureAsPdfIcon
from "@mui/icons-material/PictureAsPdf";

import {

    obtenerOrdenesProvision,
    crearOrdenProvision,
    actualizarOrdenProvision,
    eliminarOrdenProvision,
    subirArchivoOP

} from "../../services/ordenProvisionService";


function OrdenProvisionPage() {

    const [ordenes, setOrdenes] =
        useState<OrdenProvision[]>([]);

    const [numero, setNumero] =
        useState("");

    const [observaciones, setObservaciones] =
        useState("");

    const [editandoId, setEditandoId] =
        useState<number | null>(null);

    const [, setErrorMessage] =
        useState("");

    const [busqueda, setBusqueda] =
        useState("");

    const [archivo, setArchivo] =
        useState<File | null>(null);

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


    async function cargarDatos() {

        try {

            const data =
                await obtenerOrdenesProvision();

            setOrdenes(data);

        } catch {

            setErrorMessage(
                "Error al cargar órdenes"
            );
        }
    }


    useEffect(() => {

        cargarDatos();

    }, []);


    const handleSubmit =
    async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        setGuardando(true);

        try {

            const data = {

                numero,

                observaciones
            };


            if (editandoId) {

                await actualizarOrdenProvision(

                    editandoId,

                    data
                );

                setMensaje(
                    "Orden actualizada correctamente"
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

                setMensaje(
                    "Orden creada correctamente"
                );
            }


            setTipoMensaje(
                "success"
            );

            setOpenSnackbar(true);


            limpiarFormulario();


            await cargarDatos();


        } catch (error: any) {

            console.error(error);


            if (

                error.response?.status === 409 ||

                error.response?.status === 400

            ) {

                setMensaje(
                    "Ese número de orden ya existe"
                );

            } else {

                setMensaje(
                    "Error al guardar orden"
                );
            }


            setTipoMensaje(
                "error"
            );

            setOpenSnackbar(true);

        } finally {

            setGuardando(false);
        }
    };


    async function handleEliminar(
        id: number
    ) {

        try {

            const confirmar =
                window.confirm(
                    `¿Eliminar orden ${id}?`
                );

            if (!confirmar) return;

            await eliminarOrdenProvision(
                id
            );

            await cargarDatos();

            setMensaje(
                "Orden eliminada correctamente"
            );

            setTipoMensaje(
                "success"
            );

            setOpenSnackbar(true);

        } catch (error: any) {

            setMensaje(
                "Error al eliminar orden ya que se encuentra asignada a un Relé"
            );

            setTipoMensaje(
                "error"
            );

            setOpenSnackbar(true);

            setErrorMessage(

                error.response?.data?.message ||

                "Ocurrió un error"
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
    }


    function limpiarFormulario() {

        setNumero("");

        setObservaciones("");

        setArchivo(null);

        setEditandoId(null);
    }


    const ordenesFiltradas =

        ordenes.filter((orden) =>

            orden.numero
                .toLowerCase()
                .includes(
                    busqueda.toLowerCase()
                )
        );

    return (

        <Box>
            {/*Titulo de página */}
            <Typography
                variant="h3"
                sx={{
                    fontWeight: 700,
                    mb: 2
                }}
            >
                Órdenes de Provisión
            </Typography>
            
            {/*Descripción de página*/}
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
            
            {/*Formulario de carga */}
            <Paper
                elevation={2}
                sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: 3
                }}
            >

                <Typography
                    variant="h6"
                    sx={{ mb: 3 }}
                >
                    Nueva Orden de Provisión
                </Typography>

                                                        <Button
                                                            size="small"
                                                            variant="text"
                                                            startIcon={<PictureAsPdfIcon />}
                                                            onClick={() =>
                                                                window.open(
                                                                    `/api/ordenes-provision/${orden.id}/archivo`,
                                                                    "_blank"
                                                                )
                                                            }
                                                        >
                                                            VER
                                                        </Button>
                            <TextField
                                fullWidth
                                label="Número"
                                value={numero}
                                onChange={(e) =>
                                    setNumero(
                                        e.target.value
                                    )
                                }
                            />

                        </Grid>

                        {/* Observaciones */}
                        <Grid item xs={12} md={4}>

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

                        {/* PDF */}
                        <Grid item xs={12} md={2}>

                            <Button
                                variant="outlined"
                                component="label"
                                fullWidth
                                sx={{
                                    height: 56
                                }}
                            >

                                {archivo
                                    ? "PDF CARGADO"
                                    : "SUBIR PDF"}

                                <input
                                    hidden
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) =>
                                        setArchivo(
                                            e.target.files?.[0]
                                            || null
                                        )
                                    }
                                />

                            </Button>

                            {archivo && (

                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: "block",
                                        mt: 1
                                    }}
                                >

                                </Typography>
                            )}

                        </Grid>

                        {/* Crear */}
                        <Grid item xs={12} md={2}>

                            <Button
                                fullWidth
                                type="submit"
                                disabled={guardando}
                                variant="contained"
                                sx={{
                                    height: 56
                                }}
                            >

                                {guardando

                                    ? "GUARDANDO..."

                                    : editandoId

                                        ? "GUARDAR"

                                        : "CREAR"}

                            </Button>

                        </Grid>

                    </Grid>

                    {archivo && (

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mt: 2
                            }}
                        >

                            Archivo seleccionado:
                            {" "}
                            {archivo.name}

                        </Typography>

                    )}

                </Box>

            </Paper>

            {/*Buscador */}                    
            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3
                }}
            >

                <TextField
                    fullWidth
                    label="Buscar Orden de Provisión"
                    value={busqueda}
                    onChange={(e) =>
                        setBusqueda(
                            e.target.value
                        )
                    }
                    InputProps={{
                        startAdornment: (

                            <InputAdornment
                                position="start"
                            >
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                />

            </Paper>

            {/*Tabla de contenidos*/}
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

                        {ordenesFiltradas.map(
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

                                    {/* Documento */}

                                    <TableCell>

                                        {orden.nombreArchivo ? (

                                            <IconButton
                                                color="error"
                                                onClick={() =>

                                                    window.open(

                                                        `http://localhost:8080/api/ordenes-provision/${orden.id}/archivo`,

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

                                        )}

                                    </TableCell>


                                    {/* Estado */}

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


                                    {/* Acciones */}

                                    <TableCell align="right">

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

                                    </TableCell>

                                </TableRow>
                            )
                        )}

                    </TableBody>

                </Table>

            </TableContainer>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
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