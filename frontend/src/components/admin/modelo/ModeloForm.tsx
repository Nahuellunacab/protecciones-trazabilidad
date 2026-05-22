import {
    useEffect,
    useState
} from "react";

import {
    Paper,
    Stack,
    TextField,
    Typography,
    Button,
    MenuItem
} from "@mui/material";

import type { Modelo }
from "../../../types/Modelo";

import type { Marca }
from "../../../types/Marca";

import type { Tipo }
from "../../../types/Tipo";

interface Props {

    onSubmit: (
        data: {
            nombre: string;
            tensionDesde: number;
            tensionHasta: number;
            tipoTension: string;
            marcaId: number;
            tipoId: number;
        }
    ) => Promise<void>;

    modeloEditando?: Modelo | null;

    marcas: Marca[];

    tipos: Tipo[];

    cancelarEdicion: () => void;
}

function ModeloForm({

    onSubmit,

    modeloEditando,

    marcas,

    tipos,

    cancelarEdicion

}: Props) {

    const [nombre, setNombre] =
        useState("");

    const [tensionDesde,
        setTensionDesde] =
            useState<number | null>(null);

    const [tensionHasta,
        setTensionHasta] =
            useState<number | null>(null);

    const [tipoTension,
        setTipoTension] =
            useState("");

    const [marcaId, setMarcaId] =
        useState<number | "">("");

    const [tipoId, setTipoId] =
        useState<number | "">("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    useEffect(() => {

        if (modeloEditando) {

            setNombre(
                modeloEditando.nombre
            );

            setTensionDesde(
                modeloEditando.tensionDesde ?? null
            );

            setTensionHasta(
                modeloEditando.tensionHasta ?? null
            );

            setTipoTension(
                modeloEditando.tipoTension ?? ""
            );

            setMarcaId(
                modeloEditando.marcaId
            );

            setTipoId(
                modeloEditando.tipoId
            );

        } else {

            limpiarFormulario();
        }

    }, [modeloEditando]);

    const limpiarFormulario =
        () => {

        setNombre("");

        setTensionDesde(null);

        setTensionHasta(null);

        setTipoTension("");

        setMarcaId("");

        setTipoId("");

        setError("");
    };

    const validar = () => {

        if (!nombre.trim()) {

            setError(
                "El nombre es obligatorio"
            );

            return false;
        }

        if (tensionDesde === null) {

            setError(
                "Debe ingresar tensión desde"
            );

            return false;
        }

        if (tensionHasta === null) {

            setError(
                "Debe ingresar tensión hasta"
            );

            return false;
        }

        if (
            tensionHasta < tensionDesde
        ) {

            setError(
                "La tensión hasta no puede ser menor que la inicial"
            );

            return false;
        }

        if (!tipoTension) {

            setError(
                "Debe seleccionar tipo de tensión"
            );

            return false;
        }

        if (!marcaId) {

            setError(
                "Debe seleccionar una marca"
            );

            return false;
        }

        if (!tipoId) {

            setError(
                "Debe seleccionar un tipo"
            );

            return false;
        }

        setError("");

        return true;
    };

    const handleSubmit =
        async () => {

        if (!validar()) {
            return;
        }

        try {

            setLoading(true);

            await onSubmit({

                nombre:
                    nombre.trim(),

                tensionDesde:
                    tensionDesde!,

                tensionHasta:
                    tensionHasta!,

                tipoTension:
                    tipoTension,

                marcaId:
                    Number(marcaId),

                tipoId:
                    Number(tipoId)
            });

            limpiarFormulario();

        } finally {

            setLoading(false);
        }
    };

    return (

        <Paper
            sx={{
                p: 4,
                mb: 4,
                borderRadius: 3
            }}
        >

            <Typography
                variant="h6"
                sx={{
                    mb: 3,
                    fontWeight: "bold"
                }}
            >
                {
                    modeloEditando
                        ? "Editar Modelo"
                        : "Nuevo Modelo"
                }
            </Typography>

            <Stack spacing={3}>

                <TextField
                    label="Modelo"
                    value={nombre}
                    onChange={(e) =>
                        setNombre(
                            e.target.value
                        )
                    }
                    fullWidth
                />

                <Stack
                    direction="row"
                    spacing={2}
                >

                    <TextField
                        label="Tensión Desde"
                        type="number"
                        value={tensionDesde ?? ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setTensionDesde(
                                value === "" ? null : Number(value)
                            );
                        }}
                        fullWidth
                    />

                    <TextField
                        label="Tensión Hasta"
                        type="number"
                        value={tensionHasta ?? ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setTensionHasta(
                                value === "" ? null : Number(value)
                            );
                        }}
                        fullWidth
                    />

                </Stack>

                <TextField
                    select
                    label="Tipo de Tensión"
                    value={tipoTension}
                    onChange={(e) =>
                        setTipoTension(
                            e.target.value
                        )
                    }
                    fullWidth
                >

                    <MenuItem value="VCC">
                        VCC
                    </MenuItem>

                    <MenuItem value="VCA">
                        VCA
                    </MenuItem>

                </TextField>

                <TextField
                    select
                    label="Marca"
                    value={marcaId}
                    onChange={(e) =>
                        setMarcaId(
                            Number(
                                e.target.value
                            )
                        )
                    }
                    fullWidth
                >

                    {
                        marcas.map((marca) => (

                            <MenuItem
                                key={marca.id}
                                value={marca.id}
                            >

                                {marca.nombre}

                            </MenuItem>
                        ))
                    }

                </TextField>

                <TextField
                    select
                    label="Función / Tipo"
                    value={tipoId}
                    onChange={(e) =>
                        setTipoId(
                            Number(
                                e.target.value
                            )
                        )
                    }
                    fullWidth
                >

                    {
                        tipos.map((tipo) => (

                            <MenuItem
                                key={tipo.id}
                                value={tipo.id}
                            >

                                {tipo.nombre}

                            </MenuItem>
                        ))
                    }

                </TextField>

                {
                    error && (

                        <Typography
                            color="error"
                        >
                            {error}
                        </Typography>
                    )
                }

                <Stack
                    direction="row"
                    spacing={2}
                >

                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {
                            modeloEditando
                                ? "Actualizar"
                                : "Crear"
                        }
                    </Button>

                    {
                        modeloEditando && (

                            <Button
                                variant="outlined"
                                onClick={
                                    cancelarEdicion
                                }
                            >
                                Cancelar
                            </Button>
                        )
                    }

                </Stack>

            </Stack>

        </Paper>
    );
}

export default ModeloForm;