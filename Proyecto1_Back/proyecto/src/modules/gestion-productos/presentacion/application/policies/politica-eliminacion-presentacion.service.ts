import { Injectable, Inject } from "@nestjs/common";
import { IProductoRepository } from "src/modules/gestion-productos/producto/domain/interfaces/producto.repository-interface";


@Injectable()
export class PoliticaEliminacionPresentacion {
  constructor(
    @Inject('IProductoRepository')
    private readonly productoRepository: IProductoRepository,
  ) {}

  async tieneProductosActivosParaPresentacion(presentacionId: number): Promise<boolean> {
    return this.productoRepository.existsProductosActivosByPresentacion(presentacionId);
  }
}