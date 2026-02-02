import { IWebSocket, TReloadMessage } from "../interfaces/webSocket";

export class ExcelerateWebSocket implements IWebSocket {
    private webSocket: WebSocket | null = null;

    constructor(private readonly socketUrl: string) {}

    connect() {
        this.webSocket = new WebSocket(this.socketUrl);
        this.config();
    }

    onMessage(cb: (message: TReloadMessage) => void) {
        this.webSocket!.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                
                const reloadMessage: TReloadMessage = {
                    type: message.type ?? 'live',
                    path: message.path ?? '',
                }
                
                cb(reloadMessage);
            } catch (err: unknown) {
                console.error('❌ [Excelerate] Erro ao processar mensagem:', err);
            }
        };
    }

    private config() {
        this.webSocket!.onclose = () => {
            console.warn('⚠️ [Excelerate] Conexão perdida. Tentando reconectar em 3s...');
            setTimeout(() => this.connect(), 3000);
        };

        this.webSocket!.onerror = () => {
            console.error('❌ [Excelerate] Erro no WebSocket');
        };
    }
}