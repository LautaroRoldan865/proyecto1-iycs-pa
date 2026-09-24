import { redondearProducto } from "src/modules/common/utils/number/redondeo";
import { PrecioInvalidoExceptionIndividual } from "../exceptions/precio-invalido.exception";


export class Precio {
  private constructor(
    private readonly valor: number,
  ) {}

  static crear(valor: number): Precio {
    if (!Number.isFinite(valor) || valor <= 0) {
      throw new PrecioInvalidoExceptionIndividual(valor);
    }

    return new Precio(
        redondearProducto(valor)
    );
  }

  getValue(): number {
    return this.valor;
  }

  equals(otro: Precio): boolean {
    return this.valor === otro.valor;
  }
}