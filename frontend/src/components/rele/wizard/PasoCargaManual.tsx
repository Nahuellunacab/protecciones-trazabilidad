import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    Alert,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    MenuItem,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import AddIcon
from "@mui/icons-material/Add";

import ArrowForwardIcon
from "@mui/icons-material/ArrowForward";

import PlaylistAddIcon
from "@mui/icons-material/PlaylistAdd";

import type { Marca } from "../../../types/Marca";
import type { Modelo } from "../../../types/Modelo";

import { obtenerReles } from "../../../services/releService";
import { crearMarca } from "../../../services/marcaService";
import { crearModelo } from "../../../services/modeloService";

import MarcaForm from "../../admin/marca/MarcaForm";
import ModeloForm from "../../admin/modelo/ModeloForm";

export interface DatosReleManual {

    numeroSerie: string;
    codigoConfiguracion: string;
    orderCode: string;
    modeloId: number;

    // Se completa con la posición por defecto recién al pasar por "Datos y
    // garantía" (ver stampearPosicionPorDefecto en ReleAltaWizard); hasta
    // entonces queda sin definir. Se puede corregir por ítem en "Revisión".
    posicionId?: number;
}

interface Props {

    marcas: Marca[];
    modelos: Modelo[];
    onCatalogosActualizados: () => Promise<void>;
    lote: DatosReleManual[];
    onAgregarRele: (datos: DatosReleManual) => void;
    onQuitarDeLote: (indice: number) => void;
    onContinuar: () => void;
    onOmitir: () => void;
}

