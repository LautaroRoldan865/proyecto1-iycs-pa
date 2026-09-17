import { MonetarioColumn } from "src/modules/common/decorators/monetario-column.decorator";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Producto } from "./producto.entity";

@Entity('historial-precio')
export class HistorialPrecio {
    @PrimaryGeneratedColumn()
    id:number

    @MonetarioColumn()
    precioAnterior:number

    @MonetarioColumn()
    precioNuevo:number

    @CreateDateColumn({type:'timestamp'})
    fecha: Date

    @Column({type: 'text'})
    motivo: string

    @ManyToOne(()=> Producto, (producto)=> producto.historialPrecios, {onDelete:'CASCADE'})
    @JoinColumn({name:'producto_id'})
    @Index()
    producto: Producto

    @Column({ type: 'int', nullable: true})
    productoId?: number

    @Column({ type: 'int', nullable: true})
    usuarioId?: number
}