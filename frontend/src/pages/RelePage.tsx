// -----------------------------------Importación de librerías-----------------------------------
import { useEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";

import {
    TextField,
    Typography,
    Button,
    TablePagination,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Paper
} from "@mui/material";

// -----------------------------------Importación de servicios-----------------------------------
import {
    obtenerReles,
    crearRele,
    actualizar,
    obtenerRelePorId,

} from "../services/releService";

import { obtenerMarcas } from "../services/marcaService";

import { obtenerModelos } from "../services/modeloService";

import { obtenerDestinos } from "../services/destinoService";

import { obtenerEstados } from "../services/estadoService";

// -----------------------------------Importación de tipos-----------------------------------------
import type { Rele }
from "../types/Rele";

import type { ReleRequest }
from "../types/ReleRequest";

import type { Marca }
from "../types/Marca";

import type { Modelo }
from "../types/Modelo";

import type { Destino }
from "../types/Destino";

import type { Estado }
from "../types/Estado";

// -----------------------------------Importación de componentes-----------------------------------
import ReleForm
from "../components/rele/ReleForm";

import ReleTable
from "../components/rele/ReleTable";

import PageHeader
from "../components/common/PageHeader";

// -----------------------------------Definición del componente-----------------------------------

function RelePage() {

    const [searchParams, setSearchParams] =
        useSearchParams();

    const [reles, setReles] =
        useState<Rele[]>([]);

    const [totalReles, setTotalReles] =
        useState(0);

    const [textoBusqueda, setTextoBusqueda] =
        useState("");

    const [textoBusquedaDebounced,
        setTextoBusquedaDebounced] =
        useState("");

    const [cargando, setCargando] =
        useState(false);

    const [errorCarga, setErrorCarga] =
        useState("");

    const [page, setPage] =
        useState(0);

    const [rowsPerPage, setRowsPerPage] =
        useState(10);

    const [filtroEstado, setFiltroEstado] =
        useState<
            "ACTIVOS"
            |
            "INACTIVOS"
            |
            "TODOS"
        >("ACTIVOS");

    const [marcas, setMarcas] =
        useState<Marca[]>([]);

    const [modelos, setModelos] =
        useState<Modelo[]>([]);

    const [destinos, setDestinos] =
        useState<Destino[]>([]);

    const [estados, setEstados] =
        useState<Estado[]>([]);

    const [marcaId, setMarcaId] =
        useState<number | "">("");

    const [modeloId, setModeloId] =
        useState<number | "">("");

    const [estadoNombre, setEstadoNombre] =
        useState("");

    const [destinoId, setDestinoId] =
        useState<number | "">("");

    const [releEditando, setReleEditando] =
        useState<Rele | null>(null);

    const [mostrarFormulario,
        setMostrarFormulario] =
        useState(false);

    const modelosFiltrados =
        marcaId
            ? modelos.filter(
                (modelo) =>
                    modelo.marcaId === marcaId
            )
            : modelos;

    useEffect(() => {

        Promise.all([
            obtenerMarcas(),
            obtenerModelos(),
            obtenerDestinos(),
            obtenerEstados()
        ]).then(
            ([
                marcasData,
                modelosData,
                destinosData,
                estadosData
            ]) => {

                setMarcas(marcasData);
                setModelos(modelosData);
                setDestinos(destinosData);
                setEstados(estadosData);
            }
        );

    }, []);

    useEffect(() => {

        const editarId =
            searchParams.get("editar");

        if (!editarId) return;

        obtenerRelePorId(Number(editarId))
            .then((rele) => {

                setReleEditando(rele);

                setMostrarFormulario(true);

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            });

        setSearchParams(
            {},
            { replace: true }
        );

    }, [searchParams]);

    const cargarReles = async () => {

        setCargando(true);

        setErrorCarga("");

        try {

            const data =
                await obtenerReles(
                    page,
                    rowsPerPage,
                    textoBusquedaDebounced,
                    filtroEstado,
                    "id,desc",
                    {
                        marcaId:
                            marcaId
                                ? Number(marcaId)
                                : undefined,

                        modeloId:
                            modeloId
                                ? Number(modeloId)
                                : undefined,

                        estadoNombre:
                            estadoNombre || undefined,

                        destinoId:
                            destinoId
                                ? Number(destinoId)
                                : undefined
                    }
                );

            setReles(
                data.content
            );

            setTotalReles(
                data.totalElements
            );

        } catch {

            setErrorCarga(
                "No se pudieron cargar los relés. Intente nuevamente."
            );

            setReles([]);

            setTotalReles(0);

        } finally {

            setCargando(false);
        }
    };

    useEffect(() => {

        const timeoutId = setTimeout(() => {

            setTextoBusquedaDebounced(
                textoBusqueda
            );

            setPage(0);

        }, 350);

        return () =>
            clearTimeout(timeoutId);

    }, [textoBusqueda]);

    useEffect(() => {

        cargarReles();

    }, [
        page,
        rowsPerPage,
        textoBusquedaDebounced,
        filtroEstado,
        marcaId,
        modeloId,
        estadoNombre,
        destinoId
    ]);

    const handleCreate = async (
        data: ReleRequest
    ): Promise<Rele> => {

        const releCreado =
            await crearRele(data);

        await cargarReles();

        return releCreado;
    };

    const handleEditarDesdeLote = async (
        id: number
    ) => {

        const rele =
            await obtenerRelePorId(id);

        setReleEditando(rele);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleUpdate = async (
        id: number,
        data: ReleRequest
    ) => {

        await actualizar(
            id,
            data
        );

        setReleEditando(
            null
        );

        setMostrarFormulario(
            false
        );

        await cargarReles();
    };

    const handleEditar = (
        rele: Rele
    ) => {

        setReleEditando(
            rele
        );

        setMostrarFormulario(
            true
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleCancelar = () => {

        setReleEditando(
            null
        );

        setMostrarFormulario(
            false
        );
    };

    return (

        <div>

            <PageHeader
                title="Relés"
                subtitle="
                Gestión de relés de protección,
                modelos, marcas y trazabilidad operativa.
                "
            />

            <Button
                variant="contained"
                onClick={() =>
                    setMostrarFormulario(
                        !mostrarFormulario
                    )
                }
                sx={{
                    mb: 3
                }}
            >

                {
                    mostrarFormulario
                        ? "▲ OCULTAR FORMULARIO"
                        : "＋ NUEVO RELÉ"
                }

            </Button>

            {
                mostrarFormulario && (

                    <ReleForm
                        onCreate={handleCreate}
                        onUpdate={handleUpdate}
                        releEditando={releEditando}
                        onCancelEdit={
                            handleCancelar
                        }
                        onEditarDesdeLote={
                            handleEditarDesdeLote
                        }
                        onTerminarEdicionDeLote={
                            () => setReleEditando(null)
                        }
                    />

                )
            }

            <TextField
                label="Buscar por serie, marca o modelo"
                value={textoBusqueda}
                onChange={(e) => {

                    setTextoBusqueda(
                        e.target.value
                    );

                    setPage(0);
                }}
                fullWidth
                sx={{
                    mb: 2,
                    mt: 2
                }}
            />

            <Paper
                variant="outlined"
                sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 3
                }}
            >

                <Grid
                    container
                    spacing={2}
                >

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>

                        <FormControl fullWidth size="small">

                            <InputLabel id="filtro-marca-label">
                                Marca
                            </InputLabel>

                            <Select
                                labelId="filtro-marca-label"
                                label="Marca"
                                value={marcaId}
                                onChange={(e) => {

                                    setMarcaId(
                                        e.target.value === ""
                                            ? ""
                                            : Number(e.target.value)
                                    );

                                    setModeloId("");

                                    setPage(0);
                                }}
                            >

                                <MenuItem value="">
                                    Todas
                                </MenuItem>

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

                            </Select>

                        </FormControl>

                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>

                        <FormControl fullWidth size="small">

                            <InputLabel id="filtro-modelo-label">
                                Modelo
                            </InputLabel>

                            <Select
                                labelId="filtro-modelo-label"
                                label="Modelo"
                                value={modeloId}
                                onChange={(e) => {

                                    setModeloId(
                                        e.target.value === ""
                                            ? ""
                                            : Number(e.target.value)
                                    );

                                    setPage(0);
                                }}
                            >

                                <MenuItem value="">
                                    Todos
                                </MenuItem>

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

                            </Select>

                        </FormControl>

                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>

                        <FormControl fullWidth size="small">

                            <InputLabel id="filtro-estado-label">
                                Estado
                            </InputLabel>

                            <Select
                                labelId="filtro-estado-label"
                                label="Estado"
                                value={estadoNombre}
                                onChange={(e) => {

                                    setEstadoNombre(
                                        e.target.value
                                    );

                                    setPage(0);
                                }}
                            >

                                <MenuItem value="">
                                    Todos
                                </MenuItem>

                                {
                                    estados.map((estado) => (

                                        <MenuItem
                                            key={estado.id}
                                            value={estado.nombre}
                                        >
                                            {estado.nombre}
                                        </MenuItem>
                                    ))
                                }

                            </Select>

                        </FormControl>

                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>

                        <FormControl fullWidth size="small">

                            <InputLabel id="filtro-destino-label">
                                Destino
                            </InputLabel>

                            <Select
                                labelId="filtro-destino-label"
                                label="Destino"
                                value={destinoId}
                                onChange={(e) => {

                                    setDestinoId(
                                        e.target.value === ""
                                            ? ""
                                            : Number(e.target.value)
                                    );

                                    setPage(0);
                                }}
                            >

                                <MenuItem value="">
                                    Todos
                                </MenuItem>

                                {
                                    destinos.map((destino) => (

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

                </Grid>

            </Paper>

            {
                errorCarga && (

                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {errorCarga}
                    </Alert>
                )
            }

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
            >
                {totalReles} relés encontrados
            </Typography>

            <ReleTable
                reles={reles}
                cargando={cargando}
                onEditar={handleEditar}
                filtroEstado={filtroEstado}
                setFiltroEstado={(value) => {

                    setFiltroEstado(value);

                    setPage(0);
                }}
            />

            <TablePagination

                component="div"

                count={totalReles}

                page={page}

                onPageChange={(_, newPage) =>
                    setPage(newPage)
                }

                rowsPerPage={rowsPerPage}

                onRowsPerPageChange={(e) => {

                    setRowsPerPage(
                        Number(e.target.value)
                    );

                    setPage(0);
                }}

                rowsPerPageOptions={[10, 25, 50]}

            />

        </div>

    );
}

export default RelePage;
