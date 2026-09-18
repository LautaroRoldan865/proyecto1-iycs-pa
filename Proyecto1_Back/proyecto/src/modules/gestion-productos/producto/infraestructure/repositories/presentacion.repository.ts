import { Injectable, Logger } from '@nestjs/common';
import { Presentacion } from "../../domain/entities/presentacion.entity";
import { CreatePresentacionDto } from "../../dto/create-presentacion.dto";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPresentacionRepository } from '../../domain/interfaces/presentacion.repository-interface';

export class PresentacionRepository implements IPresentacionRepository{
    private readonly logger = new Logger(PresentacionRepository.name);
    private readonly ENTITY_NAME = 'Presentacion';

    constructor(
    @InjectRepository(Presentacion)
    private readonly presentacionRepository: Repository<Presentacion>,
    ) {}

    async buscarPorCantidadYUnidad(data:CreatePresentacionDto): Promise<Presentacion | null>{
        const presentacionBuscada= await this.presentacionRepository.findOneBy({
            cantidad: data.cantidad, unidad:data.unidad})
        return presentacionBuscada;
    }
    
    async guardar(data:CreatePresentacionDto): Promise<Presentacion>{
        const newPresentation = await this.presentacionRepository.create(data);
        const result = await this.presentacionRepository.save(newPresentation);
        if(!result){
            this.logger.error(`Error al crear ${this.ENTITY_NAME}: `);
        }
        return result;
    }

}