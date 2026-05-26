export interface Modelo {

    id: number;

    nombre: string;

    tensionDesde: number;

    tensionHasta: number;

    tipoTension: string;

    marcaId: number;

    marca: string;

    tipoId: number;

    tipo: string;

    cantidadRelesActivos: number;

    cantidadRelesBaja: number;

    cantidadTotalReles: number;
}