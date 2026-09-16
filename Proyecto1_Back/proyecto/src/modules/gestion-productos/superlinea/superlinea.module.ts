import { Module } from '@nestjs/common';


import { LineaModule } from '../linea/linea.module';
import { SuperLinea } from './domain/entities/superlinea.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperLineaRepository } from './infraestructura/superlinea.repository';
import { DataSource } from 'typeorm';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { TypeOrmUnitOfWork } from 'src/modules/common/unit-of-work/type-orm-unit-of-works1';
import { SuperlineaController } from './application/controller/superlinea.controller';
import { SuperlineaService } from './application/service/superlinea.service';

@Module({
  imports:[
    LineaModule,
    TypeOrmModule.forFeature([SuperLinea])
  ],
  controllers: [SuperlineaController],
  providers: [
    SuperlineaService,
    {
      provide: 'ISuperLineaRepository',
      useClass: SuperLineaRepository,
    },
    {
      provide: 'UnitOfWork',
      useFactory:(dataSource: DataSource): IUnitOfWork => {
        return new TypeOrmUnitOfWork(dataSource);
      },
      inject:[DataSource]
    }
  ],
  exports: [TypeOrmModule,SuperlineaService],

})
export class SuperlineaModule {}
