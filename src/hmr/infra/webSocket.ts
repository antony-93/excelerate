import { IWebSocket, TWSReloadMessage } from "../interfaces/webSocket";

export class ExcelerateWebSocket implements IWebSocket {
    private webSocket: WebSocket | null = null;
    private retryCounts: number = 0;

    constructor(private readonly socketUrl: string) {}

    connect() {
        this.webSocket = new WebSocket(this.socketUrl);
        this.config();
    }

    onMessage(cb: (message: TWSReloadMessage) => void) {
        this.webSocket!.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                
                const reloadMessage: TWSReloadMessage = {
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
        this.webSocket!.onopen = () => {
            this.retryCounts = 0;
        }

        this.webSocket!.onclose = () => {
            if (this.retryCounts === 3) return;

            console.warn('⚠️ [Excelerate] Conexão perdida. Tentando reconectar em 3s...');
            
            setTimeout(() => {
                this.connect()
                this.retryCounts++
            }, 3000);
        };

        this.webSocket!.onerror = () => {
            console.error('❌ [Excelerate] Erro no WebSocket');
        };
    }
}