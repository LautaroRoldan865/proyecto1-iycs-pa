import { AlertCircle, AlertTriangle, History } from "lucide-react";
import { Button } from "../../../../ui/Button";

interface Props {
  tipo: "cargando" | "error" | "vacio" | "aviso";
  mensaje?: string;
  onReintentar?: () => void;
}

/** Estados del listado (cargando, error, sin datos, aviso), con el mismo estilo que el resto de las pantallas. */
export default function MensajeEstado({ tipo, mensaje, onReintentar }: Props) {
  if (tipo === "cargando") {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Cargando historial de precios...</p>
      </div>
    );
  }

  if (tipo === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div
          role="alert"
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md"
        >
          <p className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 text-center font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {mensaje}
          </p>
        </div>
        {onReintentar && (
          <Button type="button" variant="outline" onClick={onReintentar}>
            Reintentar
          </Button>
        )}
      </div>
    );
  }

  if (tipo === "aviso") {
    return (
      <div
        role="status"
        className="flex items-center gap-2 mx-4 mb-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200"
      >
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>{mensaje}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-600 dark:text-gray-400">
      <History className="w-10 h-10 mb-3 text-gray-400" />
      <p className="text-lg">{mensaje}</p>
    </div>
  );
}
