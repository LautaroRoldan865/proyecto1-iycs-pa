import { Inject, Injectable, Logger } from '@nestjs/common';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { ISuperLineaRepository } from '../../domain/interfaces/superlinea.repository.interface';
import { CreateSuperLineaDto } from '../../dto/create-superlinea.dto';

@Injectable()
export class SuperlineaService {
    private readonly logger = new Logger(SuperlineaService.name)

    constructor(
        @Inject('ISuperLineaRepository')
        private readonly repository: ISuperLineaRepository,
        @Inject('UnitOfWork')
        private readonly uow: IUnitOfWork
    ){}

    async create(dto: CreateSuperLineaDto){
        await this.uow.start()

        try{
            //1. Persistir Superlinea bajo la transaccion del UoW
            const superlinea = await this.repository.create(dto,this.uow)

            //2. Si hay operaciones asociadas (ej. asignar lineas hijas), se ejecutan  aca con this.uow
            await this.uow.commit()
            return superlinea
        }catch(error){
            await this.uow.commit()
            this.logger.error(`Error en creación de SuperLinea: ${error}`)
            throw error
        } finally {
            await this.uow.release()
        }
    }
}
