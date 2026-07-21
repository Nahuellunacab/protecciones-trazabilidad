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
import type { DestinoRequest } from "../../../types/DestinoRequest";
import type { Posicion } from "../../../types/Posicion";
import type { PosicionRequest } from "../../../types/PosicionRequest";
import type { Localidad } from "../../../types/Localidad";
import type { LocalidadRequest } from "../../../types/LocalidadRequest";
import type { Provincia } from "../../../types/Provincia";
import type { ProvinciaRequest } from "../../../types/ProvinciaRequest";
import type { Estado } from "../../../types/Estado";
import type { Proveedor } from "../../../types/Proveedor";
import type { Remito } from "../../../types/Remito";
import type { OrdenProvision } from "../../../types/OrdenProvision";
import type { RemitoAnalisisIA } from "../../../types/RemitoAnalisisIA";

import { obtenerMarcas } from "../../../services/marcaService";
import { obtenerModelos } from "../../../services/modeloService";

import {
    obtenerDestinos,
    crearDestino
} from "../../../services/destinoService";

import {
    obtenerPosicionesPorDestino,
    crearPosicion
} from "../../../services/posicionService";

import {
    obtenerLocalidades,
    crearLocalidad
} from "../../../services/localidadService";

import {
    obtenerProvincias,
    crearProvincia
} from "../../../services/provinciaService";
import { obtenerEstadosIniciales } from "../../../services/estadoService";
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
import PasoRevision from "./PasoRevision";
import PasoResultado from "./PasoResultado";

import CargaInteligenteRemitoDialog
from "../CargaInteligenteRemitoDialog";

const ETIQUETAS_PASOS = [
    "Carga de relé(s)",
    "Datos y garantía",
    "Documentación",
    "Revisión",
    "Confirmación"
];

interface Props {

