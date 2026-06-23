import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    ToggleButtonGroup,
    ToggleButton,
    Checkbox,
    FormControlLabel,
} from "@mui/material";

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
    crearModelo,
    obtenerModelos
} from "../../services/modeloService";

import type { Tipo } from "../../types/Tipo";
import { obtenerTipos } from "../../services/tipoService";

import MarcaForm from "../admin/marca/MarcaForm";
import ModeloForm from "../admin/modelo/ModeloForm";
import type { Posicion } from "../../types/Posicion";
import {
    obtenerDestinos
} from "../../services/destinoService";

import {
    obtenerPosicionesPorDestino
} from "../../services/posicionService";

import {
    obtenerRemitos,
    crearRemito,
    subirArchivoRemito,
    obtenerRemitosDisponibles
}
from "../../services/remitoService";

import type {
    Remito,
} from "../../types/Remito";



import {
    obtenerOrdenesProvision,
    crearOrdenProvision,
    subirArchivoOP,
    obtenerOrdenesProvisionDisponibles
} from "../../services/ordenProvisionService";

import type {
    Proveedor
} from "../../types/Proveedor";

import {
    obtenerProveedores
} from "../../services/proveedorService";

type ReleFormData = {

    numeroSerie: string;

    codigoConfiguracion: string;

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
    ) => Promise<void>;

    onUpdate: (
        id: number,
        data: ReleRequest
    ) => Promise<void>;

    releEditando: Rele | null;

    onCancelEdit: () => void;
}

