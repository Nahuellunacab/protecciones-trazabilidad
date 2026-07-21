export interface ReleReciente {

    id: number;

    numeroSerie: string;

    modelo: string;

    marca: string;

    visitadoEn: string;
}

const RELES_RECIENTES_KEY = "protecciones-reles-recientes";

const TOPE_RELES_RECIENTES = 5;

export function obtenerRelesRecientes(): ReleReciente[] {

    const guardado =
        localStorage.getItem(RELES_RECIENTES_KEY);

    if (!guardado) {

        return [];
    }

    try {

        return JSON.parse(guardado) as ReleReciente[];

    } catch {

        return [];
    }
}

export function registrarReleVisitado(
    rele: Omit<ReleReciente, "visitadoEn">
) {

    const recientes =
        obtenerRelesRecientes()
            .filter((r) => r.id !== rele.id);

    recientes.unshift({
        ...rele,
        visitadoEn: new Date().toISOString()
    });

    localStorage.setItem(
        RELES_RECIENTES_KEY,
        JSON.stringify(
            recientes.slice(0, TOPE_RELES_RECIENTES)
        )
    );
}
