import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, NotEquals } from "class-validator";

export enum TipoAjustePrecio{
    PORCENTAJE = 'PORCENTAJE',
    MONTO_FIJO = 'MONTO_FIJO'
}

export class ActualizarPreciosMasivosDto{
    @IsEnum(TipoAjustePrecio, {message: 'tipoAjuste debe ser PORCENTAJE o MONTO_FIJO'  })
    tipoAjuste:TipoAjustePrecio

    @IsNumber({}, { message:'El valor debe ser numerico'})
    @NotEquals(0,{ message: 'el valor no puede ser 0'})
    valor:number

    @IsNotEmpty({ message:'el motivo es obligatorio'})
    @IsString()
    motivo: string

    @IsOptional()
    @IsNumber({},{message: 'lineaId debe ser un número entero'})
    lineaId?: number

}