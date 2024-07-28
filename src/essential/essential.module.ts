import { Module } from '@nestjs/common';
import { EssentialService } from './essential.service';
import { EssentialController } from './essential.controller';

@Module({
  controllers: [EssentialController],
  providers: [EssentialService],
})
export class EssentialModule {}
