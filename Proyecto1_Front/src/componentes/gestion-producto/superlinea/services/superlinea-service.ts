import { createCrudService } from "../../../../utils/crudFactory";
import { SelectSuperlinea } from "../../../../interfaces/gestion-producto/superlinea/interfaces-superlinea";
import ApiService from "../../../../utils/apiService";

/**
 * SuperlineaService — CR-004 (CA-004.3)
 *
 * Servicio para consumir el módulo de SuperLínea del backend (CR-003, Vicky).
 * Expone los métodos CRUD base (heredados de createCrudService) más el método
 * específico `obtenerParaSelect`, que llama al endpoint dedicado de Vicky para
 * poblar el selector de SuperLínea en los filtros de búsqueda de productos.
 */
const baseService = createCrudService("superlinea");

const SuperlineaService = {
  ...baseService,

  /**
   * Obtiene la lista de SuperLíneas filtrada por denominación parcial.
   * Llama a GET /superlinea/for-select?denominacion=<texto>
   *
   * @param denominacion - Texto parcial para filtrar (puede estar vacío para traer todas)
   * @returns Array de objetos { id, denominacion } listos para usar en react-select
   */
  obtenerParaSelect: async (denominacion: string = ""): Promise<SelectSuperlinea[]> => {
    const data = await ApiService.get("/superlinea/for-select", { denominacion });
    return data as SelectSuperlinea[];
  },
};

export default SuperlineaService;

