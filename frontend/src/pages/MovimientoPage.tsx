import { useEffect, useState } from "react";

import {
    obtenerMovimientos,
    crearMovimiento
} from "../services/movimientoService";

import type {
    Movimiento
} from "../types/Movimiento";

import type {
    MovimientoRequest
} from "../types/MovimientoRequest";

import MovimientoForm from "../components/movimiento/MovimientoForm";

import MovimientoTable from "../components/movimiento/MovimientoTable";

import PageHeader from "../components/common/PageHeader";

function MovimientoPage() {

    const [movimientos, setMovimientos] =
        useState<Movimiento[]>([]);

    const cargarMovimientos =
        async () => {

        const data =
            await obtenerMovimientos();

        setMovimientos(data);
    };

    useEffect(() => {

        cargarMovimientos();

    }, []);

    const handleCreate = async (
        data: MovimientoRequest
    ) => {

        await crearMovimiento(data);

        await cargarMovimientos();
    };

    return (

        <div>

            <PageHeader
                title="Movimientos"
                subtitle="
                Gestión operativa y
                trazabilidad de relés.
                "
            />

            <MovimientoForm
                onCreate={handleCreate}
            />

            <MovimientoTable
                movimientos={movimientos}
            />

        </div>
    );
}

export default MovimientoPage;