import { Injectable, Inject, ConflictException } from "@nestjs/common";
import { ISuperLineaRepository } from "../interfaces/superlinea.repository.interface";

@Injectable()
export class PoliticaSuperLineaService {

  constructor(
    @Inject('ISuperLineaRepository')
    private readonly repository: ISuperLineaRepository,
  ) {}

  async validarDenominacion(denominacion: string, id?: number): Promise<void> {

    const normalizada =
      denominacion.trim().toUpperCase();

    const existente =
      await this.repository.findByDenominationWith(normalizada);

    if (existente && existente.id !== id) {
      throw new ConflictException(
        'La denominación ya está en uso o esta eliminada.',
      );
    }
  }
}