import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class lineaIntrinsicValidationService {
  /**
   * Valida todos los datos intrínsecos de la linea
   */
  validarDatosBasicos(datos: {
    denominacion: string;
    superlineaId:number; 
  }): void {
    this.validarDenominacion(datos.denominacion);
    this.validarIds(datos.superlineaId);

  }

  private validarDenominacion(denominacion: string): void {
    if (!denominacion || denominacion.trim().length === 0) {
      throw new BadRequestException('La denominación es obligatoria');
    }
    if (denominacion.length > 200) {
      throw new BadRequestException(
        'La denominación no puede superar 200 caracteres',
      );
    }
  }

  private validarIds(
    superlineaId: number
  ): void {

    if (!superlineaId || superlineaId <= 0) {
      throw new BadRequestException('Superlínea ID es requerido y debe ser válido');
    }

  }

}