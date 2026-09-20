
import { SuperLinea } from "../entities/superlinea.entity"
import { CreateSuperLineaDto } from "../../dto/create-superlinea.dto"
import { UpdateSuperLineaDto } from "../../dto/update-superlinea.dto"
import { Usuario } from "src/modules/gestion-usuario/usuario/domain/entities/usuario.entity";

export interface ISuperLineaRepository{
    create(data:CreateSuperLineaDto): Promise<SuperLinea>;
    findAllFor(denominacion:string): Promise<SuperLinea[]>;
    findOne(id:number): Promise<SuperLinea | null>;
    update( id:number, data:UpdateSuperLineaDto): Promise<SuperLinea>;
    remove(data: SuperLinea, usuarioDeletedId: number): Promise<SuperLinea>;
    findAll(): Promise<SuperLinea[]>;
    findByDenominationWith(denominacion: string): Promise<SuperLinea | null>;
    hasLines(id:number): Promise<boolean>;
}