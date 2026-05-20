import { useEffect, useState }
    from "react";

import {
    crearMovimiento,
    obtenerMovimientos
} from "../services/movimientoService";

import type { Movimiento }
    from "../types/Movimiento";

import type { MovimientoRequest }
    from "../types/MovimientoRequest";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    Snackbar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";

function MovimientoPage() {

    const [movimientos, setMovimientos] =
        useState<Movimiento[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [successOpen, setSuccessOpen] =
        useState(false);

    const [errorOpen, setErrorOpen] =
        useState(false);

    const [formData, setFormData] =
        useState<MovimientoRequest>({
            releId: 1,
            estadoId: 1,
            posicionId: 1,
            notas: ""
        });

    useEffect(() => {

        cargarMovimientos();

    }, []);

    const cargarMovimientos =
        async () => {

            const data =
                await obtenerMovimientos();

            setMovimientos(data);
        };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]:
                name === "notas"
                    ? value
                    : Number(value)
        });
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        try {

            setLoading(true);

            await crearMovimiento(
                formData
            );

            await cargarMovimientos();

            setSuccessOpen(true);

            setFormData({
                releId: 1,
                estadoId: 1,
                posicionId: 1,
                notas: ""
            });

        } catch (error) {

            console.error(error);

            setErrorOpen(true);

        } finally {

            setLoading(false);
        }
    };

    return (

        <>

            <Snackbar
                open={successOpen}
                autoHideDuration={3000}
                onClose={() =>
                    setSuccessOpen(false)
                }
            >

                <Alert severity="success">

                    Movimiento creado

                </Alert>

            </Snackbar>

            <Snackbar
                open={errorOpen}
                autoHideDuration={3000}
                onClose={() =>
                    setErrorOpen(false)
                }
            >

                <Alert severity="error">

                    Error al crear movimiento

                </Alert>

            </Snackbar>

            <Paper
                elevation={3}
                sx={{
                    padding: 3,
                    marginBottom: 4
                }}
            >

                <Typography
                    variant="h6"
                    gutterBottom
                >
                    Crear Movimiento
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >

                    <Stack spacing={2}>

                        <TextField
                            label="Relé ID"
                            name="releId"
                            type="number"
                            value={formData.releId}
                            onChange={handleChange}
                        />

                        <TextField
                            label="Estado ID"
                            name="estadoId"
                            type="number"
                            value={formData.estadoId}
                            onChange={handleChange}
                        />

                        <TextField
                            label="Posición ID"
                            name="posicionId"
                            type="number"
                            value={formData.posicionId}
                            onChange={handleChange}
                        />

                        <TextField
                            label="Notas"
                            name="notas"
                            value={formData.notas}
                            onChange={handleChange}
                            multiline
                            rows={3}
                        />

                        <Button
                            variant="contained"
                            type="submit"
                            disabled={loading}
                        >

                            {loading ? (

                                <CircularProgress
                                    size={24}
                                    color="inherit"
                                />

                            ) : (

                                "Crear Movimiento"
                            )}

                        </Button>

                    </Stack>

                </Box>

            </Paper>

            <TableContainer
                component={Paper}
            >

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>
                                Relé
                            </TableCell>

                            <TableCell>
                                Estado
                            </TableCell>

                            <TableCell>
                                Posición
                            </TableCell>

                            <TableCell>
                                Fecha
                            </TableCell>

                            <TableCell>
                                Notas
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {movimientos.map(
                            (movimiento) => (

                            <TableRow
                                key={movimiento.id}
                            >

                                <TableCell>
                                    {movimiento.rele}
                                </TableCell>

                                <TableCell>
                                    {movimiento.estado}
                                </TableCell>

                                <TableCell>
                                    {movimiento.posicion}
                                </TableCell>

                                <TableCell>
                                    {
                                        movimiento
                                        .fechaMovimiento
                                    }
                                </TableCell>

                                <TableCell>
                                    {movimiento.notas}
                                </TableCell>

                            </TableRow>
                        ))}

                    </TableBody>

                </Table>

            </TableContainer>

        </>

    );
}

export default MovimientoPage;