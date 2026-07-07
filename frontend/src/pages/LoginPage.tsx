import { useState } from "react";

import {
    Alert,
    Box,
    Button,
    Paper,
    TextField,
    Typography
} from "@mui/material";

import {
    Navigate,
    useLocation,
    useNavigate
} from "react-router-dom";

import axios from "axios";

import epecLogo
from "../assets/epec-logo.png";

import { useAuth } from "../context/AuthContext";

function LoginPage() {

    const { token, login } =
        useAuth();

    const navigate =
        useNavigate();

    const location =
        useLocation();

    const [identificador, setIdentificador] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [cargando, setCargando] =
        useState(false);

    if (token) {

        const destino =
            (location.state as { from?: string })
                ?.from
            || "/";

        return (
            <Navigate
                to={destino}
                replace
            />
        );
    }

    const handleSubmit =
        async (event: React.FormEvent) => {

        event.preventDefault();

        setError("");
        setCargando(true);

        try {

            await login({
                identificador,
                password
            });

            navigate("/", { replace: true });

        } catch (err) {

            if (
                axios.isAxiosError(err)
            ) {

                setError(
                    err.response?.data?.message
                    || "No se pudo iniciar sesión"
                );

            } else {

                setError(
                    "No se pudo iniciar sesión"
                );
            }

        } finally {

            setCargando(false);
        }
    };

    return (

        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "background.default",
                p: 2
            }}
        >

            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    width: "100%",
                    maxWidth: 400
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                        mb: 3
                    }}
                >

                    <Box
                        component="img"
                        src={epecLogo}
                        alt="EPEC"
                        sx={{ height: 56 }}
                    />

                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 700 }}
                    >
                        EPEC Transmisión
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: "center" }}
                    >
                        Trazabilidad de relés de protección
                    </Typography>

                </Box>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2
                    }}
                >

                    <TextField
                        label="Email o Nº de legajo"
                        type="text"
                        value={identificador}
                        onChange={(e) =>
                            setIdentificador(e.target.value)
                        }
                        required
                        fullWidth
                        autoFocus
                    />

                    <TextField
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                        fullWidth
                    />

                    {error && (

                        <Alert severity="error">
                            {error}
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={cargando}
                        fullWidth
                    >
                        Iniciar sesión
                    </Button>

                </Box>

            </Paper>

        </Box>
    );
}

export default LoginPage;
