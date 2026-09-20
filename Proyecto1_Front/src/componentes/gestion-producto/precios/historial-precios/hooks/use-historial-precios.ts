import { useCallback, useEffect, useState } from "react";
import { RegistroHistorial } from "../interfaces/historial-precios.types";
import HistorialPreciosService, { mensajeDeError } from "../services/historial-precios-service";

export function useHistorialPrecios() {
  const [registros, setRegistros] = useState<RegistroHistorial[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productosConError, setProductosConError] = useState(0);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const resultado = await HistorialPreciosService.obtenerGeneral();
      setRegistros(resultado.registros);
      setProductosConError(resultado.productosConError);
    } catch (falla) {
      setRegistros([]);
      setProductosConError(0);
      setError(mensajeDeError(falla));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { registros, cargando, error, productosConError, recargar: cargar };
}
