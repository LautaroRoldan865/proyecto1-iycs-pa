import { useState } from "react";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/Card";
import { Alertas, TipoAlerta, TituloAlerta, useAlerts } from "../../../../herramientas/alertas/alertas";
import {
  TipoAlertaConfirmacion,
  useConfirmation,
} from "../../../../herramientas/alertas/alertas-confirmacion";
import { getUsuarioId } from "../../../../../utils/auth";
import FormularioAjuste from "../componentes/formulario-ajuste";
import ResumenVistaPrevia from "../componentes/resumen-vista-previa";
import TablaVistaPrevia from "../componentes/tabla-vista-previa";
import { useActualizacionMasiva } from "../hooks/use-actualizacion-masiva";
import {
  AlcanceAjuste,
  ConfiguracionAjuste,
  DireccionAjuste,
  TipoAjuste,
} from "../interfaces/actualizacion-masiva.types";
import { validarConfiguracion } from "../utils/calculo-ajuste-precio";
import { describirAjuste, describirAlcance } from "../utils/descripcion-ajuste";

const CONFIGURACION_INICIAL: ConfiguracionAjuste = {
  alcance: AlcanceAjuste.GLOBAL,
  tipoAjuste: TipoAjuste.PORCENTAJE,
  direccion: DireccionAjuste.AUMENTO,
  valor: 0,
  motivo: "",
};

export default function ActualizacionMasivaPrecios() {
  const navigate = useNavigate();
  const usuarioId = getUsuarioId();
  const { alerts, addAlert, removeAlert } = useAlerts();
  const { showConfirmation, AlertasConfirmacion } = useConfirmation();

  const [configuracion, setConfiguracion] = useState<ConfiguracionAjuste>(CONFIGURACION_INICIAL);
  const [erroresValidacion, setErroresValidacion] = useState<string[]>([]);

  const {
    lineas,
    errorLineas,
    productosVistaPrevia,
    configuracionVistaPrevia,
    cargandoVistaPrevia,
    aplicando,
    previsualizar,
    aplicar,
    limpiarVistaPrevia,
  } = useActualizacionMasiva(usuarioId);

  const mostrarError = (message: string) =>
    addAlert({ type: TipoAlerta.ERROR, title: TituloAlerta.ERROR, message, autoClose: true, duration: 6000 });

  // Cualquier cambio en el formulario invalida la vista previa: lo que se aplica debe ser lo que se vio.
  const handleCambioConfiguracion = (cambios: Partial<ConfiguracionAjuste>) => {
    setConfiguracion((anterior) => ({ ...anterior, ...cambios }));
    setErroresValidacion([]);
    limpiarVistaPrevia();
  };

  const handleLimpiar = () => {
    setConfiguracion(CONFIGURACION_INICIAL);
    setErroresValidacion([]);
    limpiarVistaPrevia();
  };

  const handlePrevisualizar = async () => {
    const errores = validarConfiguracion(configuracion);
    setErroresValidacion(errores);
    if (errores.length > 0) {
      mostrarError(errores[0]);
      return;
    }

    const resultado = await previsualizar(configuracion);
    if (!resultado.ok) mostrarError(resultado.mensaje);
  };

  const handleConfirmar = async () => {
    if (!productosVistaPrevia || !configuracionVistaPrevia) return;

    const confirmado = await showConfirmation({
      type: TipoAlertaConfirmacion.WARNING,
      title: "Confirmar actualización masiva",
      message:
        `${describirAjuste(configuracionVistaPrevia)} sobre ${describirAlcance(configuracionVistaPrevia, lineas)}. ` +
        `Se modificará el precio de ${productosVistaPrevia.length} producto(s) y quedará registrado en el historial. ` +
        `Motivo: "${configuracionVistaPrevia.motivo.trim()}". ¿Desea continuar?`,
      confirmText: "Aplicar cambios",
      cancelText: "Cancelar",
      onConfirm: () => {},
    });
    if (!confirmado) return;

    const resultado = await aplicar();
    if (!resultado.ok) {
      mostrarError(resultado.mensaje);
      return;
    }

    addAlert({
      type: TipoAlerta.SUCCESS,
      title: TituloAlerta.SUCCESS,
      message: `${resultado.mensaje ?? "Actualización masiva realizada."} Productos afectados: ${resultado.productosAfectados}.`,
      autoClose: true,
      duration: 5000,
    });
    setConfiguracion(CONFIGURACION_INICIAL);
  };

  return (
    <div className="w-full">
      <div className="p-6 space-y-6">
        <Card className="border-gray-200 dark:border-slate-700">
          <CardHeader className="p-4">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="consultar-icon" />
                <span>Actualización masiva de precios</span>
              </CardTitle>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/producto")}>
                <ArrowLeft />
                Volver a Productos
              </Button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Aumentá o disminuí los precios de todos los productos o de una línea, por porcentaje o monto fijo.
              Primero se muestra la vista previa; los precios solo cambian al confirmar.
            </p>
          </CardHeader>

          <FormularioAjuste
            configuracion={configuracion}
            lineas={lineas}
            errorLineas={errorLineas}
            errores={erroresValidacion}
            cargando={cargandoVistaPrevia}
            onChange={handleCambioConfiguracion}
            onPrevisualizar={handlePrevisualizar}
            onLimpiar={handleLimpiar}
          />
        </Card>

        {productosVistaPrevia && configuracionVistaPrevia && (
          <Card className="border-gray-200 dark:border-slate-700">
            <ResumenVistaPrevia
              configuracion={configuracionVistaPrevia}
              lineas={lineas}
              productos={productosVistaPrevia}
              aplicando={aplicando}
              onConfirmar={handleConfirmar}
              onCancelar={limpiarVistaPrevia}
            />
            <CardContent className="p-0">
              <TablaVistaPrevia productos={productosVistaPrevia} />
            </CardContent>
          </Card>
        )}

        <Alertas alerts={alerts} onRemove={removeAlert} />
        <AlertasConfirmacion />
      </div>
    </div>
  );
}
