
import { PresentacionDto } from "src/modules/gestion-productos/presentacion/dto/presentacion-producto.dto";

export interface ReferenciaDto {
  id: number;
  denominacion: string;
}

export function toReferenciaDto<T extends { id: number; denominacion: string }>(
  entity?: T,
): ReferenciaDto {
  if (!entity) {
    throw new Error('Entidad nula al mapear ReferenciaDto');
  }
  return {
    id: entity.id,
    denominacion: entity.denominacion,
  };
}



export function toPresentacionDto<
  T extends {
    id: number;
    denominacion: string;
    observacion?: string;
    sistema: number;
    deletedAt?: Date | null;
  }
>(
  entity?: T | null,
): PresentacionDto | null {
  if (!entity) {
    return null;
  }

  return {
    id: entity.id,
    denominacion: entity.denominacion,
    observacion: entity.observacion ?? '',
    sistema: entity.sistema,
    deletedAt: entity.deletedAt
      ? entity.deletedAt.toISOString()
      : null,
  };
}



export function toReferenciaDtoOrEmpty<T extends { id: number; denominacion: string }>(
  entity?: T | null
): ReferenciaDto {
  return entity ? toReferenciaDto(entity) : EMPTY_REFERENCIA;
}

const EMPTY_REFERENCIA: ReferenciaDto = {
  id: 0,
  denominacion: ""
};