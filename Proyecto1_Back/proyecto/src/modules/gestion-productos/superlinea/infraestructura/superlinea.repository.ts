import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { ISuperLineaRepository } from "../domain/interfaces/superlinea.repository.interface";
import { SuperLinea } from "../domain/entities/superlinea.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateSuperLineaDto } from "../dto/update-superlinea.dto";
import { CreateSuperLineaDto } from "../dto/create-superlinea.dto";
import { IUnitOfWork } from "src/modules/common/unit-of-work/iunit-of-work.";

@Injectable()
export class SuperLineaRepository implements ISuperLineaRepository{
    private readonly logger = new Logger(SuperLineaRepository.name);
    private readonly ENTITY_NAME = 'SuperLinea';

    constructor(
        @InjectRepository(SuperLinea)
        private readonly superLineaRepository: Repository<SuperLinea>
    ){}
    
    async create( data: CreateSuperLineaDto, uow?: IUnitOfWork):Promise<SuperLinea> {
        const repo = uow ? uow.getRepository(SuperLinea) : this.superLineaRepository;

        const newSuperlinea = repo.create(data);
        return await repo.save(newSuperlinea)
    };

    async update( id:number, data: UpdateSuperLineaDto): Promise<SuperLinea>{
        try{
            const existente = await this.superLineaRepository.findOneBy({id})
            if(!existente){ throw new NotFoundException("super linea no encontrada para actualizar")}
            this.superLineaRepository.merge(existente,data)
            existente.updatedAt = new Date();
            return this.superLineaRepository.save(existente);
        }catch(error){
            if(error instanceof NotFoundException) throw error
            throw new InternalServerErrorException("Error al actualizar SuperLinea")
        }
    }

    async findAllFor(denominacion: string): Promise<SuperLinea[]> {
        try{
            const encontrados = await this.superLineaRepository.findBy({denominacion})
            if(!encontrados){ throw new NotFoundException("super lineas no encontradas con esa coincidencia")}
            return encontrados
        }catch(error){
            if(error instanceof NotFoundException) throw error
            throw new InternalServerErrorException("Error al buscar SuperLineas por denominacion")
        }    
    }

    async findOne(id:number): Promise<SuperLinea | null> {
        try{
            const encontrada = await this.superLineaRepository.findOneBy({id})
            if(!encontrada){ throw new NotFoundException("super lineas no encontradas con esa coincidencia")}
            return encontrada
        }catch(error){
            if(error instanceof NotFoundException) throw error
            throw new InternalServerErrorException("Error al buscar SuperLinea por id")
        }    
    }

    async remove(entity:SuperLinea):Promise<SuperLinea>{
        try{
            if(entity.deletedAt){
                throw new NotFoundException('Entidad ya eliminada');
            }
            entity.deletedAt = new Date();
            return await this.superLineaRepository.save(entity);
        } catch(error){
            if(error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException("Error al eliminar la superlinea")
        }
    }
    
    async findAll():Promise<SuperLinea[]>{
        try{
            const superlineasBuscadas = await this.superLineaRepository.find()
            if(!superlineasBuscadas){ throw new NotFoundException("super lineas no encontradas")}
            return superlineasBuscadas;
        }catch(error){
            if(error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException("super lineas no encontradas ")
        }
    }

}