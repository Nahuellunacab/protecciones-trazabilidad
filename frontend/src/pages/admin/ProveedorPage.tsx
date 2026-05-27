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
    Proveedor
} from "../../types/Proveedor";

import type {
    ProveedorRequest
} from "../../types/ProveedorRequest";

import {

    obtenerProveedores,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor

} from "../../services/proveedorService";

function ProveedorPage() {

    const [proveedores, setProveedores] =
        useState<Proveedor[]>([]);

    const [nombre, setNombre] =
        useState("");

    const [domicilio, setDomicilio] =
        useState("");

    const [telefono, setTelefono] =
        useState("");

    const [editandoId, setEditandoId] =
        useState<number | null>(null);

    const [errorMessage, setErrorMessage] =
        useState("");

    async function cargarDatos() {

        try {

            const data =
                await obtenerProveedores();

            setProveedores(data);

        } catch {

            setErrorMessage(
                "Error al cargar proveedores"
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
            ProveedorRequest = {

                nombre,

                domicilio,

                telefono
            };

            if (editandoId) {

                await actualizarProveedor(

                    editandoId,
                    data
                );

            } else {

                await crearProveedor(
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

            await eliminarProveedor(id);

            cargarDatos();

        } catch (error: any) {

            setErrorMessage(

                error.response?.data?.message ||

                "Ocurrió un error"
            );
        }
    }

    function handleEditar(
        proveedor: Proveedor
    ) {

        setEditandoId(
            proveedor.id
        );

        setNombre(
            proveedor.nombre
        );

        setDomicilio(
            proveedor.domicilio
        );

        setTelefono(
            proveedor.telefono
        );
    }

    function limpiarFormulario() {

        setNombre("");

        setDomicilio("");

        setTelefono("");

        setEditandoId(null);
    }

    return (

        <Box>

            <Typography
                variant="h3"
                fontWeight={700}
                mb={2}
            >
                Proveedores
            </Typography>

            <Typography
                variant="h6"
                color="text.secondary"
                mb={5}
            >
                Gestión de proveedores
                utilizados en remitos,
                ingresos y trazabilidad
                logística.
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
                        fullWidth
                        label="Domicilio"
                        value={domicilio}
                        onChange={(e) =>
                            setDomicilio(
                                e.target.value
                            )
                        }
                    />

                    <TextField
                        fullWidth
                        label="Teléfono"
                        value={telefono}
                        onChange={(e) =>
                            setTelefono(
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
                                Nombre
                            </TableCell>

                            <TableCell>
                                Domicilio
                            </TableCell>

                            <TableCell>
                                Teléfono
                            </TableCell>

                            <TableCell align="right">
                                Acciones
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {proveedores.map(
                            (proveedor) => (

                                <TableRow
                                    key={
                                        proveedor.id
                                    }
                                >

                                    <TableCell>
                                        {proveedor.id}
                                    </TableCell>

                                    <TableCell>
                                        {proveedor.nombre}
                                    </TableCell>

                                    <TableCell>
                                        {proveedor.domicilio}
                                    </TableCell>

                                    <TableCell>
                                        {proveedor.telefono}
                                    </TableCell>

                                    <TableCell
                                        align="right"
                                    >

                                        <Button
                                            size="small"
                                            onClick={() =>
                                                handleEditar(
                                                    proveedor
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
                                                    proveedor.id
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

export default ProveedorPage;