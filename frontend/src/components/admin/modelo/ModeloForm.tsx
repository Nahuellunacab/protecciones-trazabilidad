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


interface Props {

    onSubmit: (
        data: {
            nombre: string;
            marcaId: number;
        }
    ) => Promise<void>;

    modeloEditando?: Modelo | null;

    marcas: Marca[];

    cancelarEdicion: () => void;

    marcaPreseleccionada?: number;

    bloquearMarca?: boolean;
}

function ModeloForm({

    onSubmit,

    modeloEditando,

    marcas,

    cancelarEdicion,

    marcaPreseleccionada,

    bloquearMarca = false

    }: Props) {

    const [nombre, setNombre] =
        useState("");

    const [marcaId, setMarcaId] =
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

            setMarcaId(
                modeloEditando.marcaId
            );

        } else {

            limpiarFormulario();
        }

    }, [modeloEditando]);

    useEffect(() => {

        if (
            marcaPreseleccionada
        ) {

            setMarcaId(
                marcaPreseleccionada
            );
        }

    }, [marcaPreseleccionada]);

    const limpiarFormulario =
        () => {

        setNombre("");

        setMarcaId(
            marcaPreseleccionada ?? ""
        );

        setError("");
    };

    const validar = () => {

        if (!nombre.trim()) {

            setError(
                "El nombre es obligatorio"
            );

            return false;
        }

        if (!marcaId) {

            setError(
                "Debe seleccionar una marca"
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

                marcaId:
                    Number(marcaId)
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

                <TextField
                    select
                    label="Marca"
                    value={marcaId}
                    disabled={bloquearMarca}
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
                        (marcas || []).map((marca) => (

                            <MenuItem
                                key={marca.id}
                                value={marca.id}
                            >

                                {marca.nombre}

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
