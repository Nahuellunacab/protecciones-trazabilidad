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
    Posicion
} from "../../types/Posicion";

import type {
    PosicionRequest
} from "../../types/PosicionRequest";

import type {
    Destino
} from "../../types/Destino";

import {

    obtenerPosiciones,
    crearPosicion,
    actualizarPosicion,
    eliminarPosicion

} from "../../services/posicionService";

import {
    obtenerDestinos
} from "../../services/destinoService";

function PosicionPage() {

    const [posiciones, setPosiciones] =
        useState<Posicion[]>([]);

    const [destinos, setDestinos] =
        useState<Destino[]>([]);

    const [nombre, setNombre] =
        useState("");

    const [destinoId, setDestinoId] =
        useState("");

    const [editandoId, setEditandoId] =
        useState<number | null>(null);

    const [errorMessage, setErrorMessage] =
        useState("");

    async function cargarDatos() {

        try {

            const [
                posicionesData,
                destinosData
            ] = await Promise.all([

                obtenerPosiciones(),

                obtenerDestinos()
            ]);

            setPosiciones(
                posicionesData
            );

            setDestinos(
                destinosData
            );

        } catch {

            setErrorMessage(
                "Error al cargar datos"
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
            PosicionRequest = {

                nombre,

                destinoId:
                    Number(destinoId)
            };

            if (editandoId) {

                await actualizarPosicion(

                    editandoId,
                    data
                );

            } else {

                await crearPosicion(
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

            await eliminarPosicion(id);

            cargarDatos();

        } catch (error: any) {

            setErrorMessage(

                error.response?.data?.message ||

                "Ocurrió un error"
            );
        }
    }

    function handleEditar(
        posicion: Posicion
    ) {

        setEditandoId(
            posicion.id
        );

        setNombre(
            posicion.nombre
        );
    }

    function limpiarFormulario() {

        setNombre("");

        setDestinoId("");

        setEditandoId(null);
    }

    return (

        <Box>

            <Typography
                variant="h3"
                fontWeight={700}
                mb={2}
            >
                Posiciones Operativas
            </Typography>

            <Typography
                variant="h6"
                color="text.secondary"
                mb={5}
            >
                Gestión de posiciones
                físicas utilizadas
                en movimientos
                y trazabilidad.
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
                        label="Nombre"
                        value={nombre}
                        onChange={(e) =>
                            setNombre(
                                e.target.value
                            )
                        }
                    />

                    <TextField
                        select
                        fullWidth
                        label="Destino"
                        value={destinoId}
                        onChange={(e) =>
                            setDestinoId(
                                e.target.value
                            )
                        }
                    >

                        {destinos.map(
                            (destino) => (

                                <MenuItem
                                    key={
                                        destino.id
                                    }
                                    value={
                                        destino.id
                                    }
                                >

                                    {destino.nombre}

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
                                Posición
                            </TableCell>

                            <TableCell>
                                Destino
                            </TableCell>

                            <TableCell align="right">
                                Acciones
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {posiciones.map(
                            (posicion) => (

                                <TableRow
                                    key={
                                        posicion.id
                                    }
                                >

                                    <TableCell>
                                        {posicion.id}
                                    </TableCell>

                                    <TableCell>
                                        {posicion.nombre}
                                    </TableCell>

                                    <TableCell>
                                        {posicion.destino}
                                    </TableCell>

                                    <TableCell
                                        align="right"
                                    >

                                        <Button
                                            size="small"
                                            onClick={() =>
                                                handleEditar(
                                                    posicion
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
                                                    posicion.id
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

export default PosicionPage;