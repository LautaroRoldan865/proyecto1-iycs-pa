import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../../ui/Card";
import EncabezadoHistorial from "../componentes/encabezado-historial";
import MensajeEstado from "../componentes/mensaje-estado";
import TablaHistorial from "../componentes/tabla-historial";
import { useHistorialPrecios } from "../hooks/use-historial-precios";

export default function HistorialPrecios() {
  const navigate = useNavigate();
  const { registros, cargando, error, productosConError, recargar } = useHistorialPrecios();

  const contenido = () => {
    if (cargando) return <MensajeEstado tipo="cargando" />;
    if (error) return <MensajeEstado tipo="error" mensaje={error} onReintentar={recargar} />;
    if (registros.length === 0) {
      return <MensajeEstado tipo="vacio" mensaje="Todavía no hay cambios de precio registrados." />;
    }
    return <TablaHistorial registros={registros} />;
  };

  return (
    <div className="w-full">
      <div className="p-6">
        <Card className="border-gray-200 dark:border-slate-700">
          <EncabezadoHistorial onVolver={() => navigate("/admin/producto")} />

          {!cargando && !error && productosConError > 0 && (
            <MensajeEstado
              tipo="aviso"
              mensaje={`No se pudo consultar el historial de ${productosConError} ${productosConError === 1 ? "producto" : "productos"}; el listado puede estar incompleto.`}
            />
          )}

          <CardContent className="p-0">{contenido()}</CardContent>
        </Card>
      </div>
    </div>
  );
}
