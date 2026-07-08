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

import type { Proveedor }
from "../../../types/Proveedor";

import type { ProveedorRequest }
from "../../../types/ProveedorRequest";

interface Props {

    onSubmit: (
        data: ProveedorRequest
    ) => Promise<void>;

    proveedorEditando?: Proveedor | null;

    cancelarEdicion: () => void;

    nombreSugerido?: string;
}

function ProveedorForm({
    onSubmit,
    proveedorEditando,
    cancelarEdicion,
    nombreSugerido
}: Props) {

    const [nombre, setNombre] =
        useState("");

    const [domicilio, setDomicilio] =
        useState("");

    const [telefono, setTelefono] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    useEffect(() => {

        if (proveedorEditando) {

            setNombre(
                proveedorEditando.nombre
            );

            setDomicilio(
                proveedorEditando.domicilio
            );

            setTelefono(
                proveedorEditando.telefono
            );

        } else {

            setNombre(
                nombreSugerido ?? ""
            );

            setDomicilio("");

            setTelefono("");
        }

    }, [proveedorEditando, nombreSugerido]);

    const validar = () => {

        if (!nombre.trim()) {

            setError(
                "El nombre es obligatorio"
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

                domicilio:
                    domicilio.trim(),

                telefono:
                    telefono.trim()
            });

            setNombre("");

            setDomicilio("");

            setTelefono("");

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
                    proveedorEditando
                        ? "Editar Proveedor"
                        : "Nuevo Proveedor"
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

                <TextField
                    label="Domicilio"
                    value={domicilio}
                    onChange={(e) =>
                        setDomicilio(
                            e.target.value
                        )
                    }
                    fullWidth
                />

                <TextField
                    label="Teléfono"
                    value={telefono}
                    onChange={(e) =>
                        setTelefono(
                            e.target.value
                        )
                    }
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
                            proveedorEditando
                                ? "Actualizar"
                                : "Crear"
                        }
                    </Button>

                    {
                        proveedorEditando && (

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

export default ProveedorForm;
