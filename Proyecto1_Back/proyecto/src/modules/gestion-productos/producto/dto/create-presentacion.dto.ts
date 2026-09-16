import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsPositive } from 'class-validator';
import { UnidadPresentacion } from '../domain/entities/presentacion.entity';

export class CreatePresentacionDto {
  @ApiProperty({ example: 500, description: 'Cantidad (ej: 500, 1.5)' })
  @IsNumber()
  @IsPositive({ message: 'La cantidad de la presentación debe ser mayor a 0' })
  cantidad: number;

  @ApiProperty({ enum: UnidadPresentacion, example: UnidadPresentacion.MILILITROS })
  @IsEnum(UnidadPresentacion, { message: 'Unidad de presentación inválida' })
  unidad: UnidadPresentacion;
}