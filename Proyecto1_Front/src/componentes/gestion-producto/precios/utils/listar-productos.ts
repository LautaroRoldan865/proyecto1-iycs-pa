import ProductoService from "../../producto/services/producto-service";

/** Campos de producto que usan las pantallas de precios (respuesta de GET /producto/search-by). */
export interface ProductoListado {
  id: number;
  codigoProveedor: string;
  denominacion: string;
  precio: number;
}

const TAMANIO_PAGINA = 200;
const MAXIMO_PAGINAS = 100; // corte de seguridad: 20.000 productos

/** Recorre paginado GET /producto/search-by hasta agotar los productos activos (opcionalmente de una línea). */
export const listarTodosLosProductos = async (lineaId?: number): Promise<ProductoListado[]> => {
  const productos: ProductoListado[] = [];

  for (let pagina = 0; pagina < MAXIMO_PAGINAS; pagina++) {
    const respuesta = await ProductoService.obtener({
      lineaId,
      skip: pagina * TAMANIO_PAGINA,
      take: TAMANIO_PAGINA,
    });
    const datos: ProductoListado[] = respuesta?.data ?? [];

    productos.push(...datos);
    if (datos.length < TAMANIO_PAGINA) break;
  }

  return productos;
};
