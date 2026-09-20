import { PresentacionDto } from "src/modules/gestion-productos/presentacion/dto/presentacion-producto.dto";
import { CreatePresentacionDto } from "../../dto/create-presentacion.dto";
import { PresentacionService } from "../services/presentacion.service";
import { UpdatePresentacionDto } from "../../dto/update-presentacion.dto";
import { Controller, UseGuards, Logger, Post, UsePipes, Body, Get, Query, Param, ParseIntPipe, Put, Delete } from "@nestjs/common";
import { ApiTags, ApiOkResponse } from "@nestjs/swagger";
import { PaginationWithDenominacionDto } from "src/modules/common/dto/busquedas/pagination-with-denominacion.dto";
import { NormalizeDenominacionSearchPipe } from "src/modules/common/pipes/normalize-denominations-search.pipe";
import { NormalizeDenominacionPipe } from "src/modules/common/pipes/normalize-denominations.pipe";
import { AuditoriaDto } from "src/modules/gestion-sistema/auditoria/dto/auditoria.dto";
import { AuthGuard } from "src/modules/gestion-usuario/auth/auth.guard";
import { Roles } from "src/modules/gestion-usuario/auth/roles.decorator";


@ApiTags('Gestion Productos')
@Controller('presentacion')
@UseGuards(AuthGuard)
export class PresentacionController {
  private readonly logger = new Logger(PresentacionController.name);
  constructor(private readonly service: PresentacionService) {}

  private readonly ENTITY_NAME = 'Presentacion';

  @Post()
  @Roles('Root', 'Administrador', 'Empleado')
  @UsePipes(NormalizeDenominacionPipe)
  create(@Body() createDto: CreatePresentacionDto) {
    this.logger.log(`Creando un nuevo ${this.ENTITY_NAME}...`);
    return this.service.create(createDto);
  }

  @Get('search-by')
  @Roles('Root', 'Administrador', 'Empleado')
  @UsePipes(NormalizeDenominacionSearchPipe)
  findByDenominacionFiltered(
    @Query() paginationDto: PaginationWithDenominacionDto,
  ) {
    const { denominacion = '', skip, take, incluirEliminados } = paginationDto;
    this.logger.log(
      `Buscando ${this.ENTITY_NAME} con denominación: ${denominacion}`,
    );
    return this.service.findBy(denominacion, skip, take, incluirEliminados);
  }

  @Get(':id')
  @Roles('Root', 'Administrador', 'Empleado')
  @ApiOkResponse({ type: PresentacionDto })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PresentacionDto> {
    this.logger.log(`Buscando ${this.ENTITY_NAME} con ID: ${id}`);
    return this.service.findDtoById(id);
  }

  @Put(':id')
  @Roles('Root', 'Administrador', 'Empleado')
  @UsePipes(NormalizeDenominacionPipe)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePresentacionDto,
  ) {
    this.logger.log(`Actualizando  ${this.ENTITY_NAME} con ID: ${id}`);
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @Roles('Root', 'Administrador', 'Empleado')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('usuarioId', ParseIntPipe) usuarioId: number,
  ) {
    this.logger.warn(
      `Eliminando ${this.ENTITY_NAME} con ID: ${id} por usuario: ${usuarioId}`,
    );
    return this.service.remove(id, usuarioId);
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
