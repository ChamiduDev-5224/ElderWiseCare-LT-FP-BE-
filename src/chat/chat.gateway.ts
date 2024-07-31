// src/chat/chat.gateway.ts

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // Adjust as needed
  },
})
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
  }

  handleDisconnect(client: any) {
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() data: { messageText: string; senderId: number; receiverId: number }) {
    // Broadcast the message to all connected clients
    this.server.emit('message', data);

    // Save message to database (you might want to move this to your ChatService)
    // await this.chatService.create(data.messageText, data.senderId, data.receiverId);
  }
}
