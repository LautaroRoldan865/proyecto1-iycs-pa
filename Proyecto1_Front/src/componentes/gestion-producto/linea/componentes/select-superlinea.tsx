import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import SuperLineaService from "../../producto/services/superlinea-service";
import { SelectSuperlineaInterface } from "../../../../interfaces/gestion-producto/superlinea/interfaces-superlinea";


interface Props {
  name: string;
  disabled?: boolean;
}

export default function SelectSuperlinea({
  name,
  disabled = false,
}: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const [superlineas, setSuperlineas] = useState<SelectSuperlineaInterface[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarSuperlineas = async () => {
      try {
        setLoading(true);

        const data = await SuperLineaService.obtenerParaSelect();

        setSuperlineas(data);
      } catch (error) {
        console.error("Error al obtener las super líneas:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarSuperlineas();
  }, []);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Super Línea
      </label>

      <select
        {...register(name, {
          valueAsNumber: true,
        })}
        disabled={disabled || loading}
        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">
          {loading
            ? "Cargando..."
            : "Seleccione una super línea"}
        </option>

        {superlineas.map((superlinea) => (
          <option
            key={superlinea.id}
            value={superlinea.id}
          >
            {superlinea.denominacion}
          </option>
        ))}
      </select>

      {errors[name] && (
        <p className="text-red-600 text-sm mt-1">
          {String(errors[name]?.message)}
        </p>
      )}
    </div>
  );
}