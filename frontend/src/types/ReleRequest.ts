export interface ReleRequest {

    numeroSerie: string;

    codigoConfiguracion: string;

    modeloId: number | "";

    tipoIngreso: "NUEVO" | "USADO";

    remitoId: number | null;

    ordenProvisionId: number | null;

    posicionInicialId: number | undefined;

    cargarGarantia: boolean;

    garantiaMeses: number | null;

    inicioGarantia: string | null;
}