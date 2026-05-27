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
    Localidad
} from "../../types/Localidad";

import type {
    LocalidadRequest
} from "../../types/LocalidadRequest";

import type {
    Provincia
} from "../../types/Provincia";

import {

    obtenerLocalidades,
    crearLocalidad,
    actualizarLocalidad,
    eliminarLocalidad

} from "../../services/localidadService";

import {
    obtenerProvincias
} from "../../services/provinciaService";

function LocalidadPage() {

    const [localidades, setLocalidades] =
        useState<Localidad[]>([]);

    const [provincias, setProvincias] =
        useState<Provincia[]>([]);

    const [nombre, setNombre] =
        useState("");

    const [provinciaId, setProvinciaId] =
        useState("");

    const [editandoId, setEditandoId] =
        useState<number | null>(null);

    const [errorMessage, setErrorMessage] =
        useState("");

    async function cargarDatos() {

        try {

            const [
                localidadesData,
                provinciasData
            ] = await Promise.all([

                obtenerLocalidades(),

                obtenerProvincias()
            ]);

            setLocalidades(
                localidadesData
            );

            setProvincias(
                provinciasData
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
            LocalidadRequest = {

                nombre,

                provinciaId:
                    Number(provinciaId)
            };

            if (editandoId) {

                await actualizarLocalidad(

                    editandoId,
                    data
                );

            } else {

                await crearLocalidad(
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

            await eliminarLocalidad(id);

            cargarDatos();

        } catch (error: any) {

            setErrorMessage(

                error.response?.data?.message ||

                "Ocurrió un error"
            );
        }
    }

    function handleEditar(
        localidad: Localidad
    ) {

        setEditandoId(
            localidad.id
        );

        setNombre(
            localidad.nombre
        );
    }

    function limpiarFormulario() {

        setNombre("");

        setProvinciaId("");

        setEditandoId(null);
    }

    return (

        <Box>

            <Typography
                variant="h3"
                fontWeight={700}
                mb={2}
            >
                Localidades
            </Typography>

            <Typography
                variant="h6"
                color="text.secondary"
                mb={5}
            >
                Gestión de localidades
                utilizadas en destinos
                y trazabilidad operativa.
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
                        label="Provincia"
                        value={provinciaId}
                        onChange={(e) =>
                            setProvinciaId(
                                e.target.value
                            )
                        }
                    >

                        {provincias.map(
                            (provincia) => (

                                <MenuItem
                                    key={
                                        provincia.id
                                    }
                                    value={
                                        provincia.id
                                    }
                                >

                                    {provincia.nombre}

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
                                Localidad
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

                        {localidades.map(
                            (localidad) => (

                                <TableRow
                                    key={
                                        localidad.id
                                    }
                                >

                                    <TableCell>
                                        {localidad.id}
                                    </TableCell>

                                    <TableCell>
                                        {localidad.nombre}
                                    </TableCell>

                                    <TableCell>
                                        {localidad.provincia}
                                    </TableCell>

                                    <TableCell
                                        align="right"
                                    >

                                        <Button
                                            size="small"
                                            onClick={() =>
                                                handleEditar(
                                                    localidad
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
                                                    localidad.id
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

export default LocalidadPage;