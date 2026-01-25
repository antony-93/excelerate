import { Server } from "node:http";
import { WebSocketServer } from "ws";
import { ISocketServer } from "@domain/communication/interfaces/socketServer";

export class WSServer implements ISocketServer {
    private wss: WebSocketServer | null = null;

    initialize(server: Server) {
        this.wss = new WebSocketServer({ server });
    }

    broadcast(message: Record<string, any>): void {
        if (!this.wss) return;
        
        const data = JSON.stringify(message);
        
        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) client.send(data);
        });
    }

    close() {
        this.wss?.close();
    }
}