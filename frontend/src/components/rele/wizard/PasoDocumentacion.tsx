import { useState } from "react";

import {
    Alert,
    Box,
    Button,
    Grid,
    LinearProgress,
    MenuItem,
    Paper,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";

import LocalShippingIcon
from "@mui/icons-material/LocalShipping";

import DescriptionIcon
from "@mui/icons-material/Description";

import AutoAwesomeIcon
from "@mui/icons-material/AutoAwesome";

import ArrowForwardIcon
from "@mui/icons-material/ArrowForward";

import type { Proveedor } from "../../../types/Proveedor";
import type { Remito } from "../../../types/Remito";
import type { OrdenProvision } from "../../../types/OrdenProvision";

import { crearRemito, subirArchivoRemito } from "../../../services/remitoService";
import { crearOrdenProvision, subirArchivoOP } from "../../../services/ordenProvisionService";
import { extraerMensajeError } from "../../../utils/errorUtils";

import SelectorArchivoAdjunto
from "../../common/SelectorArchivoAdjunto";

type ModoDocumento = "ninguno" | "nuevo" | "existente";

interface Props {

    proveedores: Proveedor[];
    remitosDisponibles: Remito[];
    opDisponibles: OrdenProvision[];

    remitoId: number | null;
    onRemitoIdChange: (id: number | null) => void;

    ordenProvisionId: number | null;
    onOrdenProvisionIdChange: (id: number | null) => void;

    onDocumentosActualizados: () => Promise<void>;

    archivoIA: File | null;
    analizando: boolean;
    errorIA: string;
    onArchivoIASeleccionado: (archivo: File) => void;

    onContinuar: () => void;
    continuarDeshabilitado?: boolean;
    textoContinuar?: string;
    continuando?: boolean;
}

function PasoDocumentacion({
    proveedores,
    remitosDisponibles,
    opDisponibles,
    remitoId,
    onRemitoIdChange,
    ordenProvisionId,
    onOrdenProvisionIdChange,
    onDocumentosActualizados,
    archivoIA,
    analizando,
    errorIA,
    onArchivoIASeleccionado,
    onContinuar,
    continuarDeshabilitado,
    textoContinuar,
    continuando
}: Props) {

    const [modoRemito, setModoRemito] = useState<ModoDocumento>("ninguno");
    const [numeroRemito, setNumeroRemito] = useState("");
    const [proveedorId, setProveedorId] = useState<number | "">("");
    const [fechaRemito, setFechaRemito] = useState(
        () => new Date().toISOString().split("T")[0]
    );
    const [archivoRemito, setArchivoRemito] = useState<File | null>(null);
    const [creandoRemito, setCreandoRemito] = useState(false);
    const [errorRemito, setErrorRemito] = useState("");

    const [modoOP, setModoOP] = useState<ModoDocumento>("ninguno");
    const [numeroOP, setNumeroOP] = useState("");
    const [archivoOP, setArchivoOP] = useState<File | null>(null);
    const [creandoOP, setCreandoOP] = useState(false);
    const [errorOP, setErrorOP] = useState("");

    const handleCrearRemito = async () => {

        setCreandoRemito(true);
        setErrorRemito("");

        try {

            const nuevo = await crearRemito({
                numeroRemito,
                proveedorId: Number(proveedorId),
                fecha: fechaRemito
            });

            if (archivoRemito) {

                try {
                    await subirArchivoRemito(nuevo.id, archivoRemito);
                } catch {
                    setErrorRemito(
                        "El remito se creó, pero no se pudo adjuntar el archivo."
                    );
                }
            }

            await onDocumentosActualizados();

            onRemitoIdChange(nuevo.id);
            setNumeroRemito("");
            setProveedorId("");
            setFechaRemito(new Date().toISOString().split("T")[0]);
            setArchivoRemito(null);

        } catch (err) {

            setErrorRemito(
                extraerMensajeError(err, "No se pudo crear el remito.")
            );

        } finally {

            setCreandoRemito(false);
        }
    };

    const handleCrearOP = async () => {

        setCreandoOP(true);
        setErrorOP("");

        try {

            const nueva = await crearOrdenProvision({
                numero: numeroOP,
                observaciones: ""
            });

            if (archivoOP) {

                try {
                    await subirArchivoOP(nueva.id, archivoOP);
                } catch {
                    setErrorOP(
                        "La orden se creó, pero no se pudo adjuntar el archivo."
                    );
                }
            }

            await onDocumentosActualizados();

            onOrdenProvisionIdChange(nueva.id);
            setNumeroOP("");
            setArchivoOP(null);

        } catch (err) {

            setErrorOP(
                extraerMensajeError(err, "No se pudo crear la orden de provisión.")
            );

        } finally {

            setCreandoOP(false);
        }
    };

    return (

        <Stack spacing={3}>

            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>

                <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mb: 2, alignItems: "center" }}
                >

                    <LocalShippingIcon color="primary" fontSize="small" />

                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Remito
                    </Typography>

                </Stack>

                <ToggleButtonGroup
                    value={modoRemito}
                    exclusive
                    size="small"
                    onChange={(_, valor) => {

                        if (valor) {
                            setModoRemito(valor);
                        }

                        if (valor === "ninguno") {
                            onRemitoIdChange(null);
                        }
                    }}
                >

                    <ToggleButton value="ninguno">Sin remito</ToggleButton>
                    <ToggleButton value="existente">Vincular existente</ToggleButton>
                    <ToggleButton value="nuevo">Crear nuevo</ToggleButton>

                </ToggleButtonGroup>

                {
                    modoRemito === "existente" && (

                        <TextField
                            select
                            label="Seleccionar remito"
                            fullWidth
                            sx={{ mt: 2 }}
                            value={remitoId ?? ""}
                            onChange={(e) =>
                                onRemitoIdChange(
                                    e.target.value ? Number(e.target.value) : null
                                )
                            }
                        >

                            {
                                remitosDisponibles.map((remito) => (

                                    <MenuItem key={remito.id} value={remito.id}>
                                        {remito.numeroRemito}
                                    </MenuItem>
                                ))
                            }

                        </TextField>
                    )
                }

                {
                    modoRemito === "nuevo" && (

                        <Grid container spacing={2} sx={{ mt: 0.5 }}>

                            <Grid size={{ xs: 12, sm: 6 }}>

                                <TextField
                                    label="Número de remito"
                                    fullWidth
                                    value={numeroRemito}
                                    onChange={(e) => setNumeroRemito(e.target.value)}
                                />

                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>

                                <TextField
                                    select
                                    label="Proveedor"
                                    fullWidth
                                    value={proveedorId}
                                    onChange={(e) =>
                                        setProveedorId(
                                            e.target.value ? Number(e.target.value) : ""
                                        )
                                    }
                                >

                                    {
                                        proveedores.map((proveedor) => (

                                            <MenuItem key={proveedor.id} value={proveedor.id}>
                                                {proveedor.nombre}
                                            </MenuItem>
                                        ))
                                    }

                                </TextField>

                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>

                                <TextField
                                    type="date"
                                    label="Fecha"
                                    fullWidth
                                    slotProps={{
                                        inputLabel: { shrink: true }
                                    }}
                                    value={fechaRemito}
                                    onChange={(e) => setFechaRemito(e.target.value)}
                                />

                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>

                                <SelectorArchivoAdjunto
                                    label="Adjuntar PDF o foto (opcional)"
                                    labelSeleccionado={archivoRemito?.name ?? "Archivo listo"}
                                    value={archivoRemito}
                                    onChange={setArchivoRemito}
                                />

                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{ height: "100%" }}
                                    disabled={
                                        creandoRemito
                                        ||
                                        !numeroRemito.trim()
                                        ||
                                        !proveedorId
                                        ||
                                        !fechaRemito
                                    }
                                    onClick={handleCrearRemito}
                                >

                                    {
                                        creandoRemito
                                            ? "Guardando..."
                                            : remitoId
                                                ? "Remito vinculado ✓"
                                                : "Guardar remito"
                                    }

                                </Button>

                            </Grid>

                        </Grid>
                    )
                }

                {
                    errorRemito && (
                        <Alert severity="error" sx={{ mt: 2 }}>{errorRemito}</Alert>
                    )
                }

            </Paper>

            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>

                <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mb: 2, alignItems: "center" }}
                >

                    <DescriptionIcon color="primary" fontSize="small" />

                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Orden de provisión
                    </Typography>

                </Stack>

                <ToggleButtonGroup
                    value={modoOP}
                    exclusive
                    size="small"
                    onChange={(_, valor) => {

                        if (valor) {
                            setModoOP(valor);
                        }

                        if (valor === "ninguno") {
                            onOrdenProvisionIdChange(null);
                        }
                    }}
                >

                    <ToggleButton value="ninguno">Sin orden</ToggleButton>
                    <ToggleButton value="existente">Vincular existente</ToggleButton>
                    <ToggleButton value="nuevo">Crear nueva</ToggleButton>

                </ToggleButtonGroup>

                {
                    modoOP === "existente" && (

                        <TextField
                            select
                            label="Seleccionar orden de provisión"
                            fullWidth
                            sx={{ mt: 2 }}
                            value={ordenProvisionId ?? ""}
                            onChange={(e) =>
                                onOrdenProvisionIdChange(
                                    e.target.value ? Number(e.target.value) : null
                                )
                            }
                        >

                            {
                                opDisponibles.map((op) => (

                                    <MenuItem key={op.id} value={op.id}>
                                        {op.numero}
                                    </MenuItem>
                                ))
                            }

                        </TextField>
                    )
                }

                {
                    modoOP === "nuevo" && (

                        <Grid container spacing={2} sx={{ mt: 0.5 }}>

                            <Grid size={{ xs: 12, sm: 6 }}>

                                <TextField
                                    label="Número de orden"
                                    fullWidth
                                    value={numeroOP}
                                    onChange={(e) => setNumeroOP(e.target.value)}
                                />

                            </Grid>

                            <Grid size={{ xs: 12, sm: 3 }}>

                                <SelectorArchivoAdjunto
                                    label="Adjuntar PDF o foto (opcional)"
                                    labelSeleccionado={archivoOP?.name ?? "Archivo listo"}
                                    value={archivoOP}
                                    onChange={setArchivoOP}
                                />

                            </Grid>

                            <Grid size={{ xs: 12, sm: 3 }}>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{ height: "100%" }}
                                    disabled={creandoOP || !numeroOP.trim()}
                                    onClick={handleCrearOP}
                                >

                                    {
                                        creandoOP
                                            ? "Guardando..."
                                            : ordenProvisionId
                                                ? "Vinculada ✓"
                                                : "Guardar orden"
                                    }

                                </Button>

                            </Grid>

                        </Grid>
                    )
                }

                {
                    errorOP && (
                        <Alert severity="error" sx={{ mt: 2 }}>{errorOP}</Alert>
                    )
                }

            </Paper>

            <Paper
                variant="outlined"
                sx={{ p: 2.5, borderRadius: 3, borderStyle: "dashed" }}
            >

                <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mb: 1, alignItems: "center" }}
                >

                    <AutoAwesomeIcon color="info" fontSize="small" />

                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Detección automática con IA (opcional)
                    </Typography>

                </Stack>

                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 1.5 }}
                >
                    Si tenés el PDF o una foto del remito con varios relés, la IA
                    puede detectarlos automáticamente. No es necesario para
                    continuar.
                </Typography>

                {
                    errorIA && (
                        <Alert severity="error" sx={{ mb: 1.5 }}>{errorIA}</Alert>
                    )
                }

                <SelectorArchivoAdjunto
                    label="Detectar relés con IA desde un PDF o foto"
                    labelSeleccionado={archivoIA?.name ?? "Remito analizado"}
                    value={archivoIA}
                    disabled={analizando}
                    height={44}
                    onChange={(archivo) => {

                        if (archivo) {
                            onArchivoIASeleccionado(archivo);
                        }
                    }}
                />

                {
                    analizando && (

                        <Box sx={{ mt: 1.5 }}>

                            <LinearProgress />

                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: "block", mt: 0.5 }}
                            >
                                Analizando remito con IA...
                            </Typography>

                        </Box>
                    )
                }

            </Paper>

            <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                disabled={analizando || continuando || continuarDeshabilitado}
                onClick={onContinuar}
                sx={{ alignSelf: "flex-end" }}
            >
                {textoContinuar ?? "Continuar"}
            </Button>

        </Stack>
    );
}

export default PasoDocumentacion;
