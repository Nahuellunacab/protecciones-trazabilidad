export interface Rele {

    id: number;

    numeroSerie: string;

    garantiaMeses: number | null;

    inicioGarantia: string | null;

    finGarantia: string | null;

    modelo: string;

    marca: string;

    tension: string;

    tipo: string;

    estadoActual: string;

    posicionActual: string;

    localidadActual: string;

    modeloId: number | null;

    remitoId: number | null;

    estadoGarantia: string;

    mesesRestantesGarantia: number | null;

    activo: boolean;

    motivoBaja: string | null;

    fechaBaja: string | null;
}