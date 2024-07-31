import { WebSocketGateway, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway() // This decorator defines the class as a WebSocket gateway
export class MyWebSocketGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): void {
    
    this.server.emit('message', payload); // Broadcast message to all connected clients
  }
}