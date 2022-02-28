import { Test, TestingModule } from '@nestjs/testing';
import { OraService } from './ora.service';

describe('OraService', () => {
  let service: OraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OraService],
    }).compile();

    service = module.get<OraService>(OraService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
