import {
    useState,
    useEffect
} from "react";

import {
    Paper,
    TextField,
    Button,
    Stack,
    Typography,
    MenuItem,
    FormControlLabel,
    Checkbox
} from "@mui/material";

import type { Usuario, Rol }
from "../../../types/Usuario";

import type { UsuarioRequest }
from "../../../types/UsuarioRequest";

interface Props {

    onSubmit: (
        data: UsuarioRequest
    ) => Promise<void>;

    usuarioEditando?: Usuario | null;

    cancelarEdicion: () => void;
}

function UsuarioForm({
    onSubmit,
    usuarioEditando,
    cancelarEdicion
}: Props) {

    const [nombre, setNombre] =
        useState("");

    const [apellido, setApellido] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [numeroSobre, setNumeroSobre] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [rol, setRol] =
        useState<Rol>("AUDITOR");

    const [activo, setActivo] =
        useState(true);

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    useEffect(() => {

        if (usuarioEditando) {

            setNombre(usuarioEditando.nombre);
            setApellido(usuarioEditando.apellido);
            setEmail(usuarioEditando.email);
            setNumeroSobre(usuarioEditando.numeroSobre);
            setRol(usuarioEditando.rol);
            setActivo(usuarioEditando.activo);
            setPassword("");

        } else {

            setNombre("");
            setApellido("");
            setEmail("");
            setNumeroSobre("");
            setPassword("");
            setRol("AUDITOR");
            setActivo(true);
        }

    }, [usuarioEditando]);

    const validar = () => {

        if (!nombre.trim() || !apellido.trim() || !email.trim() || !numeroSobre.trim()) {

            setError(
                "Nombre, apellido, email y numero de sobre son obligatorios"
            );

            return false;
        }

        if (!usuarioEditando && !password.trim()) {

            setError(
                "La contraseña es obligatoria para un usuario nuevo"
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
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                email: email.trim(),
                numeroSobre: numeroSobre.trim(),
                password: password.trim() || undefined,
                rol,
                activo
            });

            if (!usuarioEditando) {

                setNombre("");
                setApellido("");
                setEmail("");
                setNumeroSobre("");
                setPassword("");
                setRol("AUDITOR");
                setActivo(true);
            }

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
                    usuarioEditando
                        ? "Editar Usuario"
                        : "Nuevo Usuario"
                }
            </Typography>

            <Stack spacing={3}>

                <TextField
                    label="Nombre"
                    value={nombre}
                    onChange={(e) =>
                        setNombre(e.target.value)
                    }
                    fullWidth
                />

                <TextField
                    label="Apellido"
                    value={apellido}
                    onChange={(e) =>
                        setApellido(e.target.value)
                    }
                    fullWidth
                />

                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    fullWidth
                />

                <TextField
                    label="Número de sobre (legajo)"
                    value={numeroSobre}
                    onChange={(e) =>
                        setNumeroSobre(e.target.value)
                    }
                    fullWidth
                />

                <TextField
                    label={
                        usuarioEditando
                            ? "Nueva contraseña (dejar vacío para no cambiarla)"
                            : "Contraseña"
                    }
                    type="password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    fullWidth
                />

                <TextField
                    select
                    label="Rol"
                    value={rol}
                    onChange={(e) =>
                        setRol(e.target.value as Rol)
                    }
                    fullWidth
                >

                    <MenuItem value="ADMIN">
                        ADMIN
                    </MenuItem>

                    <MenuItem value="OPERADOR">
                        OPERADOR
                    </MenuItem>

                    <MenuItem value="AUDITOR">
                        AUDITOR
                    </MenuItem>

                </TextField>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={activo}
                            onChange={(e) =>
                                setActivo(e.target.checked)
                            }
                        />
                    }
                    label="Activo (puede iniciar sesión)"
                />

                {error && (

                    <Typography
                        color="error"
                        variant="body2"
                    >
                        {error}
                    </Typography>
                )}

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
                            usuarioEditando
                                ? "Actualizar"
                                : "Crear"
                        }
                    </Button>

                    {
                        usuarioEditando && (

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

export default UsuarioForm;
