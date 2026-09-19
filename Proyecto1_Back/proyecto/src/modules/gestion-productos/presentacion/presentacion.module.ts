import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NormalizeDenominacionPipe } from "src/modules/common/pipes/normalize-denominations.pipe";
import { IUnitOfWork } from "src/modules/common/unit-of-work/iunit-of-work.";
import { TypeOrmUnitOfWork } from "src/modules/common/unit-of-work/type-orm-unit-of-works1";
import { UsuarioModule } from "src/modules/gestion-usuario/usuario/usuario.module";
import { DataSource } from "typeorm";
import { ProductoModule } from "../producto/producto.module";
import { PresentacionController } from "./application/controllers/presentacion.controller";
import { PoliticaEliminacionPresentacion } from "./application/policies/politica-eliminacion-presentacion.service";
import { PresentacionService } from "./application/services/presentacion.service";
import { Presentacion } from "./domain/entities/presentacion.entity";
import { PresentacionPersistenceAdapter } from "./infraestructure/repositories/presentacion.persistence-adapters";
import { PresentacionRepository } from "./infraestructure/repositories/presentacion.repository";


@Module({
  imports: [
    TypeOrmModule.forFeature([Presentacion]),
    UsuarioModule,
    forwardRef(() => ProductoModule),

  ],
  controllers: [PresentacionController],
  providers: [
    PresentacionService,
    NormalizeDenominacionPipe,
    PresentacionPersistenceAdapter,
    PoliticaEliminacionPresentacion,
    {
      provide: 'IPresentacionRepository',
      useClass: PresentacionRepository,
    },

    {
      provide: 'UnitOfWork',
      useFactory: (dataSource: DataSource): IUnitOfWork => {
        return new TypeOrmUnitOfWork(dataSource);
      },
      inject: [DataSource],
    },
  ],
  exports: [TypeOrmModule, PresentacionService],
})
export class PresentacionModule {}
