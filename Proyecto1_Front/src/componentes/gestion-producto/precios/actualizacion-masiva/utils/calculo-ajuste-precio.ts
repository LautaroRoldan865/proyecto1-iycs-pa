import {
  AlcanceAjuste,
  ConfiguracionAjuste,
  DireccionAjuste,
  PayloadActualizacionMasiva,
  ProductoBusqueda,
  ProductoVistaPrevia,
  TipoAjuste,
} from "../interfaces/actualizacion-masiva.types";

// La vista previa replica el cálculo del back (Producto.precio y actualizarPrecioconHistorial):
// redondeo a 2 decimales en cada paso, para que lo que se muestra sea lo que se aplica.
export const redondear = (numero: number): number => Math.round((numero + Number.EPSILON) * 100) / 100;

export const valorConSigno = (direccion: DireccionAjuste, valor: number): number =>
  direccion === DireccionAjuste.DISMINUCION ? -valor : valor;

export const calcularPrecioNuevo = (precioActual: number, tipoAjuste: TipoAjuste, valor: number): number =>
  tipoAjuste === TipoAjuste.PORCENTAJE
    ? redondear(precioActual * (1 + valor / 100))
    : redondear(precioActual + valor);

export const generarVistaPrevia = (
  productos: ProductoBusqueda[],
  configuracion: ConfiguracionAjuste,
): ProductoVistaPrevia[] => {
  const valor = valorConSigno(configuracion.direccion, configuracion.valor);

  return productos.map((producto) => {
    const precioActual = redondear(producto.precio ?? 0);
    const precioNuevo = calcularPrecioNuevo(precioActual, configuracion.tipoAjuste, valor);

    return {
      id: producto.id,
      codigoProveedor: producto.codigoProveedor,
      denominacion: producto.denominacion,
      precioActual,
      precioNuevo,
      diferencia: redondear(precioNuevo - precioActual),
      esValido: precioNuevo > 0,
    };
  });
};

/** Validaciones del formulario. Devuelve la lista de motivos por los que no se puede continuar. */
export const validarConfiguracion = (configuracion: ConfiguracionAjuste): string[] => {
  const errores: string[] = [];

  if (configuracion.alcance === AlcanceAjuste.LINEA && !configuracion.lineaId) {
    errores.push("Seleccioná la línea sobre la que se aplicará el ajuste.");
  }

  if (!(configuracion.valor > 0)) {
    errores.push(
      configuracion.tipoAjuste === TipoAjuste.MONTO_FIJO
        ? "No se pueden aplicar los cambios: el monto fijo debe ser mayor a cero."
        : "No se pueden aplicar los cambios: el porcentaje debe ser mayor a cero.",
    );
  }

  if (!configuracion.motivo.trim()) {
    errores.push("Ingresá el motivo del ajuste.");
  }

  return errores;
};

export const construirPayload = (configuracion: ConfiguracionAjuste): PayloadActualizacionMasiva => ({
  tipoAjuste: configuracion.tipoAjuste,
  valor: valorConSigno(configuracion.direccion, configuracion.valor),
  motivo: configuracion.motivo.trim(),
  ...(configuracion.alcance === AlcanceAjuste.LINEA && configuracion.lineaId
    ? { lineaId: configuracion.lineaId }
    : {}),
});
