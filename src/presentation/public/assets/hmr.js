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
        this.#initWebSocket();
    }

    #initWebSocket() {
        this.#webSocket.connect();

        this.#webSocket.onMessage(({ type, ...props }) => {
            const reload = type === reloadTypes.hot
                ? this.#hotReloadHandler
                : this.#liveReloadHandler;

            reload.handle({ ...props });
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
        const className = this.#getClassNameByPath(path);

        const canHotReload = this.#canHotReload(className);

        if (!canHotReload) return;

        this.#reloadClass(path, className);
    }

    #canHotReload(className) {
        const definedClass = Ext.ClassManager.get(className);
        return Boolean(definedClass);
    }

    #reloadClass(path, className) {
        Ext.undefine(className);
        this.#loadClass(path, className)
    }

    #loadClass(path, className) {
        const url = `${path}${path.includes('?') ? '&' : '?'}excelerate_update=${Date.now()}`;

        Ext.Loader.loadScript({
            url: url,
            onLoad: () => {
                console.log(`✅ [Excelerate] ${className} recarregada do servidor!`);
            },
            onError: () => {
                console.error(`❌ [Excelerate] Erro ao carregar o arquivo físico em: ${path}`);
            }
        });
    }

    #getClassNameByPath(path) {
        const classPaths = Ext.ClassManager.paths;

        const prefix = Object.keys(classPaths).find(key => {
            return path.includes(classPaths[key])
        });

        const name = classPaths[prefix]
            .replace(path, '')
            .replace('/', '.');

        return prefix + name;
    }
}

const excelerate = new ExcelerateClient();
excelerate.initialize();