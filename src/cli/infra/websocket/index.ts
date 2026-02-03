import { Server } from "node:http";
import { WebSocketServer } from "ws";
import { INotifier } from "@domain/communication/interfaces/notifier";

export class WebSocketNotifier implements INotifier {
    private wss: WebSocketServer | null = null;

    initialize(server: Server) {
        this.wss = new WebSocketServer({ server });
    }

    notify(message: Record<string, any>): void {
        if (!this.wss) return;

        const data = JSON.stringify(message);

        this.wss.clients.forEach(c => {
            if (c.readyState === WebSocket.OPEN) c.send(data);
        });
    }

    close() {
        if (!this.wss) return

        this.wss.clients.forEach(c => c.terminate())

        this.wss.close();
    }
}