export interface BaseProductoDto {
    marcaId?: number;
    lineaId?: number;
    codigoProveedor?: string;
    denominacion: string;
    presentacionId?: number;
    alicuotaIva?: number;
    costo?: number;
    margen?: number;
  }