import { Logger } from '@nestjs/common';

import { toReferenciaDto } from 'src/modules/common/utils/mappers/referencia.mapper';
import { SuperLineaDto } from '../dto/superlinea.dto';
import { SuperLinea } from '../domain/entities/superlinea.entity';

export class SuperlineaMapper {
  private static readonly logger = new Logger(SuperlineaMapper.name);

  static toDto(entity: SuperLinea): SuperLineaDto {
    return {
      id: entity.id,
      denominacion: entity.denominacion,
      observacion: entity.observacion ?? '',
      deletedAt: entity.deletedAt
        ? entity.deletedAt instanceof Date
            ? entity.deletedAt.toISOString()
            : entity.deletedAt
        : null,

    };
  }
}