    onCreate: (data: ReleRequest) => Promise<Rele>;
    onTerminarCarga: () => void;
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

function ReleAltaWizard({ onCreate, onTerminarCarga }: Props) {

    const [activeStep, setActiveStep] = useState(0);
    const [maxReached, setMaxReached] = useState(0);

    // Catálogos
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [modelos, setModelos] = useState<Modelo[]>([]);
    const [destinos, setDestinos] = useState<Destino[]>([]);
    const [localidades, setLocalidades] = useState<Localidad[]>([]);
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [estadosIniciales, setEstadosIniciales] = useState<Estado[]>([]);
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

    const [estadoInicialId, setEstadoInicialId] =
        useState<number | undefined>(undefined);

    // Paso "Documentación": remito / orden de provisión + detección IA opcional
    const [remitoId, setRemitoId] = useState<number | null>(null);
    const [ordenProvisionId, setOrdenProvisionId] = useState<number | null>(null);
    const [archivo, setArchivo] = useState<File | null>(null);
    const [analizando, setAnalizando] = useState(false);
    const [errorDocumentacion, setErrorDocumentacion] = useState("");
    const [analisisIA, setAnalisisIA] = useState<RemitoAnalisisIA | null>(null);
    const [dialogIAAbierto, setDialogIAAbierto] = useState(false);
    const [creandoLoteIA, setCreandoLoteIA] = useState(false);

    // Paso "Carga de relé(s)": lote de relés cargados a mano (marca/modelo/
    // serie/config), pendientes de creación hasta confirmar la carga en el
    // paso "Revisión" (ver handleConfirmarLoteManual).
    const [loteManual, setLoteManual] =
        useState<DatosReleManual[]>([]);

    const handleAgregarRele = (datos: DatosReleManual) => {

        setLoteManual((prev) => [...prev, datos]);
    };

    const handleQuitarDeLote = (indice: number) => {

        setLoteManual((prev) =>
            prev.filter((_, i) => i !== indice)
        );
    };

    // Un relé puede estar en el mismo destino que el resto del lote pero
    // en otra posición puntual, así que la posición no se puede fijar de
    // una sola vez para todo el lote. Al salir de "Datos y garantía" se
    // usa la posición elegida ahí como default para los ítems que todavía
    // no tengan una propia (los que se agreguen más adelante, o si se
    // vuelve a este paso y se cambia el default, no se pisan los que ya
    // se corrigieron a mano en "Revisión").
    const stampearPosicionPorDefecto = () => {

        setLoteManual((prev) =>
            prev.map((item) =>
                item.posicionId === undefined
                    ? { ...item, posicionId: posicionInicialId }
                    : item
            )
        );
    };

    const handleCambiarPosicionEnLote = (
        indice: number,
        posicionId: number
    ) => {

        setLoteManual((prev) =>
            prev.map((item, i) =>
                i === indice ? { ...item, posicionId } : item
            )
        );
    };

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
            obtenerLocalidades(),
            obtenerProvincias(),
            obtenerEstadosIniciales(),
            obtenerProveedores(),
            obtenerRemitosDisponibles(),
            obtenerOrdenesProvisionDisponibles()
        ]).then(([
            marcasData,
            modelosData,
            destinosData,
            localidadesData,
            provinciasData,
            estadosInicialesData,
            proveedoresData,
            remitosDisponiblesData,
            opDisponiblesData
        ]) => {

            setMarcas(marcasData);
            setModelos(modelosData);
            setDestinos(destinosData);
            setLocalidades(localidadesData);
            setProvincias(provinciasData);
            setEstadosIniciales(estadosInicialesData);
            setProveedores(proveedoresData);
            setRemitosDisponibles(remitosDisponiblesData);
            setOpDisponibles(opDisponiblesData);

            const estadoStockDefault =
                estadosInicialesData.find(
                    (e) => e.nombre === "EN_STOCK"
                );

            if (estadoStockDefault) {
                setEstadoInicialId(estadoStockDefault.id);
            }

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

    // Crea una provincia nueva desde el mini-formulario inline del diálogo
    // "Nuevo destino" (usado cuando todavía no existe ninguna localidad
    // cargada, típicamente con la base recién limpiada).
    const handleCrearProvinciaInline = async (
        data: ProvinciaRequest
    ): Promise<Provincia | null> => {

        const creada = await crearProvincia(data);

        const provinciasActualizadas = await obtenerProvincias();

        setProvincias(provinciasActualizadas);

        return provinciasActualizadas.find((p) => p.id === creada.id) ?? null;
    };

    // Crea una localidad nueva desde el mini-formulario inline del diálogo
    // "Nuevo destino" y la deja disponible en el select de localidades para
    // que el destino recién creado la pueda usar.
    const handleCrearLocalidadInline = async (
        data: LocalidadRequest
    ): Promise<Localidad | null> => {

        const creada = await crearLocalidad(data);

        const localidadesActualizadas = await obtenerLocalidades();

        setLocalidades(localidadesActualizadas);

        return localidadesActualizadas.find((l) => l.id === creada.id) ?? null;
    };

    // Crea un destino nuevo desde el mini-formulario inline de "Datos y
    // garantía" y lo deja seleccionado (reutiliza handleDestinoChange para
    // que también dispare la carga de sus posiciones, igual que si el
    // usuario lo hubiera elegido del Autocomplete).
    const handleCrearDestinoInline = async (
        data: DestinoRequest
    ): Promise<Destino | null> => {

        const creado = await crearDestino(data);

        const destinosActualizados = await obtenerDestinos();

        setDestinos(destinosActualizados);

        const destinoCreado =
            destinosActualizados.find((d) => d.id === creado.id) ?? null;

        if (destinoCreado) {
            await handleDestinoChange(destinoCreado);
        }

        return destinoCreado;
    };

    // Crea una posición nueva para el destino ya seleccionado y la deja
    // elegida como posición inicial.
    const handleCrearPosicionInline = async (
        data: PosicionRequest
    ): Promise<Posicion | null> => {

        const creada = await crearPosicion(data);

        const posicionesActualizadas =
            await obtenerPosicionesPorDestino(data.destinoId);

        setPosiciones(posicionesActualizadas);

        const posicionCreada =
            posicionesActualizadas.find((p) => p.id === creada.id) ?? null;

        if (posicionCreada) {
            setPosicionInicialId(posicionCreada.id);
        }

        return posicionCreada;
    };

    // Misma creación de posición que handleCrearPosicionInline, pero usada
    // desde "Revisión" para un relé puntual del lote: a diferencia de
    // aquella, no toca posicionInicialId (el default del lote), porque eso
    // pisaría silenciosamente la posición de los demás relés que todavía
    // dependen del default (ver value en la tabla de PasoRevision).
    const handleCrearPosicionParaRele = async (
        data: PosicionRequest
    ): Promise<Posicion | null> => {

        const creada = await crearPosicion(data);

        const posicionesActualizadas =
            await obtenerPosicionesPorDestino(data.destinoId);

        setPosiciones(posicionesActualizadas);

        return posicionesActualizadas.find((p) => p.id === creada.id) ?? null;
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
                    orderCode: "",
                    modeloId: rele.modeloId ?? "",
                    tipoIngreso,
                    remitoId: remitoIdResuelto,
                    ordenProvisionId,
                    posicionInicialId,
                    estadoInicialId,
                    ...garantiaPayload
                };

                const creado = await onCreate(releData);

                creadosEnEsteLote.push(creado);
            }

            setCreados(creadosEnEsteLote);
            setDialogIAAbierto(false);
            irAPaso(4);

        } catch (err) {

            setCreados(creadosEnEsteLote);

            setErrorCreacion(
                extraerMensajeError(
                    err,
                    `Se crearon ${creadosEnEsteLote.length} de ${relesValidos.length} relés antes de un error.`
                )
            );

            setDialogIAAbierto(false);
            irAPaso(4);

        } finally {

            setCreandoLoteIA(false);
        }
    };

    // Se dispara desde el paso "Revisión": crea todos los relés del lote
    // manual de una sola vez, ya con destino/posición/garantía/estado
    // inicial/documentación confirmados por el usuario. Si falla a mitad
    // de camino, se reportan los que sí se llegaron a crear (mismo patrón
    // que handleConfirmarLoteIA).
    const handleConfirmarLoteManual = async () => {

        if (loteManual.length === 0) return;

        setCreando(true);
        setErrorCreacion("");

        const creadosEnEsteLote: Rele[] = [];

        try {

            const garantiaPayload = armarGarantiaPayload(
                cargarGarantia,
                usarFechaActual,
                garantiaMeses,
                inicioGarantia
            );

            for (const datos of loteManual) {

                const releData: ReleRequest = {

                    numeroSerie: datos.numeroSerie,
                    codigoConfiguracion: datos.codigoConfiguracion,
                    orderCode: datos.orderCode,
                    modeloId: datos.modeloId,
                    tipoIngreso,
                    remitoId,
                    ordenProvisionId,
                    posicionInicialId: datos.posicionId ?? posicionInicialId,
                    estadoInicialId,
                    ...garantiaPayload
                };

                const creado = await onCreate(releData);

                creadosEnEsteLote.push(creado);
            }

            setCreados(creadosEnEsteLote);
            setLoteManual([]);
            irAPaso(4);

        } catch (err) {

            setCreados(creadosEnEsteLote);

            setErrorCreacion(
                extraerMensajeError(
                    err,
                    `Se crearon ${creadosEnEsteLote.length} de ${loteManual.length} relés antes de un error.`
                )
            );

            irAPaso(4);

        } finally {

            setCreando(false);
        }
    };

    const reiniciarWizard = () => {

        setLoteManual([]);
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
                    activeStep === 0 && !analisisIA && (

                        <PasoCargaManual
                            marcas={marcas}
                            modelos={modelos}
                            onCatalogosActualizados={refrescarCatalogos}
                            lote={loteManual}
                            onAgregarRele={handleAgregarRele}
                            onQuitarDeLote={handleQuitarDeLote}
                            onContinuar={() => irAPaso(1)}
                            onOmitir={() => irAPaso(1)}
                        />
                    )
                }

                {
                    activeStep === 0 && analisisIA && (

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
                    activeStep === 1 && (

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
                            localidades={localidades}
                            onCrearDestino={handleCrearDestinoInline}
                            provincias={provincias}
                            onCrearProvincia={handleCrearProvinciaInline}
                            onCrearLocalidad={handleCrearLocalidadInline}
                            posiciones={posiciones}
                            posicionesLoading={posicionesLoading}
                            posicionesError={posicionesError}
                            posicionInicialId={posicionInicialId}
                            onPosicionChange={setPosicionInicialId}
                            onCrearPosicion={handleCrearPosicionInline}
                            estadosIniciales={estadosIniciales}
                            estadoInicialId={estadoInicialId}
                            onEstadoInicialChange={setEstadoInicialId}
                        />
                    )
                }

                {
                    activeStep === 2 && (

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
                            onContinuar={() => irAPaso(3)}
                            continuarDeshabilitado={loteManual.length === 0}
                            textoContinuar="Revisar y confirmar"
                        />
                    )
                }

                {
                    activeStep === 3 && (

                        <PasoRevision
                            lote={loteManual}
                            onQuitar={handleQuitarDeLote}
                            onCambiarPosicion={handleCambiarPosicionEnLote}
                            marcas={marcas}
                            modelos={modelos}
                            destinoSeleccionado={destinoSeleccionado}
                            posicionInicialId={posicionInicialId}
                            posiciones={posiciones}
                            onCrearPosicion={handleCrearPosicionParaRele}
                            estadoInicialId={estadoInicialId}
                            estadosIniciales={estadosIniciales}
                            cargarGarantia={cargarGarantia}
                            garantiaMeses={garantiaMeses}
                            usarFechaActual={usarFechaActual}
                            inicioGarantia={inicioGarantia}
                            remitoId={remitoId}
                            remitosDisponibles={remitosDisponibles}
                            ordenProvisionId={ordenProvisionId}
                            opDisponibles={opDisponibles}
                            confirmando={creando}
                            error={errorCreacion}
                            onConfirmar={handleConfirmarLoteManual}
                        />
                    )
                }

                {
                    activeStep === 4 && (

                        <PasoResultado
                            creando={creando || creandoLoteIA}
                            error={errorCreacion}
                            creados={creados}
                            onReiniciar={reiniciarWizard}
                            onTerminarCarga={onTerminarCarga}
                        />
                    )
                }

            </Paper>

            {
                activeStep < 4 && (

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
                            activeStep === 1 && (

                                <Button
                                    variant="contained"
                                    endIcon={<ArrowForwardIcon />}
                                    disabled={!puedeAvanzarDesdeDatosLote}
                                    onClick={() => {

                                        stampearPosicionPorDefecto();
                                        irAPaso(2);
                                    }}
                                >
                                    Continuar
                                </Button>
                            )
                        }

                    </Box>
                )
            }

            {
                !puedeAvanzarDesdeDatosLote && activeStep === 1 && (

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
