// -----------------------------------Importación de librerías-----------------------------------
import { useEffect, useState } from "react";

import {
    TextField,
    Typography,
    Button,
    TablePagination
} from "@mui/material";

// -----------------------------------Importación de servicios-----------------------------------
import {
    obtenerReles,
    crearRele,
    actualizar,
    obtenerRelePorId,

} from "../services/releService";

// -----------------------------------Importación de tipos-----------------------------------------
import type { Rele }
from "../types/Rele";

import type { ReleRequest }
from "../types/ReleRequest";

// -----------------------------------Importación de componentes-----------------------------------
import ReleForm
from "../components/rele/ReleForm";

import ReleTable
from "../components/rele/ReleTable";

import PageHeader
from "../components/common/PageHeader";

// -----------------------------------Definición del componente-----------------------------------

function RelePage() {

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

    const [page, setPage] =
        useState(0);
    
    const [filtroEstado, setFiltroEstado] =
        useState<
            "ACTIVOS"
            |
            "INACTIVOS"
            |
            "TODOS"
        >("ACTIVOS");

    const rowsPerPage = 10;

    const [releEditando, setReleEditando] =
        useState<Rele | null>(null);

    const [mostrarFormulario,
        setMostrarFormulario] =
        useState(false);

    const cargarReles = async () => {

        setCargando(true);

        try {

            const data =
                await obtenerReles(
                    page,
                    rowsPerPage,
                    textoBusquedaDebounced,
                    filtroEstado
                );

            setReles(
                data.content
            );

            setTotalReles(
                data.totalElements
            );

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
        textoBusquedaDebounced,
        filtroEstado
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
                    mb: 1,
                    mt: 2
                }}
            />

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

                rowsPerPageOptions={[]}

            />

        </div>
        
    );
}

export default RelePage;
