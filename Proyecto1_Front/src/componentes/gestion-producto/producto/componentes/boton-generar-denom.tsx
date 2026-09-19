import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "../../../ui/Button";
import ProductoService from "../services/producto-service";
import { Sparkles } from "lucide-react";

interface Props {
  disabled?: boolean;
}

export default function GenerarDenominacionButton({ disabled }: Props) {
  const { watch, setValue } = useFormContext();
  const [loading, setLoading] = useState(false);

  // Observamos los tres valores
  const lineaId = watch("lineaId");
  const marcaId = watch("marcaId");
  const presentacionId = watch("presentacionId");

  // El botón estará Incompleto/Deshabilitado si falta cualquiera de los 3 IDs
  const estaIncompleto = !lineaId || !marcaId || !presentacionId;

  const handleGenerar = async () => {
    try {
      setLoading(true);

      const payload = {
        lineaId,
        marcaId,
        presentacionId,
      };

      const res = await ProductoService.generarDenominacion(payload);
      const denominacionGenerada = typeof res === "string" ? res : res?.denominacion;

      if (denominacionGenerada) {
        setValue("denominacion", denominacionGenerada, { shouldValidate: true });
      }
    } catch (error) {
      console.error("No se pudo generar la denominación", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleGenerar}
      disabled={disabled || loading || estaIncompleto}
      title={estaIncompleto ? "Debes seleccionar Línea, Marca y Presentación" : ""}
      className="btn btn-secondary flex items-center gap-2 whitespace-nowrap"
    >
      <Sparkles className="w-4 h-4" />
      {loading ? "Generando..." : "Generar denominación"}
    </Button>
  );
}