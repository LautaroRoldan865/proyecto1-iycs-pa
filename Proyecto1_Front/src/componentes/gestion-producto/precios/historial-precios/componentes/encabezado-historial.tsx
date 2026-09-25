import { ArrowLeft, History } from "lucide-react";
import { Button } from "../../../../ui/Button";
import { CardHeader, CardTitle } from "../../../../ui/Card";

interface Props {
  onVolver: () => void;
}

export default function EncabezadoHistorial({ onVolver }: Props) {
  return (
    <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
      <CardTitle className="flex items-center gap-2">
        <History className="consultar-icon" />
        <span>Historial de precios</span>
      </CardTitle>

      <div className="flex gap-2 shrink-0">
        <Button type="button" variant="outline" onClick={onVolver}>
          <ArrowLeft />
          Volver a Productos
        </Button>
      </div>
    </CardHeader>
  );
}
