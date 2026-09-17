import { ApiProperty } from '@nestjs/swagger';
import { IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePresentacionDto } from './create-presentacion.dto';

export class GenerarDenominacionDto {

  @ApiProperty({ example: 1 })
  @IsInt()
  marcaId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  lineaId: number;

  @ApiProperty({ type: () => CreatePresentacionDto })
  @ValidateNested()
  @Type(() => CreatePresentacionDto)
  presentacion: CreatePresentacionDto;
}