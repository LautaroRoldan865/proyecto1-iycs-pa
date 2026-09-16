import { UnidadPresentacion } from "src/modules/gestion-productos/producto/domain/entities/presentacion.entity";
import { PresentacionDto } from "src/modules/gestion-productos/producto/dto/presentacion-producto.dto";

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



export function toPresentacionDto<T extends { id: number; cantidad: number, unidad:UnidadPresentacion}>(
  entity?: T,
): PresentacionDto {
  if (!entity) {
    throw new Error('Entidad nula al mapear ReferenciaDto');
  }
  return {
    id: entity.id,
    cantidad: entity.cantidad,
    unidad: entity.unidad,
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