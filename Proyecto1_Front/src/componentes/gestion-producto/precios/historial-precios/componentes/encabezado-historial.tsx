import { ArrowLeft, History, RefreshCw, Search } from "lucide-react";
import { Button } from "../../../../ui/Button";
import { CardHeader, CardTitle } from "../../../../ui/Card";
import { Input } from "../../../../ui/Input";
import { EstadisticasSimples } from "../../../../herramientas/reutilizables/estadisticas-simples";

interface Props {
  busqueda: string;
  total: number;
  mostrados: number;
  cargando: boolean;
  onChangeBusqueda: (valor: string) => void;
  onRecargar: () => void;
  onVolver: () => void;
}

export default function EncabezadoHistorial({
  busqueda,
  total,
  mostrados,
  cargando,
  onChangeBusqueda,
  onRecargar,
  onVolver,
}: Props) {
  return (
    <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
      <div className="flex flex-col md:flex-row flex-wrap gap-4 w-full md:items-center">
        <CardTitle className="flex items-center gap-2">
          <History className="consultar-icon" />
          <span>Historial de precios</span>
        </CardTitle>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={busqueda}
            placeholder="Producto, código o motivo..."
            className="text-black pl-10"
            onChange={(evento) => onChangeBusqueda(evento.target.value)}
          />
        </div>

        <EstadisticasSimples filtrados={total} mostrados={mostrados} />
      </div>

      <div className="flex gap-2 shrink-0">
        <Button type="button" variant="outline" disabled={cargando} onClick={onRecargar}>
          <RefreshCw />
          Actualizar
        </Button>
        <Button type="button" variant="outline" onClick={onVolver}>
          <ArrowLeft />
          Volver a Productos
        </Button>
      </div>
    </CardHeader>
  );
}
