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
    crearRemito
} from "../../services/remitoService";

import type {
    Remito
} from "../../types/Remito";

import {
    obtenerOrdenesProvision,
    crearOrdenProvision
} from "../../services/ordenProvisionService";

import type {
    Proveedor
} from "../../types/Proveedor";

import {
    obtenerProveedores
} from "../../services/proveedorService";

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
        useState<ReleRequest>({
            numeroSerie: "",
            modeloId: "",
            tipoIngreso: "NUEVO",
            remitoId: null,
            ordenProvisionId: null,
            posicionInicialId: undefined
        });
    
    const [posicionesIniciales,
        setPosicionesIniciales] =
            useState<Posicion[]>([]);

    const [remitos, setRemitos] =
        useState<Remito[]>([]);
    
    const [ordenesProvision, setOrdenesProvision] =
        useState<OrdenProvision[]>([]);  
        
    const [mostrarRemitoInline,
        setMostrarRemitoInline] =
        useState(false);

    const [mostrarOPInline,
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

            modeloId:
                releEditando.modeloId ?? "",

            tipoIngreso:
                releEditando.tipoIngreso,

            remitoId:
                releEditando.remitoId ?? null,

            ordenProvisionId:
                releEditando.ordenProvisionId ?? null,


            posicionInicialId:
                undefined
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
                proveedoresData
            ] = await Promise.all([
                obtenerMarcas(),
                obtenerModelos(),
                obtenerTipos(),
                obtenerRemitos(),
                obtenerOrdenesProvision(),
                obtenerProveedores()
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

            modeloId: "",

            tipoIngreso: "NUEVO",

            remitoId: null,

            ordenProvisionId: null,

            posicionInicialId: undefined
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

            if (releEditando) {

                await onUpdate(
                    releEditando.id,
                    formData
                );

            } else {

                await onCreate(
                    formData
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
                            fullWidth
                            required
                        />

                    </Grid>

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

                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        onClick={() =>
                                            setMostrarOPInline(
                                                !mostrarOPInline
                                            )
                                        }
                                    >
                                        + NUEVA ORDEN DE PROVISIÓN
                                    </Button>

                                    {
                                        mostrarOPInline && (

                                            <Grid size={12}>

                                                <Paper
                                                    sx={{
                                                        p: 2,
                                                        mt: 1
                                                    }}
                                                >

                                                    <Typography
                                                        variant="subtitle1"
                                                        mb={2}
                                                    >
                                                        Crear Orden de Provisión
                                                    </Typography>

                                                    <Grid
                                                        container
                                                        spacing={2}
                                                    >

                                                        <Grid size={4}>

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

                                                        <Grid size={5}>

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

                                                </Paper>

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

                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        onClick={() =>
                                            setMostrarRemitoInline(
                                                !mostrarRemitoInline
                                            )
                                        }
                                    >
                                        + NUEVO REMITO
                                    </Button>

                                    {
                                        mostrarRemitoInline && (

                                            <Grid size={12}>

                                                <Paper
                                                    sx={{
                                                        p: 2,
                                                        mt: 1
                                                    }}
                                                >

                                                    <Typography
                                                        variant="subtitle1"
                                                        mb={2}
                                                    >
                                                        Crear Remito
                                                    </Typography>

                                                    <Grid
                                                        container
                                                        spacing={2}
                                                    >

                                                        <Grid size={4}>

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

                                                        <Grid size={4}>

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

                                                        <Grid size={4}>

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

                                                </Paper>

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