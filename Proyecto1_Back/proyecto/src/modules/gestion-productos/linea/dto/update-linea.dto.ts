import { PartialType } from '@nestjs/mapped-types';
import { CreateLineaDto } from './create-linea.dto';
import { IsNotEmpty, IsInt, IsBoolean, IsOptional } from 'class-validator';

export class UpdateLineaDto extends PartialType(CreateLineaDto) {
    @IsOptional()
    @IsBoolean()
    utilizaStockMinimo: boolean;

    @IsOptional()
    updatedAt?: Date;

    @IsOptional()
    @IsInt({ message: 'El usuarioCreatedId debe ser un número entero.' })
    usuarioUpdatedId?: number;
}
