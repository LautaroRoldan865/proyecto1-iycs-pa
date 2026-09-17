import { Injectable, Inject, ConflictException } from "@nestjs/common";
import { ISuperLineaRepository } from "../interfaces/superlinea.repository.interface";

@Injectable()
export class PoliticaEliminacionSuperLinea {

  constructor(
    @Inject('ISuperLineaRepository')
    private readonly superlineaRepository: ISuperLineaRepository,
  ) {}

  async validar(id: number): Promise<boolean> {

    const lines = await this.superlineaRepository.hasLines(id);

    if (lines === true) {
      throw new ConflictException(
        'No se puede eliminar la SuperLínea porque tiene líneas asociadas.',
      );
    }

        return false;

    }

}
