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
    Typography

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

    obtenerRemitos,
    crearRemito,
    actualizarRemito,
    eliminarRemito

} from "../../services/remitoService";

import {
    obtenerProveedores
} from "../../services/proveedorService";

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

    const [errorMessage, setErrorMessage] =
        useState("");

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

        setErrorMessage("");

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

            } else {

                await crearRemito(
                    data
                );
            }

            limpiarFormulario();

            cargarDatos();

        } catch (error: any) {

            setErrorMessage(

                error.response?.data?.message ||

                "Ocurrió un error"
            );
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

        setEditandoId(null);
    }

    return (

        <Box>

            <Typography
                variant="h3"
                fontWeight={700}
                mb={2}
            >
                Remitos
            </Typography>

            <Typography
                variant="h6"
                color="text.secondary"
                mb={5}
            >
                Gestión de remitos de
                ingreso utilizados para
                trazabilidad logística
                y recepción de equipos.
            </Typography>

            <Paper
                sx={{
                    p: 3,
                    mb: 4
                }}
            >

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: "flex",
                        gap: 2
                    }}
                >

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

                    <Button
                        type="submit"
                        variant="contained"
                    >

                        {editandoId
                            ? "GUARDAR"
                            : "CREAR"}

                    </Button>

                </Box>

            </Paper>

            <TableContainer
                component={Paper}
            >

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>
                                ID
                            </TableCell>

                            <TableCell>
                                Número
                            </TableCell>

                            <TableCell>
                                Fecha
                            </TableCell>

                            <TableCell>
                                Proveedor
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
                                    key={
                                        remito.id
                                    }
                                >

                                    <TableCell>
                                        {remito.id}
                                    </TableCell>

                                    <TableCell>
                                        {remito.numeroRemito}
                                    </TableCell>

                                    <TableCell>
                                        {remito.fecha}
                                    </TableCell>

                                    <TableCell>
                                        {remito.proveedor}
                                    </TableCell>

                                    <TableCell
                                        align="right"
                                    >

                                        <Button
                                            size="small"
                                            onClick={() =>
                                                handleEditar(
                                                    remito
                                                )
                                            }
                                        >
                                            EDITAR
                                        </Button>

                                        <Button
                                            size="small"
                                            color="error"
                                            onClick={() =>
                                                handleEliminar(
                                                    remito.id
                                                )
                                            }
                                        >
                                            ELIMINAR
                                        </Button>

                                    </TableCell>

                                </TableRow>
                            )
                        )}

                    </TableBody>

                </Table>

            </TableContainer>

            <Snackbar
                open={
                    !!errorMessage
                }
                autoHideDuration={4000}
                onClose={() =>
                    setErrorMessage("")
                }
            >

                <Alert severity="error">

                    {errorMessage}

                </Alert>

            </Snackbar>

        </Box>
    );
}

export default RemitoPage;