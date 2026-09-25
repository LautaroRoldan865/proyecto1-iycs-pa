import { Injectable } from "@nestjs/common";
import { CreateLineaDto } from "../../dto/create-linea.dto";
import { lineaIntrinsicValidationService } from "../../domain/services/linea-intrinsic-validation.service.ts";
import { LineaRelatedEntitiesValidator } from "../../infraestructure/validators/linea-related-entities.validator.ts";
import { LineaUniquenessValidator } from "../../infraestructure/validators/linea-uniqueness.validator.ts";
import { UpdateLineaDto } from "../../dto/update-linea.dto";
import { SuperLinea } from "src/modules/gestion-productos/superlinea/domain/entities/superlinea.entity";

@Injectable()
export class LineaValidator {
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

    async validarYPrepararEdicion(superlineaId: number,): Promise<SuperLinea | undefined> {
        if (superlineaId) {
            const { superlinea } = await this.relatedEntitiesValidator.validarYObtenerEntidadesRelacionadas(superlineaId);
            return superlinea;
        }
        return undefined;
    }
}