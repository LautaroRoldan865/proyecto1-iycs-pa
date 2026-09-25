import { forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { ISuperLineaRepository } from '../../domain/interfaces/superlinea.repository.interface';
import { CreateSuperLineaDto } from '../../dto/create-superlinea.dto';
import { UpdateSuperLineaDto } from '../../dto/update-superlinea.dto';
import { MessageFrontUtils } from 'src/modules/common/utils/message/message-front.util';
import { SuperLinea } from '../../domain/entities/superlinea.entity';
import { PoliticaSuperLineaService } from '../../domain/services/politica-denominacion';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { SuperLineaDto } from '../../dto/superlinea.dto';
import { PoliticaEliminacionSuperLinea } from '../../domain/services/politica-eliminacion-superlinea';
import { SuperlineaMapper } from '../../mappers/superlinea.mapper';
import { PaginacionUtils } from 'src/modules/common/utils/pagination/paginacion-utils';

@Injectable()
export class SuperlineaService {
    private readonly logger = new Logger(SuperlineaService.name)
    private readonly ENTITY_NAME = 'SuperLinea';

    constructor(
        @Inject('ISuperLineaRepository')
        private readonly repository: ISuperLineaRepository,
        private readonly politicaSuperLinea: PoliticaSuperLineaService,
        private readonly politicaEliminacion: PoliticaEliminacionSuperLinea,
    ){}


    async create(dto: CreateSuperLineaDto) {
        this.logger.log(`Creando ${this.ENTITY_NAME}: ${dto.denominacion}`,);

        await this.politicaSuperLinea.validarDenominacion(dto.denominacion);

        const entity = await this.repository.create(dto);


        return MessageFrontUtils.createSimple(
        this.ENTITY_NAME,
        entity.denominacion,
        'creada',
        );
    }

    async update(id:number, dto:UpdateSuperLineaDto){
        this.logger.log(`Editando ${this.ENTITY_NAME}: ${dto.denominacion}`);

        const entity = await this.findEntityById(id);
        
        if (dto.denominacion) {
            await this.politicaSuperLinea.validarDenominacion(dto.denominacion,id);
        }

        const updated = await this.repository.update(id,dto);

        return MessageFrontUtils.createSimple(
        this.ENTITY_NAME,
        updated.denominacion,
        'editada',
        );

    }

    async findEntityById(id: number): Promise<SuperLinea> {

        const entity = await this.repository.findOne(id);

        if (!entity) {
        throw new NotFoundException(
            `${this.ENTITY_NAME} con ID ${id} no encontrada.`,
        );
        }

        return entity;
    }

    async findAllForSelect(denominacion: string = ''): Promise<SuperLineaDto[]> {
        const items = await this.repository.findAllFor(denominacion);
        return items.map(item => SuperlineaMapper.toDto(item));
    }

    async findAllFor(
        denominacion: string,
      ): Promise<{ data: SuperLineaDto[]; total: number }> {
        const result = await this.repository.findAllFor(denominacion);
    
        this.logger.log(
          ` ser Buscando o ${denominacion}    result.length=${result.length}}`,
        );
    
        const data: SuperLineaDto[] = result.map((linea) => SuperlineaMapper.toDto(linea));
    
        return {
          data,
          total: 1,
        };
      }
  

    async findDtoById(id: number): Promise<SuperLineaDto> {
        const entity = await this.findEntityById(id);
        return SuperlineaMapper.toDto(entity);
    }

    async findByDenominacionFiltered(
        denominacion: string,
        skip = 0,
        take = 10,
        incluirEliminados: boolean = false,
      ): Promise<{ data: SuperLineaDto[]; total: number }> {
        this.logger.log(
          ` ser Buscando o ${denominacion}  skip=${skip}, take=${take}`,
        );
        const result = await this.repository.findByDenominacionFiltered(
          denominacion,
          skip,
          take,
          incluirEliminados,
        );
        const data: SuperLineaDto[] = result.data.map((superlinea) =>
          SuperlineaMapper.toDto(superlinea),
        );
        return {
          data,
          total: PaginacionUtils.totalItems(result.total),
        };
      }

       async findByIdConAuditoria(id: number) {
          const entity = await this.repository.findByIdConAuditoria(id);
          if (!entity)
            throw new NotFoundException(
              `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
            );
          this.logger.warn(`FindOne : ${JSON.stringify(entity)}.`);
      
          return entity;
        }


    async remove(id: number) {

        const entity = await this.findEntityById(id);

        await this.politicaEliminacion.validar(id);

        await this.repository.remove(
            entity,
        );

        return MessageFrontUtils.createSimple(
            this.ENTITY_NAME,
            entity.denominacion,
            'eliminada',
        );
    }
}
