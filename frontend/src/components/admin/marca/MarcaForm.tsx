import {
    useState,
    useEffect
} from "react";

import {
    Paper,
    TextField,
    Button,
    Stack,
    Typography
} from "@mui/material";

import type { Marca }
from "../../../types/Marca";

interface Props {

    onSubmit: (
        nombre: string
    ) => Promise<void>;

    marcaEditando?: Marca | null;

    cancelarEdicion: () => void;
}

function MarcaForm({
    onSubmit,
    marcaEditando,
    cancelarEdicion
}: Props) {

    const [nombre, setNombre] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    useEffect(() => {

        if (marcaEditando) {

            setNombre(
                marcaEditando.nombre
            );

        } else {

            setNombre("");
        }

    }, [marcaEditando]);

    const validar = () => {

        if (!nombre.trim()) {

            setError(
                "El nombre es obligatorio"
            );

            return false;
        }

        if (
            nombre.trim().length < 2
        ) {

            setError(
                "Debe tener al menos 2 caracteres"
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

            await onSubmit(
                nombre.trim()
            );

            setNombre("");

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
                    marcaEditando
                        ? "Editar Marca"
                        : "Nueva Marca"
                }
            </Typography>

            <Stack spacing={3}>

                <TextField
                    label="Nombre"
                    value={nombre}
                    onChange={(e) =>
                        setNombre(
                            e.target.value
                        )
                    }
                    error={!!error}
                    helperText={error}
                    fullWidth
                />

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
                            marcaEditando
                                ? "Actualizar"
                                : "Crear"
                        }
                    </Button>

                    {
                        marcaEditando && (

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

export default MarcaForm;