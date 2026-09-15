import { Injectable } from "@nestjs/common";
import { IPresentacionRepository } from "../../domain/interfaces/presentacion.repository-interface";
import { CreatePresentacionDto } from "../../dto/create-presentacion.dto";
import { Presentacion } from "../../domain/entities/presentacion.entity";

@Injectable()
export class presentacionService{
    
  constructor(
    private readonly presentacionRepository: IPresentacionRepository,
  ) {}

  async ejecutar(data:CreatePresentacionDto): Promise<Presentacion> {

    const presentacion = await this.presentacionRepository.buscarPorCantidadYUnidad(data);

    if (presentacion) {
      return presentacion;
    }

    const nuevaPresentacion:CreatePresentacionDto = {
      cantidad:data.cantidad,
      unidad:data.unidad,
    };

    return await this.presentacionRepository.guardar(
      nuevaPresentacion,
    );
  }
}