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
    obtenerRemitos
} from "../../services/remitoService";

import type {
    Remito
} from "../../types/Remito";

import {
    obtenerOrdenesProvision
} from "../../services/ordenProvisionService";

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

    const handleCrearModeloInline =
    async (
        data: any
    ) => {

        try {

            const nuevoModelo =
                await crearModelo(
                    data
                );

            const nuevosModelos =
                await obtenerModelos();

            setModelos(
                nuevosModelos
            );

            setFormData(
                (prev) => ({

                    ...prev,

                    modeloId:
                        nuevoModelo.id
                })
            );

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
                ordenesProvisionData
            ] = await Promise.all([
                obtenerMarcas(),
                obtenerModelos(),
                obtenerTipos(),
                obtenerRemitos(),
                obtenerOrdenesProvision()
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

                                    <TextField
                                        select
                                        label="Remito (Opcional)"
                                        value={formData.remitoId ?? ""}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                remitoId:
                                                    e.target.value === ""
                                                        ? null
                                                        : Number(
                                                            e.target.value
                                                        )
                                            }))
                                        }
                                        fullWidth
                                    >

                                        <MenuItem value="">
                                            Ninguno
                                        </MenuItem>

                                        {remitos.map((remito) => (

                                            <MenuItem
                                                key={remito.id}
                                                value={remito.id}
                                            >
                                                {remito.numeroRemito}
                                            </MenuItem>

                                        ))}

                                    </TextField>

                                </Grid>

                                <Grid size={6}>

                                    <TextField
                                        select
                                        label="Orden de Provisión (Opcional)"
                                        value={
                                            formData.ordenProvisionId
                                            ?? ""
                                        }
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                ordenProvisionId:
                                                    e.target.value === ""
                                                        ? null
                                                        : Number(
                                                            e.target.value
                                                        )
                                            }))
                                        }
                                        fullWidth
                                    >

                                        <MenuItem value="">
                                            Ninguna
                                        </MenuItem>

                                        {
                                            ordenesProvision.map(
                                                (orden) => (

                                                    <MenuItem
                                                        key={orden.id}
                                                        value={orden.id}
                                                    >
                                                        {orden.numero}
                                                    </MenuItem>

                                                )
                                            )
                                        }

                                    </TextField>

                                </Grid>

                                <Grid size={6}>

                                    <Button
                                        variant="outlined"
                                        fullWidth
                                    >
                                        + Nuevo Remito
                                    </Button>

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