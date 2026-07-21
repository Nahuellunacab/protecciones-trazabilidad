export function tiempoRelativo(fechaIso: string): string {

    const ahora = Date.now();

    const fecha = new Date(fechaIso).getTime();

    const diffMs = ahora - fecha;

    const diffMin = Math.floor(diffMs / (60 * 1000));

    if (diffMin < 1) {

        return "recién";
    }

    if (diffMin < 60) {

        return `hace ${diffMin} min`;
    }

    const diffHoras = Math.floor(diffMin / 60);

    if (diffHoras < 24) {

        return `hace ${diffHoras} ${diffHoras === 1 ? "hora" : "horas"}`;
    }

    const diffDias = Math.floor(diffHoras / 24);

    return `hace ${diffDias} ${diffDias === 1 ? "día" : "días"}`;
}
