class ExcelerateClient {
    #webSocket
    #liveReloadHandler

    constructor() {
        this.#webSocket = new ExcelerateWebSocket();
        this.#liveReloadHandler = new ExcelerateLiveReloadHandler();
    }

    initialize() {
        this.#initWebSocket();
    }

    #initWebSocket() {
        this.#webSocket.connect();

        this.#webSocket.onMessage(() => {
            this.#liveReloadHandler.handle();
        });
    }
}

class ExcelerateWebSocket {
    #socketUrl
    #webSocket

    constructor(urlConnection) {
        this.#socketUrl = urlConnection;
    }

    connect() {
        this.#webSocket = new WebSocket(this.#socketUrl);
        this.#config()
    }

    onMessage(cb) {
        this.#webSocket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                cb(message);
            } catch (err) {
                console.error('❌ [Excelerate] Erro ao processar mensagem:', err);
            }
        };
    }

    #config() {
        this.#webSocket.onclose = () => {
            console.warn('⚠️ [Excelerate] Conexão perdida. Tentando reconectar em 3s...');
            setTimeout(() => this.connect(), 3000);
        };

        this.#webSocket.onerror = (error) => {
            console.error('❌ [Excelerate] Erro no WebSocket');
        };
    }
}

class ExcelerateLiveReloadHandler {
    handle() {
        window.location.reload();
    }
}

const excelerate = new ExcelerateClient();
excelerate.initialize();