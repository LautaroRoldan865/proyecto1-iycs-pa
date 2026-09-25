import { Test, TestingModule } from '@nestjs/testing';
import { SuperlineaController } from './application/superlinea.controller';

describe('SuperlineaController', () => {
  let controller: SuperlineaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuperlineaController],
    }).compile();

    controller = module.get<SuperlineaController>(SuperlineaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
