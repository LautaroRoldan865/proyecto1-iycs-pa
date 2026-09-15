
import { SuperLinea } from "../entities/superlinea.entity"
import { CreateSuperLineaDto } from "../../dto/create-superlinea.dto"
import { UpdateSuperLineaDto } from "../../dto/update-superlinea.dto"
import { Usuario } from "src/modules/gestion-usuario/usuario/domain/entities/usuario.entity"
import { IUnitOfWork } from "src/modules/common/unit-of-work/iunit-of-work.";

export interface ISuperLineaRepository{
    create(data:CreateSuperLineaDto, ouw?: IUnitOfWork): Promise<SuperLinea>;
    findAllFor(denominacion:string): Promise<SuperLinea[]>;
    findOne(id:number): Promise<SuperLinea | null>;
    update( id:number, data:UpdateSuperLineaDto, ouw?:IUnitOfWork): Promise<SuperLinea>;
    remove(data:SuperLinea, usuario:Usuario, ouw?:IUnitOfWork): Promise<SuperLinea>;
    findAll(): Promise<SuperLinea[]>;
}