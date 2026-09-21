// Tipos de la pantalla "Historial de precios" (CR-007).
// El contrato con el back es GET /producto/:id/historial-precios.

/**
 * Registro tal como lo devuelve el back. Ojo: `productoId` llega siempre null (columna duplicada de la
 * entidad; el vínculo real es `producto_id`), por eso el producto se toma del que se consultó.
 */
export interface RegistroHistorialApi {
  id: number;
  precioAnterior: number;
  precioNuevo: number;
  fecha: string; // ISO
  motivo: string;
  usuarioId?: number | null;
}

/** Fila del listado: un cambio de precio de un producto. */
export interface RegistroHistorial {
  id: number;
  fecha: string; // ISO
  productoId: number;
  codigoProveedor: string;
  denominacion: string;
  precioAnterior: number;
  precioNuevo: number;
  diferencia: number;
  motivo: string;
}

export interface ResultadoHistorialGeneral {
  registros: RegistroHistorial[];
  totalProductos: number;
  /** Productos cuyo historial no se pudo consultar (el resto sí se muestra). */
  productosConError: number;
}
