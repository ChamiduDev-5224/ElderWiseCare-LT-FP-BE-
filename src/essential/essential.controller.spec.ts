import { Test, TestingModule } from '@nestjs/testing';
import { EssentialController } from './essential.controller';
import { EssentialService } from './essential.service';

describe('EssentialController', () => {
  let controller: EssentialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EssentialController],
      providers: [EssentialService],
    }).compile();

    controller = module.get<EssentialController>(EssentialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
