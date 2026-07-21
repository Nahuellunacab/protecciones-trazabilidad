import { useEffect, useState } from "react";

import type { ReleReciente } from "../utils/relesRecientesStorage";

import { obtenerRelesRecientes } from "../utils/relesRecientesStorage";

export function useRecentReles() {

    const [relesRecientes, setRelesRecientes] =
        useState<ReleReciente[]>([]);

    useEffect(() => {

        setRelesRecientes(
            obtenerRelesRecientes()
        );

    }, []);

    return relesRecientes;
}
