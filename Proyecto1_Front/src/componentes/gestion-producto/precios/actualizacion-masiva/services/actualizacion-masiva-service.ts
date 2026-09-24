import ApiService from "../../../../../utils/apiService";
import { parseApiError } from "../../../../../utils/errores";
import LineaService from "../../../linea/services/linea-service";
import { listarTodosLosProductos } from "../../utils/listar-productos";
import {
  LineaOpcion,
  PayloadActualizacionMasiva,
  ProductoBusqueda,
  RespuestaActualizacionMasiva,
  RespuestaActualizacionMasivaCruda,
} from "../interfaces/actualizacion-masiva.types";

const ActualizacionMasivaService = {
  /** Todas las líneas activas, para el selector de alcance. */
  obtenerLineas: async (): Promise<LineaOpcion[]> => {
    const respuesta = await LineaService.obtener({ skip: 0, take: 500 });
    const lista = Array.isArray(respuesta) ? respuesta : (respuesta?.data ?? []);
    return lista.map((linea: any) => ({ id: linea.id, denominacion: linea.denominacion }));
  },

  /**
   * Productos que alcanza el ajuste: los mismos que actualizará el back
   * (activos, y de una línea si se indica). Se recorre paginado hasta agotarlos.
   */
  obtenerProductosEnAlcance: (lineaId?: number): Promise<ProductoBusqueda[]> => listarTodosLosProductos(lineaId),

  aplicarAjuste: async (
    payload: PayloadActualizacionMasiva,
    usuarioId: number,
  ): Promise<RespuestaActualizacionMasiva> => {
    const respuesta: (RespuestaActualizacionMasiva & RespuestaActualizacionMasivaCruda) | undefined =
      await ApiService.patch(`/producto/precios/actualizacion-masiva?usuarioId=${usuarioId}`, payload);

    // Forma esperada originalmente: { message, productosAfectados }.
    if (respuesta && typeof respuesta.productosAfectados === "number") {
      return respuesta;
    }

    // Forma real que devuelve hoy el back (ActualizarPreciosMasivosUseCase.ejecutar):
    // { productos, historiales }, sin message ni productosAfectados. Se deriva la
    // confirmación de la cantidad de historiales (o productos) devueltos.
    const cantidad = Array.isArray(respuesta?.historiales)
      ? respuesta.historiales.length
      : Array.isArray(respuesta?.productos)
        ? respuesta.productos.length
        : null;

    if (cantidad === null) {
      // El back puede responder 200 con cuerpo vacío si falla el guardado (hace rollback y no relanza).
      throw new Error("El servidor no confirmó la actualización. Los precios no se modificaron.");
    }

    return {
      message: "Actualización masiva de precios realizada con éxito.",
      productosAfectados: cantidad,
    };
  },
};

/** Mensaje legible para el usuario a partir de un error de la API. */
export const mensajeDeError = (error: any): string => {
  if (error?.response?.status === 401) return "Tu sesión venció. Volvé a iniciar sesión e intentá de nuevo.";
  if (error?.response?.status === 403) return "No tenés permisos para actualizar precios de forma masiva.";
  if (!error?.response && error?.message) return error.message;
  return parseApiError(error);
};

export default ActualizacionMasivaService;
