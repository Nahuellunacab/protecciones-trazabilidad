import { useEffect, useState } from "react";

import type { ReleRequest } from "../types/ReleRequest";
import type { Modelo } from "../types/Modelo";
import type { Marca } from "../types/Marca";

import { obtenerModelos }
    from "../services/modeloService";

import { obtenerMarcas }
    from "../services/marcaService";

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
    onCreate: (data: ReleRequest) => Promise<void>;
}

function ReleForm({ onCreate }: Props) {

    const [formData, setFormData] =
        useState<ReleRequest>({
            numeroSerie: "",
            garantiaMeses: 12,
            modeloId: 0,
            remitoId: 1
        });

    const [loading, setLoading] =
        useState(false);

    const [successOpen, setSuccessOpen] =
        useState(false);

    const [errorOpen, setErrorOpen] =
        useState(false);

    const [modelos, setModelos] =
        useState<Modelo[]>([]);

    const [marcas, setMarcas] =
        useState<Marca[]>([]);

    const [marcaSeleccionada,
        setMarcaSeleccionada] =
            useState<number | "">("");

    useEffect(() => {

        cargarMarcas();

    }, []);

    const cargarMarcas = async () => {

        const data = await obtenerMarcas();

        setMarcas(data);
    };

    const cargarModelos = async (
        marcaId: number
    ) => {

        const data =
            await obtenerModelos(marcaId);

        setModelos(data);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const { name, value } = e.target;

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
                garantiaMeses: 12,
                modeloId: 0,
                remitoId: 1
            });

            setMarcaSeleccionada("");

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
                onClose={() => setSuccessOpen(false)}
            >

                <Alert severity="success">

                    Relé creado correctamente

                </Alert>

            </Snackbar>

            <Snackbar
                open={errorOpen}
                autoHideDuration={3000}
                onClose={() => setErrorOpen(false)}
            >

                <Alert severity="error">

                    Error al crear relé

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
                    Crear Relé
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >

                    <Stack spacing={2}>

                        <TextField
                            label="Número Serie"
                            name="numeroSerie"
                            value={formData.numeroSerie}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextField
                            label="Garantía Meses"
                            name="garantiaMeses"
                            type="number"
                            value={formData.garantiaMeses}
                            onChange={handleChange}
                            fullWidth
                        />

                        <FormControl fullWidth>

                            <InputLabel>
                                Marca
                            </InputLabel>

                            <Select
                                value={marcaSeleccionada}
                                label="Marca"
                                onChange={async (e) => {

                                    const marcaId =
                                        Number(
                                            e.target.value
                                        );

                                    setMarcaSeleccionada(
                                        marcaId
                                    );

                                    setFormData({
                                        ...formData,
                                        modeloId: 0
                                    });

                                    await cargarModelos(
                                        marcaId
                                    );
                                }}
                            >

                                {marcas.map((marca) => (

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
                                disabled={
                                    !marcaSeleccionada
                                }
                                name="modeloId"
                                value={formData.modeloId}
                                label="Modelo"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        modeloId: Number(
                                            e.target.value
                                        )
                                    })
                                }
                            >

                                {modelos.map((modelo) => (

                                    <MenuItem
                                        key={modelo.id}
                                        value={modelo.id}
                                    >

                                        {modelo.nombre}
                                        {" - "}
                                        {modelo.marca}

                                    </MenuItem>
                                ))}

                            </Select>

                        </FormControl>

                        <TextField
                            label="Remito ID"
                            name="remitoId"
                            type="number"
                            value={formData.remitoId}
                            onChange={handleChange}
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