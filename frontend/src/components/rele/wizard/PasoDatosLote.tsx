import {
    Alert,
    Autocomplete,
    Box,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    Grid,
    MenuItem,
    Paper,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";

import ShieldOutlinedIcon
from "@mui/icons-material/ShieldOutlined";

import PlaceOutlinedIcon
from "@mui/icons-material/PlaceOutlined";

import type { Destino } from "../../../types/Destino";
import type { Posicion } from "../../../types/Posicion";

interface Props {

    cargarGarantia: boolean;
    onCargarGarantiaChange: (valor: boolean) => void;

    garantiaMeses: number | null;
    onGarantiaMesesChange: (valor: number | null) => void;

    usarFechaActual: boolean;
    onUsarFechaActualChange: (valor: boolean) => void;

    inicioGarantia: string | null;
    onInicioGarantiaChange: (valor: string | null) => void;

    destinos: Destino[];
    destinoSeleccionado: Destino | null;
    onDestinoChange: (destino: Destino | null) => void;

    posiciones: Posicion[];
    posicionesLoading: boolean;
    posicionesError: string;
    posicionInicialId: number | undefined;
    onPosicionChange: (id: number | undefined) => void;
}

function PasoDatosLote({
    cargarGarantia,
    onCargarGarantiaChange,
    garantiaMeses,
    onGarantiaMesesChange,
    usarFechaActual,
    onUsarFechaActualChange,
    inicioGarantia,
    onInicioGarantiaChange,
    destinos,
    destinoSeleccionado,
    onDestinoChange,
    posiciones,
    posicionesLoading,
    posicionesError,
    posicionInicialId,
    onPosicionChange
}: Props) {

    return (

        <Stack spacing={3}>

            <Paper
                variant="outlined"
                sx={{ p: 3, borderRadius: 3 }}
            >

                <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mb: 2, alignItems: "center" }}
                >

                    <ShieldOutlinedIcon color="primary" fontSize="small" />

                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600 }}
                    >
                        Garantía
                    </Typography>

                </Stack>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={cargarGarantia}
                            onChange={(e) =>
                                onCargarGarantiaChange(e.target.checked)
                            }
                        />
                    }
                    label="Cargar garantía"
                />

                {
                    cargarGarantia && (

                        <Grid container spacing={2} sx={{ mt: 0.5 }}>

                            <Grid size={{ xs: 12, sm: 4 }}>

                                <TextField
                                    label="Duración (meses)"
                                    type="number"
                                    fullWidth
                                    value={garantiaMeses ?? ""}
                                    onChange={(e) =>
                                        onGarantiaMesesChange(
                                            e.target.value
                                                ? Number(e.target.value)
                                                : null
                                        )
                                    }
                                />

                            </Grid>

                            <Grid size={{ xs: 12, sm: 4 }}>

                                <ToggleButtonGroup
                                    value={usarFechaActual ? "actual" : "manual"}
                                    exclusive
                                    fullWidth
                                    size="small"
                                    onChange={(_, valor) => {

                                        if (valor) {
                                            onUsarFechaActualChange(valor === "actual");
                                        }
                                    }}
                                >

                                    <ToggleButton value="actual">
                                        Fecha actual
                                    </ToggleButton>

                                    <ToggleButton value="manual">
                                        Fecha manual
                                    </ToggleButton>

                                </ToggleButtonGroup>

                            </Grid>

                            {
                                !usarFechaActual && (

                                    <Grid size={{ xs: 12, sm: 4 }}>

                                        <TextField
                                            label="Inicio de garantía"
                                            type="date"
                                            fullWidth
                                            slotProps={{
                                                inputLabel: { shrink: true }
                                            }}
                                            value={inicioGarantia ?? ""}
                                            onChange={(e) =>
                                                onInicioGarantiaChange(
                                                    e.target.value || null
                                                )
                                            }
                                        />

                                    </Grid>
                                )
                            }

                        </Grid>
                    )
                }

            </Paper>

            <Paper
                variant="outlined"
                sx={{ p: 3, borderRadius: 3 }}
            >

                <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mb: 2, alignItems: "center" }}
                >

                    <PlaceOutlinedIcon color="primary" fontSize="small" />

                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600 }}
                    >
                        Posición inicial
                    </Typography>

                </Stack>

                <Grid container spacing={2}>

                    <Grid size={{ xs: 12, sm: 6 }}>

                        <Autocomplete
                            options={destinos}
                            getOptionLabel={(destino) => destino.nombre}
                            isOptionEqualToValue={(a, b) => a.id === b.id}
                            value={destinoSeleccionado}
                            onChange={(_, destino) => onDestinoChange(destino)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Destino"
                                />
                            )}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>

                        <TextField
                            select
                            label="Posición"
                            fullWidth
                            value={posicionInicialId ?? ""}
                            disabled={!destinoSeleccionado || posicionesLoading}
                            onChange={(e) =>
                                onPosicionChange(
                                    e.target.value
                                        ? Number(e.target.value)
                                        : undefined
                                )
                            }
                        >

                            {
                                posiciones.map((posicion) => (

                                    <MenuItem
                                        key={posicion.id}
                                        value={posicion.id}
                                    >
                                        {posicion.nombre}
                                    </MenuItem>
                                ))
                            }

                        </TextField>

                    </Grid>

                </Grid>

                {
                    !destinoSeleccionado && (

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mt: 1 }}
                        >
                            Elegí un destino para ver sus posiciones disponibles.
                        </Typography>
                    )
                }

                {
                    posicionesLoading && (

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>

                            <CircularProgress size={16} />

                            <Typography variant="caption" color="text.secondary">
                                Cargando posiciones...
                            </Typography>

                        </Box>
                    )
                }

                {
                    posicionesError && (

                        <Alert severity="error" sx={{ mt: 1 }}>
                            {posicionesError}
                        </Alert>
                    )
                }

            </Paper>

        </Stack>
    );
}

export default PasoDatosLote;
