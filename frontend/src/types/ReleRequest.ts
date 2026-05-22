export interface ReleRequest {

    numeroSerie: string;

    modeloId: number;

    remitoId?: number;

    cargarGarantia?: boolean;

    garantiaMeses?: number;

    inicioGarantia?: string;
}