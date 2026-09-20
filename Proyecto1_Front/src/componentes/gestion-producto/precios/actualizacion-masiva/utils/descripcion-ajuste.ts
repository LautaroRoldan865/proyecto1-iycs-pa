import { formatPrice } from "../../../../herramientas/formateo-de-campos/fucion-formateo";
import {
  AlcanceAjuste,
  ConfiguracionAjuste,
  DireccionAjuste,
  LineaOpcion,
  TipoAjuste,
} from "../interfaces/actualizacion-masiva.types";

/** Ej.: "Aumento de 10,00 %" o "Disminución de $ 150,00". */
export const describirAjuste = (configuracion: ConfiguracionAjuste): string => {
  const accion = configuracion.direccion === DireccionAjuste.AUMENTO ? "Aumento" : "Disminución";
  const magnitud =
    configuracion.tipoAjuste === TipoAjuste.PORCENTAJE
      ? `${configuracion.valor.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`
      : formatPrice(configuracion.valor, "ARS");

  return `${accion} de ${magnitud}`;
};

/** Ej.: "todos los productos" o "la línea GASEOSAS". */
export const describirAlcance = (configuracion: ConfiguracionAjuste, lineas: LineaOpcion[]): string => {
  if (configuracion.alcance === AlcanceAjuste.GLOBAL) return "todos los productos";

  const linea = lineas.find((opcion) => opcion.id === configuracion.lineaId);
  return linea ? `la línea ${linea.denominacion}` : "la línea seleccionada";
};
