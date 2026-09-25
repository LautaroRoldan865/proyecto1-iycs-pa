import Select from "react-select";
import { PlusCircle } from "lucide-react";
import { Linea, SelectLinea } from "../../../../../interfaces/gestion-producto/linea/interfaces-linea";
import { SelectSublinea, SubLinea } from "../../../../../interfaces/gestion-producto/sublinea/interfaces-sublinea";
import { Button } from "../../../../ui/Button";
import { SelectSuperlineaInterface, Superlinea } from "../../../../../interfaces/gestion-producto/superlinea/interfaces-superlinea";

interface SuperlineasSelectorProps {
  denominacionSuperlinea: string;
  setDenominacionSuperlinea: (value: string) => void;
  denominacionSuperlineaRef: React.RefObject<HTMLInputElement>;
  selectSuperlineaRef: React.RefObject<HTMLDivElement>;

  superlineas: SelectSuperlineaInterface[];

  selectedSuperlinea: SelectSuperlineaInterface | null;

  superlineaId: number;

  disabled?: boolean;

  errors?: {
    superlineaId?: { message?: string };
  };

  onEnterDenominacion: (e: React.KeyboardEvent) => void;
  onEnterSuperlinea: (e: React.KeyboardEvent) => void;

  onSuperlineaChange: (superlinea: SelectSuperlineaInterface | null) => void;

  onAgregarSuperlinea: () => void;
}

export default function SuperlineasSelector({
  denominacionSuperlinea,
  setDenominacionSuperlinea,
  denominacionSuperlineaRef,
  selectSuperlineaRef,
  superlineas,
  selectedSuperlinea,
  superlineaId,
  disabled = false,
  errors,
  onEnterDenominacion,
  onEnterSuperlinea,
  onSuperlineaChange,
  onAgregarSuperlinea,
}: SuperlineasSelectorProps) {
  return (
    <div className="border border-gray-300 rounded-lg p-2 shadow-sm bg-gray-100">
      <label className="block text-sm font-medium text-gray-700 py-1">
        Superlíneas
      </label>

      <div className="flex gap-x-4">
        {/* Denominación */}
        <div className="w-80">
          <input
            ref={denominacionSuperlineaRef}
            type="text"
            placeholder="Denominación"
            value={denominacionSuperlinea}
            onChange={(e) => setDenominacionSuperlinea(e.target.value.trimStart())}
            onKeyDown={onEnterSuperlinea}
            disabled={disabled}
            className="w-full border border-gray-300 bg-white text-black rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Selects */}
        <div className="flex flex-col w-full gap-2">
          <div ref={selectSuperlineaRef}>
            <Select
              value={
                superlineas.find((l) => l.id === superlineaId) ?? selectedSuperlinea
              }
              options={superlineas}
              getOptionLabel={(o) => o.denominacion}
              getOptionValue={(o) => String(o.id)}
              onChange={(opt) => onSuperlineaChange(opt as Superlinea)}
              onKeyDown={onEnterDenominacion}
              isDisabled={disabled}
              placeholder="Seleccione"
              menuPortalTarget={document.body}
              styles={selectStyles}
            />

            {errors?.superlineaId?.message && (
              <p className="text-sm text-red-600 mt-1">
                {errors.superlineaId.message}
              </p>
            )}
          </div>

          
        </div>

        {/* Botón agregar */}
        <Button
          type="button"
          disabled={disabled}
          title="Agregar Superlínea"
          variant="outline"
          size="icon"
          className="bg-blue-500 text-white hover:bg-gray-700 w-10 h-10 rounded-full shadow-md transition"
          onClick={onAgregarSuperlinea}
        >
          <PlusCircle size={20} />
        </Button>
      </div>
    </div>
  );
}

const selectStyles = {
  control: (base: any) => ({ ...base, color: "black" }),
  singleValue: (base: any) => ({ ...base, color: "black" }),
  option: (base: any, state: any) => ({
    ...base,
    color: state.isSelected ? "white" : "black",
    backgroundColor: state.isSelected
      ? "#3b82f6"
      : state.isFocused
      ? "#93c5fd"
      : "white",
  }),
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
};
