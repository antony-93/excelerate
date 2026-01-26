const reloadTypes = {
    hot: 'hot',
    live: 'live'
}

class ExcelerateClient {
    #webSocket
    #liveReloadHandler
    #hotReloadHandler

    constructor() {
        this.#webSocket = new ExcelerateWebSocket();
        this.#liveReloadHandler = new ExcelerateLiveReloadHandler();
        this.#hotReloadHandler = new ExcelerateHotReloadHandler();
    }

    initialize() {
        this.initWebSocket();
    }

    initWebSocket() {
        this.#webSocket.connect();

        this.#webSocket.onMessage(({ type, ...props }) => {
            const reload = type === reloadTypes.hot
                ? this.#hotReloadHandler 
                : this.#liveReloadHandler;
                
            reload.handle(...props);
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

class ExcelerateHotReloadHandler {
    handle({ path }) {
        const canHotReload = this.#canHotReload();
    
        if (!canHotReload) return;

    }

    #canHotReload() {
        return true;
    }

    #reloadClasses() {
        
    }
}


const excelerate = new ExcelerateClient();
excelerate.initialize();