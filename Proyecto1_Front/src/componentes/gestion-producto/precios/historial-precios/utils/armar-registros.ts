import { ProductoListado } from "../../utils/listar-productos";
import { RegistroHistorial, RegistroHistorialApi } from "../interfaces/historial-precios.types";

const redondear = (numero: number): number => Math.round((numero + Number.EPSILON) * 100) / 100;

const marcaDeTiempo = (fecha: string): number => {
  const tiempo = new Date(fecha).getTime();
  return Number.isNaN(tiempo) ? 0 : tiempo;
};

/** Convierte el historial de un producto en filas del listado, agregando los datos del producto. */
export const armarRegistros = (
  producto: ProductoListado,
  historial: RegistroHistorialApi[],
): RegistroHistorial[] =>
  historial.map((registro) => {
    const precioAnterior = Number(registro.precioAnterior);
    const precioNuevo = Number(registro.precioNuevo);

    return {
      id: registro.id,
      fecha: registro.fecha,
      productoId: producto.id,
      codigoProveedor: producto.codigoProveedor,
      denominacion: producto.denominacion,
      precioAnterior,
      precioNuevo,
      diferencia: redondear(precioNuevo - precioAnterior),
      motivo: registro.motivo,
    };
  });

/** Más recientes primero; a igual fecha (ajuste masivo), por id descendente. */
export const ordenarPorFechaDesc = (registros: RegistroHistorial[]): RegistroHistorial[] =>
  [...registros].sort((a, b) => marcaDeTiempo(b.fecha) - marcaDeTiempo(a.fecha) || b.id - a.id);

const normalizar = (texto: string): string =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

/** Filtra por código o denominación del producto, o por motivo del cambio (sin distinguir tildes ni mayúsculas). */
export const filtrarRegistros = (registros: RegistroHistorial[], busqueda: string): RegistroHistorial[] => {
  const texto = normalizar(busqueda);
  if (!texto) return registros;

  return registros.filter((registro) =>
    normalizar(`${registro.codigoProveedor} ${registro.denominacion} ${registro.motivo}`).includes(texto),
  );
};
