import { useMemo } from "react";
import { formatFechaHora, formatPrice } from "../../../../herramientas/formateo-de-campos/fucion-formateo";
import { Column, TablaAGGrid } from "../../../../herramientas/tablas/tabla-flexible-ag-grid";
import { RegistroHistorial } from "../interfaces/historial-precios.types";

interface Props {
  registros: RegistroHistorial[];
}

export default function TablaHistorial({ registros }: Props) {
  const columnas = useMemo<Column<RegistroHistorial>[]>(
    () => [
      {
        header: "Fecha",
        accessor: "fecha",
        flex: 0.6,
        type: "text",
        editable: false,
        scrollable: false,
        formatFunction: ({ value }) => <span>{formatFechaHora(value)}</span>,
      },
      {
        header: "Código",
        accessor: "codigoProveedor",
        flex: 0.5,
        type: "text",
        align: "right",
        editable: false,
        scrollable: false,
      },
      {
        header: "Producto",
        accessor: "denominacion",
        flex: 1.3,
        type: "text",
        editable: false,
        scrollable: false,
      },
      {
        header: "Precio anterior",
        accessor: "precioAnterior",
        flex: 0.6,
        type: "text",
        align: "right",
        editable: false,
        formatFunction: ({ value }) => <span>{formatPrice(value, "ARS")}</span>,
      },
      {
        header: "Precio nuevo",
        accessor: "precioNuevo",
        flex: 0.6,
        type: "text",
        align: "right",
        editable: false,
        formatFunction: ({ value }) => <span className="font-semibold">{formatPrice(value, "ARS")}</span>,
      },
      {
        header: "Diferencia",
        accessor: "diferencia",
        flex: 0.6,
        type: "text",
        align: "right",
        editable: false,
        formatFunction: ({ value }) => (
          <span className={value >= 0 ? "text-green-600" : "text-red-600"}>
            {value > 0 ? "+" : ""}
            {formatPrice(value, "ARS")}
          </span>
        ),
      },
      {
        header: "Motivo",
        accessor: "motivo",
        flex: 1.3,
        type: "text",
        editable: false,
        scrollable: false,
        formatFunction: ({ value }) => (
          <span className="block truncate" title={value}>
            {value}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="overflow-x-auto">
      <TablaAGGrid columns={columnas} data={registros} onUpdate={() => {}} actionsFlex={0} rowHeight={50} height={600} />
    </div>
  );
}
