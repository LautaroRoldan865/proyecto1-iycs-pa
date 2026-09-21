import { IsNumber } from 'class-validator';

export class CalcularPrecioDto {
  @IsNumber({}, { message: 'El costo debe ser un número.' })
  costo: number;

  @IsNumber({}, { message: 'El margen debe ser un número.' })
  margen: number;
}