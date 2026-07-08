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

import { useAuth } from "../../context/AuthContext";

import ProveedorForm from "../../components/admin/proveedor/ProveedorForm";

function ProveedorPage() {

    const { canWrite } = useAuth();

    const [proveedores, setProveedores] =
        useState<Proveedor[]>([]);

    const [proveedorEditando, setProveedorEditando] =
        useState<Proveedor | null>(null);

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
        data: ProveedorRequest
    ) {

        setErrorMessage("");

        try {

            if (proveedorEditando) {

                await actualizarProveedor(

                    proveedorEditando.id,
                    data
                );

            } else {

                await crearProveedor(
                    data
                );
            }

            setProveedorEditando(null);

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

        setProveedorEditando(
            proveedor
        );
    }

    return (

        <Box>

            <Typography
                variant="h3"
                sx={{ fontWeight: 700, mb: 2 }}
            >
                Proveedores
            </Typography>

            <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 5 }}
            >
                Gestión de proveedores
                utilizados en remitos,
                ingresos y trazabilidad
                logística.
            </Typography>

            {canWrite && (

                <ProveedorForm
                    onSubmit={handleSubmit}
                    proveedorEditando={proveedorEditando}
                    cancelarEdicion={() =>
                        setProveedorEditando(null)
                    }
                />
            )}

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

                                        {canWrite && (
                                            <>

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

                                            </>
                                        )}

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