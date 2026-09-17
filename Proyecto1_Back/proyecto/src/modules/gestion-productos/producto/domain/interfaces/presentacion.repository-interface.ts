import { Presentacion } from "../entities/presentacion.entity";
import { CreatePresentacionDto } from '../../dto/create-presentacion.dto';


export interface IPresentacionRepository{  
  buscarPorCantidadYUnidad(data:CreatePresentacionDto): Promise<Presentacion | null>;
  guardar(data:CreatePresentacionDto): Promise<Presentacion>;
}