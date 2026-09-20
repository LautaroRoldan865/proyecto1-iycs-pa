import { ApiProperty } from "@nestjs/swagger";
import { Producto } from "src/modules/gestion-productos/producto/domain/entities/producto.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


export enum UnidadPresentacion {
  GRAMOS = 'GRAMOS',
  KILOGRAMOS = 'KILOGRAMOS',
  MILILITROS = 'MILILITROS',
  LITROS = 'LITROS',
  UNIDADES = 'UNIDADES',
}
@Entity('presentacion-producto')
export class Presentacion {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, })
    denominacion: string;

    @Column({ type: 'text', nullable: true })
    observacion?: string;



    @OneToMany(()=> Producto, (producto)=> producto.presentacion)
    productos:Producto[]

    /*igual que marca*/
    @CreateDateColumn()
      createdAt: Date;
    
      @UpdateDateColumn()
      updatedAt: Date;
    
      @DeleteDateColumn({ nullable: true })
      deletedAt?: Date;
    
      @Column({ type: 'int', nullable: true })
      usuarioCreatedId?: number;
    
      @Column({ type: 'int', nullable: true })
      usuarioDeletedId?: number;
    
      @Column({ type: 'int', nullable: true })
      usuarioUpdatedId?: number;
    
      @Column({ type: 'int', default: 0 })
      sistema: number;
}