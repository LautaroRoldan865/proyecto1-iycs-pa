import { useCallback, useEffect, useState } from "react";
import {
  ConfiguracionAjuste,
  LineaOpcion,
  ProductoVistaPrevia,
  ResultadoOperacion,
} from "../interfaces/actualizacion-masiva.types";
import ActualizacionMasivaService, { mensajeDeError } from "../services/actualizacion-masiva-service";
import { construirPayload, generarVistaPrevia } from "../utils/calculo-ajuste-precio";

export function useActualizacionMasiva(usuarioId: number) {
  const [lineas, setLineas] = useState<LineaOpcion[]>([]);
  const [errorLineas, setErrorLineas] = useState<string | null>(null);
  const [productosVistaPrevia, setProductosVistaPrevia] = useState<ProductoVistaPrevia[] | null>(null);
  // Configuración con la que se generó la vista previa: es la que se envía al confirmar.
  const [configuracionVistaPrevia, setConfiguracionVistaPrevia] = useState<ConfiguracionAjuste | null>(null);
  const [cargandoVistaPrevia, setCargandoVistaPrevia] = useState(false);
  const [aplicando, setAplicando] = useState(false);

  useEffect(() => {
    ActualizacionMasivaService.obtenerLineas()
      .then(setLineas)
      .catch(() => setErrorLineas("No se pudieron cargar las líneas."));
  }, []);

  const limpiarVistaPrevia = useCallback(() => {
    setProductosVistaPrevia(null);
    setConfiguracionVistaPrevia(null);
  }, []);

  /** Calcula el impacto del ajuste sin modificar ningún precio (CA-006.2). */
  const previsualizar = async (configuracion: ConfiguracionAjuste): Promise<ResultadoOperacion> => {
    setCargandoVistaPrevia(true);
    try {
      const productos = await ActualizacionMasivaService.obtenerProductosEnAlcance(configuracion.lineaId);

      if (productos.length === 0) {
        limpiarVistaPrevia();
        return { ok: false, mensaje: "No se encontraron productos activos para el alcance seleccionado." };
      }

      setProductosVistaPrevia(generarVistaPrevia(productos, configuracion));
      setConfiguracionVistaPrevia(configuracion);
      return { ok: true };
    } catch (error) {
      limpiarVistaPrevia();
      return { ok: false, mensaje: mensajeDeError(error) };
    } finally {
      setCargandoVistaPrevia(false);
    }
  };

  /** Aplica el ajuste previsualizado. Nada se aplica si algún producto quedaría en 0 o negativo (CA-006.5). */
  const aplicar = async (): Promise<ResultadoOperacion> => {
    if (!productosVistaPrevia || !configuracionVistaPrevia) {
      return { ok: false, mensaje: "Primero generá la vista previa del ajuste." };
    }
    if (productosVistaPrevia.some((producto) => !producto.esValido)) {
      return {
        ok: false,
        mensaje: "No se pueden aplicar los cambios: hay productos que quedarían con precio menor o igual a cero.",
      };
    }
    if (!usuarioId) {
      return { ok: false, mensaje: "No se pudo identificar al usuario. Volvé a iniciar sesión." };
    }

    setAplicando(true);
    try {
      const respuesta = await ActualizacionMasivaService.aplicarAjuste(
        construirPayload(configuracionVistaPrevia),
        usuarioId,
      );
      limpiarVistaPrevia();
      return { ok: true, mensaje: respuesta.message, productosAfectados: respuesta.productosAfectados };
    } catch (error) {
      return { ok: false, mensaje: mensajeDeError(error) };
    } finally {
      setAplicando(false);
    }
  };

  return {
    lineas,
    errorLineas,
    productosVistaPrevia,
    configuracionVistaPrevia,
    cargandoVistaPrevia,
    aplicando,
    previsualizar,
    aplicar,
    limpiarVistaPrevia,
  };
}
