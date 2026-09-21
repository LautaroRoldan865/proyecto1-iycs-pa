import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { PaginacionDto } from "../dto/paginacion.dto";

export const Paginacion = createParamDecorator((data, ctx: ExecutionContext): PaginacionDto => {
    const request = ctx.switchToHttp().getRequest();

    const pagina = Math.max(Number(request.query.page)|| 1,1)
    const limite = Math.min(Math.max(Number(request.query.limit)||10,1), 100)

    return { pagina, limite };
});

/*
Para usar este decorador en un controlador de NestJS, 
primero debes importarlo y luego aplicarlo a un parámetro de tu método de controlador. 
Aquí tienes un ejemplo de cómo hacerlo:

import { Controller, Get } from '@nestjs/common';
import { Paginacion } from './paginacion.decorator';
import { PaginacionDto } from './paginacion.dto';

@Get()
obtenerProductos(@Pagination() pagination: PaginationDto) {
  return this.productoService.obtenerTodos(pagination);
}


*/ 