function ReleForm({
    onCreate,
    onUpdate,
    releEditando,
    onCancelEdit
}: Props) {

    const [marcas, setMarcas] =
        useState<Marca[]>([]);

    const [modelos, setModelos] =
        useState<Modelo[]>([]);

    const [tipos, setTipos] =
        useState<Tipo[]>([]);

    const [marcaId, setMarcaId] =
        useState<number | "">("");

    const [modelosFiltrados,
        setModelosFiltrados] =
        useState<Modelo[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

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

        modeloId: "",

        tipoIngreso: "NUEVO",

        remitoId: null,

        ordenProvisionId: null,

        posicionInicialId: undefined,

        cargarGarantia: false,

        garantiaMeses: null,

        usarFechaActual: true,

        inicioGarantia: null
    });
    
    const [posicionesIniciales,
        setPosicionesIniciales] =
            useState<Posicion[]>([]);

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

            proveedorId: ""
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

            } catch {

                setError(
                    "Error al crear marca"
                );
            }
        };
    
    
    
    const handleCrearRemitoInline =
    async () => {

        try {

            const remitoCreado =
                await crearRemito({

                    numeroRemito:
                        nuevoRemito.numeroRemito,

                    proveedorId:
                        Number(
                            nuevoRemito.proveedorId
                        ),

                    fecha:
                        new Date()
                            .toISOString()
                            .split("T")[0]
                });

            if (
                archivoRemito &&
                remitoCreado.id
            ) {

                await subirArchivoRemito(
                    remitoCreado.id,
                    archivoRemito
                );
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

                proveedorId: ""
            });

            setArchivoRemito(
                null
            );

            setMostrarRemitoInline(
                false
            );

        } catch {

            setError(
                "Error al crear remito"
            );
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

            } catch {

                setError(
                    "Error al crear modelo"
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

            } catch {

                setError(
                    "Error al crear la orden de provisión"
                );
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

    const cargarDatos = async () => {

        try {

            const [

                marcasData,

                modelosData,

                tiposData,

                remitosData,

                ordenesProvisionData,

                proveedoresData,

                remitosDisponiblesData,

                opsDisponiblesData

            ] = await Promise.all([

                obtenerMarcas(),

                obtenerModelos(),

                obtenerTipos(),

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

            setTipos(
                tiposData
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

            const destinos =
                await obtenerDestinos();

            const depositoCentral =
                destinos.find(
                    (d) =>
                        d.nombre ===
                        "Depósito Central"
                );

            if (depositoCentral) {

                const posiciones =
                    await obtenerPosicionesPorDestino(
                        depositoCentral.id
                    );


                setPosicionesIniciales(
                    posiciones
                );
            }

            } catch {

                setError(
                    "Error al cargar datos"
                );
            }
        };


    const obtenerTension = () => {

        const modelo =
            modelos.find(
                (m) =>
                    m.id ===
                    formData.modeloId
            );

        if (!modelo) {

            return "-";
        }

        return `${modelo.tensionDesde}
        - ${modelo.tensionHasta}
        ${modelo.tipoTension}`;
    };

    const limpiarFormulario = () => {

        setFormData({

            numeroSerie: "",

            codigoConfiguracion: "",

            modeloId: "",

            tipoIngreso: "NUEVO",

            remitoId: null,

            ordenProvisionId: null,

            posicionInicialId: undefined,

            cargarGarantia: false,

            garantiaMeses: null,

            usarFechaActual: true,

            inicioGarantia: null
        });

        setMarcaId("");

        setError("");

        onCancelEdit();
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
                        ? value.toUpperCase()
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

            } else {

                await onCreate(
                    releData
                );
            }

            limpiarFormulario();

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

            <form
                onSubmit={handleSubmit}
            >

                <Grid
                    container
                    spacing={2}
                >
                    <Grid size={12}>

                        <FormControl fullWidth>

                            <Typography
                                variant="subtitle1"
                                sx={{ mb: 1 }}
                            >
                                Tipo de ingreso
                            </Typography>

                            <ToggleButtonGroup
                                value={formData.tipoIngreso}
                                exclusive
                                fullWidth
                                onChange={(_, value) => {

                                    if (!value) return;

                                    setFormData((prev) => ({
                                        ...prev,
                                        tipoIngreso: value
                                    }));
                                }}
                            >

                                <ToggleButton value="NUEVO">
                                    Nuevo
                                </ToggleButton>

                                <ToggleButton value="USADO">
                                    Usado
                                </ToggleButton>

                            </ToggleButtonGroup>

                        </FormControl>

                    </Grid>

                    <Grid size={12}>

                        <FormControl
                        
                            fullWidth
                        >

                            <InputLabel>
                                Marca
                            </InputLabel>

                            <Select
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

                            <InputLabel>
                                Modelo
                            </InputLabel>

                            <Select
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

                    </Grid>

                    <Grid size={12}>

                        <TextField
                            label="Tensión"
                            value={
                                obtenerTension()
                            }
                            slotProps={{
                                input: {
                                    readOnly: true
                                }
                            }}
                            fullWidth
                        />

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
                            autoComplete="off"
                            fullWidth
                            required
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
                        />

                    </Grid>

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

                                <Grid size={6}>

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

                                <Grid size={6}>

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

                        {
                        !releEditando && (

                            <Grid size={12}>

                                <FormControl fullWidth>

                                    <InputLabel>
                                        Posición Inicial
                                    </InputLabel>

                                    <Select
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
                                                            posicion.nombre
                                                        }
                                                    </MenuItem>
                                                )
                                            )
                                        }

                                    </Select>

                                </FormControl>

                            </Grid>

                        )
                    }

                    {
                        formData.tipoIngreso ===
                        "NUEVO" && (

                            <>
                                <Grid size={12}>

                                    <Alert severity="info">

                                        La documentación inicial es opcional. Puede asociarse
                                        un remito, una orden de provisión, ambos o ningubo.

                                    </Alert>

                                </Grid>
                                <Grid size={6}>

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

                                                        <Grid size={3}>

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

                                                        <Grid size={3}>

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

                                                        <Grid size={3}>

                                                            <Button
                                                                variant="outlined"
                                                                component="label"
                                                                fullWidth
                                                            >

                                                                Seleccionar PDF

                                                                <input
                                                                    hidden
                                                                    type="file"
                                                                    accept=".pdf"
                                                                    onChange={(e) =>
                                                                        setArchivoOP(
                                                                            e.target.files?.[0]
                                                                            ?? null
                                                                        )
                                                                    }
                                                                />

                                                            </Button>

                                                        </Grid>

                                                        <Grid size={3}>

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

                                <Grid size={6}>

                                    {
                                        remitoSeleccionado && (

                                            <Alert
                                                severity="success"
                                                sx={{ mb: 2 }}
                                            >
                                                Remito asociado:
                                                {" "}
                                                {remitoSeleccionado.numeroRemito}
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

                                                        <Grid size={3}>

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

                                                        <Grid size={3}>

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

                                                        <Grid size={3}>

                                                            <Button
                                                                variant="outlined"
                                                                component="label"
                                                                fullWidth
                                                            >

                                                                Seleccionar PDF

                                                                <input
                                                                    hidden
                                                                    type="file"
                                                                    accept=".pdf"
                                                                    onChange={(e) =>
                                                                        setArchivoRemito(
                                                                            e.target.files?.[0]
                                                                            ?? null
                                                                        )
                                                                    }
                                                                />

                                                            </Button>

                                                        </Grid>

                                                        <Grid size={3}>

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

                            </>
                        )
                    }

                    <Grid size={12}>

                        <Box
                            sx={{ display: "flex", gap: 2 }}
                        >

                            <Button
                                variant="contained"
                                type="submit"
                                disabled={loading}
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

                    Nueva Marca

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
                        mostrarModeloInline
                        &&
                        marcaCreadaId && (

                            <ModeloForm

                                onSubmit={
                                    handleCrearModeloInline
                                }

                                marcas={marcas}

                                tipos={tipos}

                                cancelarEdicion={() => {

                                    setMostrarModeloInline(
                                        false
                                    );

                                    setOpenMarcaDialog(
                                        false
                                    );
                                }}

                                marcaPreseleccionada={
                                    marcaCreadaId
                                }

                                bloquearMarca={true}
                            />
                        )
                    }

                </DialogContent>

            </Dialog>

        </Paper>
    );
}

export default ReleForm;