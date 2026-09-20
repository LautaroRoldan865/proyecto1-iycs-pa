import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ILineaRepository } from '../../domain/interfaces/linea.repository.interface';

@Injectable()
export class LineaUniquenessValidator {

  private readonly logger = new Logger(LineaUniquenessValidator.name);

  constructor(
    @Inject('IProductoRepository')
    private readonly repository: ILineaRepository,
  ) {}

  /**
   * Valida que la denominación sea única
   * @param denominacion - Denominación a validar
   */
  async validarDenominacionUnica(denominacion: string): Promise<void> {
    const existingLine = await this.repository.findByDenominacion(denominacion);

    if (existingLine) {
      this.logger.warn(
        `Producto - Denominación duplicada: "${denominacion}"`,
      );
      throw new ConflictException(
        `La denominación "${denominacion}" ya está en uso`,
      );
    }
  }
}