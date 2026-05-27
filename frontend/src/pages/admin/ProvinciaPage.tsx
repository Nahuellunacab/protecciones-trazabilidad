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
    Provincia
} from "../../types/Provincia";

import type {
    ProvinciaRequest
} from "../../types/ProvinciaRequest";

import {

    obtenerProvincias,
    crearProvincia,
    actualizarProvincia,
    eliminarProvincia

} from "../../services/provinciaService";

function ProvinciaPage() {

    const [provincias, setProvincias] =
        useState<Provincia[]>([]);

    const [nombre, setNombre] =
        useState("");

    const [editandoId, setEditandoId] =
        useState<number | null>(null);

    const [errorMessage, setErrorMessage] =
        useState("");

    async function cargarDatos() {

        try {

            const data =
                await obtenerProvincias();

            setProvincias(data);

        } catch {

            setErrorMessage(
                "Error al cargar provincias"
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
            ProvinciaRequest = {

                nombre
            };

            if (editandoId) {

                await actualizarProvincia(

                    editandoId,
                    data
                );

            } else {

                await crearProvincia(
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

            await eliminarProvincia(id);

            cargarDatos();

        } catch (error: any) {

            setErrorMessage(

                error.response?.data?.message ||

                "Ocurrió un error"
            );
        }
    }

    function handleEditar(
        provincia: Provincia
    ) {

        setEditandoId(
            provincia.id
        );

        setNombre(
            provincia.nombre
        );
    }

    function limpiarFormulario() {

        setNombre("");

        setEditandoId(null);
    }

    return (

        <Box>

            <Typography
                variant="h3"
                fontWeight={700}
                mb={2}
            >
                Provincias
            </Typography>

            <Typography
                variant="h6"
                color="text.secondary"
                mb={5}
            >
                Gestión de provincias
                utilizadas en localidades
                y destinos operativos.
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
                                Provincia
                            </TableCell>

                            <TableCell align="right">
                                Acciones
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {provincias.map(
                            (provincia) => (

                                <TableRow
                                    key={
                                        provincia.id
                                    }
                                >

                                    <TableCell>
                                        {provincia.id}
                                    </TableCell>

                                    <TableCell>
                                        {provincia.nombre}
                                    </TableCell>

                                    <TableCell
                                        align="right"
                                    >

                                        <Button
                                            size="small"
                                            onClick={() =>
                                                handleEditar(
                                                    provincia
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
                                                    provincia.id
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

export default ProvinciaPage;