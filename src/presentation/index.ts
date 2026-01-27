import { IHttpServer } from '@domain/communication/interfaces/httpServer';
import { ISocketServer } from '@domain/communication/interfaces/socketServer';
import { TCommandArgs } from '@domain/config/interfaces/commandArgs';
import { FastifyHttpServerAdapter } from '@infra/adapters/http';
import { WSSocketServerAdapter } from '@infra/adapters/websocket';
import { IEventBus } from '@domain/events/interfaces/eventBus';
import { NodeEventEmmiterAdapter } from '@infra/adapters/events';
import { ExcelarateConfigAdapter } from '@infra/adapters/config';
import { IExcelerateConfig, TServerConfig, TWatcherConfig } from '@domain/config/interfaces/excelerateConfig';
import { IWatcher } from '@domain/watcher/interfaces/watcher';
import { ParcelWatcherDriver } from '@infra/driver/watcher';
import { ReloadController } from './controllers/reloadController';
import { HotReloadInjection, LiveReloadInjection } from '@domain/reload/injections';
import { IInjection } from '@domain/reload/interfaces/injection';
import { EXCELERATE_INTERNAL_PREFIX } from '@domain/communication/const/server';
import path from 'node:path';

export class ExcelerateApp {
    private readonly httpServer: IHttpServer;
    private readonly socketServer: ISocketServer;
    private readonly eventBus: IEventBus;
    private readonly excelerateConfig: IExcelerateConfig;
    private readonly watcher: IWatcher;
    private readonly workingDir: string;

    constructor(private readonly commandArgs: TCommandArgs) {
        const eventBus = new NodeEventEmmiterAdapter();
        const workingDir = process.cwd();

        this.workingDir = workingDir;
        this.eventBus = eventBus;
        this.watcher = new ParcelWatcherDriver(eventBus);
        this.excelerateConfig = new ExcelarateConfigAdapter(workingDir);
        this.httpServer = new FastifyHttpServerAdapter();
        this.socketServer = new WSSocketServerAdapter();
    }

    async initialize() {
        this.registerControllers();

        const { server, watcher } = await this.excelerateConfig.getConfig();

        await Promise.all([
            this.startWatcher(watcher),
            this.startHttpServer(server)
        ]);

        this.startSocketServer();
    }

    close() {
        this.socketServer.close();

        return Promise.all([
            this.httpServer.close(),
            this.watcher.stop()
        ])
    }

    private registerControllers() {
        const reloadController = new ReloadController(this.socketServer);
        NodeEventEmmiterAdapter.registerSubscriber(reloadController, this.eventBus);
    }

    private startWatcher(watcherConfig: TWatcherConfig) {
        this.watcher.config(watcherConfig);
        return this.watcher.start(this.workingDir);
    }

    private async startHttpServer(serverConfig: TServerConfig) {
        const injection: IInjection = this.commandArgs.live
            ? new LiveReloadInjection()
            : new HotReloadInjection();

        const root = path.join(__dirname, 'assets');

        await this.httpServer.config({
            injection,
            internalAssetsRoot: root,
            internalPrefix: EXCELERATE_INTERNAL_PREFIX
        });

        const port = this.commandArgs.port || serverConfig.port || 3000;

        await this.httpServer.start('0.0.0.0', port);
    }

    private startSocketServer() {
        const server = this.httpServer.getServer();

        this.socketServer.initialize(server);
    }
}