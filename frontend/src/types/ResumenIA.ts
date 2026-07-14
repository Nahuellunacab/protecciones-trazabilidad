export interface ResumenIA {

    resumen: string | null;

    // Momento real en que el backend generó el resumen devuelto (no
    // cuándo llegó esta respuesta): como se cachea 4hs del lado del
    // servidor, la mayoría de los pedidos devuelven un resumen generado
    // antes. Null cuando resumen es null.
    generadoEn: string | null;
}
