import { redondearProducto } from "src/modules/common/utils/number/redondeo"
import { TipoAjustePrecio } from "../../dto/actualizar-precios-masivos.dto";

export class ProductoCalculoHelper{

    static calcularNuevoCosto(nuevoPrecio:number,margen:number){
        const factorMargen = 1 + ((margen)/100)
        const costo = (nuevoPrecio/factorMargen)
        return redondearProducto(costo)
    }

    static calcularPrecio(costo:number, margen:number){
        const calculo = costo * (1 + (margen/100))
        return redondearProducto(calculo)
    }

    static calcularNuevoPrecio(precioActual: number,tipoAjuste: TipoAjustePrecio,valor: number): number {
        if (tipoAjuste === TipoAjustePrecio.PORCENTAJE) {
            return redondearProducto(
                precioActual * (1 + valor / 100),
            );
        }

        return redondearProducto(precioActual + valor);
    }

}