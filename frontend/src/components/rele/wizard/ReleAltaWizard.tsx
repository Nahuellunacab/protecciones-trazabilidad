import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Paper,
    Step,
    StepButton,
    StepLabel,
    Stepper,
    Typography
} from "@mui/material";

import ArrowBackIcon
from "@mui/icons-material/ArrowBack";

import ArrowForwardIcon
from "@mui/icons-material/ArrowForward";

import AutoAwesomeIcon
from "@mui/icons-material/AutoAwesome";

import type { Rele } from "../../../types/Rele";
import type { ReleRequest } from "../../../types/ReleRequest";
import type { Marca } from "../../../types/Marca";
import type { Modelo } from "../../../types/Modelo";
import type { Destino } from "../../../types/Destino";
import type { Posicion } from "../../../types/Posicion";
import type { Proveedor } from "../../../types/Proveedor";
import type { Remito } from "../../../types/Remito";
import type { OrdenProvision } from "../../../types/OrdenProvision";
import type { RemitoAnalisisIA } from "../../../types/RemitoAnalisisIA";

import { obtenerMarcas } from "../../../services/marcaService";
import { obtenerModelos } from "../../../services/modeloService";
import { obtenerDestinos } from "../../../services/destinoService";
import { obtenerPosicionesPorDestino } from "../../../services/posicionService";
import { obtenerProveedores } from "../../../services/proveedorService";

import {
    obtenerOrdenesProvisionDisponibles
} from "../../../services/ordenProvisionService";

import {
    analizarRemitoConIA,
    crearRemito,
    obtenerRemitos,
    obtenerRemitosDisponibles,
    subirArchivoRemito
} from "../../../services/remitoService";

import { extraerMensajeError } from "../../../utils/errorUtils";

import PasoDatosLote from "./PasoDatosLote";
import PasoDocumentacion from "./PasoDocumentacion";
import PasoCargaManual, { type DatosReleManual } from "./PasoCargaManual";
import PasoResultado from "./PasoResultado";

import CargaInteligenteRemitoDialog
from "../CargaInteligenteRemitoDialog";

const ETIQUETAS_PASOS = [
    "Datos y garantía",
    "Documentación",
    "Carga de relé(s)",
    "Confirmación"
];

interface Props {

    onCreate: (data: ReleRequest) => Promise<Rele>;
}

function armarGarantiaPayload(
    cargarGarantia: boolean,
    usarFechaActual: boolean,
    garantiaMeses: number | null,
    inicioGarantia: string | null
) {

    return {

        cargarGarantia,

        garantiaMeses: cargarGarantia ? garantiaMeses : null,

        inicioGarantia:
            cargarGarantia && !usarFechaActual
                ? inicioGarantia
                : null
    };
}

