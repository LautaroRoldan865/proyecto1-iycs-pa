export class PrecioInvalidoException extends Error {
    constructor(
        public readonly productoId: number,
        public readonly denominacion: string,
        public readonly precioActual: number,
        public readonly precioCalculado: number
    ){
        super(
            `El producto "${denominacion}" 
            (ID: ${productoId}) quedaría con precio inválido ($${precioCalculado}). 
            El precio debe ser estrictamente mayor a 0.`
        )
        this.name = 'PrecioInvalidoException'
    }
}