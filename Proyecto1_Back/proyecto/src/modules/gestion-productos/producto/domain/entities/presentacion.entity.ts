import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Producto } from "./producto.entity";

export enum UnidadPresentacion {
  GRAMOS = 'GRAMOS',
  KILOGRAMOS = 'KILOGRAMOS',
  MILILITROS = 'MILILITROS',
  LITROS = 'LITROS',
  UNIDADES = 'UNIDADES',
}
@Entity('presentacion-producto')
@Index(['cantidad', 'unidad']) 
export class Presentacion {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 500 })
    @Column()
    cantidad: number;

    @Index()
    @ApiProperty({ enum: UnidadPresentacion, example: UnidadPresentacion.MILILITROS })
    @Column({ type: 'enum', enum: UnidadPresentacion })
    unidad: UnidadPresentacion;

    @OneToMany(()=> Producto, (producto)=> producto.presentacion)
    productos:Producto[]
}