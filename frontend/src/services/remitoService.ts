import api from "../api/axios";

import type {
    Remito
} from "../types/Remito";

import type {
    RemitoRequest
} from "../types/RemitoRequest";

import type {
    RemitoAnalisisIA,
    RemitoDatosExtraidos
} from "../types/RemitoAnalisisIA";

export async function obtenerRemitos():
Promise<Remito[]> {

    const response =
        await api.get(
            "/remitos"
        );

    return response.data;
}

export async function obtenerRemitosDisponibles():
Promise<Remito[]> {

    const response =
        await api.get(
            "/remitos/disponibles"
        );

    return response.data;
}

export async function crearRemito(
    data: RemitoRequest
) {

    const response =
        await api.post(
            "/remitos",
            data
        );

    return response.data;
}

export async function actualizarRemito(

    id: number,
    data: RemitoRequest
) {

    const response =
        await api.put(
            `/remitos/${id}`,
            data
        );

    return response.data;
}

export async function eliminarRemito(
    id: number
) {

    await api.delete(
        `/remitos/${id}`
    );
}

export async function subirArchivoRemito(
    remitoId: number,
    archivo: File
) {

    const formData =
        new FormData();

    formData.append(
        "archivo",
        archivo
    );

    await api.post(
        `/remitos/${remitoId}/archivo`,
        formData
    );
}

// Abre el PDF de un remito en una pestaña nueva. No se puede usar
// window.open(`/api/remitos/{id}/archivo`) directo: esa ruta requiere el
// header Authorization (JWT) que solo agrega el interceptor de axios, y
// además debe resolverse contra el baseURL configurado (dev/proxy/docker),
// no contra el origen del propio frontend. Por eso se pide el archivo como
// blob autenticado y se abre como object URL.
// La pestaña se abre ANTES del fetch (con about:blank) para que el
// navegador no la bloquee como popup, ya que el open() debe ocurrir de
// forma sincrónica dentro del handler del click.
export async function abrirArchivoRemito(
    remitoId: number
): Promise<void> {

    const ventana =
        window.open(
            "",
            "_blank"
        );

    try {

        const response =
            await api.get(
                `/remitos/${remitoId}/archivo`,
                {
                    responseType: "blob"
                }
            );

        const blobUrl =
            URL.createObjectURL(
                response.data
            );

        if (ventana) {

            ventana.location.href =
                blobUrl;

        } else {

            window.open(
                blobUrl,
                "_blank"
            );
        }

    } catch (err) {

        if (ventana) {

            ventana.close();
        }

        throw err;
    }
}

export async function analizarRemitoConIA(
    archivo: File
): Promise<RemitoAnalisisIA> {

    const formData =
        new FormData();

    formData.append(
        "archivo",
        archivo
    );

    const response =
        await api.post(
            "/remitos/analizar",
            formData
        );

    return response.data;
}

// Revalida un analisis ya extraido (mismos datos crudos) sin volver a
// llamar a Gemini. Se usa despues de crear desde el dialogo de importacion
// una marca/modelo/proveedor que faltaba, para que el matching contra los
// catalogos se repita ya con el registro nuevo cargado.
export async function revalidarAnalisisRemito(
    datos: RemitoDatosExtraidos
): Promise<RemitoAnalisisIA> {

    const response =
        await api.post(
            "/remitos/analizar/revalidar",
            datos
        );

    return response.data;
}