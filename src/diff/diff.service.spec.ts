import { Test, TestingModule } from '@nestjs/testing';
import { DiffService } from './diff.service';

describe('DiffService', () => {
  let service: DiffService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiffService],
    }).compile();

    service = module.get<DiffService>(DiffService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
