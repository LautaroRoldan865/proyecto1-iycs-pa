import { ApiProperty } from '@nestjs/swagger';
import { IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';


export class GenerarDenominacionDto {

  @ApiProperty({ example: 1 })
  @IsInt()
  marcaId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  lineaId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  presentacionId: number;

  /*@ApiProperty({ type: () => CreatePresentacionDto })
  @ValidateNested()
  @Type(() => CreatePresentacionDto)
  presentacion: CreatePresentacionDto;*/
}