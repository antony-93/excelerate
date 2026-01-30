import { IHttpServer } from "@domain/communication/interfaces/httpServer";
import { INotifier } from "@domain/communication/interfaces/notifier";
import { TWatcherConfig } from "@domain/config/interfaces/config";
import { IEventBus } from "@domain/events/interfaces/eventBus";
import { IMatcher } from "@domain/matcher/interfaces/matcher";
import { IWatcher } from "@domain/watcher/interfaces/watcher";
import { ParcelWatcher } from "@infra/watcher";
import { NodeEventEmmiter } from "@infra/events";
import { FastifyHttpServer } from "@infra/http";
import { PicomatchMatcher } from "@infra/matcher";
import { WebSocketNotifier } from "@infra/websocket";

let wsNotifier: INotifier | null = null;

export const makeWebSocketNotifier = (): INotifier => {
    if (!wsNotifier) wsNotifier = new WebSocketNotifier();
    return wsNotifier;
};

export const makeFastifyHttpServer = (): IHttpServer => {
    return new FastifyHttpServer();
};

export const makePicomatchMatcher = (): IMatcher => {
    return new PicomatchMatcher();
};

export const makeNodeEventEmmiter = (): IEventBus => {
    return new NodeEventEmmiter();
};

export const makeParcelWatcher = (
    eventBus: IEventBus, 
    matcher: IMatcher, 
    watcherConfig: TWatcherConfig,
    workingDir: string
): IWatcher => {
    return new ParcelWatcher(eventBus, matcher, watcherConfig, workingDir);
};