import { AlertCircle } from "lucide-react";

interface Props {
  titulo?: string;
  errores: string[];
}

/** Caja de errores en línea, con el mismo estilo que los errores de carga del resto de las pantallas. */
export default function ListaErrores({ titulo = "No se puede continuar", errores }: Props) {
  if (errores.length === 0) return null;

  return (
    <div
      role="alert"
      className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
    >
      <div className="flex items-center gap-2 font-medium text-red-600 dark:text-red-400">
        <AlertCircle className="w-4 h-4" />
        <span>{titulo}</span>
      </div>
      <ul className="mt-2 list-disc pl-6 text-sm text-red-600 dark:text-red-400 space-y-1">
        {errores.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </div>
  );
}
