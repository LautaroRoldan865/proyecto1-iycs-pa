import { Test, TestingModule } from '@nestjs/testing';
import { SuperlineaService } from './superlinea.service';

describe('SuperlineaService', () => {
  let service: SuperlineaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuperlineaService],
    }).compile();

    service = module.get<SuperlineaService>(SuperlineaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
