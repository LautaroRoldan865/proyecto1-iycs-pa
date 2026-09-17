import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsString } from "class-validator";

export class SuperLineaDto{
    @ApiProperty({example:123, description:"ID superlinea"})
    @Type(()=> Number)
    @IsInt()
    id:number;

    @ApiProperty({example:"Bebidas", description:"Denominacion o nombre de la superlinea"})
    @IsString()
    denominacion: string;

    @ApiProperty({example:"", description:"Observacion sobre la superlinea"})
    @IsString()
    observacion:string;

}