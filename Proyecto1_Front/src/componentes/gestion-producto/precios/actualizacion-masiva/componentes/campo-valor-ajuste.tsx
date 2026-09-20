import { NumericFormat } from "react-number-format";
import { Input } from "../../../../ui/Input";
import { Label } from "../../../../ui/Label";
import { TipoAjuste } from "../interfaces/actualizacion-masiva.types";

interface Props {
  tipoAjuste: TipoAjuste;
  valor: number;
  onChange: (valor: number) => void;
}

/** Campo numérico con el formato del sistema (1.234,56). Solo admite positivos: el signo lo da Aumento/Disminución. */
export default function CampoValorAjuste({ tipoAjuste, valor, onChange }: Props) {
  const esPorcentaje = tipoAjuste === TipoAjuste.PORCENTAJE;

  return (
    <div className="space-y-2">
      <Label htmlFor="valor-ajuste">{esPorcentaje ? "Porcentaje" : "Monto fijo"}</Label>
      <NumericFormat
        id="valor-ajuste"
        customInput={Input}
        value={valor || ""}
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={2}
        allowNegative={false}
        prefix={esPorcentaje ? undefined : "$ "}
        suffix={esPorcentaje ? " %" : undefined}
        placeholder={esPorcentaje ? "0,00 %" : "$ 0,00"}
        className="max-w-[200px] bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500 text-black dark:text-white text-right"
        onValueChange={(valores) => onChange(valores.floatValue ?? 0)}
      />
    </div>
  );
}
