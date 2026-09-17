import { Module } from '@nestjs/common';
import { SuperlineaController } from './application/controller/superlinea.controller';
import { SuperlineaService } from './application/service/superlinea.service';
import { LineaModule } from '../linea/linea.module';
import { SuperLinea } from './domain/entities/superlinea.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperLineaRepository } from './infraestructura/superlinea.repository';
import { DataSource } from 'typeorm';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { TypeOrmUnitOfWork } from 'src/modules/common/unit-of-work/type-orm-unit-of-works1';
import { PoliticaEliminacionSuperLinea } from './domain/services/politica-eliminacion-superlinea';
import { PoliticaSuperLineaService } from './domain/services/politica-denominacion';

@Module({
  imports:[
    LineaModule,
    TypeOrmModule.forFeature([SuperLinea])
  ],
  controllers: [SuperlineaController],
  providers: [
    SuperlineaService,
    PoliticaEliminacionSuperLinea,
    PoliticaSuperLineaService,
    SuperLineaRepository,
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
