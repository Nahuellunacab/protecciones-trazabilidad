// Forma generica que consume RegistrosSimilaresAlert (componente
// reutilizable de deteccion de duplicados). Cada pantalla que integre
// la funcionalidad (Destino, Posicion, Localidad, Marca, Modelo,
// Proveedor...) mapea la respuesta de su propio endpoint "/similares"
// a esta forma antes de renderizar la alerta.
export interface RegistroSimilar {

    id: number;

    nombre: string;

    descripcion?: string;

    detalle?: string;

    similitud: number;
}
