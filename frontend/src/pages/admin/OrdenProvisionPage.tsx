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
    Typography

} from "@mui/material";

import type {
    OrdenProvision
} from "../../types/OrdenProvision";

import type {
    OrdenProvisionRequest
} from "../../types/OrdenProvisionRequest";

import {

    obtenerOrdenesProvision,
    crearOrdenProvision,
    actualizarOrdenProvision,
    eliminarOrdenProvision

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

    const [errorMessage, setErrorMessage] =
        useState("");

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

    async function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault();

        try {

            const data:
            OrdenProvisionRequest = {

                numero,

                observaciones
            };

            if (editandoId) {

                await actualizarOrdenProvision(

                    editandoId,

                    data
                );

            } else {

                await crearOrdenProvision(
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

        try {

            await eliminarOrdenProvision(
                id
            );

            cargarDatos();

        } catch (error: any) {

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
                        label="Número"
                        value={numero}
                        onChange={(e) =>
                            setNumero(
                                e.target.value
                            )
                        }
                    />

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
                                Observaciones
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
                                >

                                    <TableCell>
                                        {orden.id}
                                    </TableCell>

                                    <TableCell>
                                        {orden.numero}
                                    </TableCell>

                                    <TableCell>
                                        {orden.observaciones}
                                    </TableCell>

                                    <TableCell
                                        align="right"
                                    >

                                        <Button
                                            size="small"
                                            onClick={() =>
                                                handleEditar(
                                                    orden
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
                                                    orden.id
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

export default OrdenProvisionPage;