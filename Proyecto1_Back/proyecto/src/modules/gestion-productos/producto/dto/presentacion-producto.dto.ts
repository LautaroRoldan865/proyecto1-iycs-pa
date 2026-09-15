import { ApiProperty } from "@nestjs/swagger";
import { UnidadPresentacion } from "../domain/entities/presentacion.entity";

export class PresentacionDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 500 })
  cantidad: number;

  @ApiProperty({ enum: UnidadPresentacion, example: 'MILILITROS' })
  unidad: UnidadPresentacion;

}