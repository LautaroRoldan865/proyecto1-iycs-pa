import { ConflictException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { MessageFrontUtils } from "src/modules/common/utils/message/message-front.util";
import { UpdatePresentacionDto } from "../../dto/update-presentacion.dto";
import { ensureNotSistemaEntity } from "src/modules/common/utils/atrituto-sistema";
import { PaginacionUtils } from "src/modules/common/utils/pagination/paginacion-utils";
import { Marca } from "src/modules/gestion-productos/marca/domain/entities/marca.entity";
import { MarcaDto } from "src/modules/gestion-productos/marca/dto/marca.dto";
import { MarcaMapper } from "src/modules/gestion-productos/marca/mappers/marca.mapper";
import { PresentacionDto } from "../../dto/presentacion-producto.dto";
import { UsuarioService } from "src/modules/gestion-usuario/usuario/application/services/usuario.service";
import { PresentacionMapper } from "../../domain/mappers/presentacion.mapper";
import { PoliticaEliminacionPresentacion } from "../policies/politica-eliminacion-presentacion.service";
import { IPresentacionRepository } from "../../domain/interfaces/presentacion.repository-interface";
import { Presentacion } from "../../domain/entities/presentacion.entity";
import { CreatePresentacionDto } from "../../dto/create-presentacion.dto";

@Injectable()
export class PresentacionService{
    private readonly logger = new Logger(PresentacionService.name);
  constructor(
    @Inject('IPresentacionRepository')
    private readonly presentacionRepository: IPresentacionRepository,
    private readonly usuarioService: UsuarioService,
     private readonly validacionesService: PoliticaEliminacionPresentacion,
  ) {}

  private readonly ENTITY_NAME = 'Presentacion';

  async create(dto: CreatePresentacionDto){
    this.logger.log(
      `Creando un nuevo ${this.ENTITY_NAME} con denominación: ${dto.denominacion} a: ${dto.denominacion}`,
    );

    await this.checkDenominacionExists(dto.denominacion, 0);
        const entity = await this.presentacionRepository.create(dto);
    
        return MessageFrontUtils.createSimple(
          `${this.ENTITY_NAME}`,
          dto.denominacion,
          'creada',
        );
  }

  /*lo comento porque ya hice el create -mili*/
 /* async ejecutar(data:CreatePresentacionDto): Promise<Presentacion> {

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
  }*/

    async update(id: number, dto: UpdatePresentacionDto) {
        this.logger.log(`Actualizando  ${this.ENTITY_NAME} con ID: ${id}`);
        const presentacion = await this.findEntityById(id);
        ensureNotSistemaEntity(presentacion, 'Presentacion');
    
        if (dto.denominacion)
          await this.checkDenominacionExists(dto.denominacion, id);
    
        const entity = await this.presentacionRepository.update(id, dto);
        return MessageFrontUtils.createSimple(
          `${this.ENTITY_NAME}`,
          entity.denominacion,
          'editada',
        );
      }
    
      async findAllFor(
        denominacion: string,
      ): Promise<{ data: PresentacionDto[]; total: number }> {
        const result = await this.presentacionRepository.findAllFor(denominacion);
        const data: PresentacionDto[] = result.map((presentacion) => PresentacionMapper.toDto(presentacion));
        return {
          data,
          total: 1,
        };
      }
    
      async findAllListado(): Promise<Presentacion[]> {
        const result = await this.presentacionRepository.findAllListado();
        return result;
      }
    
      async findAllSinSistemaFor(
        denominacion: string,
      ): Promise<{ data: PresentacionDto[]; total: number }> {
        const result = await this.presentacionRepository.findAllSinSistemaFor(denominacion);
        const data: PresentacionDto[] = result.map((presentacion) => PresentacionMapper.toDto(presentacion));
        return {
          data,
          total: 1,
        };
      }
    
      async findAllSistemaFor(
        denominacion: string,
      ): Promise<{ data: PresentacionDto[]; total: number }> {
        const result = await this.presentacionRepository.findAllSistemaFor(denominacion);
        const data: PresentacionDto[] = result.map((presentacion) => MarcaMapper.toDto(presentacion));
        return {
          data,
          total: 1,
        };
      }
    
      async findBy(
        denominacion: string,
        skip = 0,
        take = 10,
        incluirEliminados = false,
      ): Promise<{ data: PresentacionDto[]; total: number }> {
        this.logger.log(`  Buscando o ${denominacion}  skip=${skip}, take=${take}`);
        const result = await this.presentacionRepository.findBy(denominacion, skip, take, incluirEliminados);
        const data: PresentacionDto[] = result.data.map((presentacion) =>
          PresentacionMapper.toDto(presentacion),
        );
        return {
          data,
          total: PaginacionUtils.totalItems(result.total),
        };
      }
    
      async findDtoById(id: number) {
        const entity = await this.presentacionRepository.findOne(id);
        if (!entity)
          throw new NotFoundException(
            `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
          );
        return PresentacionMapper.toDto(entity);
      }
    
      async findEntityById(id: number) {
        const entity = await this.presentacionRepository.findOne(id);
        if (!entity)
          throw new NotFoundException(
            `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
          );
        return entity;
      }
    
      async remove(id: number, usuarioId: number) {
        const entity = await this.presentacionRepository.findOne(id);
    
        if (!entity) {
          throw new NotFoundException(
            `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
          );
        }
    
        ensureNotSistemaEntity(entity, 'Marca');
    
        const tieneProductosActivos =
          await this.validacionesService.tieneProductosActivosParaPresentacion(id);
    
        if (tieneProductosActivos) {
          throw new ConflictException(
            'No se puede eliminar la presentacion porque está asociada a productos activos.',
          );
        }
    
        const usuario = await this.usuarioService.findOne(usuarioId);
        if (!usuario) {
          throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado.`);
        }
        await this.presentacionRepository.remove(entity, usuario);
    
        return MessageFrontUtils.createSimple(
          `${this.ENTITY_NAME}`,
          entity.denominacion,
          'eliminada',
        );
      }
    
      
    
      async findByIdConAuditoria(id: number) {
        const entity = await this.presentacionRepository.findByIdConAuditoria(id);
        if (!entity)
          throw new NotFoundException(
            `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
          );
        this.logger.warn(`FindOne : ${JSON.stringify(entity)}.`);
    
        return entity;
      }
    
      async findByDenominacionFiltered(findByDenominacionFiltered: any) {
        throw new Error('Method not implemented.');
      }


   private async checkDenominacionExists(denominacion: string, id: number) {
      const exists = await this.presentacionRepository.findByDenominacionWith(denominacion);
      if (exists && exists.id !== id) {
        this.logger.warn(
          `${this.ENTITY_NAME} Conflicto: denominación ya está en uso: ${denominacion}`,
        );
        throw new ConflictException('Denominación ya en uso.');
      }
    }
}
