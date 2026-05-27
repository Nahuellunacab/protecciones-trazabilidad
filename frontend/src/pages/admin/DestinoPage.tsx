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
    Destino
} from "../../types/Destino";

import type {
    DestinoRequest
} from "../../types/DestinoRequest";

import type {
    Localidad
} from "../../types/Localidad";

import {

    obtenerDestinos,
    crearDestino,
    actualizarDestino,
    eliminarDestino

} from "../../services/destinoService";

import {
    obtenerLocalidades
} from "../../services/localidadService";

function DestinoPage() {

    const [destinos, setDestinos] =
        useState<Destino[]>([]);

    const [localidades, setLocalidades] =
        useState<Localidad[]>([]);

    const [nombre, setNombre] =
        useState("");

    const [localidadId, setLocalidadId] =
        useState("");

    const [editandoId, setEditandoId] =
        useState<number | null>(null);

    const [errorMessage, setErrorMessage] =
        useState("");

    async function cargarDatos() {

        try {

            const [
                destinosData,
                localidadesData
            ] = await Promise.all([

                obtenerDestinos(),

                obtenerLocalidades()
            ]);

            setDestinos(
                destinosData
            );

            setLocalidades(
                localidadesData
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
            DestinoRequest = {

                nombre,

                localidadId:
                    Number(localidadId)
            };

            if (editandoId) {

                await actualizarDestino(

                    editandoId,
                    data
                );

            } else {

                await crearDestino(
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

            await eliminarDestino(id);

            cargarDatos();

        } catch (error: any) {

            setErrorMessage(

                error.response?.data?.message ||

                "Ocurrió un error"
            );
        }
    }

    function handleEditar(
        destino: Destino
    ) {

        setEditandoId(
            destino.id
        );

        setNombre(
            destino.nombre
        );
    }

    function limpiarFormulario() {

        setNombre("");

        setLocalidadId("");

        setEditandoId(null);
    }

    return (

        <Box>

            <Typography
                variant="h3"
                fontWeight={700}
                mb={2}
            >
                Destinos Operativos
            </Typography>

            <Typography
                variant="h6"
                color="text.secondary"
                mb={5}
            >
                Gestión de destinos y
                ubicaciones operativas
                utilizadas en movimientos
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
                        label="Localidad"
                        value={localidadId}
                        onChange={(e) =>
                            setLocalidadId(
                                e.target.value
                            )
                        }
                    >

                        {localidades.map(
                            (localidad) => (

                                <MenuItem
                                    key={
                                        localidad.id
                                    }
                                    value={
                                        localidad.id
                                    }
                                >

                                    {localidad.nombre}
                                    {" - "}
                                    {localidad.provincia}

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
                                Nombre
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

                        {destinos.map(
                            (destino) => (

                                <TableRow
                                    key={
                                        destino.id
                                    }
                                >

                                    <TableCell>
                                        {destino.id}
                                    </TableCell>

                                    <TableCell>
                                        {destino.nombre}
                                    </TableCell>

                                    <TableCell>
                                        {destino.localidad}
                                    </TableCell>

                                    <TableCell>
                                        {destino.provincia}
                                    </TableCell>

                                    <TableCell
                                        align="right"
                                    >

                                        <Button
                                            size="small"
                                            onClick={() =>
                                                handleEditar(
                                                    destino
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
                                                    destino.id
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

export default DestinoPage;