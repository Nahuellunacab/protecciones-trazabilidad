export interface ReleRequest {

    numeroSerie: string;

    modeloId: number | "";

    tipoIngreso: "NUEVO" | "USADO";

    remitoId: number | null;

    posicionInicialId: number | undefined;

}