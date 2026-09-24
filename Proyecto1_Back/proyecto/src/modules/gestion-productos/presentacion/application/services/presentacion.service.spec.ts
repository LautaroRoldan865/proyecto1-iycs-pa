import { ConflictException } from '@nestjs/common';
import { PresentacionService } from './presentacion.service';
import { Presentacion } from '../../domain/entities/presentacion.entity';
import { beforeEach, describe, it } from 'node:test';

describe('PresentacionService', () => {
  let service: PresentacionService;

  let presentacionRepository: any;
  let usuarioService: any;
  let validacionesService: any;

  beforeEach(() => {
    presentacionRepository = {
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    usuarioService = {
      findOne: jest.fn(),
    };

    validacionesService = {
      tieneProductosActivosParaPresentacion: jest.fn(),
    };

    service = new PresentacionService(
      presentacionRepository,
      usuarioService,
      validacionesService,
    );
  });

  describe('remove', () => {

    it('CP-002-06 - no debería permitir eliminar una presentación asociada a productos', async () => {

      // DADO: existe la presentación 500G
      const presentacion = {
        id: 1,
        denominacion: '500G',
        sistema: 0,
      } as Presentacion;

      presentacionRepository.findOne.mockResolvedValue(presentacion);

      // Y la presentación tiene productos asociados
      validacionesService.tieneProductosActivosParaPresentacion
        .mockResolvedValue(true);

      // CUANDO: se intenta eliminar la presentación
      const resultado = service.remove(1, 1);

      // ENTONCES: debe lanzar un error
      await expect(resultado).rejects.toThrow(
        ConflictException,
      );

      // Y no debe eliminarse la presentación
      expect(presentacionRepository.remove).not.toHaveBeenCalled();
    });

  });
});