import { useState } from "react";

import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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

import AddIcon
from "@mui/icons-material/Add";

import ShieldOutlinedIcon
from "@mui/icons-material/ShieldOutlined";

import PlaceOutlinedIcon
from "@mui/icons-material/PlaceOutlined";

import type { Destino } from "../../../types/Destino";
import type { DestinoRequest } from "../../../types/DestinoRequest";
import type { Posicion } from "../../../types/Posicion";
import type { PosicionRequest } from "../../../types/PosicionRequest";
import type { Localidad } from "../../../types/Localidad";
import type { Estado } from "../../../types/Estado";

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
    localidades: Localidad[];
    onCrearDestino: (data: DestinoRequest) => Promise<Destino | null>;

    posiciones: Posicion[];
    posicionesLoading: boolean;
    posicionesError: string;
    posicionInicialId: number | undefined;
    onPosicionChange: (id: number | undefined) => void;
    onCrearPosicion: (data: PosicionRequest) => Promise<Posicion | null>;

    estadosIniciales: Estado[];
    estadoInicialId: number | undefined;
    onEstadoInicialChange: (id: number | undefined) => void;
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
    localidades,
    onCrearDestino,
    posiciones,
    posicionesLoading,
    posicionesError,
    posicionInicialId,
    onPosicionChange,
    onCrearPosicion,
    estadosIniciales,
    estadoInicialId,
    onEstadoInicialChange
}: Props) {

    const [openDestinoDialog, setOpenDestinoDialog] = useState(false);
    const [nuevoDestinoNombre, setNuevoDestinoNombre] = useState("");
    const [nuevoDestinoLocalidadId, setNuevoDestinoLocalidadId] =
        useState<number | "">("");
    const [creandoDestino, setCreandoDestino] = useState(false);
    const [errorDestino, setErrorDestino] = useState("");

    const [openPosicionDialog, setOpenPosicionDialog] = useState(false);
    const [nuevaPosicionNombre, setNuevaPosicionNombre] = useState("");
    const [creandoPosicion, setCreandoPosicion] = useState(false);
    const [errorPosicion, setErrorPosicion] = useState("");

    const cerrarDialogoDestino = () => {

        setOpenDestinoDialog(false);
        setNuevoDestinoNombre("");
        setNuevoDestinoLocalidadId("");
        setErrorDestino("");
    };

    const handleCrearDestino = async () => {

        setCreandoDestino(true);
        setErrorDestino("");

        try {

            await onCrearDestino({
                nombre: nuevoDestinoNombre.trim(),
                localidadId: Number(nuevoDestinoLocalidadId)
            });

            cerrarDialogoDestino();

        } catch {

            setErrorDestino("No se pudo crear el destino. Intente nuevamente.");

        } finally {

            setCreandoDestino(false);
        }
    };

    const cerrarDialogoPosicion = () => {

        setOpenPosicionDialog(false);
        setNuevaPosicionNombre("");
        setErrorPosicion("");
    };

    const handleCrearPosicion = async () => {

        if (!destinoSeleccionado) return;

        setCreandoPosicion(true);
        setErrorPosicion("");

        try {

            await onCrearPosicion({
                nombre: nuevaPosicionNombre.trim(),
                destinoId: destinoSeleccionado.id
            });

            cerrarDialogoPosicion();

        } catch {

            setErrorPosicion(
                "No se pudo crear la posición. Intente nuevamente."
            );

        } finally {

            setCreandoPosicion(false);
        }
    };

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

                        <Button
                            size="small"
                            startIcon={<AddIcon fontSize="small" />}
                            sx={{ mt: 0.5 }}
                            onClick={() => setOpenDestinoDialog(true)}
                        >
                            Nuevo destino
                        </Button>

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

                        <Button
                            size="small"
                            startIcon={<AddIcon fontSize="small" />}
                            sx={{ mt: 0.5 }}
                            disabled={!destinoSeleccionado}
                            onClick={() => setOpenPosicionDialog(true)}
                        >
                            Nueva posición
                        </Button>

                    </Grid>

                    <Grid size={12}>

                        <TextField
                            select
                            label="Estado inicial"
                            fullWidth
                            value={estadoInicialId ?? ""}
                            onChange={(e) =>
                                onEstadoInicialChange(
                                    e.target.value
                                        ? Number(e.target.value)
                                        : undefined
                                )
                            }
                        >

                            {
                                estadosIniciales.map((estado) => (

                                    <MenuItem
                                        key={estado.id}
                                        value={estado.id}
                                    >
                                        {estado.nombre}
                                    </MenuItem>
                                ))
                            }

                        </TextField>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mt: 0.5 }}
                        >
                            Por defecto "EN STOCK". Si el relé que estás
                            cargando ya está instalado o en servicio,
                            elegí ese estado para no dejarlo registrado
                            como si estuviera en depósito.
                        </Typography>

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

            <Dialog
                open={openDestinoDialog}
                onClose={cerrarDialogoDestino}
                maxWidth="sm"
                fullWidth
            >

                <DialogTitle>Nuevo destino</DialogTitle>

                <DialogContent>

                    <Stack spacing={2} sx={{ mt: 1 }}>

                        <TextField
                            label="Nombre"
                            fullWidth
                            value={nuevoDestinoNombre}
                            onChange={(e) =>
                                setNuevoDestinoNombre(e.target.value)
                            }
                        />

                        <TextField
                            select
                            label="Localidad"
                            fullWidth
                            value={nuevoDestinoLocalidadId}
                            onChange={(e) =>
                                setNuevoDestinoLocalidadId(
                                    e.target.value ? Number(e.target.value) : ""
                                )
                            }
                        >

                            {
                                localidades.map((localidad) => (

                                    <MenuItem
                                        key={localidad.id}
                                        value={localidad.id}
                                    >
                                        {localidad.nombre} - {localidad.provincia}
                                    </MenuItem>
                                ))
                            }

                        </TextField>

                        {
                            errorDestino && (
                                <Alert severity="error">{errorDestino}</Alert>
                            )
                        }

                    </Stack>

                </DialogContent>

                <DialogActions>

                    <Button onClick={cerrarDialogoDestino}>
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        disabled={
                            creandoDestino
                            ||
                            !nuevoDestinoNombre.trim()
                            ||
                            !nuevoDestinoLocalidadId
                        }
                        onClick={handleCrearDestino}
                    >
                        {creandoDestino ? "Creando..." : "Crear"}
                    </Button>

                </DialogActions>

            </Dialog>

            <Dialog
                open={openPosicionDialog}
                onClose={cerrarDialogoPosicion}
                maxWidth="sm"
                fullWidth
            >

                <DialogTitle>
                    Nueva posición
                    {
                        destinoSeleccionado
                            ? ` en ${destinoSeleccionado.nombre}`
                            : ""
                    }
                </DialogTitle>

                <DialogContent>

                    <Stack spacing={2} sx={{ mt: 1 }}>

                        <TextField
                            label="Nombre"
                            fullWidth
                            value={nuevaPosicionNombre}
                            onChange={(e) =>
                                setNuevaPosicionNombre(e.target.value)
                            }
                        />

                        {
                            errorPosicion && (
                                <Alert severity="error">{errorPosicion}</Alert>
                            )
                        }

                    </Stack>

                </DialogContent>

                <DialogActions>

                    <Button onClick={cerrarDialogoPosicion}>
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        disabled={
                            creandoPosicion || !nuevaPosicionNombre.trim()
                        }
                        onClick={handleCrearPosicion}
                    >
                        {creandoPosicion ? "Creando..." : "Crear"}
                    </Button>

                </DialogActions>

            </Dialog>

        </Stack>
    );
}

export default PasoDatosLote;
