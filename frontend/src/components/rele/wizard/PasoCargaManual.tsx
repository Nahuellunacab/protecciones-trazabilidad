import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    MenuItem,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import AddIcon
from "@mui/icons-material/Add";

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
    modeloId: number;
}

interface Props {

    marcas: Marca[];
    modelos: Modelo[];
    onCatalogosActualizados: () => Promise<void>;
    enviando: boolean;
    onSubmit: (datos: DatosReleManual) => void;
}

function PasoCargaManual({
    marcas,
    modelos,
    onCatalogosActualizados,
    enviando,
    onSubmit
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

    const puedeEnviar =
        Boolean(numeroSerie.trim())
        &&
        Boolean(modeloId)
        &&
        !duplicadoDetectado
        &&
        !verificandoSerie
        &&
        !enviando;

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

                </Grid>

                <Grid size={12}>

                    <TextField
                        label="Número de serie"
                        fullWidth
                        required
                        value={numeroSerie}
                        error={duplicadoDetectado}
                        helperText={
                            duplicadoDetectado
                                ? "Ya existe un relé con este número de serie"
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
                            htmlInput: { maxLength: 150 }
                        }}
                        helperText={`${codigoConfiguracion.length}/150`}
                        onChange={(e) =>
                            setCodigoConfiguracion(
                                e.target.value.toUpperCase()
                            )
                        }
                    />

                </Grid>

            </Grid>

            <Button
                variant="contained"
                size="large"
                disabled={!puedeEnviar}
                onClick={() =>
                    onSubmit({
                        numeroSerie: numeroSerie.trim(),
                        codigoConfiguracion,
                        modeloId: Number(modeloId)
                    })
                }
            >

                {
                    enviando
                        ? "Creando..."
                        : "Crear relé"
                }

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
                                marcaPreseleccionada={marcaCreadaId ?? undefined}
                                bloquearMarca
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
                Podés seguir cargando más relés con "Registrar otro relé" al
                terminar.
            </Typography>

        </Stack>
    );
}

export default PasoCargaManual;