function PasoCargaManual({
    marcas,
    modelos,
    onCatalogosActualizados,
    lote,
    onAgregarRele,
    onQuitarDeLote,
    onContinuar,
    onOmitir
}: Props) {

    const [marcaId, setMarcaId] =
        useState<number | "">("");

    const [modeloId, setModeloId] =
        useState<number | "">("");

    const [numeroSerie, setNumeroSerieState] =
        useState("");

    const setNumeroSerie = (valor: string) => {

        setNumeroSerieState(valor);

        if (valor.trim().length < 3) {
            setDuplicadoDetectado(false);
        }
    };

    const [codigoConfiguracion, setCodigoConfiguracion] =
        useState("");

    const [orderCode, setOrderCode] =
        useState("");

    const [verificandoSerie, setVerificandoSerie] =
        useState(false);

    const [duplicadoDetectado, setDuplicadoDetectado] =
        useState(false);

    const timeoutRef =
        useRef<ReturnType<typeof setTimeout> | null>(null);

    const [openMarcaDialog, setOpenMarcaDialog] =
        useState(false);

    const [mostrarModeloInline, setMostrarModeloInline] =
        useState(false);

    const [marcaCreadaId, setMarcaCreadaId] =
        useState<number | null>(null);

    const modelosFiltrados =
        marcaId
            ? modelos.filter((modelo) => modelo.marcaId === marcaId)
            : modelos;

    useEffect(() => {

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        const valor = numeroSerie.trim();

        if (valor.length < 3) {
            return;
        }

        timeoutRef.current = setTimeout(async () => {

            setVerificandoSerie(true);

            try {

                const resultado =
                    await obtenerReles(0, 5, valor, "TODOS");

                const existe =
                    resultado.content.some(
                        (rele) =>
                            rele.numeroSerie.toUpperCase() === valor.toUpperCase()
                    );

                setDuplicadoDetectado(existe);

            } catch {

                setDuplicadoDetectado(false);

            } finally {

                setVerificandoSerie(false);
            }

        }, 400);

        return () => {

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };

    }, [numeroSerie]);

    const handleCrearMarcaInline = async (nombre: string) => {

        const nuevaMarca = await crearMarca({ nombre });

        await onCatalogosActualizados();

        setMarcaId(nuevaMarca.id);
        setMarcaCreadaId(nuevaMarca.id);
        setMostrarModeloInline(true);
    };

    const handleCrearModeloInline = async (
        data: { nombre: string; marcaId: number }
    ) => {

        const nuevoModelo = await crearModelo(data);

        await onCatalogosActualizados();

        setModeloId(nuevoModelo.id);
        setOpenMarcaDialog(false);
        setMostrarModeloInline(false);
        setMarcaCreadaId(null);
    };

    const duplicadoEnLote =
        lote.some(
            (rele) =>
                rele.numeroSerie.toUpperCase()
                ===
                numeroSerie.trim().toUpperCase()
        );

    const puedeAgregar =
        Boolean(numeroSerie.trim())
        &&
        Boolean(modeloId)
        &&
        !duplicadoDetectado
        &&
        !duplicadoEnLote
        &&
        !verificandoSerie;

    const handleAgregarRele = () => {

        onAgregarRele({
            numeroSerie: numeroSerie.trim(),
            codigoConfiguracion,
            orderCode,
            modeloId: Number(modeloId)
        });

        setNumeroSerie("");
        setCodigoConfiguracion("");
        setOrderCode("");
    };

    const nombreModelo = (modeloId: number) =>
        modelos.find((m) => m.id === modeloId)?.nombre
        ?? "Modelo eliminado";

    return (

        <Stack spacing={3}>

            <Grid container spacing={2}>

                <Grid size={{ xs: 12, sm: 6 }}>

                    <TextField
                        select
                        label="Marca"
                        fullWidth
                        value={marcaId}
                        onChange={(e) => {

                            setMarcaId(
                                e.target.value
                                    ? Number(e.target.value)
                                    : ""
                            );

                            setModeloId("");
                        }}
                    >

                        {
                            marcas.map((marca) => (

                                <MenuItem
                                    key={marca.id}
                                    value={marca.id}
                                >
                                    {marca.nombre}
                                </MenuItem>
                            ))
                        }

                    </TextField>

                    <Button
                        size="small"
                        startIcon={<AddIcon fontSize="small" />}
                        sx={{ mt: 0.5 }}
                        onClick={() => setOpenMarcaDialog(true)}
                    >
                        Nueva marca
                    </Button>

                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>

                    <TextField
                        select
                        label="Modelo"
                        fullWidth
                        value={modeloId}
                        onChange={(e) =>
                            setModeloId(
                                e.target.value
                                    ? Number(e.target.value)
                                    : ""
                            )
                        }
                    >

                        {
                            modelosFiltrados.map((modelo) => (

                                <MenuItem
                                    key={modelo.id}
                                    value={modelo.id}
                                >
                                    {modelo.nombre}
                                </MenuItem>
                            ))
                        }

                    </TextField>

                    <Button
                        size="small"
                        startIcon={<AddIcon fontSize="small" />}
                        sx={{ mt: 0.5 }}
                        onClick={() => {

                            setMostrarModeloInline(true);
                            setOpenMarcaDialog(true);
                        }}
                    >
                        Nuevo modelo
                    </Button>

                </Grid>

                <Grid size={12}>

                    <TextField
                        label="Número de serie"
                        fullWidth
                        required
                        value={numeroSerie}
                        error={duplicadoDetectado || duplicadoEnLote}
                        helperText={
                            duplicadoDetectado
                                ? "Ya existe un relé con este número de serie"
                                : duplicadoEnLote
                                    ? "Ya agregaste este número de serie a la carga"
                                    : verificandoSerie
                                        ? "Verificando..."
                                        : " "
                        }
                        onChange={(e) =>
                            setNumeroSerie(e.target.value.toUpperCase())
                        }
                    />

                </Grid>

                <Grid size={12}>

                    <TextField
                        label="Código de configuración"
                        fullWidth
                        multiline
                        maxRows={3}
                        value={codigoConfiguracion}
                        slotProps={{
                            htmlInput: { maxLength: 400 }
                        }}
                        helperText={`${codigoConfiguracion.length}/400`}
                        onChange={(e) =>
                            setCodigoConfiguracion(
                                e.target.value
                                    .replace(/[\r\n]+/g, "")
                                    .toUpperCase()
                            )
                        }
                    />

                </Grid>

                <Grid size={12}>

                    <TextField
                        label="Order Code"
                        fullWidth
                        value={orderCode}
                        slotProps={{
                            htmlInput: { maxLength: 150 }
                        }}
                        helperText={`${orderCode.length}/150`}
                        onChange={(e) =>
                            setOrderCode(
                                e.target.value.toUpperCase()
                            )
                        }
                    />

                </Grid>

            </Grid>

            <Button
                variant="contained"
                size="large"
                startIcon={<PlaylistAddIcon />}
                disabled={!puedeAgregar}
                onClick={handleAgregarRele}
            >
                Agregar a la carga
            </Button>

            {
                lote.length > 0 && (

                    <Stack spacing={1}>

                        <Divider />

                        <Typography variant="subtitle2">
                            Relés cargados en este lote ({lote.length})
                        </Typography>

                        <Stack
                            direction="row"
                            spacing={1}
                            useFlexGap
                            sx={{ flexWrap: "wrap" }}
                        >

                            {
                                lote.map((rele, indice) => (

                                    <Chip
                                        key={`${rele.numeroSerie}-${indice}`}
                                        label={
                                            `${nombreModelo(rele.modeloId)} · ${rele.numeroSerie}`
                                        }
                                        onDelete={
                                            () => onQuitarDeLote(indice)
                                        }
                                    />
                                ))
                            }

                        </Stack>

                    </Stack>
                )
            }

            <Button
                variant={lote.length > 0 ? "contained" : "outlined"}
                size="large"
                endIcon={<ArrowForwardIcon />}
                disabled={lote.length === 0}
                onClick={onContinuar}
            >
                {
                    lote.length > 0
                        ? `Continuar con ${lote.length} relé(s)`
                        : "Continuar"
                }
            </Button>

            <Button
                size="small"
                color="inherit"
                onClick={onOmitir}
            >
                ¿Vas a cargar varios relés desde un remito? Omití este paso e importá con IA
            </Button>

            <Dialog
                open={openMarcaDialog}
                onClose={() => {

                    setOpenMarcaDialog(false);
                    setMostrarModeloInline(false);
                    setMarcaCreadaId(null);
                }}
                maxWidth="sm"
                fullWidth
            >

                <DialogTitle>
                    {
                        mostrarModeloInline
                            ? "Crear modelo"
                            : "Crear marca"
                    }
                </DialogTitle>

                <DialogContent>

                    {
                        !mostrarModeloInline && (

                            <MarcaForm
                                onSubmit={handleCrearMarcaInline}
                                cancelarEdicion={() => setOpenMarcaDialog(false)}
                            />
                        )
                    }

                    {
                        mostrarModeloInline && (

                            <ModeloForm
                                marcas={marcas}
                                marcaPreseleccionada={
                                    marcaCreadaId ?? (marcaId || undefined)
                                }
                                bloquearMarca={Boolean(marcaCreadaId)}
                                onSubmit={handleCrearModeloInline}
                                cancelarEdicion={() => {

                                    setOpenMarcaDialog(false);
                                    setMostrarModeloInline(false);
                                    setMarcaCreadaId(null);
                                }}
                            />
                        )
                    }

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={() => {

                            setOpenMarcaDialog(false);
                            setMostrarModeloInline(false);
                            setMarcaCreadaId(null);
                        }}
                    >
                        Cerrar
                    </Button>

                </DialogActions>

            </Dialog>

            {
                !marcas.length && (

                    <Alert severity="info">
                        No hay marcas cargadas todavía — creá una con el botón
                        "Nueva marca".
                    </Alert>
                )
            }

            <Typography variant="caption" color="text.secondary">
                Cargá los relés de a uno con "Agregar a la carga". Vas a
                poder revisar todo el lote antes de confirmarlo.
            </Typography>

        </Stack>
    );
}

export default PasoCargaManual;
