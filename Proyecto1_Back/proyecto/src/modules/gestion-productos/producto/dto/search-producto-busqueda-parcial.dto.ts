import { IsInt, IsNotEmpty,  IsString, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchProductoBusquedaParcialDto {

  @IsString()
  @IsNotEmpty()
  @MinLength(2, {message: 'La búsqueda debe contener al menos 2 caracteres'})
  busqueda: string;

  @IsInt()
  @Min(0, { message: 'skip debe ser un número entero positivo o 0' })
  @Type(() => Number)
  skip: number = 0;

  @IsInt()
  @Min(1, { message: 'take debe ser un número entero mayor que 0' })
  @Type(() => Number)
  take: number = 10;

}