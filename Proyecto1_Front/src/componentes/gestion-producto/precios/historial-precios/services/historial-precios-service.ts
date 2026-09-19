import ApiService from "../../../../../utils/apiService";
import { parseApiError } from "../../../../../utils/errores";
import { listarTodosLosProductos } from "../../utils/listar-productos";
import {
  RegistroHistorial,
  RegistroHistorialApi,
  ResultadoHistorialGeneral,
} from "../interfaces/historial-precios.types";
import { armarRegistros, ordenarPorFechaDesc } from "../utils/armar-registros";

const PEDIDOS_SIMULTANEOS = 5;

const HistorialPreciosService = {
  /** Historial de un producto (más reciente primero). */
  obtenerDeProducto: async (productoId: number): Promise<RegistroHistorialApi[]> => {
    const respuesta = await ApiService.get(`/producto/${productoId}/historial-precios`);
    return Array.isArray(respuesta) ? respuesta : [];
  },

  /**
   * Listado general de cambios de precio de todos los productos activos.
   * El back solo expone el historial por producto, así que se consulta uno por uno (de a 5 a la vez) y se junta acá.
   */
  obtenerGeneral: async (): Promise<ResultadoHistorialGeneral> => {
    const productos = await listarTodosLosProductos();
    const registros: RegistroHistorial[] = [];
    let productosConError = 0;
    let ultimoError: unknown = null;
    let siguiente = 0;

    const trabajar = async () => {
      while (siguiente < productos.length) {
        const producto = productos[siguiente++];
        try {
          const historial = await HistorialPreciosService.obtenerDeProducto(producto.id);
          registros.push(...armarRegistros(producto, historial));
        } catch (error) {
          productosConError++;
          ultimoError = error;
        }
      }
    };

    await Promise.all(Array.from({ length: Math.min(PEDIDOS_SIMULTANEOS, productos.length) }, trabajar));

    // Si falló todo (sesión vencida, sin permisos, back caído) no tiene sentido mostrar un listado vacío.
    if (productos.length > 0 && productosConError === productos.length) throw ultimoError;

    return { registros: ordenarPorFechaDesc(registros), totalProductos: productos.length, productosConError };
  },
};

/** Mensaje legible para el usuario a partir de un error de la API. */
export const mensajeDeError = (error: any): string => {
  if (error?.response?.status === 401) return "Tu sesión venció. Volvé a iniciar sesión e intentá de nuevo.";
  if (error?.response?.status === 403) return "No tenés permisos para consultar el historial de precios.";
  if (!error?.response && error?.message) return error.message;
  return parseApiError(error);
};

export default HistorialPreciosService;
