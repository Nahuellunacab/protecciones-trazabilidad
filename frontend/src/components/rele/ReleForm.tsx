import { useEffect, useRef, useState } from "react";

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Alert,
    Box,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Stack,
    TextField,
    Tooltip,
    Typography,
    ToggleButtonGroup,
    ToggleButton,
    Checkbox,
    FormControlLabel,
} from "@mui/material";

import { alpha } from "@mui/material/styles";

import ExpandMoreIcon
from "@mui/icons-material/ExpandMore";

import PlaylistAddCheckIcon
from "@mui/icons-material/PlaylistAddCheck";

import DescriptionIcon
from "@mui/icons-material/Description";

import LocalShippingIcon
from "@mui/icons-material/LocalShipping";

import AutoAwesomeIcon
from "@mui/icons-material/AutoAwesome";

import PhotoCameraIcon
from "@mui/icons-material/PhotoCamera";

import type { Modelo }
from "../../types/Modelo";

import type { Marca }
from "../../types/Marca";

import type { Rele }
from "../../types/Rele";

import type { ReleRequest }
from "../../types/ReleRequest";

import type {
    OrdenProvision
} from "../../types/OrdenProvision";

import {
    crearMarca,
    obtenerMarcas
} from "../../services/marcaService";

import {
    obtenerReles
} from "../../services/releService";

import {
    crearModelo,
    obtenerModelos
} from "../../services/modeloService";

import MarcaForm from "../admin/marca/MarcaForm";
import ModeloForm from "../admin/modelo/ModeloForm";
import type { Posicion } from "../../types/Posicion";
import type { Provincia } from "../../types/Provincia";
import type { Localidad } from "../../types/Localidad";
import type { Destino } from "../../types/Destino";

import {
    obtenerDestinosPorLocalidad,
    crearDestino
} from "../../services/destinoService";

import {
    obtenerPosiciones,
    crearPosicion
} from "../../services/posicionService";

import {
    obtenerProvincias,
    crearProvincia
} from "../../services/provinciaService";

import {
    obtenerLocalidadesPorProvincia,
    crearLocalidad
} from "../../services/localidadService";

import {
    obtenerRemitos,
    crearRemito,
    subirArchivoRemito,
    obtenerRemitosDisponibles,
    analizarRemitoConIA,
    abrirArchivoRemito
}
from "../../services/remitoService";

import type {
    Remito,
} from "../../types/Remito";

import type {
    RemitoAnalisisIA
} from "../../types/RemitoAnalisisIA";

import CargaInteligenteRemitoDialog
from "./CargaInteligenteRemitoDialog";

import SelectorArchivoAdjunto
from "../common/SelectorArchivoAdjunto";

import {
    obtenerOrdenesProvision,
    crearOrdenProvision,
    subirArchivoOP,
    obtenerOrdenesProvisionDisponibles
} from "../../services/ordenProvisionService";

import type {
    Proveedor
} from "../../types/Proveedor";

import { extraerMensajeError }
from "../../utils/errorUtils";

import {
    obtenerProveedores
} from "../../services/proveedorService";

type ReleFormData = {

    numeroSerie: string;

    codigoConfiguracion: string;

    orderCode: string;

    modeloId: number | "";

    tipoIngreso: "NUEVO" | "USADO";

    remitoId: number | null;

    ordenProvisionId: number | null;

    posicionInicialId: number | undefined;

    cargarGarantia: boolean;

    garantiaMeses: number | null;

    usarFechaActual: boolean;

    inicioGarantia: string | null;
};

interface Props {

    onCreate: (
        data: ReleRequest
    ) => Promise<Rele>;

    onUpdate: (
        id: number,
        data: ReleRequest
    ) => Promise<void>;

    releEditando: Rele | null;

    onCancelEdit: () => void;

    onEditarDesdeLote: (
        id: number
    ) => void;

    onTerminarEdicionDeLote: () => void;
}

function fechaHoy() {

    return new Date()
        .toISOString()
        .split("T")[0];
}

