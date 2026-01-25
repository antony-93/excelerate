export interface ISocketServer {
    initialize(server: any): void;
    broadcast(message: Record<string, any>): void;
    close(): void;
}