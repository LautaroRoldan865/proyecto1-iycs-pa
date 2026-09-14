import { Module } from '@nestjs/common';
import { SuperlineaController } from './application/superlinea.controller';
import { SuperlineaService } from './superlinea.service';
import { LineaModule } from '../linea/linea.module';
import { SuperLinea } from './domain/entities/superlinea.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperLineaRepository } from './infraestructura/superlinea.repository';

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
