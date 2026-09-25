import { ValueTransformer } from 'typeorm';
import { Precio } from '../../domain/value-objects/previo.vo';


export const PrecioTransformer: ValueTransformer = {
  to(precio: Precio): number {
    return precio.getValue();
  },

  from(valor: number|string): Precio {
    return Precio.crear(Number(valor));
  },
};