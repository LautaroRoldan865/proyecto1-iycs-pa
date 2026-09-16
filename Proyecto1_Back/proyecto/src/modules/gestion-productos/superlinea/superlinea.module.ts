import { Module } from '@nestjs/common';

import { LineaModule } from '../linea/linea.module';
import { SuperLinea } from './domain/entities/superlinea.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperLineaRepository } from './infraestructura/superlinea.repository';
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
  ],
  exports: [TypeOrmModule,SuperlineaService],

})
export class SuperlineaModule {}
