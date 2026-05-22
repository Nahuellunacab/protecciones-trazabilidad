// RelePage.tsx

import { useEffect, useState } from "react";

import PageHeader
from "../components/common/PageHeader";

import {
    obtenerReles,
    crearRele,
    actualizar
} from "../services/releService";

import type { Rele }
from "../types/Rele";

import type { ReleRequest }
from "../types/ReleRequest";

import ReleForm
from "../components/rele/ReleForm";

import ReleTable
from "../components/rele/ReleTable";

function RelePage() {

    const [reles, setReles] =
        useState<Rele[]>([]);

    const [releEditando, setReleEditando] =
        useState<Rele | null>(null);

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

        setReleEditando(null);

        await cargarReles();
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

            <ReleForm
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                releEditando={releEditando}
                onCancelEdit={() =>
                    setReleEditando(null)
                }
            />

            <ReleTable
                reles={reles}
                onEditar={setReleEditando}
            />

        </div>
    );
}

export default RelePage;