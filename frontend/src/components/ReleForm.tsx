import { useEffect, useState } from "react";

import type { ReleRequest } from "../types/ReleRequest";
import type { Modelo } from "../types/Modelo";

import { obtenerModelos }
    from "../services/modeloService";

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
            modeloId: 1,
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

    useEffect(() => {

        cargarModelos();

    }, []);

    const cargarModelos = async () => {

        const data = await obtenerModelos();

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
                modeloId: 1,
                remitoId: 1
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
                                Modelo
                            </InputLabel>

                            <Select
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