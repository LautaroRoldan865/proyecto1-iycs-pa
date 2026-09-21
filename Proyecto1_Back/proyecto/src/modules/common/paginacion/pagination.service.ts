import { Injectable } from "@nestjs/common";
import { ObjectLiteral, Repository } from "typeorm";
import { PaginacionDto } from "./dto/paginacion.dto";

@Injectable()
export class PaginacionService {

    async paginar<T extends ObjectLiteral>( repository: Repository<T>, paginacion:PaginacionDto){
        const { pagina, limite } = paginacion;

        const [datos,total] = await repository.findAndCount({
            skip: (pagina - 1) * limite,
            take:limite,
        })

        return {
            datos,
            total,
            pagina,
            limite,
            totalPaginas: Math.ceil(total / limite),
        }
    }

}