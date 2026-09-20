export class ProductosNoEncontradosException extends Error {

  constructor(lineaId?: number) {
    if(lineaId){
        super(
            `No se encontraron productos activos para la línea ${lineaId}.`,
        );
    }else{
       super(
            `No se encontraron productos activos para actualizacion masiva.`,
        ); 
    }
    
  }
}