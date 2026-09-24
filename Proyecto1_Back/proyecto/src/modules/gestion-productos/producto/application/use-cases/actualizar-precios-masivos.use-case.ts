import { Inject, Injectable } from '@nestjs/common';
import { HistorialPrecio } from '../../domain/entities/historial-precio.entity';
import { PrecioInvalidoException } from '../../domain/exceptions/precio-invalido.exception';
import { ActualizarPreciosMasivosDto, TipoAjustePrecio } from '../../dto/actualizar-precios-masivos.dto';
import { ProductoCalculoHelper } from '../../domain/helpers/producto-calculos.helper';
import { PreciosMasivosInvalidosException } from '../../domain/exceptions/actualizacion-precios-masivos.exceptions';
import { ProductosNoEncontradosException } from '../../domain/exceptions/producto-noenecontrado.exceptions';
import { IProductoRepository } from '../../domain/interfaces/producto.repository-interface';


@Injectable()
export class ActualizarPreciosMasivosUseCase {

  constructor(
    @Inject('IProductoRepository')
    private readonly repository: IProductoRepository,
  ){}

  async ejecutar( dto: ActualizarPreciosMasivosDto, usuarioId?: number,){
    
    const errores: string[] = [];
    const historiales: HistorialPrecio[] = [];

    const productos = await this.repository.findParaActualizacionPrecios(dto.lineaId);

    if (!productos || productos.length === 0) { 
      throw new ProductosNoEncontradosException(dto.lineaId);
    }

    for (const producto of productos) {

      const precioAnterior = producto.precio;

      const nuevoPrecio = ProductoCalculoHelper.calcularNuevoPrecio( precioAnterior.getValue(), dto.tipoAjuste, dto.valor );

      try {

        const historial = producto.actualizarPrecioconHistorial(nuevoPrecio,dto.motivo,usuarioId);

        historiales.push(historial);

      } catch (error) {

        if (error instanceof PrecioInvalidoException) {
          errores.push(error.message);
        } else {
          throw error;
        }

      }
    }

    if (errores.length > 0) {
      throw new PreciosMasivosInvalidosException(errores);
    }

    await this.repository.guardarLoteConHistorial(productos,historiales)

    return { productos, historiales };
  }
}