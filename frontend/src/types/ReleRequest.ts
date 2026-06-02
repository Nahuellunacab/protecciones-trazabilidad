export interface ReleRequest {

    numeroSerie: string;

    modeloId: number | "";

    tipoIngreso: "NUEVO" | "USADO";

    remitoId: number | null;

    provinciaId?: number;

    localidadId?: number;

    destinoId?: number;

    posicionId?: number;
}