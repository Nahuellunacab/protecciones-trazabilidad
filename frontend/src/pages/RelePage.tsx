// -----------------------------------Importación de librerías-----------------------------------
import { useEffect, useState } from "react";

import {
    TextField,
    Typography
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

    const cargarReles = async () => {

        const data =
            await obtenerReles();

        setReles(data);
    };

    // Cuándo la página aparezca por primera vez, cargar los relés
    useEffect(() => {

        cargarReles();

    }, []);

    // Función para manejar la creación de un nuevo relé
    const handleCreate = async (
        data: ReleRequest
    ) => {

        await crearRele(data);

        await cargarReles();
    };

    // Función para manejar la actualización de un relé existente
    const handleUpdate = async (
        id: number,
        data: ReleRequest
    ) => {

        await actualizar(
            id,
            data
        );

        setReleEditando(null);

        await cargarReles();
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

            <ReleForm
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                releEditando={releEditando}
                onCancelEdit={() =>
                    setReleEditando(null)
                }
            />

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
                onEditar={setReleEditando}
            />

        </div>
    );
}

export default RelePage;