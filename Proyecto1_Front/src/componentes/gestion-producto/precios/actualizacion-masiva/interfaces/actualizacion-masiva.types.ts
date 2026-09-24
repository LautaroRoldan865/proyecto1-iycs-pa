// Tipos de la pantalla "Actualización masiva de precios" (CR-006).
// El contrato con el back es PATCH /producto/precios/actualizacion-masiva.

export const TipoAjuste = {
  PORCENTAJE: "PORCENTAJE",
  MONTO_FIJO: "MONTO_FIJO",
} as const;
export type TipoAjuste = (typeof TipoAjuste)[keyof typeof TipoAjuste];

export const DireccionAjuste = {
  AUMENTO: "AUMENTO",
  DISMINUCION: "DISMINUCION",
} as const;
export type DireccionAjuste = (typeof DireccionAjuste)[keyof typeof DireccionAjuste];

export const AlcanceAjuste = {
  GLOBAL: "GLOBAL",
  LINEA: "LINEA",
} as const;
export type AlcanceAjuste = (typeof AlcanceAjuste)[keyof typeof AlcanceAjuste];

/** Lo que el usuario configura en el formulario. `valor` siempre es positivo: el signo lo da `direccion`. */
export interface ConfiguracionAjuste {
  alcance: AlcanceAjuste;
  lineaId?: number;
  tipoAjuste: TipoAjuste;
  direccion: DireccionAjuste;
  valor: number;
  motivo: string;
}

export interface LineaOpcion {
  id: number;
  denominacion: string;
}

/** Campos de producto que se usan de la respuesta de GET /producto/search-by. */
export interface ProductoBusqueda {
  id: number;
  codigoProveedor: string;
  denominacion: string;
  precio: number;
}

export interface ProductoVistaPrevia {
  id: number;
  codigoProveedor: string;
  denominacion: string;
  precioActual: number;
  precioNuevo: number;
  diferencia: number;
  /** El precio resultante debe ser estrictamente mayor a 0 (CA-006.5). */
  esValido: boolean;
}

/** Body que espera el back. `valor` va con signo (negativo = disminución). */
export interface PayloadActualizacionMasiva {
  tipoAjuste: TipoAjuste;
  valor: number;
  motivo: string;
  lineaId?: number;
}

export interface RespuestaActualizacionMasiva {
  message: string;
  productosAfectados: number;
}

/**
 * Forma real que hoy devuelve el back (ActualizarPreciosMasivosUseCase.ejecutar):
 * las entidades completas, no { message, productosAfectados }. Se usa solo para
 * derivar la confirmación en el front; no se leen sus campos internos.
 */
export interface RespuestaActualizacionMasivaCruda {
  productos?: unknown[];
  historiales?: unknown[];
}

export type ResultadoOperacion =
  | { ok: true; mensaje?: string; productosAfectados?: number }
  | { ok: false; mensaje: string };
