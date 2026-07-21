import type { ChipProps } from "@mui/material";

import {
    Alert,
    Box,
    Button,
    Chip,
    Collapse,
    Paper,
    Stack,
    Typography
} from "@mui/material";

import WarningAmberIcon
from "@mui/icons-material/WarningAmber";

import type { RegistroSimilar }
from "../../types/RegistroSimilar";

interface Props {

    registros: RegistroSimilar[];

    // Nombre plural del catalogo para el texto de la alerta,
    // ej. "destinos", "posiciones", "modelos". Minuscula.
    etiquetaEntidad: string;

    onSeleccionar: (registro: RegistroSimilar) => void;

    onCrearIgualmente: () => void;
}

function colorPorSimilitud(similitud: number): ChipProps["color"] {

    if (similitud >= 95) {

        return "error";
    }

    if (similitud >= 90) {

        return "warning";
    }

    return "default";
}

// Advertencia reutilizable de "posibles duplicados": no bloquea nada,
// solo informa. Cualquier formulario de alta de un catalogo con
// nombre libre (Destino, Posicion, Localidad, Marca, Modelo,
// Proveedor...) puede reutilizarla pasandole los resultados de su
// propio endpoint "/similares" ya mapeados a RegistroSimilar.
function RegistrosSimilaresAlert({
    registros,
    etiquetaEntidad,
    onSeleccionar,
    onCrearIgualmente
}: Props) {

    return (

        <Collapse
            in={registros.length > 0}
            unmountOnExit
        >

            <Alert
                severity="warning"
                icon={<WarningAmberIcon />}
                variant="outlined"
                sx={{
                    mt: 2,
                    borderRadius: 2,
                    alignItems: "flex-start",
                    "& .MuiAlert-message": { width: "100%" }
                }}
            >

                <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700 }}
                >
                    Se encontraron {etiquetaEntidad} similares
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1.5 }}
                >
                    Puede que el registro ya exista en el sistema.
                    Revisá antes de continuar.
                </Typography>

                <Stack spacing={1}>

                    {registros.map((registro) => (

                        <Paper
                            key={registro.id}
                            variant="outlined"
                            sx={{
                                p: 1.5,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1.5,
                                transition:
                                    "background-color 0.15s ease, border-color 0.15s ease",
                                "&:hover": {
                                    bgcolor: "action.hover",
                                    borderColor: "warning.main"
                                }
                            }}
                        >

                            <Box sx={{ minWidth: 0 }}>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{ alignItems: "center" }}
                                >

                                    <Typography
                                        variant="body2"
                                        sx={{ fontWeight: 600 }}
                                        noWrap
                                    >
                                        {registro.nombre}
                                    </Typography>

                                    <Chip
                                        size="small"
                                        color={colorPorSimilitud(registro.similitud)}
                                        label={`${registro.similitud}% similar`}
                                        sx={{ fontWeight: 600 }}
                                    />

                                </Stack>

                                {registro.descripcion && (

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ display: "block" }}
                                        noWrap
                                    >
                                        {registro.descripcion}
                                    </Typography>
                                )}

                                {registro.detalle && (

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ display: "block" }}
                                    >
                                        {registro.detalle}
                                    </Typography>
                                )}

                            </Box>

                            <Button
                                size="small"
                                variant="outlined"
                                color="warning"
                                sx={{ flexShrink: 0, whiteSpace: "nowrap" }}
                                onClick={() => onSeleccionar(registro)}
                            >
                                Usar este registro
                            </Button>

                        </Paper>
                    ))}

                </Stack>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 1.5
                    }}
                >

                    <Button
                        size="small"
                        color="inherit"
                        onClick={onCrearIgualmente}
                    >
                        Crear igualmente
                    </Button>

                </Box>

            </Alert>

        </Collapse>
    );
}

export default RegistrosSimilaresAlert;
