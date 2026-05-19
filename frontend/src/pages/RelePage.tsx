import { useEffect, useState } from "react";

import {
    obtenerReles,
    crearRele
} from "../services/releService";

import type { Rele } from "../types/Rele";
import type { ReleRequest } from "../types/ReleRequest";

import ReleForm from "../components/ReleForm";
import ReleTable from "../components/ReleTable";

function RelePage() {

    const [reles, setReles] = useState<Rele[]>([]);

    useEffect(() => {

        cargarReles();

    }, []);

    const cargarReles = async () => {

        const data = await obtenerReles();

        setReles(data);
    };

    const handleCreate = async (
        data: ReleRequest
    ) => {

        await crearRele(data);

        await cargarReles();
    };

    return (

        <div style={{ padding: "20px" }}>

            <h1>Relés</h1>

            <ReleForm onCreate={handleCreate} />

            <hr />

            <ReleTable reles={reles} />

        </div>
    );
}

export default RelePage;