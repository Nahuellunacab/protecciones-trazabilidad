import {

    useEffect,
    useState

} from "react";

import {

    Alert,
    Box,
    Button,
    MenuItem,
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
    IconButton

} from "@mui/material";

import Grid from "@mui/material/Grid";

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

    obtenerRemitos,
    crearRemito,
    actualizarRemito,
    eliminarRemito,
    subirArchivoRemito

} from "../../services/remitoService";

import {
    obtenerProveedores
} from "../../services/proveedorService";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import EditIcon from "@mui/icons-material/Edit";

import DeleteIcon from "@mui/icons-material/Delete";

function RemitoPage() {

    const [remitos, setRemitos] =
        useState<Remito[]>([]);

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

    const [, setErrorMessage] =
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

            const [
                remitosData,
                proveedoresData
            ] = await Promise.all([

                obtenerRemitos(),

                obtenerProveedores()
            ]);

            setRemitos(
                remitosData
            );

            setProveedores(
                proveedoresData
            );

        } catch {

            setErrorMessage(
                "Error al cargar remitos"
            );
        }
    }

    useEffect(() => {

        cargarDatos();

    }, []);

    async function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault();

        setGuardando(true);

        try {

            const data:
            RemitoRequest = {

                numeroRemito,

                fecha,

                proveedorId:
                    Number(proveedorId)
            };


            if (editandoId) {

                await actualizarRemito(

                    editandoId,

                    data
                );

                setMensaje(
                    "Remito actualizado correctamente"
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

                setMensaje(
                    "Remito creado correctamente"
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
                    "Ese número de remito ya existe"
                );

            } else {

                setMensaje(
                    "Error al guardar remito"
                );
            }


            setTipoMensaje(
                "error"
            );

            setOpenSnackbar(true);

        } finally {

            setGuardando(false);
        }
    }

    async function handleEliminar(
        id: number
    ) {

        setErrorMessage("");

        try {

            await eliminarRemito(id);

            cargarDatos();

        } catch (error: any) {

            setErrorMessage(

                error.response?.data?.message ||

                "Ocurrió un error"
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

            {/*Titulo principal */}
            <Typography
                variant="h3"
                sx={{
                    fontWeight: 700,
                    mb: 2
                }}
            >
                Remitos
            </Typography>

            {/*Descripción*/}
            <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                    mb: 5
                }}
            >
                Gestión de remitos de
                ingreso utilizados para
                trazabilidad logística
                y recepción de equipos.
            </Typography>

            {/*Formulario*/}
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
                    Nuevo Remito
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >

                    <Grid
                        container
                        spacing={2}
                    >

                        <Grid item xs={12} md={3}>
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

                        <Grid item xs={12} md={2}>
                            <TextField
                                type="date"
                                fullWidth
                                label="Fecha"
                                InputLabelProps={{
                                    shrink: true
                                }}
                                value={fecha}
                                onChange={(e) =>
                                    setFecha(
                                        e.target.value
                                    )
                                }
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
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
                            >

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

                            </TextField>
                        </Grid>

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
                                    ? "PDF OK"
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
                        </Grid>

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

                            Archivo: {archivo.name}

                        </Typography>

                    )}

                </Box>

            </Paper>


            {/* Tabla */}
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

                        {remitos.map((remito) => (

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

                                    {remito.tieneArchivo ? (

                                        <IconButton
                                            color="error"
                                            onClick={() =>

                                                window.open(

                                                    `http://localhost:8080/api/remitos/${remito.id}/archivo`,
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
                                        />

                                    )}

                                </TableCell>

                                <TableCell>

                                    <Chip
                                        label="ASOCIADO"
                                        color="success"
                                        size="small"
                                    />

                                </TableCell>

                                <TableCell align="right">

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

                                </TableCell>

                            </TableRow>

                        ))}

                    </TableBody>

                </Table>

            </TableContainer>


            {/* Snackbar */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
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