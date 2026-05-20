import { useEffect, useState } from "react";

import type {
    MovimientoRequest
} from "../../types/MovimientoRequest";

import type {
    Estado
} from "../../types/Estado";

import type {
    Posicion
} from "../../types/Posicion";

import type {
    ReleOption
} from "../../types/ReleOption";

import {
    obtenerEstados
} from "../../services/estadoService";

import {
    obtenerPosiciones
} from "../../services/posicionService";

import {
    obtenerOpciones
} from "../../services/releService";

import {

    Alert,
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Stack,
    TextField,
    Typography

} from "@mui/material";

interface Props {

    onCreate: (
        data: MovimientoRequest
    ) => Promise<void>;
}

function MovimientoForm({
    onCreate
}: Props) {

    const [loading, setLoading] =
        useState(false);

    const [successOpen, setSuccessOpen] =
        useState(false);

    const [errorOpen, setErrorOpen] =
        useState(false);

    const [reles, setReles] =
        useState<ReleOption[]>([]);

    const [estados, setEstados] =
        useState<Estado[]>([]);

    const [posiciones, setPosiciones] =
        useState<Posicion[]>([]);

    const [formData, setFormData] =
        useState<MovimientoRequest>({
            releId: 0,
            estadoId: 0,
            posicionId: 0,
            notas: ""
        });

    useEffect(() => {

        cargarCatalogos();

    }, []);

    const cargarCatalogos =
        async () => {

        const relesData =
            await obtenerOpciones();

        const estadosData =
            await obtenerEstados();

        const posicionesData =
            await obtenerPosiciones();

        setReles(relesData);

        setEstados(estadosData);

        setPosiciones(posicionesData);
    };

    const handleChange = (
        e: any
    ) => {

        const { name, value } =
            e.target;

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

            await onCreate(formData);

            setSuccessOpen(true);

            setFormData({
                releId: 0,
                estadoId: 0,
                posicionId: 0,
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

                        <FormControl fullWidth>

                            <InputLabel>
                                Relé
                            </InputLabel>

                            <Select
                                name="releId"
                                value={
                                    formData.releId
                                }
                                label="Relé"
                                onChange={handleChange}
                            >

                                {reles.map(
                                    (rele) => (

                                    <MenuItem
                                        key={rele.id}
                                        value={rele.id}
                                    >

                                        {
                                            rele.numeroSerie
                                        }

                                    </MenuItem>
                                ))}

                            </Select>

                        </FormControl>

                        <FormControl fullWidth>

                            <InputLabel>
                                Estado
                            </InputLabel>

                            <Select
                                name="estadoId"
                                value={
                                    formData.estadoId
                                }
                                label="Estado"
                                onChange={handleChange}
                            >

                                {estados.map(
                                    (estado) => (

                                    <MenuItem
                                        key={estado.id}
                                        value={estado.id}
                                    >

                                        {
                                            estado.nombre
                                        }

                                    </MenuItem>
                                ))}

                            </Select>

                        </FormControl>

                        <FormControl fullWidth>

                            <InputLabel>
                                Posición
                            </InputLabel>

                            <Select
                                name="posicionId"
                                value={
                                    formData.posicionId
                                }
                                label="Posición"
                                onChange={handleChange}
                            >

                                {posiciones.map(
                                    (posicion) => (

                                    <MenuItem
                                        key={posicion.id}
                                        value={posicion.id}
                                    >

                                        {
                                            posicion.destino
                                        }
                                        {" - "}
                                        {
                                            posicion.nombre
                                        }

                                    </MenuItem>
                                ))}

                            </Select>

                        </FormControl>

                        <TextField
                            label="Notas"
                            name="notas"
                            value={formData.notas}
                            onChange={handleChange}
                            multiline
                            rows={3}
                            fullWidth
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

        </>
    );
}

export default MovimientoForm;