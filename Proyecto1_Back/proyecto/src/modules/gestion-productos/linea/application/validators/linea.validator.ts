import { Injectable } from "@nestjs/common";
import { CreateLineaDto } from "../../dto/create-linea.dto";
import { lineaIntrinsicValidationService } from "../../domain/services/linea-intrinsic-validation.service.ts";
import { LineaRelatedEntitiesValidator } from "../../infraestructure/validators/linea-related-entities.validator.ts";
import { LineaUniquenessValidator } from "../../infraestructure/validators/linea-uniqueness.validator.ts";

@Injectable()
export class LineaCreateValidator {
    constructor(
        private readonly intrinsicValidationService: lineaIntrinsicValidationService,
        private readonly uniquenessValidator: LineaUniquenessValidator,
        private readonly relatedEntitiesValidator: LineaRelatedEntitiesValidator,
    ){}
    async validarYPrepararCreacion(dto: CreateLineaDto) {

        this.intrinsicValidationService.validarDatosBasicos({
            denominacion: dto.denominacion,
            superlineaId: dto.superlineaId,
        });

        await this.uniquenessValidator.validarDenominacionUnica(dto.denominacion);

        const { superlinea } =await this.relatedEntitiesValidator.validarYObtenerEntidadesRelacionadas(dto.superlineaId);
        return { superlinea };
    }
}