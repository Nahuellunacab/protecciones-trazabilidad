import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
} from "@mui/material";

import type { Modelo }
from "../../types/Modelo";

import type { Marca }
from "../../types/Marca";

import type { Rele }
from "../../types/Rele";

import type { ReleRequest }
from "../../types/ReleRequest";

import type { Provincia }
from "../../types/Provincia";

import type { Localidad }
from "../../types/Localidad";

import type { Destino }
from "../../types/Destino";

import type { Posicion }
from "../../types/Posicion";


import {
    crearMarca,
    obtenerMarcas
} from "../../services/marcaService";

import {
    crearModelo,
    obtenerModelos
} from "../../services/modeloService";

import {
    obtenerProvincias
} from "../../services/provinciaService";

import {
    obtenerLocalidadesPorProvincia
} from "../../services/localidadService";

import {
    obtenerDestinosPorLocalidad
} from "../../services/destinoService";

import {
    obtenerPosicionesPorDestino
} from "../../services/posicionService";

import MarcaForm
from "../admin/marca/MarcaForm";

import ModeloForm
from "../admin/modelo/ModeloForm";
import type { Tipo } from "../../types/Tipo";
import { obtenerTipos } from "../../services/tipoService";

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

    const [provincias, setProvincias] =
        useState<Provincia[]>([]);

    const [localidades, setLocalidades] =
        useState<Localidad[]>([]);

    const [destinos, setDestinos] =
        useState<Destino[]>([]);

    const [posiciones, setPosiciones] =
        useState<Posicion[]>([]);

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
            modeloId: 0,
            cargarGarantia: false,
            garantiaMeses: 12,
            inicioGarantia: "",
            remitoId: null,
            provinciaId: undefined,
            localidadId: undefined,
            destinoId: undefined,
            posicionId: undefined
        });

    useEffect(() => {

        cargarDatos();

    }, []);

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

    useEffect(() => {

        if (
            formData.provinciaId
        ) {

            cargarLocalidades(
                formData.provinciaId
            );
        }

    }, [formData.provinciaId]);

    useEffect(() => {

        if (
            formData.localidadId
        ) {

            cargarDestinos(
                formData.localidadId
            );
        }

    }, [formData.localidadId]);

    useEffect(() => {

        if (
            formData.destinoId
        ) {

            cargarPosiciones(
                formData.destinoId
            );
        }

    }, [formData.destinoId]);

    useEffect(() => {

        if (releEditando) {

            const modelo =
                modelos.find(
                    (m) =>
                        m.id ===
                        releEditando.modeloId
                );

            setMarcaId(
                modelo?.marcaId || ""
            );

            setFormData({

                numeroSerie:
                    releEditando.numeroSerie,

                modeloId:
                    releEditando.modeloId ?? 0,

                cargarGarantia:
                    releEditando.garantiaMeses
                    !== null,

                garantiaMeses:
                    releEditando.garantiaMeses
                    || 12,

                inicioGarantia:
                    releEditando.inicioGarantia
                    || "",

                remitoId:
                    releEditando.remitoId
                    || null,

                provinciaId: undefined,

                localidadId: undefined,

                destinoId: undefined,

                posicionId: undefined
            });

        } else {

            limpiarFormulario();
        }

    }, [releEditando, modelos]);

    const cargarDatos = async () => {

        try {

            const [
                marcasData,
                modelosData,
                provinciasData,
                tiposData
            ] = await Promise.all([

                obtenerMarcas(),

                obtenerModelos(),

                obtenerProvincias(),

                obtenerTipos()
            ]);

            setMarcas(
                marcasData
            );

            setModelos(
                modelosData
            );

            setProvincias(
                provinciasData
            );

            setTipos(
                tiposData
            );

        } catch {

            setError(
                "Error al cargar datos"
            );
        }
    };

    const cargarLocalidades =
    async (
        provinciaId: number
    ) => {

        const data =
            await obtenerLocalidadesPorProvincia(
                provinciaId
            );

        setLocalidades(data);
    };

    const cargarDestinos =
    async (
        localidadId: number
    ) => {

        const data =
            await obtenerDestinosPorLocalidad(
                localidadId
            );

        setDestinos(data);
    };

    const cargarPosiciones =
    async (
        destinoId: number
    ) => {

        const data =
            await obtenerPosicionesPorDestino(
                destinoId
            );

        setPosiciones(data);
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

            cargarGarantia: false,

            garantiaMeses: 12,

            inicioGarantia: "",

            remitoId: null,

            provinciaId: undefined,

            localidadId: undefined,

            destinoId: undefined,

            posicionId: undefined
        });

        setMarcaId("");

        setError("");

        setLocalidades([]);

        setDestinos([]);

        setPosiciones([]);

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

                    <Grid size={6}>

                        <FormControl
                            fullWidth
                        >

                            <InputLabel>
                                Provincia
                            </InputLabel>

                            <Select
                                name="provinciaId"
                                value={
                                    formData.provinciaId || ""
                                }
                                label="Provincia"
                                onChange={(e) => {

                                    handleChange(e);

                                    setFormData(
                                        (prev) => ({
                                            ...prev,
                                            provinciaId:
                                                Number(
                                                    e.target.value
                                                ),
                                            localidadId:
                                                undefined,
                                            destinoId:
                                                undefined,
                                            posicionId:
                                                undefined
                                        })
                                    );

                                    setDestinos([]);

                                    setPosiciones([]);
                                }}
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
                                    ))
                                }

                            </Select>

                        </FormControl>

                    </Grid>

                    <Grid size={6}>

                        <FormControl
                            fullWidth
                        >

                            <InputLabel>
                                Localidad
                            </InputLabel>

                            <Select
                                name="localidadId"
                                value={
                                    formData.localidadId || ""
                                }
                                label="Localidad"
                                onChange={(e) => {

                                    handleChange(e);

                                    setFormData(
                                        (prev) => ({
                                            ...prev,
                                            localidadId:
                                                Number(
                                                    e.target.value
                                                ),
                                            destinoId:
                                                undefined,
                                            posicionId:
                                                undefined
                                        })
                                    );

                                    setPosiciones([]);
                                }}
                            >

                                {
                                    localidades.map(
                                        (localidad) => (

                                        <MenuItem
                                            key={localidad.id}
                                            value={localidad.id}
                                        >

                                            {localidad.nombre}

                                        </MenuItem>
                                    ))
                                }

                            </Select>

                        </FormControl>

                    </Grid>

                    <Grid size={6}>

                        <FormControl
                            fullWidth
                        >

                            <InputLabel>
                                Destino
                            </InputLabel>

                            <Select
                                name="destinoId"
                                value={
                                    formData.destinoId || ""
                                }
                                label="Destino"
                                onChange={(e) => {

                                    handleChange(e);

                                    setFormData(
                                        (prev) => ({
                                            ...prev,
                                            destinoId:
                                                Number(
                                                    e.target.value
                                                ),
                                            posicionId:
                                                undefined
                                        })
                                    );
                                }}
                            >

                                {
                                    destinos.map(
                                        (destino) => (

                                        <MenuItem
                                            key={destino.id}
                                            value={destino.id}
                                        >

                                            {destino.nombre}

                                        </MenuItem>
                                    ))
                                }

                            </Select>

                        </FormControl>

                    </Grid>

                    <Grid size={6}>

                        <FormControl
                            fullWidth
                        >

                            <InputLabel>
                                Posición
                            </InputLabel>

                            <Select
                                name="posicionId"
                                value={
                                    formData.posicionId || ""
                                }
                                label="Posición"
                                onChange={
                                    handleChange
                                }
                            >

                                {
                                    posiciones.map(
                                        (posicion) => (

                                        <MenuItem
                                            key={posicion.id}
                                            value={posicion.id}
                                        >

                                            {posicion.nombre}

                                        </MenuItem>
                                    ))
                                }

                            </Select>

                        </FormControl>

                    </Grid>

                    <Grid size={12}>

                        <FormControlLabel
                            control={

                                <Checkbox
                                    name="cargarGarantia"
                                    checked={
                                        formData.cargarGarantia
                                    }
                                    onChange={
                                        handleChange
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
                                        label="Meses Garantía"
                                        name="garantiaMeses"
                                        type="number"
                                        value={
                                            formData.garantiaMeses
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        fullWidth
                                    />

                                </Grid>

                                <Grid size={6}>

                                    <TextField
                                        label="Inicio Garantía"
                                        name="inicioGarantia"
                                        type="date"
                                        value={
                                            formData.inicioGarantia
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true
                                            }
                                        }}
                                        fullWidth
                                    />

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