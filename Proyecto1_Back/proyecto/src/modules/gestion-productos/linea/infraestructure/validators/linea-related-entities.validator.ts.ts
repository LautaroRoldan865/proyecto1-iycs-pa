import { Injectable } from '@nestjs/common';
import { SuperlineaService } from 'src/modules/gestion-productos/superlinea/application/service/superlinea.service';
import { SuperLinea } from 'src/modules/gestion-productos/superlinea/domain/entities/superlinea.entity';

@Injectable()
export class LineaRelatedEntitiesValidator {

  constructor(
    private readonly superlineaService: SuperlineaService,
  ) {}

  async validarYObtenerEntidadesRelacionadas(superlineaId: number): Promise<{ superlinea: SuperLinea }> {

    const superlinea = await this.superlineaService.findEntityById(superlineaId);

    return {superlinea};
  }
}