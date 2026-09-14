export enum UnidadPresentacion {
  GRAMOS = 'GRAMOS',
  KILOGRAMOS = 'KILOGRAMOS',
  MILILITROS = 'MILILITROS',
  LITROS = 'LITROS',
  UNIDADES = 'UNIDADES',
}
export class Presentacion {
    constructor(
        public readonly cantidad:number,
        public readonly unidad:UnidadPresentacion,
        public readonly unidadesPorPack: number = 1,

    ){
        if(cantidad <= 0){
            throw new Error("La cantidad debe ser mayor a 0")
        }

        if(unidadesPorPack <= 0){
            throw new Error("La cantidad de unidades debe ser mayor a 0")
        }

    }

    get esPack():boolean{
        return this.unidadesPorPack > 1;
    }

    get toStringPresentacion():string{
        if(this.esPack === true){
            return `Pack de: ${this.unidadesPorPack} unidades, de ${this.cantidad} ${this.unidad}`
        }else{
            return `${this.cantidad} ${this.unidad}`
        }
        
    }   
}