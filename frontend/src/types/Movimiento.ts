export interface Movimiento {

    id: number;

    rele: string;

    modelo: string;

    marca: string;

    estado: string;

    provincia: string | null;

    localidad: string | null;

    destino: string;

    posicion: string;

    responsable: string;

    fechaMovimiento: string;

    notas: string;
}