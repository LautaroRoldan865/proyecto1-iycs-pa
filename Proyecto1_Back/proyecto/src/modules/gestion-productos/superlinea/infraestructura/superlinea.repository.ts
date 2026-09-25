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
import { AuditoriaDto } from "src/modules/gestion-sistema/auditoria/dto/auditoria.dto";
import { DatabaseConnectionException } from "src/modules/common/exceptions/database-connection.exception";
import { FechaUtils } from "src/modules/common/utils/date/fecha-utils";

@Injectable()
export class SuperLineaRepository implements ISuperLineaRepository{
    private readonly logger = new Logger(SuperLineaRepository.name);
    private readonly ENTITY_NAME = 'SuperLinea';

    constructor(
        @InjectRepository(SuperLinea)
        private readonly superLineaRepository: Repository<SuperLinea>,
        private readonly dataSource: DataSource,
        @Inject('UnitOfWork') private readonly uow: IUnitOfWork,
       // private readonly persistenceService: SuperLineaPersistenceAdapter
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
    const query = this.superLineaRepository
        .createQueryBuilder('superlinea');

    if (denominacion?.trim()) {
        query.andWhere(
            'UPPER(superlinea.denominacion) LIKE :denominacion',
            {
                denominacion: `%${denominacion.trim().toUpperCase()}%`,
            },
        );
    }

    return await query
        .orderBy('superlinea.denominacion', 'ASC')
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
    async remove(entity: SuperLinea): Promise<SuperLinea> {
        const repository = this.uow.getRepository(SuperLinea);
        entity.deletedAt = new Date();
        //entity.usuarioDeletedId = usuarioDeletedId;
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


    async findByDenominacionFiltered(
        denominacion: string,
        skip = 0,
        take = 10,
        incluirEliminados = false,
        ): Promise<{ data: SuperLinea[]; total: number }> {

        this.logger.log(
            `Buscando SuperLinea: denominacion="${denominacion}", skip=${skip}, take=${take}, incluirEliminados=${incluirEliminados}`,
        );

        const query = this.superLineaRepository
            .createQueryBuilder('superlinea');

        if (incluirEliminados) {
            query.withDeleted();
        } else {
            query.andWhere('superlinea.deletedAt IS NULL');
        }

        // Filtro por denominación
        if (denominacion?.trim()) {
            query.andWhere(
            'UPPER(superlinea.denominacion) LIKE :denominacion',
            {
                denominacion: `%${denominacion.trim().toUpperCase()}%`,
            },
            );
        }

        // Orden
        query.orderBy('superlinea.denominacion', 'ASC');

        // Paginación
        query.skip(skip);
        query.take(take);

        // Datos + total
        const [data, total] = await query.getManyAndCount();

        return {
            data,
            total,
        };
        }
    
    async findByIdConAuditoria(id: number): Promise<AuditoriaDto | null> {
        try {
            const raw = await this.superLineaRepository
            .createQueryBuilder('superlinea')
            .leftJoin(
                'usuario',
                'usuarioCreated',
                'usuarioCreated.id = superlinea.usuarioCreatedId',
            )
            .leftJoin(
                'usuario',
                'usuarioUpdated',
                'usuarioUpdated.id = superlinea.usuarioUpdatedId',
            )
            .leftJoin(
                'usuario',
                'usuarioDeleted',
                'usuarioDeleted.id = superlinea.usuarioDeletedId',
            )
            .addSelect([
                'superlinea.id as superlinea_id',
                'superlinea.denominacion as superlinea_denominacion',
                'superlinea.createdAt as superlinea_createdAt',
                'superlinea.updatedAt as superlinea_updatedAt',
                'superlinea.deletedAt as superlinea_deletedAt',
                'usuarioCreated.denominacion as usuarioCreated_nombre',
                'usuarioUpdated.denominacion as usuarioUpdated_nombre',
                'usuarioDeleted.denominacion as usuarioDeleted_nombre',
            ])
            .where('superlinea.id = :id', { id })
            .getRawOne();

            console.debug('RAW RESULTADO:', raw);

            if (!raw) return null;

            return {
            id: raw.superlinea_id ?? 0,

            detalle: raw.superlinea_denominacion
                ? `superlinea ${raw.superlinea_denominacion}`
                : 'superlinea (sin denominación)',

            createdAt: raw.superlinea_createdAt
                ? FechaUtils.formatFechaHora(raw.superlinea_createdAt)
                : '',

            updatedAt: raw.superlinea_updatedAt
                ? FechaUtils.formatFechaHora(raw.superlinea_updatedAt)
                : '',

            deletedAt: raw.superlinea_deletedAt
                ? FechaUtils.formatFechaHora(raw.superlinea_deletedAt)
                : '',

            usuarioCreated: raw.usuarioCreated_nombre ?? '',
            usuarioUpdated: raw.usuarioUpdated_nombre ?? '',
            usuarioDeleted: raw.usuarioDeleted_nombre ?? '',
            };
        } catch (error) {
            console.error('ERROR EN findByIdConAuditoria:', error);

            throw new DatabaseConnectionException(
            'Error al conectar con la base de datos.',
            );
        }
        }

    async hasLines(id: number): Promise<boolean> {
        const count =  await this.superLineaRepository
            .createQueryBuilder('superlinea')
            .innerJoin('superlinea.lineas', 'linea', 'linea.deletedAt IS NULL')
            .where('superlinea.id = :id', { id })
            .getCount();
        if(count>0){
            return true;
        }else{
            return false;
        }
    }

}