function ReleForm({
    onCreate,
    onUpdate,
    releEditando,
    onCancelEdit,
    onEditarDesdeLote,
    onTerminarEdicionDeLote
}: Props) {

    const [marcas, setMarcas] =
        useState<Marca[]>([]);

    const [modelos, setModelos] =
        useState<Modelo[]>([]);

    const [marcaId, setMarcaId] =
        useState<number | "">("");

    const [modelosFiltrados,
        setModelosFiltrados] =
        useState<Modelo[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [successMsg, setSuccessMsg] =
        useState("");

    const numeroSerieInputRef =
        useRef<HTMLInputElement>(null);

    // Por defecto se propone 10 años de garantía (ver formData mas abajo);
    // se abre el acordeón para que quede visible que ya viene precargada.
    const [garantiaAbierta, setGarantiaAbierta] =
        useState(true);

    // Documentación es opcional y va al final del formulario (los datos
    // del relé en sí son lo prioritario); arranca colapsado y solo se abre
    // solo si el relé que se está editando ya tenía remito/OP asociado
    // (ver el useEffect que sincroniza con releEditando mas abajo).
    const [documentacionAbierta, setDocumentacionAbierta] =
        useState(false);

    type ReleDelLote = {
        id: number;
        modelo: string;
        numeroSerie: string;
    };

    const [relesDelLote, setRelesDelLote] =
        useState<ReleDelLote[]>([]);

    const [editandoDesdeLote, setEditandoDesdeLote] =
        useState(false);

    const [duplicadoDetectado, setDuplicadoDetectado] =
        useState<Rele | null>(null);

    const [verificandoSerie, setVerificandoSerie] =
        useState(false);

    const serieCheckTimeoutRef =
        useRef<ReturnType<typeof setTimeout> | null>(null);

    const [
        openMarcaDialog,
        setOpenMarcaDialog
    ] = useState(false);

    const [
        mostrarModeloInline,
        setMostrarModeloInline
    ] = useState(false);

    const [
        marcaCreadaId,
        setMarcaCreadaId
    ] = useState<number | null>(null);

    const [formData, setFormData] =
        useState<ReleFormData>({
            numeroSerie: "",

        codigoConfiguracion: "",

        orderCode: "",

        modeloId: "",

        tipoIngreso: "NUEVO",

        remitoId: null,

        ordenProvisionId: null,

        posicionInicialId: undefined,

        // Por ahora, todo relé nuevo se carga por defecto con 10 años
        // (120 meses) de garantía desde la fecha actual; el usuario puede
        // desmarcarla o cambiarla en el acordeón "Garantía" si hace falta.
        cargarGarantia: true,

        garantiaMeses: 120,

        usarFechaActual: true,

        inicioGarantia: null
    });
    
    const [posicionesIniciales,
        setPosicionesIniciales] =
            useState<Posicion[]>([]);

    // Diálogo "Nueva Posición": permite crear en cadena Provincia →
    // Localidad → Destino → Posición sin salir del alta de relé, para el
    // caso (típico con la base recién limpiada) en que todavía no existe
    // ninguna ubicación cargada y el select de "Posición Inicial" (campo
    // obligatorio) quedaría vacío.
    const [openUbicacionDialog,
        setOpenUbicacionDialog] =
        useState(false);

    const [provincias,
        setProvincias] =
        useState<Provincia[]>([]);

    const [localidadesCascada,
        setLocalidadesCascada] =
        useState<Localidad[]>([]);

    const [destinosCascada,
        setDestinosCascada] =
        useState<Destino[]>([]);

    const [ubProvinciaId,
        setUbProvinciaId] =
        useState<number | "">("");

    const [ubLocalidadId,
        setUbLocalidadId] =
        useState<number | "">("");

    const [ubDestinoId,
        setUbDestinoId] =
        useState<number | "">("");

    const [ubNuevaProvinciaNombre,
        setUbNuevaProvinciaNombre] =
        useState("");

    const [ubNuevaLocalidadNombre,
        setUbNuevaLocalidadNombre] =
        useState("");

    const [ubNuevoDestinoNombre,
        setUbNuevoDestinoNombre] =
        useState("");

    const [ubNuevaPosicionNombre,
        setUbNuevaPosicionNombre] =
        useState("");

    const [ubGuardando,
        setUbGuardando] =
        useState(false);

    const [remitos, setRemitos] =
        useState<Remito[]>([]);
    
    const [ordenesProvision, setOrdenesProvision] =
        useState<OrdenProvision[]>([]);  
        
    const [,
        setMostrarRemitoInline] =
        useState(false);

    const [,
        setMostrarOPInline] =
        useState(false);

    const [nuevoRemito,
        setNuevoRemito] =
        useState({

            numeroRemito: "",

            proveedorId: "",

            fecha: fechaHoy()
        });

    const [nuevaOP,
        setNuevaOP] =
        useState({

            numero: "",

            observaciones: ""
        });

    const [proveedores,
        setProveedores] =
        useState<Proveedor[]>([]);

    const [archivoRemito,
        setArchivoRemito] =
        useState<File | null>(null);

    // PDF/imagen que se envió a analizar con IA: se guarda para poder
    // adjuntarlo automáticamente al remito que termine asociado a los
    // relés detectados (se cree automáticamente o lo cree el usuario a
    // mano desde el mini-formulario "Crear Remito").
    const [archivoAnalizadoIA,
        setArchivoAnalizadoIA] =
        useState<File | null>(null);

    const [archivoOP,
        setArchivoOP] =
        useState<File | null>(null);

    const [remitosDisponibles,
        setRemitosDisponibles] =

        useState<Remito[]>([]);

    const [opDisponibles,
        setOpDisponibles] =

        useState<OrdenProvision[]>([]);

    const [modoRemito,
        setModoRemito] =

        useState<
            "nuevo" | "existente"
        >("nuevo");

    const [modoOP,
        setModoOP] =

        useState<
            "nuevo" | "existente"
        >("nuevo");

    const [analizandoRemito,
        setAnalizandoRemito] =
        useState(false);

    const [analisisIA,
        setAnalisisIA] =
        useState<RemitoAnalisisIA | null>(null);

    const [dialogIAAbierto,
        setDialogIAAbierto] =
        useState(false);

    const [creandoLoteIA,
        setCreandoLoteIA] =
        useState(false);

    useEffect(() => {

        cargarDatos();

    }, []);
        

    useEffect(() => {

    if (!releEditando) {
        return;
    }

    setFormData({

        numeroSerie:
            releEditando.numeroSerie,

        codigoConfiguracion:
            releEditando.codigoConfiguracion ?? "",

        orderCode:
            releEditando.orderCode ?? "",

        modeloId:
            releEditando.modeloId ?? "",

        tipoIngreso:
            releEditando.tipoIngreso,

        remitoId:
            releEditando.remitoId ?? null,

        ordenProvisionId:
            releEditando.ordenProvisionId ?? null,

        posicionInicialId:
            undefined,

        cargarGarantia:
            releEditando.garantiaMeses
                ? true
                : false,

        garantiaMeses:
            releEditando.garantiaMeses ?? null,

        usarFechaActual:
            false,

        inicioGarantia:
            releEditando.inicioGarantia ?? null
    });

        setGarantiaAbierta(
            Boolean(releEditando.garantiaMeses)
        );

        setDocumentacionAbierta(
            Boolean(
                releEditando.remitoId
                ||
                releEditando.ordenProvisionId
            )
        );

        const modelo =
            modelos.find(
                (m) =>
                    m.id ===
                    releEditando.modeloId
            );

        if (modelo) {

            setMarcaId(
                modelo.marcaId
            );
        }

    }, [
        releEditando,
        modelos
    ]);

    useEffect(() => {

        const valor =
            formData.numeroSerie.trim();

        if (serieCheckTimeoutRef.current) {

            clearTimeout(
                serieCheckTimeoutRef.current
            );
        }

        if (valor.length < 3) {

            setDuplicadoDetectado(null);

            setVerificandoSerie(false);

            return;
        }

        setVerificandoSerie(true);

        serieCheckTimeoutRef.current = setTimeout(

            async () => {

                try {

                    const resultado =
                        await obtenerReles(
                            0,
                            5,
                            valor,
                            "TODOS"
                        );

                    const encontrado =
                        resultado.content.find(
                            (r) =>
                                r.numeroSerie.toUpperCase()
                                ===
                                valor.toUpperCase()
                        );

                    const esElMismoQueEdito =
                        releEditando
                        &&
                        encontrado
                        &&
                        encontrado.id === releEditando.id;

                    setDuplicadoDetectado(
                        encontrado && !esElMismoQueEdito
                            ? encontrado
                            : null
                    );

                } catch {

                    setDuplicadoDetectado(null);

                } finally {

                    setVerificandoSerie(false);
                }
            },
            400
        );

        return () => {

            if (serieCheckTimeoutRef.current) {

                clearTimeout(
                    serieCheckTimeoutRef.current
                );
            }
        };

    }, [
        formData.numeroSerie,
        releEditando
    ]);

    const remitoSeleccionado =
        remitos.find(
            (r) =>
                r.id ===
                formData.remitoId
        );

    const opSeleccionada =
        ordenesProvision.find(
            (op) =>
                op.id ===
                formData.ordenProvisionId
        );

    const handleCrearMarcaInline =
        async (
            nombre: string
        ) => {

            try {

                const nuevaMarca =
                    await crearMarca({
                        nombre
                    });

                const nuevasMarcas =
                    await obtenerMarcas();

                setMarcas(
                    nuevasMarcas
                );

                setMarcaId(
                    nuevaMarca.id
                );

                setMarcaCreadaId(
                    nuevaMarca.id
                );

                setMostrarModeloInline(
                    true
                );

            } catch (err) {

                setError(
                    extraerMensajeError(
                        err,
                        "No se pudo crear la marca. Intente nuevamente."
                    )
                );
            }
        };
    
    
    
    const handleCrearRemitoInline =
    async () => {

        let remitoCreado;

        try {

            remitoCreado =
                await crearRemito({

                    numeroRemito:
                        nuevoRemito.numeroRemito,

                    proveedorId:
                        Number(
                            nuevoRemito.proveedorId
                        ),

                    fecha:
                        nuevoRemito.fecha
                });

        } catch (err) {

            setError(
                extraerMensajeError(
                    err,
                    "No se pudo crear el remito. Intente nuevamente."
                )
            );

            return;
        }

        // La subida del archivo va en un try/catch aparte: si el remito ya
        // se creó pero falla la subida del PDF, no queremos mezclar ese
        // error con "no se pudo crear el remito" (son fallas distintas), y
        // el usuario tiene que enterarse igual de que el PDF no se adjuntó.
        if (archivoRemito) {

            try {

                await subirArchivoRemito(
                    remitoCreado.id,
                    archivoRemito
                );

            } catch {

                setError(
                    "El remito se creó, pero no se pudo adjuntar el PDF. Puede volver a subirlo más adelante."
                );
            }
        }

        const remitosActualizados =
            await obtenerRemitos();

        setRemitos(
            remitosActualizados
        );

        setFormData((prev) => ({

            ...prev,

            remitoId:
                remitoCreado.id
        }));

        setNuevoRemito({

            numeroRemito: "",

            proveedorId: "",

            fecha: fechaHoy()
        });

        setArchivoRemito(
            null
        );

        setMostrarRemitoInline(
            false
        );
    };

    const handleArchivoIA =
        async (
            archivo: File | null
        ) => {

            if (!archivo) {

                return;
            }

            setAnalizandoRemito(true);

            setError("");

            try {

                const resultado =
                    await analizarRemitoConIA(
                        archivo
                    );

                setAnalisisIA(
                    resultado
                );

                setArchivoAnalizadoIA(
                    archivo
                );

                setDialogIAAbierto(
                    true
                );

                if (
                    modoRemito === "nuevo"
                    &&
                    !formData.remitoId
                    &&
                    (resultado.numeroRemito || resultado.proveedorId)
                ) {

                    setNuevoRemito({

                        numeroRemito:
                            resultado.numeroRemito ?? "",

                        proveedorId:
                            resultado.proveedorId
                                ? String(resultado.proveedorId)
                                : "",

                        fecha:
                            resultado.fecha ?? fechaHoy()
                    });

                    // Si el usuario termina creando el remito a mano desde
                    // el mini-formulario (por ejemplo porque el proveedor
                    // no se pudo resolver solo), que quede adjuntado el
                    // mismo PDF que se analizó, sin tener que volver a
                    // seleccionarlo.
                    setArchivoRemito(
                        archivo
                    );
                }

            } catch (err: any) {

                setError(

                    err?.response?.data?.message

                    ||

                    "Error al analizar el remito con IA"
                );

            } finally {

                setAnalizandoRemito(false);
            }
        };

    // Resuelve el remito a asociar a los relés importados por IA: si ya
    // hay uno seleccionado/creado en el formulario lo reutiliza; si no,
    // intenta crearlo automáticamente con los datos detectados (número +
    // proveedor) y le adjunta el mismo PDF que se analizó. Si no se pudo
    // detectar proveedor o número de remito, o si falla la creación,
    // devuelve el remitoId que hubiera en el formulario (puede ser null:
    // el usuario podrá asociarlo a mano después desde "Documentación").
    const resolverRemitoParaImportacionIA =
        async (): Promise<number | null> => {

            if (formData.remitoId) {

                return formData.remitoId;
            }

            if (
                !analisisIA?.numeroRemito
                ||
                !analisisIA?.proveedorId
            ) {

                return formData.remitoId;
            }

            let remitoId: number;

            try {

                const remitoCreado =
                    await crearRemito({

                        numeroRemito:
                            analisisIA.numeroRemito,

                        proveedorId:
                            analisisIA.proveedorId,

                        fecha:
                            analisisIA.fecha
                            ??
                            fechaHoy()
                    });

                remitoId =
                    remitoCreado.id;

                const remitosActualizados =
                    await obtenerRemitos();

                setRemitos(
                    remitosActualizados
                );

                setFormData((prev) => ({

                    ...prev,

                    remitoId
                }));

            } catch {

                // Probablemente ya existe un remito con ese número (por
                // ejemplo si el usuario ya lo habia creado antes de
                // re-analizar el mismo PDF): en vez de bloquear la
                // importación, reutilizamos el remito existente.
                const remitosActuales =
                    await obtenerRemitos();

                setRemitos(
                    remitosActuales
                );

                const existente =
                    remitosActuales.find(
                        (remito) =>
                            remito.numeroRemito
                                .toUpperCase()
                            ===
                            analisisIA.numeroRemito
                                ?.toUpperCase()
                    );

                if (!existente) {

                    return formData.remitoId;
                }

                remitoId =
                    existente.id;

                setFormData((prev) => ({

                    ...prev,

                    remitoId
                }));
            }

            // La subida del archivo va en un try/catch aparte: si falla,
            // no se confunde con "el remito ya existía" (que es lo que
            // atrapa el catch de arriba), y el usuario se entera de que el
            // PDF en particular no quedó adjuntado.
            if (archivoAnalizadoIA) {

                try {

                    await subirArchivoRemito(
                        remitoId,
                        archivoAnalizadoIA
                    );

                    // Vuelve a traer los remitos para que "tieneArchivo" se
                    // actualice (el fetch anterior fue antes de subir el
                    // PDF) y el botón "Ver PDF" aparezca sin recargar.
                    const remitosConArchivo =
                        await obtenerRemitos();

                    setRemitos(
                        remitosConArchivo
                    );

                } catch {

                    setError(
                        "El remito se asoció, pero no se pudo adjuntar el PDF analizado. Puede subirlo manualmente desde \"Documentación\"."
                    );
                }
            }

            return remitoId;
        };

    const handleConfirmarImportacionIA =
        async () => {

            if (!analisisIA) {

                return;
            }

            if (!formData.posicionInicialId) {

                setError(
                    "Seleccione la posición inicial antes de importar los relés detectados"
                );

                return;
            }

            setCreandoLoteIA(true);

            setError("");

            const relesValidos =
                analisisIA.reles.filter(
                    (rele) => rele.valido
                );

            try {

                // Si todavía no hay un remito asociado en el formulario,
                // lo creamos automáticamente con los datos que detectó la
                // IA (y le adjuntamos el mismo PDF analizado), para que el
                // documento quede asociado a los relés sin que el usuario
                // tenga que repetir el alta manual del remito.
                const remitoIdParaImportar =
                    await resolverRemitoParaImportacionIA();

                let creados = 0;

                for (const rele of relesValidos) {

                    const releData: ReleRequest = {

                        numeroSerie:
                            rele.numeroSerie ?? "",

                        codigoConfiguracion:
                            rele.codigoConfiguracion ?? "",

                        orderCode: "",

                        modeloId:
                            rele.modeloId ?? "",

                        tipoIngreso:
                            formData.tipoIngreso,

                        remitoId:
                            remitoIdParaImportar,

                        ordenProvisionId:
                            formData.ordenProvisionId,

                        posicionInicialId:
                            formData.posicionInicialId,

                        cargarGarantia:
                            formData.cargarGarantia,

                        garantiaMeses:
                            formData.cargarGarantia
                                ? formData.garantiaMeses
                                : null,

                        inicioGarantia:
                            formData.cargarGarantia
                                ? (
                                    formData.usarFechaActual
                                        ? null
                                        : formData.inicioGarantia
                                )
                                : null
                    };

                    const releCreado =
                        await onCreate(
                            releData
                        );

                    creados += 1;

                    setRelesDelLote((prev) => [

                        ...prev,

                        {
                            id:
                                releCreado.id,

                            numeroSerie:
                                rele.numeroSerie ?? "",

                            modelo:
                                rele.modelo ?? ""
                        }
                    ]);
                }

                setSuccessMsg(
                    `Se crearon ${creados} relés desde el remito.`
                );

                setDialogIAAbierto(false);

                setAnalisisIA(null);

                setArchivoAnalizadoIA(null);

                // La importación de un remito entero se considera un lote
                // completo en sí mismo: se da por terminada la carga (igual
                // que "TERMINAR CARGA" en el flujo manual) en vez de dejar
                // el formulario abierto esperando más altas manuales.
                limpiarFormulario();

            } catch (err: any) {

                setError(

                    err?.response?.data?.message

                    ||

                    "Error al crear los relés detectados por IA"
                );

            } finally {

                setCreandoLoteIA(false);
            }
        };

    // Refresca los catalogos (marca/modelo/proveedor) despues de crearlos
    // desde el dialogo de importacion inteligente, para que el resto del
    // formulario (selects de Marca/Modelo, mini-form de Remito) los vea sin
    // recargar la pagina. La revalidacion del analisis en si la dispara el
    // propio dialogo contra el backend, no depende de este refresco.
    const handleCatalogosActualizadosDesdeIA =
        async () => {

            try {

                const [
                    marcasData,
                    modelosData,
                    proveedoresData
                ] = await Promise.all([

                    obtenerMarcas(),

                    obtenerModelos(),

                    obtenerProveedores()
                ]);

                setMarcas(
                    marcasData
                );

                setModelos(
                    modelosData
                );

                setProveedores(
                    proveedoresData
                );

            } catch {

                // Silencioso: si falla el refresco de catalogos no se
                // bloquea el flujo de importacion, que igual revalida
                // contra el backend con los datos ya persistidos.
            }
        };

    const handleCrearModeloInline =
        async (data: any) => {

            try {

                const nuevoModelo =
                    await crearModelo(data);

                const nuevosModelos =
                    await obtenerModelos();

                setModelos(
                    nuevosModelos
                );

                setFormData((prev) => ({

                    ...prev,

                    modeloId:
                        nuevoModelo.id
                }));

                setMostrarModeloInline(
                    false
                );

                setOpenMarcaDialog(
                    false
                );

            } catch (err) {

                setError(
                    extraerMensajeError(
                        err,
                        "No se pudo crear el modelo. Intente nuevamente."
                    )
                );
            }
        };

    const handleCrearOPInline =
        async () => {

            try {

                const opCreada =
                    await crearOrdenProvision({

                        numero:
                            nuevaOP.numero,

                        observaciones:
                            nuevaOP.observaciones
                    });

                if (
                    archivoOP &&
                    opCreada.id
                ) {

                    await subirArchivoOP(
                        opCreada.id,
                        archivoOP
                    );
                }

                const opActualizadas =
                    await obtenerOrdenesProvision();

                setOrdenesProvision(
                    opActualizadas
                );

                setFormData((prev) => ({

                    ...prev,

                    ordenProvisionId:
                        opCreada.id
                }));

                setNuevaOP({

                    numero: "",

                    observaciones: ""
                });

                setArchivoOP(
                    null
                );

                setMostrarOPInline(
                    false
                );

            } catch (err) {

                setError(
                    extraerMensajeError(
                        err,
                        "No se pudo crear la orden de provisión. Intente nuevamente."
                    )
                );
            }
        };

    const handleAbrirDialogoUbicacion =
        async () => {

            setError("");

            try {

                const provinciasData =
                    await obtenerProvincias();

                setProvincias(
                    provinciasData
                );

            } catch (err) {

                setError(
                    extraerMensajeError(
                        err,
                        "No se pudieron cargar las provincias. Intente nuevamente."
                    )
                );

                return;
            }

            setUbProvinciaId("");
            setUbLocalidadId("");
            setUbDestinoId("");
            setUbNuevaProvinciaNombre("");
            setUbNuevaLocalidadNombre("");
            setUbNuevoDestinoNombre("");
            setUbNuevaPosicionNombre("");
            setLocalidadesCascada([]);
            setDestinosCascada([]);

            setOpenUbicacionDialog(true);
        };

    const handleCrearProvinciaEnCadena =
        async () => {

            if (!ubNuevaProvinciaNombre.trim()) {

                return;
            }

            setUbGuardando(true);

            try {

                const nuevaProvincia =
                    await crearProvincia({
                        nombre: ubNuevaProvinciaNombre.trim()
                    });

                const provinciasActualizadas =
                    await obtenerProvincias();

                setProvincias(
                    provinciasActualizadas
                );

                setUbProvinciaId(
                    nuevaProvincia.id
                );

                setUbNuevaProvinciaNombre("");

            } catch (err) {

                setError(
                    extraerMensajeError(
                        err,
                        "No se pudo crear la provincia. Intente nuevamente."
                    )
                );

            } finally {

                setUbGuardando(false);
            }
        };

    const handleCrearLocalidadEnCadena =
        async () => {

            if (
                !ubProvinciaId
                ||
                !ubNuevaLocalidadNombre.trim()
            ) {

                return;
            }

            setUbGuardando(true);

            try {

                const nuevaLocalidad =
                    await crearLocalidad({
                        nombre: ubNuevaLocalidadNombre.trim(),
                        provinciaId: Number(ubProvinciaId)
                    });

                const localidadesActualizadas =
                    await obtenerLocalidadesPorProvincia(
                        Number(ubProvinciaId)
                    );

                setLocalidadesCascada(
                    localidadesActualizadas
                );

                setUbLocalidadId(
                    nuevaLocalidad.id
                );

                setUbNuevaLocalidadNombre("");

            } catch (err) {

                setError(
                    extraerMensajeError(
                        err,
                        "No se pudo crear la localidad. Intente nuevamente."
                    )
                );

            } finally {

                setUbGuardando(false);
            }
        };

    const handleCrearDestinoEnCadena =
        async () => {

            if (
                !ubLocalidadId
                ||
                !ubNuevoDestinoNombre.trim()
            ) {

                return;
            }

            setUbGuardando(true);

            try {

                const nuevoDestino =
                    await crearDestino({
                        nombre: ubNuevoDestinoNombre.trim(),
                        localidadId: Number(ubLocalidadId)
                    });

                const destinosActualizados =
                    await obtenerDestinosPorLocalidad(
                        Number(ubLocalidadId)
                    );

                setDestinosCascada(
                    destinosActualizados
                );

                setUbDestinoId(
                    nuevoDestino.id
                );

                setUbNuevoDestinoNombre("");

            } catch (err) {

                setError(
                    extraerMensajeError(
                        err,
                        "No se pudo crear el destino. Intente nuevamente."
                    )
                );

            } finally {

                setUbGuardando(false);
            }
        };

    const handleCrearPosicionEnCadena =
        async () => {

            if (
                !ubDestinoId
                ||
                !ubNuevaPosicionNombre.trim()
            ) {

                return;
            }

            setUbGuardando(true);

            try {

                const nuevaPosicion =
                    await crearPosicion({
                        nombre: ubNuevaPosicionNombre.trim(),
                        destinoId: Number(ubDestinoId)
                    });

                const posicionesActualizadas =
                    await obtenerPosiciones();

                setPosicionesIniciales(
                    posicionesActualizadas
                );

                setFormData((prev) => ({

                    ...prev,

                    posicionInicialId:
                        nuevaPosicion.id
                }));

                setOpenUbicacionDialog(false);

            } catch (err) {

                setError(
                    extraerMensajeError(
                        err,
                        "No se pudo crear la posición. Intente nuevamente."
                    )
                );

            } finally {

                setUbGuardando(false);
            }
        };

    useEffect(() => {

        if (marcaId) {

            const filtrados =
                modelos.filter(
                    (modelo) =>
                        modelo.marcaId ===
                        Number(marcaId)
                );

            setModelosFiltrados(
                filtrados
            );

        } else {

            setModelosFiltrados([]);
        }

    }, [marcaId, modelos]);

    const handleSeleccionarUbProvincia = (
        id: number
    ) => {

        setUbProvinciaId(id);

        setUbLocalidadId("");

        setUbDestinoId("");

        setDestinosCascada([]);

        obtenerLocalidadesPorProvincia(
            id
        ).then(
            setLocalidadesCascada
        );
    };

    const handleSeleccionarUbLocalidad = (
        id: number
    ) => {

        setUbLocalidadId(id);

        setUbDestinoId("");

        obtenerDestinosPorLocalidad(
            id
        ).then(
            setDestinosCascada
        );
    };

    const cargarDatos = async () => {

        try {

            const [

                marcasData,

                modelosData,

                remitosData,

                ordenesProvisionData,

                proveedoresData,

                remitosDisponiblesData,

                opsDisponiblesData

            ] = await Promise.all([

                obtenerMarcas(),

                obtenerModelos(),

                obtenerRemitos(),

                obtenerOrdenesProvision(),

                obtenerProveedores(),

                obtenerRemitosDisponibles(),

                obtenerOrdenesProvisionDisponibles()
            ]);

            setMarcas(
                marcasData
            );

            setModelos(
                modelosData
            );

            setRemitos(
                remitosData
            );

            setOrdenesProvision(
                ordenesProvisionData
            );
            
            setProveedores(
                proveedoresData
            );

            setRemitosDisponibles(
                remitosDisponiblesData
            );

            setOpDisponibles(
                opsDisponiblesData
            );

            // Se trae el catálogo completo de posiciones (no solo las de un
            // destino fijo): si la base está recién limpiada no hay ningún
            // destino/posición todavía, y restringir a un nombre hardcodeado
            // dejaba el select vacío y bloqueaba el alta (el campo es
            // obligatorio). El usuario puede crear la cadena completa
            // Provincia → Localidad → Destino → Posición sin salir del
            // formulario con el botón "+ Nueva ubicación".
            const posiciones =
                await obtenerPosiciones();

            setPosicionesIniciales(
                posiciones
            );

            // Por ahora, todo relé nuevo se carga por defecto en la
            // posición "Depósito" de "Area Protecciones" si ese catálogo ya
            // existe (dato operativo real, ver migracion V29); el usuario
            // puede cambiarla en el selector si hace falta otra.
            const posicionDeposito =
                posiciones.find(
                    (p) =>
                        p.destino === "Area Protecciones"
                        &&
                        p.nombre === "Depósito"
                );

            if (posicionDeposito) {

                setFormData(
                    (prev) => ({
                        ...prev,
                        posicionInicialId:
                            prev.posicionInicialId
                            ?? posicionDeposito.id
                    })
                );
            }

            } catch (err) {

                setError(
                    extraerMensajeError(
                        err,
                        "No se pudieron cargar los catálogos necesarios para el formulario. Intente nuevamente."
                    )
                );
            }
        };


    const limpiarFormulario = () => {

        setFormData({

            numeroSerie: "",

            codigoConfiguracion: "",

            orderCode: "",

            modeloId: "",

            tipoIngreso: "NUEVO",

            remitoId: null,

            ordenProvisionId: null,

            posicionInicialId: undefined,

            cargarGarantia: true,

            garantiaMeses: 120,

            usarFechaActual: true,

            inicioGarantia: null
        });

        setMarcaId("");

        setError("");

        setGarantiaAbierta(true);

        setDocumentacionAbierta(false);

        if (editandoDesdeLote) {

            setEditandoDesdeLote(false);

            onTerminarEdicionDeLote();

        } else {

            setRelesDelLote([]);

            onCancelEdit();
        }
    };

    const handleChange = (
        e: any
    ) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]:
                type === "checkbox"
                    ? checked
                    : typeof value === "string"
                        ? (
                            name === "codigoConfiguracion"
                                ? value.replace(/[\r\n]+/g, "")
                                : value
                        ).toUpperCase()
                        : value
        }));
    };

    const handleSubmit = async (
        e: any
    ) => {

        e.preventDefault();

        setLoading(true);

        setError("");

        try {

            if (
                formData.cargarGarantia &&
                !formData.garantiaMeses
            ) {

                setError(
                    "Debe ingresar duración de garantía"
                );

                setLoading(false);

                return;
            }

            const releData = {

                numeroSerie:
                    formData.numeroSerie,

                codigoConfiguracion:
                    formData.codigoConfiguracion,

                orderCode:
                    formData.orderCode,

                modeloId:
                    formData.modeloId,

                tipoIngreso:
                    formData.tipoIngreso,

                remitoId:
                    formData.remitoId,

                ordenProvisionId:
                    formData.ordenProvisionId,

                posicionInicialId:
                    formData.posicionInicialId,

                cargarGarantia:
                    formData.cargarGarantia,

                garantiaMeses:
                    formData.cargarGarantia
                        ? formData.garantiaMeses
                        : null,

                inicioGarantia:
                    formData.cargarGarantia
                        ? (
                            formData.usarFechaActual
                                ? null
                                : formData.inicioGarantia
                        )
                        : null
            };

            if (releEditando) {

                await onUpdate(
                    releEditando.id,
                    releData
                );

                limpiarFormulario();

            } else {

                const releCreado =
                    await onCreate(
                        releData
                    );

                setSuccessMsg(
                    `Relé ${formData.numeroSerie} creado. Continúe con el siguiente.`
                );

                setRelesDelLote((prev) => [

                    ...prev,

                    {
                        id:
                            releCreado.id,

                        numeroSerie:
                            formData.numeroSerie,

                        modelo:
                            modelos.find(
                                (m) =>
                                    m.id === formData.modeloId
                            )?.nombre
                            ??
                            ""
                    }
                ]);

                setFormData((prev) => ({

                    ...prev,

                    numeroSerie: "",

                    codigoConfiguracion: "",

                    orderCode: ""
                }));

                numeroSerieInputRef.current?.focus();
            }

        } catch (err: any) {

            setError(

                err?.response?.data?.message

                ||

                "Error al guardar relé"
            );

        } finally {

            setLoading(false);
        }
    };
            

    return (

        <Paper
            sx={{
                p: 3,
                mb: 4,
                borderRadius: 4
            }}
        >

            <Typography
                variant="h5"
                sx={{ mb: 3 }}
            >

                {
                    releEditando
                        ? "Editar Relé"
                        : "Crear Relé"
                }

            </Typography>

            {
                error && (

                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Alert>
                )
            }

            {
                !releEditando
                &&
                relesDelLote.length > 0 && (

                    <Paper
                        variant="outlined"
                        sx={(theme) => ({
                            p: 2,
                            mb: 3,
                            borderRadius: 3,
                            borderColor: "success.main",
                            backgroundColor:
                                alpha(theme.palette.success.main, 0.08)
                        })}
                    >

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 1
                            }}
                        >

                            <PlaylistAddCheckIcon
                                color="success"
                                fontSize="small"
                            />

                            <Typography
                                sx={{ fontWeight: 600 }}
                            >

                                Lote actual
                                {" — "}
                                {relesDelLote.length}
                                {" "}
                                {
                                    relesDelLote.length === 1
                                        ? "relé cargado"
                                        : "relés cargados"
                                }

                            </Typography>

                        </Box>

                        {
                            (remitoSeleccionado || opSeleccionada) && (

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{ mb: 1.5, flexWrap: "wrap" }}
                                    useFlexGap
                                >

                                    {
                                        remitoSeleccionado && (

                                            <Chip
                                                icon={<LocalShippingIcon />}
                                                label={
                                                    `Remito: ${remitoSeleccionado.numeroRemito}`
                                                }
                                                size="small"
                                                color="info"
                                                variant="outlined"
                                            />
                                        )
                                    }

                                    {
                                        opSeleccionada && (

                                            <Chip
                                                icon={<DescriptionIcon />}
                                                label={
                                                    `OP: ${opSeleccionada.numero}`
                                                }
                                                size="small"
                                                color="info"
                                                variant="outlined"
                                            />
                                        )
                                    }

                                </Stack>
                            )
                        }

                        <Divider sx={{ mb: 1.5 }} />

                        <Stack
                            direction="row"
                            spacing={1}
                            useFlexGap
                            sx={{ flexWrap: "wrap" }}
                        >

                            {
                                relesDelLote.map(
                                    (rele) => (

                                        <Tooltip
                                            key={rele.id}
                                            title="Editar este relé"
                                        >

                                            <Chip
                                                label={
                                                    rele.modelo
                                                        ? `${rele.modelo} · ${rele.numeroSerie}`
                                                        : rele.numeroSerie
                                                }
                                                size="small"
                                                color="success"
                                                variant="outlined"
                                                onClick={() => {

                                                    setEditandoDesdeLote(
                                                        true
                                                    );

                                                    onEditarDesdeLote(
                                                        rele.id
                                                    );
                                                }}
                                            />

                                        </Tooltip>
                                    )
                                )
                            }

                        </Stack>

                    </Paper>
                )
            }

            <form
                onSubmit={handleSubmit}
            >

                <Grid
                    container
                    spacing={2}
                >

                    <Grid size={12}>

                        <Typography
                            variant="overline"
                            color="text.secondary"
                        >
                            Datos del Relé
                        </Typography>

                    </Grid>

                    <Grid size={12}>

                        <FormControl
                        
                            fullWidth
                        >

                            <InputLabel
                                id="marca-select-label"
                            >
                                Marca
                            </InputLabel>

                            <Select
                                labelId="marca-select-label"
                                value={marcaId}
                                label="Marca"
                                onChange={(e) => {

                                    setMarcaId(
                                        Number(
                                            e.target.value
                                        )
                                    );

                                    setFormData(
                                        (prev) => ({
                                            ...prev,
                                            modeloId: 0
                                        })
                                    );
                                }}
                            >

                                {
                                    marcas.map(
                                        (marca) => (

                                        <MenuItem
                                            key={marca.id}
                                            value={marca.id}
                                        >

                                            {marca.nombre}

                                        </MenuItem>
                                    ))
                                }

                            </Select>

                        </FormControl>

                        <Button
                            size="small"
                            sx={{
                                mt: 1,
                                alignSelf: "flex-start"
                            }}
                            onClick={() =>
                                setOpenMarcaDialog(true)
                            }
                        >

                            + Nueva Marca

                        </Button>

                    </Grid>

                    <Grid size={12}>

                        <FormControl
                            fullWidth
                        >

                            <InputLabel
                                id="modelo-select-label"
                            >
                                Modelo
                            </InputLabel>

                            <Select
                                labelId="modelo-select-label"
                                name="modeloId"
                                value={
                                    formData.modeloId
                                }
                                label="Modelo"
                                onChange={
                                    handleChange
                                }
                            >

                                {
                                    modelosFiltrados.map(
                                        (modelo) => (

                                        <MenuItem
                                            key={modelo.id}
                                            value={modelo.id}
                                        >

                                            {modelo.nombre}

                                        </MenuItem>
                                    ))
                                }

                            </Select>

                        </FormControl>

                        <Button
                            size="small"
                            sx={{
                                mt: 1,
                                alignSelf: "flex-start"
                            }}
                            onClick={() => {

                                setMostrarModeloInline(
                                    true
                                );

                                setOpenMarcaDialog(
                                    true
                                );
                            }}
                        >

                            + Nuevo Modelo

                        </Button>

                    </Grid>

                    <Grid size={12}>

                        <TextField
                            label="Número Serie"
                            name="numeroSerie"
                            value={
                                formData.numeroSerie
                            }
                            onChange={
                                handleChange
                            }
                            inputRef={
                                numeroSerieInputRef
                            }
                            autoComplete="off"
                            fullWidth
                            required
                            error={
                                Boolean(duplicadoDetectado)
                            }
                            helperText={
                                duplicadoDetectado
                                    ? `Ya existe un relé con esta serie: ${duplicadoDetectado.modelo} — estado ${duplicadoDetectado.estadoActual}${duplicadoDetectado.activo ? "" : " (dado de baja)"}.`
                                    : verificandoSerie
                                        ? "Verificando disponibilidad..."
                                        : " "
                            }
                        />

                    </Grid>

                    <Grid size={12}>

                        <TextField
                            label="Cod. Configuración"
                            name="codigoConfiguracion"
                            value={
                                formData.codigoConfiguracion
                            }
                            onChange={
                                handleChange
                            }
                            autoComplete="off"
                            fullWidth
                            multiline
                            maxRows={3}
                            slotProps={{
                                htmlInput: {
                                    maxLength: 400
                                }
                            }}
                            helperText={
                                `${formData.codigoConfiguracion.length}/400`
                            }
                        />

                    </Grid>

                    <Grid size={12}>

                        <TextField
                            label="Order Code"
                            name="orderCode"
                            value={
                                formData.orderCode
                            }
                            onChange={
                                handleChange
                            }
                            autoComplete="off"
                            fullWidth
                            slotProps={{
                                htmlInput: {
                                    maxLength: 150
                                }
                            }}
                            helperText={
                                `${formData.orderCode.length}/150`
                            }
                        />

                    </Grid>

                        {
                        !releEditando && (

                            <Grid size={12}>

                                <FormControl fullWidth>

                                    <InputLabel
                                        id="posicion-inicial-select-label"
                                    >
                                        Posición Inicial
                                    </InputLabel>

                                    <Select
                                        labelId="posicion-inicial-select-label"
                                        value={
                                            formData.posicionInicialId
                                            ?? ""
                                        }
                                        label="Posición Inicial"
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                posicionInicialId:
                                                    Number(
                                                        e.target.value
                                                    )
                                            }))
                                        }
                                    >

                                        {
                                            posicionesIniciales.map(
                                                (posicion) => (

                                                    <MenuItem
                                                        key={
                                                            posicion.id
                                                        }
                                                        value={
                                                            posicion.id
                                                        }
                                                    >
                                                        {
                                                            `${posicion.destino} · ${posicion.nombre}`
                                                        }
                                                    </MenuItem>
                                                )
                                            )
                                        }

                                    </Select>

                                </FormControl>

                                <Button
                                    size="small"
                                    sx={{
                                        mt: 1,
                                        alignSelf: "flex-start"
                                    }}
                                    onClick={
                                        handleAbrirDialogoUbicacion
                                    }
                                >

                                    + Nueva ubicación

                                </Button>

                            </Grid>

                        )
                    }

                    <Grid size={12}>

                        <Accordion
                            expanded={garantiaAbierta}
                            onChange={(_, expandida) =>
                                setGarantiaAbierta(expandida)
                            }
                        >

                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                            >

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        width: "100%"
                                    }}
                                >

                                    <Typography
                                        sx={{ fontWeight: 600 }}
                                    >
                                        Garantía
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >

                                        {
                                            formData.cargarGarantia
                                            &&
                                            formData.garantiaMeses
                                                ? `${formData.garantiaMeses} meses`
                                                : "Sin garantía cargada"
                                        }

                                    </Typography>

                                </Box>

                            </AccordionSummary>

                            <AccordionDetails>

                                <Grid
                                    container
                                    spacing={2}
                                >

                                    <Grid size={12}>

                                        <FormControlLabel
                                            control={

                                                <Checkbox
                                                    checked={formData.cargarGarantia}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            cargarGarantia:
                                                                e.target.checked
                                                        }))
                                                    }
                                                />
                                            }
                                            label="Cargar garantía"
                                        />

                                    </Grid>

                                    {
                                        formData.cargarGarantia && (

                                            <>

                                                <Grid size={{ xs: 12, sm: 6 }}>

                                                    <TextField
                                                        type="number"
                                                        label="Meses Garantía"
                                                        value={
                                                            formData.garantiaMeses || ""
                                                        }
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                garantiaMeses:
                                                                    Number(
                                                                        e.target.value
                                                                    )
                                                            }))
                                                        }
                                                        fullWidth
                                                    />

                                                </Grid>

                                                <Grid size={{ xs: 12, sm: 6 }}>

                                                    <ToggleButtonGroup
                                                        exclusive
                                                        value={
                                                            formData.usarFechaActual
                                                                ? "AUTO"
                                                                : "MANUAL"
                                                        }
                                                        onChange={(_, value) => {

                                                            if (!value) return;

                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                usarFechaActual:
                                                                    value === "AUTO"
                                                            }));
                                                        }}
                                                        fullWidth
                                                    >

                                                        <ToggleButton value="AUTO">
                                                            Fecha actual
                                                        </ToggleButton>

                                                        <ToggleButton value="MANUAL">
                                                            Fecha manual
                                                        </ToggleButton>

                                                    </ToggleButtonGroup>

                                                </Grid>

                                                {
                                                    !formData.usarFechaActual && (

                                                        <Grid size={12}>

                                                            <TextField
                                                                type="date"
                                                                fullWidth
                                                                label="Inicio Garantía"
                                                                value={
                                                                    formData.inicioGarantia || ""
                                                                }
                                                                slotProps={{
                                                                    inputLabel: {
                                                                        shrink: true
                                                                    }
                                                                }}
                                                                onChange={(e) =>
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        inicioGarantia:
                                                                            e.target.value
                                                                    }))
                                                                }
                                                            />

                                                        </Grid>
                                                    )
                                                }

                                            </>
                                        )
                                    }

                                </Grid>

                            </AccordionDetails>

                        </Accordion>

                    </Grid>

                    <Grid size={12}>

                                <Accordion
                                    expanded={documentacionAbierta}
                                    onChange={(_, expandida) =>
                                        setDocumentacionAbierta(expandida)
                                    }
                                >

                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >

                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 2,
                                                width: "100%"
                                            }}
                                        >

                                            <Typography
                                                sx={{ fontWeight: 600 }}
                                            >
                                                Documentación (Remito / Orden de Provisión)
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >

                                                {
                                                    [
                                                        remitoSeleccionado
                                                            ? `Remito ${remitoSeleccionado.numeroRemito}`
                                                            : null,
                                                        opSeleccionada
                                                            ? `OP ${opSeleccionada.numero}`
                                                            : null
                                                    ].filter(
                                                        (v): v is string => v !== null
                                                    ).join(" · ")
                                                    ||
                                                    "Opcional - sin documentación asociada"
                                                }

                                            </Typography>

                                        </Box>

                                    </AccordionSummary>

                                    <AccordionDetails>

                                        <Grid
                                            container
                                            spacing={2}
                                        >

                                            <Grid size={12}>

                                                <Alert severity="info">

                                                    La documentación inicial es opcional. Puede asociarse
                                                    un remito, una orden de provisión, ambos o ninguno.

                                                </Alert>

                                            </Grid>

                                            <Grid size={12}>

                                                <Paper
                                                    variant="outlined"
                                                    sx={(theme) => ({
                                                        p: 2.5,
                                                        borderRadius: 3,
                                                        borderWidth: 2,
                                                        borderColor: "primary.main",
                                                        backgroundColor:
                                                            alpha(theme.palette.primary.main, 0.06),
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        gap: 1
                                                    })}
                                                >

                                                    <Stack
                                                        direction={{ xs: "column", sm: "row" }}
                                                        spacing={1}
                                                        sx={{ width: "100%" }}
                                                    >

                                                        <Button
                                                            variant="contained"
                                                            component="label"
                                                            size="large"
                                                            fullWidth
                                                            startIcon={
                                                                <AutoAwesomeIcon fontSize="medium" />
                                                            }
                                                            disabled={analizandoRemito}
                                                            sx={{
                                                                py: 1.5,
                                                                fontSize: "1rem",
                                                                fontWeight: 700,
                                                                borderRadius: 2,
                                                                boxShadow: 3,
                                                                textTransform: "none"
                                                            }}
                                                        >

                                                            {
                                                                analizandoRemito
                                                                    ? "Analizando remito..."
                                                                    : "Cargar desde Remito con IA"
                                                            }

                                                            <input
                                                                hidden
                                                                type="file"
                                                                accept="application/pdf,image/png,image/jpeg,image/jpg,image/webp"
                                                                onChange={(e) => {

                                                                    const archivo =
                                                                        e.target.files?.[0]
                                                                        ?? null;

                                                                    handleArchivoIA(
                                                                        archivo
                                                                    );

                                                                    e.target.value = "";
                                                                }}
                                                            />

                                                        </Button>

                                                        <Button
                                                            variant="outlined"
                                                            component="label"
                                                            size="large"
                                                            startIcon={
                                                                <PhotoCameraIcon fontSize="medium" />
                                                            }
                                                            disabled={analizandoRemito}
                                                            sx={{
                                                                py: 1.5,
                                                                fontWeight: 700,
                                                                borderRadius: 2,
                                                                textTransform: "none",
                                                                flexShrink: 0
                                                            }}
                                                        >

                                                            Tomar foto

                                                            <input
                                                                hidden
                                                                type="file"
                                                                accept="image/*"
                                                                capture="environment"
                                                                onChange={(e) => {

                                                                    const archivo =
                                                                        e.target.files?.[0]
                                                                        ?? null;

                                                                    handleArchivoIA(
                                                                        archivo
                                                                    );

                                                                    e.target.value = "";
                                                                }}
                                                            />

                                                        </Button>

                                                    </Stack>

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{ textAlign: "center" }}
                                                    >
                                                        Subí el PDF o la foto del remito y el sistema
                                                        detecta automáticamente los relés, sus modelos
                                                        y números de serie.
                                                    </Typography>

                                                </Paper>

                                            </Grid>

                                            <Grid size={{ xs: 12, md: 6 }}>

                                    {
                                        opSeleccionada && (

                                            <Alert
                                                severity="success"
                                                sx={{ mb: 2 }}
                                            >
                                                Orden de provisión asociada:
                                                {" "}
                                                {opSeleccionada.numero}
                                            </Alert>
                                        )
                                    }

                                    <ToggleButtonGroup
                                        value={modoOP}
                                        exclusive
                                        fullWidth
                                        onChange={(_, value) => {

                                            if (!value) return;

                                            setModoOP(value);
                                        }}
                                        sx={{ mb: 2 }}
                                    >

                                        <ToggleButton value="nuevo">

                                            Crear nueva

                                        </ToggleButton>

                                        <ToggleButton value="existente">

                                            Seleccionar existente

                                        </ToggleButton>

                                    </ToggleButtonGroup>

                                    {
                                        modoOP === "nuevo" && (

                                            <Grid size={12}>

                                                <Paper
                                                    sx={{
                                                        p: 2,
                                                        mt: 1
                                                    }}
                                                >

                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{ mb: 2 }}
                                                    >
                                                        Crear Orden de Provisión
                                                    </Typography>

                                                    <Grid
                                                        container
                                                        spacing={2}
                                                    >

                                                        <Grid size={{ xs: 12, sm: 6 }}>

                                                            <TextField
                                                                label="Número OP"
                                                                value={
                                                                    nuevaOP.numero
                                                                }
                                                                onChange={(e) =>
                                                                    setNuevaOP(
                                                                        (prev) => ({
                                                                            ...prev,
                                                                            numero:
                                                                                e.target.value
                                                                        })
                                                                    )
                                                                }
                                                                fullWidth
                                                            />

                                                        </Grid>

                                                        <Grid size={{ xs: 12, sm: 6 }}>

                                                            <TextField
                                                                label="Observaciones"
                                                                value={
                                                                    nuevaOP.observaciones
                                                                }
                                                                onChange={(e) =>
                                                                    setNuevaOP(
                                                                        (prev) => ({
                                                                            ...prev,
                                                                            observaciones:
                                                                                e.target.value
                                                                        })
                                                                    )
                                                                }
                                                                fullWidth
                                                            />

                                                        </Grid>

                                                        <Grid size={{ xs: 12, sm: 6 }}>

                                                            <SelectorArchivoAdjunto
                                                                label="Seleccionar PDF"
                                                                labelSeleccionado="PDF/foto listo"
                                                                value={archivoOP}
                                                                onChange={setArchivoOP}
                                                            />

                                                        </Grid>

                                                        <Grid size={{ xs: 12, sm: 6 }}>

                                                            <Button
                                                                variant="contained"
                                                                fullWidth
                                                                onClick={
                                                                    handleCrearOPInline
                                                                }
                                                            >
                                                                GUARDAR OP
                                                            </Button>

                                                        </Grid>

                                                    </Grid>

                                                    {
                                                        archivoOP && (

                                                            <Typography
                                                                variant="body2"
                                                                sx={{ mt: 1 }}
                                                            >
                                                                Archivo seleccionado:
                                                                {" "}
                                                                {archivoOP.name}
                                                            </Typography>

                                                        )
                                                    }

                                                </Paper>

                                            </Grid>
                                        )
                                    }

                                    {
                                        modoOP === "existente" && (

                                            <Grid size={12}>

                                                <TextField
                                                    select
                                                    label="Seleccionar Orden de Provisión"

                                                    value={
                                                        formData.ordenProvisionId ?? ""
                                                    }

                                                    onChange={(e) =>

                                                        setFormData({

                                                            ...formData,

                                                            ordenProvisionId:
                                                                Number(
                                                                    e.target.value
                                                                )
                                                        })
                                                    }

                                                    fullWidth
                                                >

                                                    {
                                                        opDisponibles.map(
                                                            (op) => (

                                                                <MenuItem
                                                                    key={op.id}
                                                                    value={op.id}
                                                                >

                                                                    {
                                                                        op.numero
                                                                    }

                                                                </MenuItem>
                                                            )
                                                        )
                                                    }

                                                </TextField>

                                            </Grid>
                                        )
                                    }

                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>

                                    {
                                        remitoSeleccionado && (

                                            <Alert
                                                severity="success"
                                                sx={{ mb: 2 }}
                                                action={
                                                    remitoSeleccionado.tieneArchivo ? (

                                                        <Button
                                                            color="inherit"
                                                            size="small"
                                                            onClick={() =>
                                                                abrirArchivoRemito(
                                                                    remitoSeleccionado.id
                                                                ).catch(() =>
                                                                    setError(
                                                                        "No se pudo abrir el PDF del remito"
                                                                    )
                                                                )
                                                            }
                                                        >
                                                            Ver PDF
                                                        </Button>

                                                    ) : undefined
                                                }
                                            >
                                                Remito asociado:
                                                {" "}
                                                {remitoSeleccionado.numeroRemito}
                                                {
                                                    !remitoSeleccionado.tieneArchivo
                                                    &&
                                                    " (sin PDF adjunto)"
                                                }
                                            </Alert>
                                        )
                                    }

                                    <ToggleButtonGroup
                                        value={modoRemito}
                                        exclusive
                                        fullWidth
                                        onChange={(_, value) => {

                                            if (!value) return;

                                            setModoRemito(value);
                                        }}
                                        sx={{ mb: 2 }}
                                    >

                                        <ToggleButton value="nuevo">

                                            Crear nuevo

                                        </ToggleButton>

                                        <ToggleButton value="existente">

                                            Seleccionar existente

                                        </ToggleButton>

                                    </ToggleButtonGroup>

                                    {
                                        modoRemito === "nuevo" && (

                                            <Grid size={12}>

                                                <Paper
                                                    sx={{
                                                        p: 2,
                                                        mt: 1
                                                    }}
                                                >

                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{ mb: 2 }}
                                                    >
                                                        Crear Remito
                                                    </Typography>

                                                    <Grid
                                                        container
                                                        spacing={2}
                                                    >

                                                        <Grid size={{ xs: 12, sm: 6 }}>

                                                            <TextField
                                                                label="Número Remito"
                                                                value={
                                                                    nuevoRemito.numeroRemito
                                                                }
                                                                onChange={(e) =>
                                                                    setNuevoRemito(
                                                                        (prev) => ({
                                                                            ...prev,
                                                                            numeroRemito:
                                                                                e.target.value
                                                                        })
                                                                    )
                                                                }
                                                                fullWidth
                                                            />

                                                        </Grid>

                                                        <Grid size={{ xs: 12, sm: 6 }}>

                                                            <TextField
                                                                select
                                                                label="Proveedor"
                                                                value={
                                                                    nuevoRemito.proveedorId
                                                                }
                                                                onChange={(e) =>
                                                                    setNuevoRemito(
                                                                        (prev) => ({
                                                                            ...prev,
                                                                            proveedorId:
                                                                                e.target.value
                                                                        })
                                                                    )
                                                                }
                                                                fullWidth
                                                            >

                                                                {
                                                                    proveedores.map(
                                                                        (
                                                                            proveedor
                                                                        ) => (

                                                                            <MenuItem
                                                                                key={
                                                                                    proveedor.id
                                                                                }
                                                                                value={
                                                                                    proveedor.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    proveedor.nombre
                                                                                }
                                                                            </MenuItem>
                                                                        )
                                                                    )
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
                                                                value={
                                                                    nuevoRemito.fecha
                                                                }
                                                                onChange={(e) =>
                                                                    setNuevoRemito(
                                                                        (prev) => ({
                                                                            ...prev,
                                                                            fecha:
                                                                                e.target.value
                                                                        })
                                                                    )
                                                                }
                                                            />

                                                        </Grid>

                                                        <Grid size={{ xs: 12, sm: 6 }}>

                                                            <SelectorArchivoAdjunto
                                                                label="Seleccionar PDF"
                                                                labelSeleccionado="PDF/foto listo"
                                                                value={archivoRemito}
                                                                onChange={setArchivoRemito}
                                                            />

                                                        </Grid>

                                                        <Grid size={{ xs: 12, sm: 6 }}>

                                                            <Button
                                                                variant="contained"
                                                                fullWidth
                                                                onClick={
                                                                    handleCrearRemitoInline
                                                                }
                                                            >
                                                                GUARDAR REMITO
                                                            </Button>

                                                        </Grid>

                                                    </Grid>

                                                    {
                                                        archivoRemito && (

                                                            <Typography
                                                                variant="body2"
                                                                sx={{ mt: 1 }}
                                                            >
                                                                Archivo seleccionado:
                                                                {" "}
                                                                {archivoRemito.name}
                                                            </Typography>

                                                        )
                                                    }

                                                </Paper>

                                            </Grid>
                                        )
                                    }

                                    {
                                        modoRemito === "existente" && (

                                            <Grid size={12}>

                                                <TextField
                                                    select
                                                    label="Seleccionar Remito"

                                                    value={
                                                        formData.remitoId ?? ""
                                                    }

                                                    onChange={(e) =>

                                                        setFormData({

                                                            ...formData,

                                                            remitoId:
                                                                Number(
                                                                    e.target.value
                                                                )
                                                        })
                                                    }

                                                    fullWidth
                                                >

                                                    {
                                                        remitosDisponibles.map(
                                                            (remito) => (

                                                                <MenuItem
                                                                    key={remito.id}
                                                                    value={remito.id}
                                                                >

                                                                    {
                                                                        remito.numeroRemito
                                                                    }

                                                                </MenuItem>
                                                            )
                                                        )
                                                    }

                                                </TextField>

                                            </Grid>
                                        )
                                    }

                                </Grid>

                                        </Grid>

                                    </AccordionDetails>

                                </Accordion>

                    </Grid>

                    <Grid size={12}>

                        <Box
                            sx={{ display: "flex", gap: 2 }}
                        >

                            <Button
                                variant="contained"
                                type="submit"
                                disabled={
                                    loading
                                    ||
                                    Boolean(duplicadoDetectado)
                                }
                                fullWidth
                            >

                                {
                                    releEditando
                                        ? "GUARDAR CAMBIOS"
                                        : "CREAR RELÉ"
                                }

                            </Button>

                            {
                                releEditando && (

                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        onClick={
                                            limpiarFormulario
                                        }
                                    >

                                        CANCELAR

                                    </Button>
                                )
                            }

                            {
                                !releEditando && (

                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        onClick={
                                            limpiarFormulario
                                        }
                                    >

                                        TERMINAR CARGA

                                    </Button>
                                )
                            }

                        </Box>

                    </Grid>

                </Grid>

            </form>


            <Dialog
                open={openMarcaDialog}
                onClose={() =>
                    setOpenMarcaDialog(false)
                }
                maxWidth="md"
                fullWidth
            >

                <DialogTitle>

                    {
                        mostrarModeloInline
                            ? "Nuevo Modelo"
                            : "Nueva Marca"
                    }

                </DialogTitle>

                <DialogContent>

                    {
                        !mostrarModeloInline && (

                            <MarcaForm
                                onSubmit={
                                    handleCrearMarcaInline
                                }
                                cancelarEdicion={() =>
                                    setOpenMarcaDialog(false)
                                }
                            />
                        )
                    }

                    {
                        mostrarModeloInline && (

                            <ModeloForm

                                onSubmit={
                                    handleCrearModeloInline
                                }

                                marcas={marcas}

                                cancelarEdicion={() => {

                                    setMostrarModeloInline(
                                        false
                                    );

                                    setOpenMarcaDialog(
                                        false
                                    );

                                    setMarcaCreadaId(
                                        null
                                    );
                                }}

                                marcaPreseleccionada={
                                    marcaCreadaId
                                    ?? (marcaId || undefined)
                                }

                                bloquearMarca={
                                    Boolean(marcaCreadaId)
                                }
                            />
                        )
                    }

                </DialogContent>

            </Dialog>

            <CargaInteligenteRemitoDialog
                open={dialogIAAbierto}
                analisis={analisisIA}
                creando={creandoLoteIA}
                marcas={marcas}
                onClose={() =>
                    setDialogIAAbierto(false)
                }
                onConfirmar={
                    handleConfirmarImportacionIA
                }
                onAnalisisActualizado={setAnalisisIA}
                onCatalogosActualizados={
                    handleCatalogosActualizadosDesdeIA
                }
            />

            <Dialog
                open={openUbicacionDialog}
                onClose={() =>
                    setOpenUbicacionDialog(false)
                }
                maxWidth="sm"
                fullWidth
            >

                <DialogTitle>
                    Nueva ubicación
                </DialogTitle>

                <DialogContent>

                    <Alert
                        severity="info"
                        sx={{ mb: 2 }}
                    >
                        Complete la cadena Provincia → Localidad → Destino →
                        Posición. Puede seleccionar una ya existente en cada
                        paso, o crear una nueva.
                    </Alert>

                    <Stack spacing={3}>

                        <Box>

                            <Typography
                                variant="subtitle2"
                                sx={{ mb: 1 }}
                            >
                                1. Provincia
                            </Typography>

                            <FormControl fullWidth>

                                <InputLabel id="ub-provincia-label">
                                    Provincia
                                </InputLabel>

                                <Select
                                    labelId="ub-provincia-label"
                                    label="Provincia"
                                    value={ubProvinciaId}
                                    onChange={(e) =>
                                        handleSeleccionarUbProvincia(
                                            Number(e.target.value)
                                        )
                                    }
                                >

                                    {
                                        provincias.map(
                                            (provincia) => (

                                                <MenuItem
                                                    key={provincia.id}
                                                    value={provincia.id}
                                                >
                                                    {provincia.nombre}
                                                </MenuItem>
                                            )
                                        )
                                    }

                                </Select>

                            </FormControl>

                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ mt: 1 }}
                            >

                                <TextField
                                    size="small"
                                    fullWidth
                                    label="O crear provincia nueva"
                                    value={ubNuevaProvinciaNombre}
                                    onChange={(e) =>
                                        setUbNuevaProvinciaNombre(
                                            e.target.value
                                        )
                                    }
                                />

                                <Button
                                    variant="outlined"
                                    disabled={
                                        ubGuardando
                                        ||
                                        !ubNuevaProvinciaNombre.trim()
                                    }
                                    onClick={
                                        handleCrearProvinciaEnCadena
                                    }
                                >
                                    Crear
                                </Button>

                            </Stack>

                        </Box>

                        <Divider />

                        <Box>

                            <Typography
                                variant="subtitle2"
                                sx={{ mb: 1 }}
                            >
                                2. Localidad
                            </Typography>

                            <FormControl
                                fullWidth
                                disabled={!ubProvinciaId}
                            >

                                <InputLabel id="ub-localidad-label">
                                    Localidad
                                </InputLabel>

                                <Select
                                    labelId="ub-localidad-label"
                                    label="Localidad"
                                    value={ubLocalidadId}
                                    onChange={(e) =>
                                        handleSeleccionarUbLocalidad(
                                            Number(e.target.value)
                                        )
                                    }
                                >

                                    {
                                        localidadesCascada.map(
                                            (localidad) => (

                                                <MenuItem
                                                    key={localidad.id}
                                                    value={localidad.id}
                                                >
                                                    {localidad.nombre}
                                                </MenuItem>
                                            )
                                        )
                                    }

                                </Select>

                            </FormControl>

                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ mt: 1 }}
                            >

                                <TextField
                                    size="small"
                                    fullWidth
                                    disabled={!ubProvinciaId}
                                    label="O crear localidad nueva"
                                    value={ubNuevaLocalidadNombre}
                                    onChange={(e) =>
                                        setUbNuevaLocalidadNombre(
                                            e.target.value
                                        )
                                    }
                                />

                                <Button
                                    variant="outlined"
                                    disabled={
                                        ubGuardando
                                        ||
                                        !ubProvinciaId
                                        ||
                                        !ubNuevaLocalidadNombre.trim()
                                    }
                                    onClick={
                                        handleCrearLocalidadEnCadena
                                    }
                                >
                                    Crear
                                </Button>

                            </Stack>

                        </Box>

                        <Divider />

                        <Box>

                            <Typography
                                variant="subtitle2"
                                sx={{ mb: 1 }}
                            >
                                3. Destino
                            </Typography>

                            <FormControl
                                fullWidth
                                disabled={!ubLocalidadId}
                            >

                                <InputLabel id="ub-destino-label">
                                    Destino
                                </InputLabel>

                                <Select
                                    labelId="ub-destino-label"
                                    label="Destino"
                                    value={ubDestinoId}
                                    onChange={(e) =>
                                        setUbDestinoId(
                                            Number(e.target.value)
                                        )
                                    }
                                >

                                    {
                                        destinosCascada.map(
                                            (destino) => (

                                                <MenuItem
                                                    key={destino.id}
                                                    value={destino.id}
                                                >
                                                    {destino.nombre}
                                                </MenuItem>
                                            )
                                        )
                                    }

                                </Select>

                            </FormControl>

                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ mt: 1 }}
                            >

                                <TextField
                                    size="small"
                                    fullWidth
                                    disabled={!ubLocalidadId}
                                    label="O crear destino nuevo"
                                    value={ubNuevoDestinoNombre}
                                    onChange={(e) =>
                                        setUbNuevoDestinoNombre(
                                            e.target.value
                                        )
                                    }
                                />

                                <Button
                                    variant="outlined"
                                    disabled={
                                        ubGuardando
                                        ||
                                        !ubLocalidadId
                                        ||
                                        !ubNuevoDestinoNombre.trim()
                                    }
                                    onClick={
                                        handleCrearDestinoEnCadena
                                    }
                                >
                                    Crear
                                </Button>

                            </Stack>

                        </Box>

                        <Divider />

                        <Box>

                            <Typography
                                variant="subtitle2"
                                sx={{ mb: 1 }}
                            >
                                4. Posición
                            </Typography>

                            <TextField
                                fullWidth
                                disabled={!ubDestinoId}
                                label="Nombre de la posición"
                                value={ubNuevaPosicionNombre}
                                onChange={(e) =>
                                    setUbNuevaPosicionNombre(
                                        e.target.value
                                    )
                                }
                            />

                        </Box>

                    </Stack>

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={() =>
                            setOpenUbicacionDialog(false)
                        }
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        disabled={
                            ubGuardando
                            ||
                            !ubDestinoId
                            ||
                            !ubNuevaPosicionNombre.trim()
                        }
                        onClick={
                            handleCrearPosicionEnCadena
                        }
                    >
                        Crear y usar como posición inicial
                    </Button>

                </DialogActions>

            </Dialog>

            <Snackbar
                open={Boolean(successMsg)}
                autoHideDuration={2500}
                onClose={() =>
                    setSuccessMsg("")
                }
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center"
                }}
            >

                <Alert severity="success">

                    {successMsg}

                </Alert>

            </Snackbar>

        </Paper>
    );
}

export default ReleForm;
