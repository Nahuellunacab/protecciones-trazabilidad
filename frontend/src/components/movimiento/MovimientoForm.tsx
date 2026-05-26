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
    Rele
} from "../../types/Rele";

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

    obtenerOpciones,

    obtenerRelePorId

} from "../../services/releService";

import {

    Alert,
    Autocomplete,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
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

    const [releSeleccionado,
        setReleSeleccionado] =
        useState<Rele | null>(null);

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

    const handleSeleccionRele =
    async (
        value: ReleOption | null
    ) => {

        setFormData({

            ...formData,

            releId:
                value
                    ? value.id
                    : 0
        });

        if (!value) {

            setReleSeleccionado(null);

            return;
        }

        try {

            const rele =
                await obtenerRelePorId(
                    value.id
                );

            setReleSeleccionado(
                rele
            );

        } catch (error) {

            console.error(error);
        }
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

            setReleSeleccionado(null);

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

                        <Autocomplete

                            options={reles}

                            getOptionLabel={(option) =>

                                `${option.numeroSerie} | ${option.marca} | ${option.modelo} | ${option.tension}`
                            }

                            value={
                                reles.find(
                                    (r) =>
                                        r.id === formData.releId
                                ) || null
                            }

                            onChange={(_, value) =>
                                handleSeleccionRele(
                                    value
                                )
                            }

                            renderInput={(params) => (

                                <TextField
                                    {...params}
                                    label="Relé"
                                />
                            )}

                            renderOption={(props, option) => (

                                <Box
                                    component="li"
                                    {...props}
                                >

                                    <Stack>

                                        <Typography
                                            fontWeight={600}
                                        >

                                            {option.numeroSerie}

                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >

                                            {
                                                `${option.marca} | ${option.modelo} | ${option.tension}`
                                            }

                                        </Typography>

                                    </Stack>

                                </Box>
                            )}
                        />

                        {
                            releSeleccionado && (

                                <Paper
                                    variant="outlined"
                                    sx={{
                                        padding: 2,
                                        backgroundColor:
                                            "#fafafa"
                                    }}
                                >

                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={600}
                                        gutterBottom
                                    >
                                        Estado Operacional Actual
                                    </Typography>

                                    <Divider
                                        sx={{ mb: 2 }}
                                    />

                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        flexWrap="wrap"
                                        useFlexGap
                                    >

                                        <Chip
                                            label={
                                                `Estado: ${releSeleccionado.estadoActual}`
                                            }
                                            color="primary"
                                        />

                                        <Chip
                                            label={
                                                `Posición: ${releSeleccionado.posicionActual}`
                                            }
                                            color="secondary"
                                        />

                                        <Chip
                                            label={
                                                `Destino: ${releSeleccionado.localidadActual}`
                                            }
                                            color="info"
                                        />

                                        <Chip
                                            label={
                                                `Garantía: ${releSeleccionado.estadoGarantia}`
                                            }
                                            color={
                                                releSeleccionado.estadoGarantia === "VIGENTE"
                                                    ? "success"
                                                    : releSeleccionado.estadoGarantia === "POR VENCER"
                                                        ? "warning"
                                                        : "error"
                                            }
                                        />

                                    </Stack>

                                    <Stack
                                        spacing={1}
                                        sx={{ mt: 2 }}
                                    >

                                        <Typography
                                            variant="body2"
                                        >

                                            <strong>Marca:</strong>
                                            {" "}
                                            {
                                                releSeleccionado.marca
                                            }

                                        </Typography>

                                        <Typography
                                            variant="body2"
                                        >

                                            <strong>Modelo:</strong>
                                            {" "}
                                            {
                                                releSeleccionado.modelo
                                            }

                                        </Typography>

                                        <Typography
                                            variant="body2"
                                        >

                                            <strong>Tensión:</strong>
                                            {" "}
                                            {
                                                releSeleccionado.tension
                                            }

                                        </Typography>

                                    </Stack>

                                </Paper>
                            )
                        }

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
                                        {" | "}
                                        {
                                            posicion.nombre
                                        }

                                    </MenuItem>
                                ))}

                            </Select>

                        </FormControl>

                        <TextField
                            label="Notas operativas"
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