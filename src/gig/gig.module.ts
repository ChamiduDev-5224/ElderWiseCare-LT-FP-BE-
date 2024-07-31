import { Module } from '@nestjs/common';
import { GigService } from './gig.service';
import { GigController } from './gig.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gig } from 'src/entities/gig.entity';
import { Service } from 'src/entities/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gig,Service])], // Import the Gig repository
  controllers: [GigController],
  providers: [GigService],
})
export class GigModule {

}
