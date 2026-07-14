import { useEffect, useState } from "react";

import type {
    MovimientoRequest
} from "../../types/MovimientoRequest";

import type {
    Estado
} from "../../types/Estado";

import type {
    Posicion
} from "../../types/Posicion";

import type {
    Destino
} from "../../types/Destino";

import type {
    Rele
} from "../../types/Rele";

import type {
    ReleOption
} from "../../types/ReleOption";

import {

    obtenerEstadosPermitidos

} from "../../services/estadoService";

import {
    obtenerPosicionesPorDestino
} from "../../services/posicionService";

import {
    obtenerDestinos
} from "../../services/destinoService";

import {

    obtenerOpciones,

    obtenerRelePorId

} from "../../services/releService";

import {

    Alert,
    Autocomplete,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Stack,
    TextField,
    Typography

} from "@mui/material";

interface Props {

    onCreate: (
        data: MovimientoRequest
    ) => Promise<void>;

    releIdPreseleccionado?: number;
}

function MovimientoForm({
    onCreate,
    releIdPreseleccionado
}: Props) {

    const [loading, setLoading] =
        useState(false);

    const [successOpen, setSuccessOpen] =
        useState(false);

    const [errorOpen, setErrorOpen] =
        useState(false);

    const [reles, setReles] =
        useState<ReleOption[]>([]);

    const [
        releSeleccionado,
        setReleSeleccionado
    ] =
        useState<Rele | null>(null);

    const [estados, setEstados] =
        useState<Estado[]>([]);

    const [destinos, setDestinos] =
        useState<Destino[]>([]);

    const [
        destinoSeleccionado,
        setDestinoSeleccionado
    ] =
        useState<Destino | null>(null);

    const [posiciones, setPosiciones] =
        useState<Posicion[]>([]);

    const [posicionesLoading, setPosicionesLoading] =
        useState(false);

    const [catalogosError, setCatalogosError] =
        useState(false);

    const [formData, setFormData] =
        useState<MovimientoRequest>({
            releId: 0,
            estadoId: 0,
            posicionId: 0,
            notas: ""
        });

    const [confirmBajaOpen, setConfirmBajaOpen] =
        useState(false);

    const estadoSeleccionado =
        estados.find(
            (estado) =>
                estado.id === formData.estadoId
        );

    const esBaja =
        estadoSeleccionado?.nombre
            ?.toUpperCase() === "BAJA";

    useEffect(() => {

        cargarCatalogos();

    }, []);

    const cargarCatalogos =
        async () => {

        try {

            const [
                relesData,
                destinosData
            ] =
                await Promise.all([
                    obtenerOpciones(),
                    obtenerDestinos()
                ]);

            setReles(relesData);

            setDestinos(
                [...destinosData].sort(
                    (a, b) =>
                        a.provincia.localeCompare(
                            b.provincia
                        )
                        ||
                        a.nombre.localeCompare(
                            b.nombre
                        )
                )
            );

            setCatalogosError(false);

        } catch (error) {

            console.error(error);

            setCatalogosError(true);
        }
    };

    const handleSeleccionDestino =
    async (
        destino: Destino | null
    ) => {

        setDestinoSeleccionado(
            destino
        );

        setFormData({

            ...formData,

            posicionId: 0
        });

        if (!destino) {

            setPosiciones([]);

            return;
        }

        try {

            setPosicionesLoading(true);

            const posicionesData =
                await obtenerPosicionesPorDestino(
                    destino.id
                );

            setPosiciones(
                [...posicionesData].sort(
                    (a, b) =>
                        a.nombre.localeCompare(
                            b.nombre
                        )
                )
            );

        } catch (error) {

            console.error(error);

            setPosiciones([]);

        } finally {

            setPosicionesLoading(false);
        }
    };

    const handleChange = (
        e: any
    ) => {

        const { name, value } =
            e.target;

        setFormData({

            ...formData,

            [name]:

                name === "notas"
                    ? value
                    : Number(value)
        });
    };

    const handleSeleccionRele =
    async (
        value: ReleOption | null
    ) => {

        setFormData({

            ...formData,

            releId:
                value
                    ? value.id
                    : 0,

            estadoId: 0
        });

        if (!value) {

            setReleSeleccionado(null);

            setEstados([]);

            return;
        }

        try {

            const rele =
                await obtenerRelePorId(
                    value.id
                );

            setReleSeleccionado(
                rele
            );

            const estadosPermitidos =
                await obtenerEstadosPermitidos(
                    value.id
                );

            setEstados(
                estadosPermitidos
            );

        } catch (error) {

            console.error(error);
        }
    };

    useEffect(() => {

        if (!releIdPreseleccionado) return;

        if (formData.releId === releIdPreseleccionado) return;

        const opcion =
            reles.find(
                (r) => r.id === releIdPreseleccionado
            );

        if (opcion) {

            handleSeleccionRele(opcion);
        }

    }, [reles, releIdPreseleccionado]);

    const ejecutarMovimiento = async () => {

        try {

            setLoading(true);

            await onCreate(formData);

            setSuccessOpen(true);

            setFormData({
                releId: 0,
                estadoId: 0,
                posicionId: 0,
                notas: ""
            });

            setReleSeleccionado(null);

            setEstados([]);

            setDestinoSeleccionado(null);

            setPosiciones([]);

        } catch (error) {

            console.error(error);

            setErrorOpen(true);

        } finally {

            setLoading(false);
        }
    };

    const handleSubmit = (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (esBaja) {

            setConfirmBajaOpen(true);

            return;
        }

        ejecutarMovimiento();
    };

    const handleConfirmarBaja = () => {

        setConfirmBajaOpen(false);

        ejecutarMovimiento();
    };

    return (

        <>

            <Snackbar
                open={successOpen}
                autoHideDuration={3000}
                onClose={() =>
                    setSuccessOpen(false)
                }
            >

                <Alert severity="success">

                    Movimiento creado

                </Alert>

            </Snackbar>

            <Snackbar
                open={errorOpen}
                autoHideDuration={3000}
                onClose={() =>
                    setErrorOpen(false)
                }
            >

                <Alert severity="error">

                    Error al crear movimiento

                </Alert>

            </Snackbar>

            <Paper
                elevation={3}
                sx={{
                    padding: 3,
                    marginBottom: 4
                }}
            >

                <Typography
                    variant="h6"
                    gutterBottom
                >
                    Crear Movimiento
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >

                    <Stack spacing={2}>

                        {
                            catalogosError && (

                                <Alert severity="error">

                                    No se pudieron cargar los relés o
                                    destinos. Recargá la página para
                                    reintentar.

                                </Alert>
                            )
                        }

                        <Autocomplete

                            options={reles}

                            getOptionLabel={(option) =>

                                `${option.numeroSerie} | ${option.marca} | ${option.modelo}`
                            }

                            value={
                                reles.find(
                                    (r) =>
                                        r.id === formData.releId
                                ) || null
                            }

                            onChange={(_, value) =>
                                handleSeleccionRele(
                                    value
                                )
                            }

                            renderInput={(params) => (

                                <TextField
                                    {...params}
                                    label="Relé"
                                />
                            )}

                            renderOption={(props, option) => (

                                <Box
                                    component="li"
                                    {...props}
                                >

                                    <Stack>

                                        <Typography
                                            sx={{ fontWeight: 600 }}
                                        >

                                            {option.numeroSerie}

                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >

                                            {
                                                `${option.marca} | ${option.modelo}`
                                            }

                                        </Typography>

                                    </Stack>

                                </Box>
                            )}
                        />

                        {
                            releSeleccionado && (

                                <Paper
                                    variant="outlined"
                                    sx={{
                                        padding: 2,
                                        backgroundColor:
                                            "action.hover"
                                    }}
                                >

                                    <Typography
                                        variant="subtitle1"
                                        gutterBottom
                                        sx={{ fontWeight: 600 }}
                                    >
                                        Estado Operacional Actual
                                    </Typography>

                                    <Divider
                                        sx={{ mb: 2 }}
                                    />

                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        useFlexGap
                                        sx={{ flexWrap: "wrap" }}
                                    >

                                        <Chip
                                            label={
                                                `Estado: ${releSeleccionado.estadoActual}`
                                            }
                                            color="primary"
                                        />

                                        <Chip
                                            label={
                                                `Posición: ${releSeleccionado.posicionActual}`
                                            }
                                            color="secondary"
                                        />

                                        <Chip
                                            label={
                                                `Destino: ${releSeleccionado.localidadActual}`
                                            }
                                            color="info"
                                        />

                                        <Chip
                                            label={
                                                `Garantía: ${releSeleccionado.estadoGarantia}`
                                            }
                                            color={
                                                releSeleccionado.estadoGarantia === "VIGENTE"
                                                    ? "success"
                                                    : releSeleccionado.estadoGarantia === "POR VENCER"
                                                        ? "warning"
                                                        : "error"
                                            }
                                        />

                                    </Stack>

                                    <Stack
                                        spacing={1}
                                        sx={{ mt: 2 }}
                                    >

                                        <Typography
                                            variant="body2"
                                        >

                                            <strong>Marca:</strong>
                                            {" "}
                                            {
                                                releSeleccionado.marca
                                            }

                                        </Typography>

                                        <Typography
                                            variant="body2"
                                        >

                                            <strong>Modelo:</strong>
                                            {" "}
                                            {
                                                releSeleccionado.modelo
                                            }

                                        </Typography>

                                    </Stack>

                                </Paper>
                            )
                        }

                        <FormControl fullWidth>

                            <InputLabel>
                                Estado
                            </InputLabel>

                            <Select
                                name="estadoId"
                                value={formData.estadoId}
                                label="Estado"
                                onChange={handleChange}
                                disabled={!formData.releId}
                            >

                                {estados.map(
                                    (estado) => (

                                    <MenuItem
                                        key={estado.id}
                                        value={estado.id}
                                        sx={{
                                            color:
                                                estado.nombre.toUpperCase() === "BAJA"
                                                    ? "error.main"
                                                    : undefined
                                        }}
                                    >

                                        {
                                            estado.nombre
                                        }

                                    </MenuItem>
                                ))}

                            </Select>

                        </FormControl>

                        <Autocomplete

                            options={destinos}

                            groupBy={(option) =>
                                option.provincia
                            }

                            getOptionLabel={(option) =>

                                `${option.nombre} (${option.localidad})`
                            }

                            value={destinoSeleccionado}

                            onChange={(_, value) =>
                                handleSeleccionDestino(
                                    value
                                )
                            }

                            renderInput={(params) => (

                                <TextField
                                    {...params}
                                    label="Destino"
                                />
                            )}
                        />

                        <FormControl fullWidth>

                            <InputLabel>
                                Posición
                            </InputLabel>

                            <Select
                                name="posicionId"
                                value={
                                    formData.posicionId
                                }
                                label="Posición"
                                onChange={handleChange}
                                disabled={
                                    !destinoSeleccionado
                                    ||
                                    posicionesLoading
                                }
                            >

                                {posiciones.map(
                                    (posicion) => (

                                    <MenuItem
                                        key={posicion.id}
                                        value={posicion.id}
                                    >

                                        {
                                            posicion.nombre
                                        }

                                    </MenuItem>
                                ))}

                            </Select>

                            {
                                !destinoSeleccionado && (

                                    <FormHelperText>

                                        Elegí un destino para ver
                                        sus posiciones disponibles

                                    </FormHelperText>
                                )
                            }

                            {
                                destinoSeleccionado
                                &&
                                posicionesLoading && (

                                    <FormHelperText>

                                        Cargando posiciones...

                                    </FormHelperText>
                                )
                            }

                            {
                                destinoSeleccionado
                                &&
                                !posicionesLoading
                                &&
                                posiciones.length === 0 && (

                                    <FormHelperText error>

                                        Este destino no tiene
                                        posiciones cargadas

                                    </FormHelperText>
                                )
                            }

                        </FormControl>

                        <TextField
                            label="Notas operativas"
                            name="notas"
                            value={formData.notas}
                            onChange={handleChange}
                            multiline
                            rows={3}
                            fullWidth
                        />

                        <Button
                            variant="contained"
                            type="submit"
                            disabled={
                                loading
                                ||
                                !formData.releId
                                ||
                                !formData.estadoId
                                ||
                                !formData.posicionId
                            }
                        >

                            {loading ? (

                                <CircularProgress
                                    size={24}
                                    color="inherit"
                                />

                            ) : (

                                "Crear Movimiento"
                            )}

                        </Button>

                    </Stack>

                </Box>

            </Paper>

            <Dialog
                open={confirmBajaOpen}
                onClose={() =>
                    setConfirmBajaOpen(false)
                }
            >

                <DialogTitle>

                    Confirmar baja de relé

                </DialogTitle>

                <DialogContent>

                    <DialogContentText>

                        Está a punto de dar de baja al relé
                        {" "}
                        <strong>
                            {releSeleccionado?.numeroSerie}
                        </strong>
                        . Esta acción es terminal: el relé
                        quedará inactivo y no podrá registrar
                        más movimientos. ¿Confirma la baja?

                    </DialogContentText>

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={() =>
                            setConfirmBajaOpen(false)
                        }
                    >

                        CANCELAR

                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleConfirmarBaja}
                    >

                        SÍ, DAR DE BAJA

                    </Button>

                </DialogActions>

            </Dialog>

        </>
    );
}

export default MovimientoForm;