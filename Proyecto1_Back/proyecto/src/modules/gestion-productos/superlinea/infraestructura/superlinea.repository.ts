import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { ISuperLineaRepository } from "../domain/interfaces/superlinea.repository.interface";
import { SuperLinea } from "../domain/entities/superlinea.entity";
import { DataSource, IsNull, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateSuperLineaDto } from "../dto/update-superlinea.dto";
import { CreateSuperLineaDto } from "../dto/create-superlinea.dto";
import { IUnitOfWork } from "src/modules/common/unit-of-work/iunit-of-work.";
import { Transactional } from "src/modules/common/decorators/transactional.decoratos";
import { Usuario } from "src/modules/gestion-usuario/usuario/domain/entities/usuario.entity";

@Injectable()
export class SuperLineaRepository implements ISuperLineaRepository{
    private readonly logger = new Logger(SuperLineaRepository.name);
    private readonly ENTITY_NAME = 'SuperLinea';

    constructor(
        @InjectRepository(SuperLinea)
        private readonly superLineaRepository: Repository<SuperLinea>,
        private readonly dataSource: DataSource,
        @Inject('UnitOfWork') private readonly uow: IUnitOfWork,
    ){}

    
    @Transactional()
    async create(data: CreateSuperLineaDto):Promise<SuperLinea> {
        const repository = this.uow.getRepository(SuperLinea);
        const newSuperlinea = repository.create({
            denominacion:data.denominacion,
            observacion:data.observacion,
            usuarioCreatedId: data.usuarioCreatedId,
            createdAt: new Date(),
        });
        return await repository.save(newSuperlinea)
    };


    @Transactional()
    async update(id:number, data: UpdateSuperLineaDto): Promise<SuperLinea>{
    
        const repository = this.uow.getRepository(SuperLinea);
        const entity = await repository.findOne({
            where: { id },
    
        })
        if (!entity) {
            throw new NotFoundException(
                `Línea con ID ${id} no encontrada`,
            );
        }

        entity.denominacion = data.denominacion ?? entity.denominacion;
        entity.observacion = data.observacion ?? entity.observacion;
        entity.updatedAt = new Date();
        entity.usuarioUpdatedId = data.usuarioUpdatedId

        return await repository.save(entity);
    }

    async findAllFor(denominacion: string = ''): Promise<SuperLinea[]> {
    return await this.superLineaRepository
        .createQueryBuilder('superlinea')
        .where('superlinea.deletedAt IS NULL')
        .andWhere(
            'UPPER(superlinea.denominacion) LIKE :denominacion',
            {
                denominacion: `%${denominacion.trim().toUpperCase()}%`,
            },
        )
        .getMany();
    }

    async findOne(id:number): Promise<SuperLinea | null> {
       return await this.superLineaRepository
       .createQueryBuilder('superlinea')
       .leftJoinAndSelect(
            'superlinea.lineas',
            'lineas',
        )
       .where('superlinea.id = :id', { id })
       .andWhere('superlinea.deletedAt IS NULL')
       .getOne();
    }

    @Transactional()
    async remove(entity: SuperLinea, usuarioDeletedId: number): Promise<SuperLinea> {
        const repository = this.uow.getRepository(SuperLinea);
        entity.deletedAt = new Date();
        entity.usuarioDeletedId = usuarioDeletedId;
        return await repository.save(entity);
    }
    
    async findAll(): Promise<SuperLinea[]> {
        return await this.superLineaRepository.find({
            where: {
                deletedAt: IsNull(),
            },
        });
    }

    async findByDenominationWith(denominacion: string): Promise<SuperLinea | null> {
        return await this.superLineaRepository
            .createQueryBuilder('superlinea')
            .withDeleted()
            .where('UPPER(superlinea.denominacion) = :denominacion', {
                denominacion: denominacion.trim().toUpperCase(),
            })
            .getOne();
    }

    async hasLines(id: number): Promise<boolean> {
        const count =  await this.superLineaRepository
            .createQueryBuilder('superlinea')
            .innerJoin('superlinea.lineas', 'linea', 'linea.deletedAt IS NULL')
            .where('superlinea.id = :id', { id })
            .getCount();
        return count > 0;
    }

}