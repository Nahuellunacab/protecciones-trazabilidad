export interface Modelo {

    id: number;

    nombre: string;

    tensionDesde: number | null;

    tensionHasta: number | null;

    tipoTension: string | null;

    tensionCompleta: string;

    marcaId: number;

    marcaNombre: string;

    tipoId: number;

    tipoNombre: string;
}