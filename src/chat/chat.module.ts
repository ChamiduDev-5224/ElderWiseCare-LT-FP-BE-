import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatDetails } from 'src/entities/chatDetails.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatDetails])], // Import the Gig repository
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
