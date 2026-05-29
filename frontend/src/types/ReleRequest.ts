export interface ReleRequest {

    numeroSerie: string;

    modeloId: number | "";

    cargarGarantia: boolean;

    garantiaMeses: number;

    inicioGarantia: string;

    remitoId: number | null;

    provinciaId?: number;

    localidadId?: number;

    destinoId?: number;

    posicionId?: number;
}