function ReleAltaWizard({ onCreate }: Props) {

    const [activeStep, setActiveStep] = useState(0);
    const [maxReached, setMaxReached] = useState(0);

    // Catálogos
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [modelos, setModelos] = useState<Modelo[]>([]);
    const [destinos, setDestinos] = useState<Destino[]>([]);
    const [posiciones, setPosiciones] = useState<Posicion[]>([]);
    const [posicionesLoading, setPosicionesLoading] = useState(false);
    const [posicionesError, setPosicionesError] = useState("");
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [remitosDisponibles, setRemitosDisponibles] = useState<Remito[]>([]);
    const [opDisponibles, setOpDisponibles] = useState<OrdenProvision[]>([]);

    // El tipo de ingreso no tiene control en la UI (siempre "NUEVO"), igual
    // que en el formulario clásico: no hace falta pedírselo al usuario.
    const tipoIngreso: "NUEVO" | "USADO" = "NUEVO";

    const [cargarGarantia, setCargarGarantia] = useState(true);
    const [garantiaMeses, setGarantiaMeses] = useState<number | null>(120);
    const [usarFechaActual, setUsarFechaActual] = useState(true);
    const [inicioGarantia, setInicioGarantia] = useState<string | null>(null);

    const [destinoSeleccionado, setDestinoSeleccionado] =
        useState<Destino | null>(null);

    const [posicionInicialId, setPosicionInicialId] =
        useState<number | undefined>(undefined);

    // Paso 1: documentación (remito / orden de provisión) + detección IA opcional
    const [remitoId, setRemitoId] = useState<number | null>(null);
    const [ordenProvisionId, setOrdenProvisionId] = useState<number | null>(null);
    const [archivo, setArchivo] = useState<File | null>(null);
    const [analizando, setAnalizando] = useState(false);
    const [errorDocumentacion, setErrorDocumentacion] = useState("");
    const [analisisIA, setAnalisisIA] = useState<RemitoAnalisisIA | null>(null);
    const [dialogIAAbierto, setDialogIAAbierto] = useState(false);
    const [creandoLoteIA, setCreandoLoteIA] = useState(false);

    // Paso 3: resultado
    const [creando, setCreando] = useState(false);
    const [errorCreacion, setErrorCreacion] = useState("");
    const [creados, setCreados] = useState<Rele[]>([]);

    const handleDestinoChange = async (destino: Destino | null) => {

        setDestinoSeleccionado(destino);
        setPosicionInicialId(undefined);
        setPosicionesError("");

        if (!destino) {

            setPosiciones([]);

            return;
        }

        setPosicionesLoading(true);

        try {

            const posicionesData =
                await obtenerPosicionesPorDestino(destino.id);

            setPosiciones(posicionesData);

            const deposito =
                posicionesData.find((p) => p.nombre === "Depósito");

            if (deposito) {
                setPosicionInicialId(deposito.id);
            }

        } catch (err) {

            setPosicionesError(
                extraerMensajeError(
                    err,
                    "No se pudieron cargar las posiciones de este destino."
                )
            );

            setPosiciones([]);

        } finally {

            setPosicionesLoading(false);
        }
    };

    useEffect(() => {

        Promise.all([
            obtenerMarcas(),
            obtenerModelos(),
            obtenerDestinos(),
            obtenerProveedores(),
            obtenerRemitosDisponibles(),
            obtenerOrdenesProvisionDisponibles()
        ]).then(([
            marcasData,
            modelosData,
            destinosData,
            proveedoresData,
            remitosDisponiblesData,
            opDisponiblesData
        ]) => {

            setMarcas(marcasData);
            setModelos(modelosData);
            setDestinos(destinosData);
            setProveedores(proveedoresData);
            setRemitosDisponibles(remitosDisponiblesData);
            setOpDisponibles(opDisponiblesData);

            const destinoDefault =
                destinosData.find(
                    (d) => d.nombre === "Area Protecciones"
                )
                ??
                null;

            if (destinoDefault) {
                handleDestinoChange(destinoDefault);
            }

        }).catch(() => {

            // Degradación silenciosa: si fallan los catálogos, el usuario
            // igual puede elegir destino/marca manualmente una vez que
            // reintente (los selects solo quedarán vacíos).
        });

    }, []);

    const refrescarCatalogos = async () => {

        try {

            const [marcasData, modelosData] = await Promise.all([
                obtenerMarcas(),
                obtenerModelos()
            ]);

            setMarcas(marcasData);
            setModelos(modelosData);

        } catch {

            // silencioso: el usuario puede reintentar la creación inline
        }
    };

    const refrescarDocumentos = async () => {

        try {

            const [remitosDisponiblesData, opDisponiblesData] =
                await Promise.all([
                    obtenerRemitosDisponibles(),
                    obtenerOrdenesProvisionDisponibles()
                ]);

            setRemitosDisponibles(remitosDisponiblesData);
            setOpDisponibles(opDisponiblesData);

        } catch {

            // silencioso: el usuario ya tiene el remito/OP recién creado
            // vinculado en el estado del wizard, solo se refresca la lista
        }
    };

    const puedeAvanzarDesdeDatosLote =
        Boolean(posicionInicialId)
        &&
        (!cargarGarantia || Boolean(garantiaMeses));

    const irAPaso = (paso: number) => {

        setActiveStep(paso);
        setMaxReached((prev) => Math.max(prev, paso));
    };

    const handleArchivoSeleccionado = async (nuevoArchivo: File) => {

        setArchivo(nuevoArchivo);
        setAnalizando(true);
        setErrorDocumentacion("");

        try {

            const resultado = await analizarRemitoConIA(nuevoArchivo);

            setAnalisisIA(resultado);
            setDialogIAAbierto(true);

        } catch (err) {

            setErrorDocumentacion(
                extraerMensajeError(
                    err,
                    "No se pudo analizar el remito. Cargue los datos manualmente."
                )
            );

        } finally {

            setAnalizando(false);
        }
    };

    const resolverRemitoId = async (): Promise<number | null> => {

        // Si el usuario ya vinculó (o creó) un remito a mano en el paso de
        // Documentación, se respeta esa elección y no se intenta crear uno
        // nuevo a partir de lo que haya detectado la IA.
        if (remitoId) return remitoId;

        if (!analisisIA) return null;

        if (!analisisIA.numeroRemito || !analisisIA.proveedorId) {
            return null;
        }

        try {

            const nuevoRemito = await crearRemito({
                numeroRemito: analisisIA.numeroRemito,
                fecha:
                    analisisIA.fecha
                    ??
                    new Date().toISOString().slice(0, 10),
                proveedorId: analisisIA.proveedorId
            });

            if (archivo) {
                await subirArchivoRemito(nuevoRemito.id, archivo);
            }

            return nuevoRemito.id;

        } catch {

            try {

                const remitos = await obtenerRemitos();

                const existente =
                    remitos.find(
                        (r) =>
                            r.numeroRemito.trim().toUpperCase()
                            ===
                            analisisIA.numeroRemito?.trim().toUpperCase()
                    );

                return existente?.id ?? null;

            } catch {

                return null;
            }
        }
    };

    const handleConfirmarLoteIA = async () => {

        if (!analisisIA) return;

        setCreandoLoteIA(true);
        setErrorCreacion("");

        const relesValidos = analisisIA.reles.filter((r) => r.valido);
        const creadosEnEsteLote: Rele[] = [];

        try {

            const remitoIdResuelto = await resolverRemitoId();

            const garantiaPayload = armarGarantiaPayload(
                cargarGarantia,
                usarFechaActual,
                garantiaMeses,
                inicioGarantia
            );

            for (const rele of relesValidos) {

                const releData: ReleRequest = {

                    numeroSerie: rele.numeroSerie ?? "",
                    codigoConfiguracion: rele.codigoConfiguracion ?? "",
                    modeloId: rele.modeloId ?? "",
                    tipoIngreso,
                    remitoId: remitoIdResuelto,
                    ordenProvisionId,
                    posicionInicialId,
                    ...garantiaPayload
                };

                const creado = await onCreate(releData);

                creadosEnEsteLote.push(creado);
            }

            setCreados(creadosEnEsteLote);
            setDialogIAAbierto(false);
            irAPaso(3);

        } catch (err) {

            setCreados(creadosEnEsteLote);

            setErrorCreacion(
                extraerMensajeError(
                    err,
                    `Se crearon ${creadosEnEsteLote.length} de ${relesValidos.length} relés antes de un error.`
                )
            );

            setDialogIAAbierto(false);
            irAPaso(3);

        } finally {

            setCreandoLoteIA(false);
        }
    };

    const handleCrearManual = async (datos: DatosReleManual) => {

        setCreando(true);
        setErrorCreacion("");

        try {

            const garantiaPayload = armarGarantiaPayload(
                cargarGarantia,
                usarFechaActual,
                garantiaMeses,
                inicioGarantia
            );

            const releData: ReleRequest = {

                numeroSerie: datos.numeroSerie,
                codigoConfiguracion: datos.codigoConfiguracion,
                modeloId: datos.modeloId,
                tipoIngreso,
                remitoId,
                ordenProvisionId,
                posicionInicialId,
                ...garantiaPayload
            };

            const creado = await onCreate(releData);

            setCreados([creado]);
            irAPaso(3);

        } catch (err) {

            setErrorCreacion(
                extraerMensajeError(err, "Error al crear el relé.")
            );

            irAPaso(3);

        } finally {

            setCreando(false);
        }
    };

    const reiniciarWizard = () => {

        setRemitoId(null);
        setOrdenProvisionId(null);
        setArchivo(null);
        setAnalisisIA(null);
        setErrorDocumentacion("");
        setErrorCreacion("");
        setCreados([]);
        irAPaso(0);
    };

    return (

        <Box sx={{ mb: 4 }}>

            <Paper
                variant="outlined"
                sx={{ p: 3, borderRadius: 3, mb: 3 }}
            >

                <Stepper
                    activeStep={activeStep}
                    nonLinear
                >

                    {
                        ETIQUETAS_PASOS.map((etiqueta, index) => (

                            <Step
                                key={etiqueta}
                                completed={index < activeStep}
                            >

                                <StepButton
                                    disabled={index > maxReached}
                                    onClick={() => setActiveStep(index)}
                                >

                                    <StepLabel>{etiqueta}</StepLabel>

                                </StepButton>

                            </Step>
                        ))
                    }

                </Stepper>

            </Paper>

            <Paper
                variant="outlined"
                sx={{ p: 3, borderRadius: 3 }}
            >

                {
                    activeStep === 0 && (

                        <PasoDatosLote
                            cargarGarantia={cargarGarantia}
                            onCargarGarantiaChange={setCargarGarantia}
                            garantiaMeses={garantiaMeses}
                            onGarantiaMesesChange={setGarantiaMeses}
                            usarFechaActual={usarFechaActual}
                            onUsarFechaActualChange={setUsarFechaActual}
                            inicioGarantia={inicioGarantia}
                            onInicioGarantiaChange={setInicioGarantia}
                            destinos={destinos}
                            destinoSeleccionado={destinoSeleccionado}
                            onDestinoChange={handleDestinoChange}
                            posiciones={posiciones}
                            posicionesLoading={posicionesLoading}
                            posicionesError={posicionesError}
                            posicionInicialId={posicionInicialId}
                            onPosicionChange={setPosicionInicialId}
                        />
                    )
                }

                {
                    activeStep === 1 && (

                        <PasoDocumentacion
                            proveedores={proveedores}
                            remitosDisponibles={remitosDisponibles}
                            opDisponibles={opDisponibles}
                            remitoId={remitoId}
                            onRemitoIdChange={setRemitoId}
                            ordenProvisionId={ordenProvisionId}
                            onOrdenProvisionIdChange={setOrdenProvisionId}
                            onDocumentosActualizados={refrescarDocumentos}
                            archivoIA={archivo}
                            analizando={analizando}
                            errorIA={errorDocumentacion}
                            onArchivoIASeleccionado={handleArchivoSeleccionado}
                            onContinuar={() => irAPaso(2)}
                        />
                    )
                }

                {
                    activeStep === 2 && !analisisIA && (

                        <PasoCargaManual
                            marcas={marcas}
                            modelos={modelos}
                            onCatalogosActualizados={refrescarCatalogos}
                            enviando={creando}
                            onSubmit={handleCrearManual}
                        />
                    )
                }

                {
                    activeStep === 2 && analisisIA && (

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 2,
                                py: 4
                            }}
                        >

                            <AutoAwesomeIcon color="info" sx={{ fontSize: 40 }} />

                            <Typography variant="body1">
                                {analisisIA.reles.length} relé(s) detectados en
                                el remito.
                            </Typography>

                            <Button
                                variant="contained"
                                onClick={() => setDialogIAAbierto(true)}
                            >
                                Revisar y confirmar detección
                            </Button>

                        </Box>
                    )
                }

                {
                    activeStep === 3 && (

                        <PasoResultado
                            creando={creando || creandoLoteIA}
                            error={errorCreacion}
                            creados={creados}
                            onReiniciar={reiniciarWizard}
                        />
                    )
                }

            </Paper>

            {
                activeStep < 3 && (

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 2
                        }}
                    >

                        <Button
                            startIcon={<ArrowBackIcon />}
                            disabled={activeStep === 0}
                            onClick={() => setActiveStep(activeStep - 1)}
                        >
                            Atrás
                        </Button>

                        {
                            activeStep === 0 && (

                                <Button
                                    variant="contained"
                                    endIcon={<ArrowForwardIcon />}
                                    disabled={!puedeAvanzarDesdeDatosLote}
                                    onClick={() => irAPaso(1)}
                                >
                                    Continuar
                                </Button>
                            )
                        }

                    </Box>
                )
            }

            {
                !puedeAvanzarDesdeDatosLote && activeStep === 0 && (

                    <Alert severity="info" sx={{ mt: 2 }}>
                        Elegí una posición inicial
                        {cargarGarantia ? " y la duración de la garantía " : " "}
                        para continuar.
                    </Alert>
                )
            }

            <CargaInteligenteRemitoDialog
                open={dialogIAAbierto}
                analisis={analisisIA}
                creando={creandoLoteIA}
                marcas={marcas}
                onClose={() => setDialogIAAbierto(false)}
                onConfirmar={handleConfirmarLoteIA}
                onAnalisisActualizado={setAnalisisIA}
                onCatalogosActualizados={refrescarCatalogos}
            />

        </Box>
    );
}

export default ReleAltaWizard;
