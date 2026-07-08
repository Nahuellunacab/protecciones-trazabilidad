import api from "../api/axios";

import type {
    CopilotoConsultaResponse
} from "../types/Copiloto";

export async function consultarCopiloto(
    mensaje: string
): Promise<CopilotoConsultaResponse> {

    const response =
        await api.post(
            "/copiloto/consultar",
            { mensaje }
        );

    return response.data;
}
