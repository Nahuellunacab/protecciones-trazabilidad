import { useEffect, useState } from "react";
import PageHeader from "../components/common/PageHeader";

import {
    obtenerReles,
    crearRele
} from "../services/releService";

import type { Rele } from "../types/Rele";
import type { ReleRequest } from "../types/ReleRequest";

import ReleForm from "../components/rele/ReleForm";
import ReleTable from "../components/rele/ReleTable";

function RelePage() {

    const [reles, setReles] =
        useState<Rele[]>([]);

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
            />

            <ReleTable
                reles={reles}
            />

        </div>
    );
}

export default RelePage;