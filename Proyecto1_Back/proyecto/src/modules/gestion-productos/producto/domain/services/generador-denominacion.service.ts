import { Injectable } from "@nestjs/common";
import { Linea } from "src/modules/gestion-productos/linea/domain/entities/linea.entity";
import { Marca } from "src/modules/gestion-productos/marca/domain/entities/marca.entity";
import { Presentacion } from "../entities/presentacion.entity";

@Injectable()
export class GeneradorDenominacionService {

    generar(marca: Marca, linea: Linea, presentacion: Presentacion): string{
        return `${marca.denominacion.toUpperCase()} ${linea.denominacion.toUpperCase()} ${presentacion.cantidad}${presentacion.unidad}`.trim();
    }
}