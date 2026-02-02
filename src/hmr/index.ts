import { ExcelerateWebSocket } from "./infra/webSocket";
import { IWebSocket } from "./interfaces/webSocket";
import { makeReload } from "./reload/factories/reloadFactory";

class ExcelerateClient {
    constructor(private readonly webSocket: IWebSocket) {}

    initialize() {
        this.initWebSocket();
        this.initHmrSelectors();
    }

    private initWebSocket() {
        this.webSocket.connect();

        this.webSocket.onMessage(({ type, ...props }) => {
            const reload = makeReload(type);
            reload.execute({ ...props });
        });
    }

    private initHmrSelectors() {
        const timer = setInterval(() => {
            if (typeof Ext !== 'undefined' && Ext.ComponentQuery) {
                this.setControllerOptionInQuery();
                this.setViewModelOptionInQuery();
                clearInterval(timer);
            }
        }, 300);
    
        setTimeout(() => clearInterval(timer), 10000);
    }

    private setControllerOptionInQuery() {
        Ext.ComponentQuery.pseudos.controllerClass = function(components: any[], className: string) {
            const result: any[] = [];
        
            components.forEach($cmp => {
                const controller = $cmp.getController ? $cmp.getController() : null;

                if (controller?.$className === className) result.push($cmp);
            })

            return result;
        };
    }

    private setViewModelOptionInQuery() {
        Ext.ComponentQuery.pseudos.viewModelClass = function(components: any[], className: string) {
            const result: any[] = [];
        
            components.forEach($cmp => {
                const vwm = $cmp.getViewModel ? $cmp.getViewModel() : null;

                if (vwm?.$className === className) result.push($cmp);
            })

            return result;
        };
    }
}

const urlConnection = `ws://${window.location.host}`;

const webSocket = new ExcelerateWebSocket(urlConnection);

const excelerate = new ExcelerateClient(webSocket);

excelerate.initialize();