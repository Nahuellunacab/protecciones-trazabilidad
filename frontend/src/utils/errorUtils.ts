import axios from "axios";

export function extraerMensajeError(
    err: unknown,
    mensajePorDefecto: string
): string {

    if (axios.isAxiosError(err)) {

        return err.response?.data?.message
            || mensajePorDefecto;
    }

    return mensajePorDefecto;
}
