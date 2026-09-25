import { Button } from "../../../../ui/Button";
import { Label } from "../../../../ui/Label";

interface Opcion<T extends string> {
  valor: T;
  etiqueta: string;
}

interface Props<T extends string> {
  titulo: string;
  opciones: Opcion<T>[];
  valor: T;
  onChange: (valor: T) => void;
}

/** Grupo de botones excluyentes (una sola opción activa). */
export default function SelectorOpciones<T extends string>({ titulo, opciones, valor, onChange }: Props<T>) {
  return (
    <div className="space-y-2">
      <Label>{titulo}</Label>
      <div className="flex flex-wrap gap-2">
        {opciones.map((opcion) => {
          const seleccionada = opcion.valor === valor;
          return (
            <Button
              key={opcion.valor}
              type="button"
              size="sm"
              variant={seleccionada ? "default" : "outline"}
              aria-pressed={seleccionada}
              className={seleccionada ? "bg-blue-500 text-white hover:bg-blue-800" : ""}
              onClick={() => onChange(opcion.valor)}
            >
              {opcion.etiqueta}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
