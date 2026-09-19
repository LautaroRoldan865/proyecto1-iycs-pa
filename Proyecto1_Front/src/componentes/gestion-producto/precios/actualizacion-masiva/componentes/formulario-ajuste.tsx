import { Eraser, Eye } from "lucide-react";
import { Button } from "../../../../ui/Button";
import { CardContent } from "../../../../ui/Card";
import { Label } from "../../../../ui/Label";
import { Textarea } from "../../../../ui/TextArea";
import {
  ConfiguracionAjuste,
  DireccionAjuste,
  LineaOpcion,
  TipoAjuste,
} from "../interfaces/actualizacion-masiva.types";
import CampoValorAjuste from "./campo-valor-ajuste";
import ListaErrores from "./lista-errores";
import SelectorAlcance from "./selector-alcance";
import SelectorOpciones from "./selector-opciones";

interface Props {
  configuracion: ConfiguracionAjuste;
  lineas: LineaOpcion[];
  errorLineas: string | null;
  errores: string[];
  cargando: boolean;
  onChange: (cambios: Partial<ConfiguracionAjuste>) => void;
  onPrevisualizar: () => void;
  onLimpiar: () => void;
}

const OPCIONES_TIPO = [
  { valor: TipoAjuste.PORCENTAJE, etiqueta: "Porcentaje" },
  { valor: TipoAjuste.MONTO_FIJO, etiqueta: "Monto fijo" },
];

const OPCIONES_DIRECCION = [
  { valor: DireccionAjuste.AUMENTO, etiqueta: "Aumento" },
  { valor: DireccionAjuste.DISMINUCION, etiqueta: "Disminución" },
];

export default function FormularioAjuste({
  configuracion,
  lineas,
  errorLineas,
  errores,
  cargando,
  onChange,
  onPrevisualizar,
  onLimpiar,
}: Props) {
  return (
    <CardContent className="space-y-6 px-4 sm:px-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectorAlcance
          alcance={configuracion.alcance}
          lineaId={configuracion.lineaId}
          lineas={lineas}
          errorLineas={errorLineas}
          onChange={onChange}
        />

        <div className="space-y-4">
          <SelectorOpciones
            titulo="Método de ajuste"
            opciones={OPCIONES_TIPO}
            valor={configuracion.tipoAjuste}
            // Al cambiar de método se reinicia el valor: 10 (%) no equivale a $ 10.
            onChange={(tipoAjuste) => onChange({ tipoAjuste, valor: 0 })}
          />
          <SelectorOpciones
            titulo="Tipo de cambio"
            opciones={OPCIONES_DIRECCION}
            valor={configuracion.direccion}
            onChange={(direccion) => onChange({ direccion })}
          />
          <CampoValorAjuste
            tipoAjuste={configuracion.tipoAjuste}
            valor={configuracion.valor}
            onChange={(valor) => onChange({ valor })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="motivo-ajuste">Motivo del ajuste</Label>
        <Textarea
          id="motivo-ajuste"
          placeholder="Ej.: Actualización trimestral de precios"
          className="bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500 text-black dark:text-white"
          value={configuracion.motivo}
          onChange={(evento) => onChange({ motivo: evento.target.value })}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Queda registrado en el historial de precios de cada producto afectado.
        </p>
      </div>

      <ListaErrores errores={errores} />

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          disabled={cargando}
          onClick={onPrevisualizar}
          className="bg-blue-500 text-white hover:bg-blue-800"
        >
          <Eye />
          {cargando ? "Calculando..." : "Previsualizar"}
        </Button>
        <Button type="button" variant="outline" disabled={cargando} onClick={onLimpiar}>
          <Eraser />
          Limpiar
        </Button>
      </div>
    </CardContent>
  );
}
