import { useEffect, useState } from "react";

import type {
    ReleRequest
} from "../../types/ReleRequest";

import type {
    Modelo
} from "../../types/Modelo";

import type {
    Marca
} from "../../types/Marca";

import {

    obtenerModelosPorMarca

} from "../../services/modeloService";

import {
    obtenerMarcas
} from "../../services/marcaService";

import {

    Alert,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControl,
    FormControlLabel,
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
        data: ReleRequest
    ) => Promise<void>;
}

function ReleForm({
    onCreate
}: Props) {

    const [formData, setFormData] =
        useState<ReleRequest>({

            numeroSerie: "",

            modeloId: 0,

            remitoId: 1,

            cargarGarantia: false,

            garantiaMeses: 12,

            inicioGarantia: ""
        });

    const [marcas, setMarcas] =
        useState<Marca[]>([]);

    const [modelos, setModelos] =
        useState<Modelo[]>([]);

    const [marcaId, setMarcaId] =
        useState<number>(0);

    const [modeloSeleccionado,
        setModeloSeleccionado] =
            useState<Modelo | null>(null);

    const [loading, setLoading] =
        useState(false);

    const [successOpen, setSuccessOpen] =
        useState(false);

    const [errorOpen, setErrorOpen] =
        useState(false);

    useEffect(() => {

        cargarMarcas();

    }, []);

    const cargarMarcas =
        async () => {

        const data =
            await obtenerMarcas();

        setMarcas(data);
    };

    const cargarModelos =
        async (marcaId: number) => {

        const data =
            await obtenerModelosPorMarca(
                marcaId
            );

        setModelos(data);
    };

    const handleMarcaChange =
        async (value: number) => {

        setMarcaId(value);

        setFormData({

            ...formData,

            modeloId: 0
        });

        setModeloSeleccionado(null);

        if (value > 0) {

            await cargarModelos(value);

        } else {

            setModelos([]);
        }
    };

    const handleModeloChange =
        (modeloId: number) => {

        const modelo =
            modelos.find(
                (m) =>
                    m.id === modeloId
            ) || null;

        setModeloSeleccionado(
            modelo
        );

        setFormData({

            ...formData,

            modeloId
        });
    };

    const handleChange = (
        e: any
    ) => {

        const {
            name,
            value
        } = e.target;

        setFormData({

            ...formData,

            [name]:

                name === "garantiaMeses"
                || name === "modeloId"
                || name === "remitoId"

                    ? Number(value)

                    : value
        });
    };

    const handleCheckbox =
        (
            e: React.ChangeEvent<HTMLInputElement>
        ) => {

        setFormData({

            ...formData,

            cargarGarantia:
                e.target.checked
        });
    };

    const obtenerTension =
        () => {

        if (!modeloSeleccionado) {
            return "-";
        }

        const desde =
            modeloSeleccionado.tensionDesde;

        const hasta =
            modeloSeleccionado.tensionHasta;

        const tipo =
            modeloSeleccionado.tipoTension;

        if (
            desde &&
            hasta
        ) {

            return `${desde} - ${hasta} ${tipo}`;
        }

        if (desde) {

            return `${desde} ${tipo}`;
        }

        return tipo || "-";
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

                numeroSerie: "",

                modeloId: 0,

                remitoId: 1,

                cargarGarantia: false,

                garantiaMeses: 12,

                inicioGarantia: ""
            });

            setMarcaId(0);

            setModeloSeleccionado(null);

            setModelos([]);

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

                    Relé creado correctamente

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

                    Error al crear relé

                </Alert>

            </Snackbar>

            <Paper
                elevation={3}
                sx={{
                    padding: 3,
                    marginBottom: 4,
                    borderRadius: 4
                }}
            >

                <Typography
                    variant="h6"
                    gutterBottom
                >
                    Crear Relé
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >

                    <Stack spacing={2}>

                        <FormControl fullWidth>

                            <InputLabel>
                                Marca
                            </InputLabel>

                            <Select
                                value={marcaId}
                                label="Marca"
                                onChange={(e) =>
                                    handleMarcaChange(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                            >

                                {marcas.map(
                                    (marca) => (

                                    <MenuItem
                                        key={marca.id}
                                        value={marca.id}
                                    >

                                        {marca.nombre}

                                    </MenuItem>
                                ))}

                            </Select>

                        </FormControl>

                        <FormControl fullWidth>

                            <InputLabel>
                                Modelo
                            </InputLabel>

                            <Select
                                value={
                                    formData.modeloId
                                }
                                label="Modelo"
                                onChange={(e) =>
                                    handleModeloChange(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                            >

                                {modelos.map(
                                    (modelo) => (

                                    <MenuItem
                                        key={modelo.id}
                                        value={modelo.id}
                                    >

                                        {modelo.nombre}

                                    </MenuItem>
                                ))}

                            </Select>

                        </FormControl>

                        <TextField
                            label="Tensión"
                            value={
                                obtenerTension()
                            }
                            slotProps={{
                                input: {
                                    readOnly: true
                                }
                            }}
                            fullWidth
                        />

                        <TextField
                            label="Número Serie"
                            name="numeroSerie"
                            value={
                                formData.numeroSerie
                            }
                            onChange={handleChange}
                            fullWidth
                        />

                        <FormControlLabel
                            control={

                                <Checkbox
                                    checked={
                                        formData.cargarGarantia
                                    }
                                    onChange={
                                        handleCheckbox
                                    }
                                />
                            }
                            label="Cargar garantía"
                        />

                        {formData.cargarGarantia && (

                            <>

                                <TextField
                                    label="Garantía Meses"
                                    name="garantiaMeses"
                                    type="number"
                                    value={
                                        formData.garantiaMeses
                                    }
                                    onChange={handleChange}
                                    fullWidth
                                />

                                <TextField
                                    label="Inicio Garantía"
                                    name="inicioGarantia"
                                    type="date"
                                    value={
                                        formData.inicioGarantia
                                    }
                                    onChange={handleChange}
                                    slotProps={{
                                        inputLabel: {
                                            shrink: true
                                        }
                                    }}
                                    fullWidth
                                />

                            </>
                        )}

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

                                "Crear Relé"
                            )}

                        </Button>

                    </Stack>

                </Box>

            </Paper>

        </>
    );
}

export default ReleForm;