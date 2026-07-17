import {
    Alert,
    Box,
    Button,
    Chip,
    List,
    ListItem,
    ListItemText,
    Stack,
    Typography
} from "@mui/material";

import CelebrationIcon
from "@mui/icons-material/Celebration";

import AddIcon
from "@mui/icons-material/Add";

import type { Rele } from "../../../types/Rele";

interface Props {

    creando: boolean;
    error: string;
    creados: Rele[];
    onReiniciar: () => void;
    onTerminarCarga: () => void;
}

function PasoResultado({
    creando,
    error,
    creados,
    onReiniciar,
    onTerminarCarga
}: Props) {

    if (error) {

        return (

            <Stack spacing={2} sx={{ py: 4, alignItems: "center" }}>

                <Alert severity="error" sx={{ width: "100%" }}>
                    {error}
                </Alert>

                {
                    creados.length > 0 && (

                        <Alert severity="info" sx={{ width: "100%" }}>
                            Se alcanzaron a crear {creados.length} relé(s) antes
                            del error: {" "}
                            {creados.map((r) => r.numeroSerie).join(", ")}
                        </Alert>
                    )
                }

                <Stack direction="row" spacing={2}>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={onReiniciar}
                    >
                        Volver a intentar
                    </Button>

                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={onTerminarCarga}
                    >
                        Terminar carga
                    </Button>

                </Stack>

            </Stack>
        );
    }

    return (

        <Stack
            spacing={2}
            sx={{
                py: 6,
                px: 3,
                alignItems: "center",
                textAlign: "center",
                border: "1px solid",
                borderColor: "success.main",
                borderRadius: 3,
                bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                        ? "rgba(46, 125, 50, 0.12)"
                        : "rgba(46, 125, 50, 0.06)"
            }}
        >

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    bgcolor: "success.main",
                    color: "success.contrastText"
                }}
            >

                <CelebrationIcon sx={{ fontSize: 32 }} />

            </Box>

            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {
                    creando
                        ? "Creando relé(s)..."
                        : creados.length > 1
                            ? `${creados.length} relés registrados con éxito`
                            : "Relé registrado con éxito"
                }
            </Typography>

            {
                creados.length > 0 && (

                    <List dense sx={{ width: "100%", maxWidth: 420 }}>

                        {
                            creados.map((rele) => (

                                <ListItem key={rele.id}>

                                    <ListItemText
                                        primary={`${rele.marca} ${rele.modelo}`}
                                        secondary={rele.numeroSerie}
                                    />

                                    <Chip
                                        size="small"
                                        color="success"
                                        label={rele.estadoActual}
                                    />

                                </ListItem>
                            ))
                        }

                    </List>
                )
            }

            <Stack direction="row" spacing={2}>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    disabled={creando}
                    onClick={onReiniciar}
                >
                    Registrar otro relé
                </Button>

                <Button
                    variant="outlined"
                    color="inherit"
                    disabled={creando}
                    onClick={onTerminarCarga}
                >
                    Terminar carga
                </Button>

            </Stack>

        </Stack>
    );
}

export default PasoResultado;
