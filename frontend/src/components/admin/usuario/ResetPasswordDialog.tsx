import {
    useEffect,
    useState
} from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Stack,
    Typography
} from "@mui/material";

import type { Usuario }
from "../../../types/Usuario";

const LONGITUD_MINIMA = 6;

function generarPasswordAleatoria(): string {

    const caracteres =
        "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";

    let resultado = "";

    for (let i = 0; i < 10; i++) {

        resultado +=
            caracteres.charAt(
                Math.floor(Math.random() * caracteres.length)
            );
    }

    return resultado;
}

interface Props {

    usuario: Usuario | null;

    open: boolean;

    onClose: () => void;

    onConfirm: (
        passwordNueva: string
    ) => Promise<void>;
}

function ResetPasswordDialog({
    usuario,
    open,
    onClose,
    onConfirm
}: Props) {

    const [password, setPassword] =
        useState("");

    const [generada, setGenerada] =
        useState(false);

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    useEffect(() => {

        if (open) {

            setPassword("");
            setGenerada(false);
            setError("");
        }

    }, [open]);

    const handleGenerar = () => {

        setPassword(
            generarPasswordAleatoria()
        );

        setGenerada(true);
    };

    const handleConfirmar =
        async () => {

        if (password.trim().length < LONGITUD_MINIMA) {

            setError(
                `La contraseña debe tener al menos ${LONGITUD_MINIMA} caracteres`
            );

            return;
        }

        try {

            setLoading(true);

            await onConfirm(
                password.trim()
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xs"
        >

            <DialogTitle>
                Resetear contraseña
            </DialogTitle>

            <DialogContent>

                <Stack spacing={2} sx={{ mt: 1 }}>

                    <Typography variant="body2">
                        {
                            usuario &&
                            `Nueva contraseña para ${usuario.nombre} ${usuario.apellido}`
                        }
                    </Typography>

                    <TextField
                        label="Nueva contraseña"
                        type={
                            generada
                                ? "text"
                                : "password"
                        }
                        value={password}
                        onChange={(e) => {

                            setPassword(e.target.value);
                            setGenerada(false);
                        }}
                        fullWidth
                        autoFocus
                    />

                    <Button
                        variant="outlined"
                        onClick={handleGenerar}
                    >
                        Generar contraseña aleatoria
                    </Button>

                    {generada && (

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Copiá esta contraseña y comunicásela al usuario de forma segura.
                        </Typography>
                    )}

                    {error && (

                        <Typography
                            color="error"
                            variant="body2"
                        >
                            {error}
                        </Typography>
                    )}

                </Stack>

            </DialogContent>

            <DialogActions>

                <Button onClick={onClose}>
                    Cancelar
                </Button>

                <Button
                    variant="contained"
                    onClick={handleConfirmar}
                    disabled={loading || !password.trim()}
                >
                    Confirmar
                </Button>

            </DialogActions>

        </Dialog>
    );
}

export default ResetPasswordDialog;
