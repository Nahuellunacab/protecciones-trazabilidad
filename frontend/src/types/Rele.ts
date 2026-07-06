export interface Rele {

    id: number;

    numeroSerie: string;

    codigoConfiguracion: string | null;

    garantiaMeses: number | null;

    inicioGarantia: string | null;

    finGarantia: string | null;

    modelo: string;

    marca: string;

    estadoActual: string;

    posicionActual: string;

    localidadActual: string;

    modeloId: number | null;

    remitoId: number | null;

    ordenProvisionId: number | null;

    tipoIngreso: "NUEVO" | "USADO";

    estadoGarantia: string;

    mesesRestantesGarantia: number | null;

    activo: boolean;

    motivoBaja: string | null;

    fechaBaja: string | null;
}