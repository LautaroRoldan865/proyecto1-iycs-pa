import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../ui/Button";
import { navigationGuard } from "../../../../utils/navigation-guard";

interface Props {
  ruta: string;
  texto: string;
  icono: LucideIcon;
  /** Solo el ícono, para el encabezado angosto (celular). */
  soloIcono?: boolean;
}

/** Botón del encabezado de Productos que lleva a otra pantalla, respetando los cambios sin guardar como el menú. */
export function BotonNavegacion({ ruta, texto, icono: Icono, soloIcono = false }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!navigationGuard.check()) return;
    navigate(ruta);
  };

  return (
    <Button
      onClick={handleClick}
      title={texto}
      aria-label={texto}
      className="bg-blue-500 hover:bg-blue-700 text-white"
    >
      <Icono className={soloIcono ? "h-4 w-4" : "mr-2 h-4 w-4"} />
      {!soloIcono && texto}
    </Button>
  );
}
