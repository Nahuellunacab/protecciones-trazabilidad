import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from "@mui/material";

import type { Modelo }
from "../../types/Modelo";

import type { Marca }
from "../../types/Marca";

import type { Rele }
from "../../types/Rele";

import type { ReleRequest }
from "../../types/ReleRequest";

import {
    obtenerMarcas
} from "../../services/marcaService";

import {
    obtenerModelos
} from "../../services/modeloService";

interface Props {

    onCreate: (
        data: ReleRequest
    ) => Promise<void>;

    onUpdate: (
        id: number,
        data: ReleRequest
    ) => Promise<void>;

    releEditando: Rele | null;

    onCancelEdit: () => void;
}

function ReleForm({
    onCreate,
    onUpdate,
    releEditando,
    onCancelEdit
}: Props) {

    const [marcas, setMarcas] =
        useState<Marca[]>([]);

    const [modelos, setModelos] =
        useState<Modelo[]>([]);

    const [marcaId, setMarcaId] =
        useState<number | "">("");

    const [modelosFiltrados,
        setModelosFiltrados] =
        useState<Modelo[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [formData, setFormData] =
        useState<ReleRequest>({
            numeroSerie: "",
            modeloId: 0,
            cargarGarantia: false,
            garantiaMeses: 12,
            inicioGarantia: "",
            remitoId: null
        });

    useEffect(() => {

        cargarDatos();

    }, []);

    useEffect(() => {

        if (marcaId) {

            const filtrados =
                modelos.filter(
                    (modelo) =>
                        modelo.marcaId ===
                        Number(marcaId)
                );

            setModelosFiltrados(
                filtrados
            );

        } else {

            setModelosFiltrados([]);
        }

    }, [marcaId, modelos]);

    useEffect(() => {

        if (releEditando) {

            const modelo =
                modelos.find(
                    (m) =>
                        m.id ===
                        releEditando.modeloId
                );

            setMarcaId(
                modelo?.marcaId || ""
            );

            setFormData({

                numeroSerie:
                    releEditando.numeroSerie,

                modeloId:
                    releEditando.modeloId ?? 0,

                cargarGarantia:
                    releEditando.garantiaMeses
                    !== null,

                garantiaMeses:
                    releEditando.garantiaMeses
                    || 12,

                inicioGarantia:
                    releEditando.inicioGarantia
                    || "",

                remitoId:
                    releEditando.remitoId
                    || null
            });

        } else {

            limpiarFormulario();
        }

    }, [releEditando, modelos]);

    const cargarDatos = async () => {

        try {

            const [
                marcasData,
                modelosData
            ] = await Promise.all([

                obtenerMarcas(),

                obtenerModelos()
            ]);

            setMarcas(
                marcasData
            );

            setModelos(
                modelosData
            );

        } catch {

            setError(
                "Error al cargar datos"
            );
        }
    };

    const obtenerTension = () => {

        const modelo =
            modelos.find(
                (m) =>
                    m.id ===
                    formData.modeloId
            );

        if (!modelo) {

            return "-";
        }

        return `${modelo.tensionDesde}
        - ${modelo.tensionHasta}
        ${modelo.tipoTension}`;
    };

    const limpiarFormulario = () => {

        setFormData({

            numeroSerie: "",

            modeloId: 0,

            cargarGarantia: false,

            garantiaMeses: 12,

            inicioGarantia: "",

            remitoId: null
        });

        setMarcaId("");

        setError("");

        onCancelEdit();
    };

    const handleChange = (
        e: any
    ) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    };

    const handleSubmit = async (
        e: any
    ) => {

        e.preventDefault();

        setLoading(true);

        setError("");

        try {

            if (releEditando) {

                await onUpdate(
                    releEditando.id,
                    formData
                );

            } else {

                await onCreate(
                    formData
                );
            }

            limpiarFormulario();

        } catch (err: any) {

            setError(
                err?.response?.data?.message
                ||
                "Error al guardar relé"
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <Paper
            sx={{
                p: 3,
                mb: 4,
                borderRadius: 4
            }}
        >

            <Typography
                variant="h5"
                sx={{ mb: 3 }}
            >

                {
                    releEditando
                        ? "Editar Relé"
                        : "Crear Relé"
                }

            </Typography>

            {
                error && (

                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Alert>
                )
            }

            <form
                onSubmit={handleSubmit}
            >

                <Grid
                    container
                    spacing={2}
                >

                    <Grid size={12}>

                        <FormControl
                            fullWidth
                        >

                            <InputLabel>
                                Marca
                            </InputLabel>

                            <Select
                                value={marcaId}
                                label="Marca"
                                onChange={(e) => {

                                    setMarcaId(
                                        Number(
                                            e.target.value
                                        )
                                    );

                                    setFormData(
                                        (prev) => ({
                                            ...prev,
                                            modeloId: 0
                                        })
                                    );
                                }}
                            >

                                {
                                    marcas.map(
                                        (marca) => (

                                        <MenuItem
                                            key={marca.id}
                                            value={marca.id}
                                        >

                                            {marca.nombre}

                                        </MenuItem>
                                    ))
                                }

                            </Select>

                        </FormControl>

                    </Grid>

                    <Grid size={12}>

                        <FormControl
                            fullWidth
                        >

                            <InputLabel>
                                Modelo
                            </InputLabel>

                            <Select
                                name="modeloId"
                                value={
                                    formData.modeloId
                                }
                                label="Modelo"
                                onChange={
                                    handleChange
                                }
                            >

                                {
                                    modelosFiltrados.map(
                                        (modelo) => (

                                        <MenuItem
                                            key={modelo.id}
                                            value={modelo.id}
                                        >

                                            {modelo.nombre}

                                        </MenuItem>
                                    ))
                                }

                            </Select>

                        </FormControl>

                    </Grid>

                    <Grid size={12}>

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

                    </Grid>

                    <Grid size={12}>

                        <TextField
                            label="Número Serie"
                            name="numeroSerie"
                            value={
                                formData.numeroSerie
                            }
                            onChange={
                                handleChange
                            }
                            fullWidth
                            required
                        />

                    </Grid>

                    <Grid size={12}>

                        <FormControlLabel
                            control={

                                <Checkbox
                                    name="cargarGarantia"
                                    checked={
                                        formData.cargarGarantia
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            }
                            label="Cargar garantía"
                        />

                    </Grid>

                    {
                        formData.cargarGarantia && (

                            <>

                                <Grid size={6}>

                                    <TextField
                                        label="Meses Garantía"
                                        name="garantiaMeses"
                                        type="number"
                                        value={
                                            formData.garantiaMeses
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        fullWidth
                                    />

                                </Grid>

                                <Grid size={6}>

                                    <TextField
                                        label="Inicio Garantía"
                                        name="inicioGarantia"
                                        type="date"
                                        value={
                                            formData.inicioGarantia
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true
                                            }
                                        }}
                                        fullWidth
                                    />

                                </Grid>

                            </>
                        )
                    }

                    <Grid size={12}>

                        <Box
                            sx={{ display: "flex", gap: 2 }}
                        >

                            <Button
                                variant="contained"
                                type="submit"
                                disabled={loading}
                                fullWidth
                            >

                                {
                                    releEditando
                                        ? "GUARDAR CAMBIOS"
                                        : "CREAR RELÉ"
                                }

                            </Button>

                            {
                                releEditando && (

                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        onClick={
                                            limpiarFormulario
                                        }
                                    >

                                        CANCELAR

                                    </Button>
                                )
                            }

                        </Box>

                    </Grid>

                </Grid>

            </form>

        </Paper>
    );
}
export default ReleForm;