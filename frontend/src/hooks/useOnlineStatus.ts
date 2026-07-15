import { useSyncExternalStore } from "react";

function suscribirse(callback: () => void) {

    window.addEventListener("online", callback);
    window.addEventListener("offline", callback);

    return () => {

        window.removeEventListener("online", callback);
        window.removeEventListener("offline", callback);
    };
}

function obtenerEstadoActual() {

    return navigator.onLine;
}

function obtenerEstadoServidor() {

    return true;
}

export function useOnlineStatus(): boolean {

    return useSyncExternalStore(
        suscribirse,
        obtenerEstadoActual,
        obtenerEstadoServidor
    );
}
