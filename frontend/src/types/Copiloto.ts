export interface CopilotoAccion {

    accion: "FILTRAR_RELES" | "ABRIR_RELE" | "IR_A_MODULO";

    marca: string | null;

    modelo: string | null;

    estado: string | null;

    proveedor: string | null;

    destino: string | null;

    serie: string | null;

    modulo: "DASHBOARD" | "RELES" | "MOVIMIENTOS" | "ADMINISTRACION" | null;
}

export interface CopilotoConsultaResponse {

    tipo: "RESPUESTA" | "ACCION";

    respuesta: string | null;

    accion: CopilotoAccion | null;
}
