import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Matches } from 'class-validator';

export class UpdateSuperLineaDto {

  @IsOptional()
  @IsString({
    message: 'La denominación debe ser una cadena de texto.',
  })
  @IsNotEmpty({
    message: 'La denominación no puede estar vacía.',
  })
  @MaxLength(255, {
    message: 'La denominación no puede superar los 255 caracteres.',
  })
  @Matches(/^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ]+$/, {
    message: 'La denominación solo puede contener letras, números y espacios.',
  })
  denominacion?: string;

  @IsOptional()
  @IsString({
    message: 'La observación debe ser una cadena de texto.',
  })
  observacion?: string;

  @IsNotEmpty({
    message: 'El usuarioUpdatedId es obligatorio.',
  })
  @IsInt({
    message: 'El usuarioUpdatedId debe ser un número entero.',
  })
  usuarioUpdatedId: number;
}