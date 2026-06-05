// -----------------------------------Importación de librerías-----------------------------------
import { useEffect, useState } from "react";

import {
    TextField,
    Typography,
    Button
} from "@mui/material";

// -----------------------------------Importación de servicios-----------------------------------
import {
    obtenerReles,
    crearRele,
    actualizar,

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

    const [textoBusqueda, setTextoBusqueda] =
        useState("");

    const [releEditando, setReleEditando] =
        useState<Rele | null>(null);

    const [mostrarFormulario,
        setMostrarFormulario] =
        useState(false);

    const cargarReles = async () => {

        const data =
            await obtenerReles();

        setReles(data);
    };

    useEffect(() => {

        cargarReles();

    }, []);

    const handleCreate = async (
        data: ReleRequest
    ) => {

        await crearRele(data);

        setMostrarFormulario(
            false
        );

        await cargarReles();
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

    const relesFiltrados =
        reles.filter((rele) => {

            const texto =
                textoBusqueda.toLowerCase();

            return (

                rele.numeroSerie
                    .toLowerCase()
                    .includes(texto)

                ||

                rele.marca
                    .toLowerCase()
                    .includes(texto)

                ||

                rele.modelo
                    .toLowerCase()
                    .includes(texto)
            );
        });

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
                    />

                )
            }

            <TextField
                label="Buscar por serie, marca o modelo"
                value={textoBusqueda}
                onChange={(e) =>
                    setTextoBusqueda(
                        e.target.value
                    )
                }
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
                {relesFiltrados.length} relés encontrados
            </Typography>

            <ReleTable
                reles={relesFiltrados}
                onEditar={handleEditar}
            />

        </div>
    );
}

export default RelePage;