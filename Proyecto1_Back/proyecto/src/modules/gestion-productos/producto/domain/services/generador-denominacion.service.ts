import { Injectable } from "@nestjs/common";
import { Linea } from "src/modules/gestion-productos/linea/domain/entities/linea.entity";
import { Marca } from "src/modules/gestion-productos/marca/domain/entities/marca.entity";
import { Presentacion } from "../entities/presentacion.entity";

@Injectable()
export class GeneradorDenominacionService {

    /*
    POST http://localhost:3000/api/producto/denominacion-automatica
    lo probe con:
    {
        "marcaId": 2,
        "lineaId": 1,
        "presentacion": {
            "cantidad": 500,
            "unidad": "GRAMOS"
        }
    }

    me deolvió: CAROYENSE ACEITES 500GRAMOS
    */
    generar(marca: Marca, linea: Linea, presentacion: Presentacion): string{
        return `${marca.denominacion.toUpperCase()} ${linea.denominacion.toUpperCase()} ${presentacion.cantidad}${presentacion.unidad}`.trim();
    }
}