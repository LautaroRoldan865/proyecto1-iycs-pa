import Select from "react-select";
import { Label } from "../../../../ui/Label";
import {
  AlcanceAjuste,
  ConfiguracionAjuste,
  LineaOpcion,
} from "../interfaces/actualizacion-masiva.types";
import SelectorOpciones from "./selector-opciones";

interface Props {
  alcance: AlcanceAjuste;
  lineaId?: number;
  lineas: LineaOpcion[];
  errorLineas: string | null;
  onChange: (cambios: Partial<ConfiguracionAjuste>) => void;
}

const OPCIONES_ALCANCE = [
  { valor: AlcanceAjuste.GLOBAL, etiqueta: "Todos los productos" },
  { valor: AlcanceAjuste.LINEA, etiqueta: "Una línea" },
];

// Mismos estilos de react-select que el resto de los filtros del sistema.
const estilosSelect = {
  control: (base: any) => ({ ...base, color: "black" }),
  singleValue: (base: any) => ({ ...base, color: "black" }),
  option: (base: any, { isSelected, isFocused }: any) => ({
    ...base,
    color: isSelected ? "white" : "black",
    backgroundColor: isSelected ? "#3b82f6" : isFocused ? "#93c5fd" : "white",
  }),
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
};

export default function SelectorAlcance({ alcance, lineaId, lineas, errorLineas, onChange }: Props) {
  return (
    <div className="space-y-3">
      <SelectorOpciones
        titulo="Alcance del ajuste"
        opciones={OPCIONES_ALCANCE}
        valor={alcance}
        onChange={(nuevoAlcance) =>
          onChange({
            alcance: nuevoAlcance,
            lineaId: nuevoAlcance === AlcanceAjuste.GLOBAL ? undefined : lineaId,
          })
        }
      />

      {alcance === AlcanceAjuste.LINEA && (
        <div className="space-y-2">
          <Label>Línea</Label>
          <Select
            value={lineas.find((linea) => linea.id === lineaId) || null}
            options={lineas}
            getOptionLabel={(linea) => linea.denominacion}
            getOptionValue={(linea) => String(linea.id)}
            onChange={(linea) => onChange({ lineaId: linea ? linea.id : undefined })}
            placeholder="Seleccione una línea"
            noOptionsMessage={() => "No hay líneas"}
            className="text-black"
            menuPortalTarget={document.body}
            styles={estilosSelect}
          />
          {errorLineas && <p className="text-sm text-red-500">{errorLineas}</p>}
        </div>
      )}
    </div>
  );
}
