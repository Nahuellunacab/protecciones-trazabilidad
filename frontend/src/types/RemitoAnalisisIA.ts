export interface ValidacionItem {

    mensaje: string;

    severidad: "OK" | "ADVERTENCIA" | "ERROR";
}

export interface ReleDetectado {

    numeroSerie: string | null;

    modelo: string | null;

    marca: string | null;

    codigoConfiguracion: string | null;

    modeloId: number | null;

    marcaId: number | null;

    valido: boolean;

    validaciones: ValidacionItem[];
}

export interface RemitoAnalisisIA {

    numeroRemito: string | null;

    fecha: string | null;

    proveedor: string | null;

    proveedorId: number | null;

    proveedorEncontrado: boolean;

    ordenProvision: string | null;

    reles: ReleDetectado[];

    accesoriosIgnorados: string[];

    cantidadValidos: number;

    cantidadModelosNuevos: number;

    cantidadConError: number;

    cantidadAccesoriosIgnorados: number;

    todosValidos: boolean;
}

// Datos crudos (sin resolver contra catalogos) para pedirle al backend que
// revalide un analisis ya hecho, sin volver a llamar a Gemini. Se arma a
// partir de un RemitoAnalisisIA existente (ver armarDatosParaRevalidar en
// remitoService.ts).
export interface ReleExtraido {

    marca: string | null;

    modelo: string | null;

    codigoConfiguracion: string | null;

    numeroSerie: string | null;
}

export interface RemitoDatosExtraidos {

    numeroRemito: string | null;

    fecha: string | null;

    proveedor: string | null;

    ordenProvision: string | null;

    reles: ReleExtraido[];
}
