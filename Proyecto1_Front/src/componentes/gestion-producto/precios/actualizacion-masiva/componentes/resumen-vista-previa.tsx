import { Check, X } from "lucide-react";
import { Button } from "../../../../ui/Button";
import { CardContent } from "../../../../ui/Card";
import {
  ConfiguracionAjuste,
  LineaOpcion,
  ProductoVistaPrevia,
} from "../interfaces/actualizacion-masiva.types";
import { describirAjuste, describirAlcance } from "../utils/descripcion-ajuste";
import ListaErrores from "./lista-errores";

interface Props {
  configuracion: ConfiguracionAjuste;
  lineas: LineaOpcion[];
  productos: ProductoVistaPrevia[];
  aplicando: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ResumenVistaPrevia({
  configuracion,
  lineas,
  productos,
  aplicando,
  onConfirmar,
  onCancelar,
}: Props) {
  const invalidos = productos.filter((producto) => !producto.esValido);
  const puedeAplicar = invalidos.length === 0 && productos.length > 0;

  return (
    <CardContent className="space-y-4 px-4 sm:px-6 py-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Vista previa del ajuste</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {describirAjuste(configuracion)} sobre {describirAlcance(configuracion, lineas)}:{" "}
            <strong>{productos.length}</strong> {productos.length === 1 ? "producto" : "productos"}. Todavía no se
            modificó ningún precio.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" disabled={aplicando} onClick={onCancelar}>
            <X />
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={!puedeAplicar || aplicando}
            onClick={onConfirmar}
            className="bg-blue-500 text-white hover:bg-blue-800"
          >
            <Check />
            {aplicando ? "Aplicando..." : "Aplicar cambios"}
          </Button>
        </div>
      </div>

      {invalidos.length > 0 && (
        <ListaErrores
          titulo="No se puede aplicar el ajuste"
          errores={[
            `${invalidos.length} ${invalidos.length === 1 ? "producto quedaría" : "productos quedarían"} con precio menor o igual a cero (resaltados en rojo). No se aplica ningún cambio a ningún producto.`,
          ]}
        />
      )}
    </CardContent>
  );
}
