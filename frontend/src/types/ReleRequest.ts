export interface ReleRequest {

    numeroSerie: string;

    codigoConfiguracion: string;

    orderCode: string;

    modeloId: number | "";

    tipoIngreso: "NUEVO" | "USADO";

    remitoId: number | null;

    ordenProvisionId: number | null;

    posicionInicialId: number | undefined;

    estadoInicialId?: number;

    cargarGarantia: boolean;

    garantiaMeses: number | null;

    inicioGarantia: string | null;
}