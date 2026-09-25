import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { SuperlineaService } from '../service/superlinea.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/gestion-usuario/auth/auth.guard';
import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';
import { Roles } from 'src/modules/gestion-usuario/auth/roles.decorator';
import { CreateSuperLineaDto } from '../../dto/create-superlinea.dto';
import { SuperLineaDto } from '../../dto/superlinea.dto';
import { UpdateSuperLineaDto } from '../../dto/update-superlinea.dto';
import { PaginationWithDenominacionDto } from 'src/modules/common/dto/busquedas/pagination-with-denominacion.dto';
import { NormalizeDenominacionSearchPipe } from 'src/modules/common/pipes/normalize-denominations-search.pipe';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';

@ApiTags('Gestion Productos')
@Controller('superlinea')
@UseGuards(AuthGuard)
export class SuperlineaController {
   private readonly logger = new Logger(SuperlineaController.name);
   constructor(private readonly service: SuperlineaService) {} 
   
   private readonly ENTITY_NAME = 'Superlinea';

    @Post()
    @Roles('Root', 'Administrador', 'Empleado')
    @UsePipes(NormalizeDenominacionPipe)
    create(@Body() createDto: CreateSuperLineaDto) {
        this.logger.log(`Creando una nueva ${this.ENTITY_NAME}...`);
        return this.service.create(createDto);
    }


    @Get('for-select')
    @Roles('Root', 'Administrador', 'Empleado')
    findAllForSelect(
        @Query('denominacion') denominacion: string = '',
    ): Promise<SuperLineaDto[]> {
    this.logger.log(
        `Buscando ${this.ENTITY_NAME} para selección con denominación: ${denominacion}`,
    );

    return this.service.findAllForSelect(denominacion);
    }

    @Get('search-by')
      @Roles('Root', 'Administrador', 'Empleado')
      @UsePipes(NormalizeDenominacionSearchPipe)
      findByDenominacionFiltered(
        @Query() paginationDto: PaginationWithDenominacionDto,
      ) {
        const { denominacion = '', skip, take, incluirEliminados } = paginationDto;
        this.logger.log(`Buscando usuarios con denominación: ${denominacion}`);
        return this.service.findByDenominacionFiltered(
          denominacion,
          skip,
          take,
          incluirEliminados,
        );
      }

    @Get(':id')
    @ApiOkResponse({ type: SuperLineaDto })
    @Roles('Root', 'Administrador', 'Empleado')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<SuperLineaDto> {
        this.logger.log(`Buscando  ${this.ENTITY_NAME} con ID: ${id}`);
        return this.service.findDtoById(id);
    }

    @Put(':id')
    @Roles('Root', 'Administrador', 'Empleado')
    @UsePipes(NormalizeDenominacionPipe)
    @Roles('Root', 'Administrador', 'Empleado')
    update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSuperLineaDto,
    ) {
        this.logger.log(`Actualizando  ${this.ENTITY_NAME} con ID: ${id}`);
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @Roles('Root', 'Administrador', 'Empleado')
    remove(
      @Param('id', ParseIntPipe) id: number,
      //@Body('usuarioDeletedId', ParseIntPipe) usuarioDeletedId: number,
    ) {
        this.logger.warn(
            `Eliminando ${this.ENTITY_NAME}`,
        );
        return this.service.remove(id);
    }

    @Get(':id/audit')
      @Roles('Root', 'Administrador', 'Empleado')
      @ApiOkResponse({
        description: 'Informacion de auditoria',
        type: AuditoriaDto,
      })
      async findByIdConAuditoria(
        @Param('id', ParseIntPipe) id: number,
      ): Promise<AuditoriaDto> {
        const data = await this.service.findByIdConAuditoria(id);
        return data;
      }
    
}
