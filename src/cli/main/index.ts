import path from 'node:path';
import { IHttpServer } from '@domain/communication/interfaces/httpServer';
import { INotifier } from '@domain/communication/interfaces/notifier';
import { TCommandArgs } from '@domain/config/interfaces/commandArgs';
import { IEventBus } from '@domain/events/interfaces/eventBus';
import { TServerConfig } from '@domain/config/interfaces/config';
import { IWatcher } from '@domain/watcher/interfaces/watcher';
import { EXCELERATE_INTERNAL_PREFIX } from '@domain/communication/const/server';
import { NodeEventEmmiter } from '@infra/events';
import { makeReloadController } from './factories/controllerFactory';
import { HotReloadInjection } from '@domain/reload/injections/hotReloadInjection';

export class App {
    constructor(
        private readonly commandArgs: TCommandArgs,
        private readonly httpServer: IHttpServer,
        private readonly notifier: INotifier,
        private readonly eventBus: IEventBus,
        private readonly serverConfig: TServerConfig,
        private readonly watcher: IWatcher,
        private readonly workingDir: string
    ) { }

    async initialize() {
        this.registerControllers();

        await Promise.all([
            this.startWatcher(),
            this.startHttpServer()
        ]);

        this.startNotifier();
    }

    close() {
        this.notifier.close();

        return Promise.all([
            this.httpServer.close(),
            this.watcher.stop()
        ])
    }

    private registerControllers() {
        const reloadController = makeReloadController(this.workingDir, this.commandArgs);
        NodeEventEmmiter.registerSubscriber(reloadController, this.eventBus);
    }

    private startWatcher() {
        return this.watcher.start(this.workingDir);
    }

    private async startHttpServer() {
        const injection = new HotReloadInjection();

        const root = path.join(__dirname, 'assets');

        await this.httpServer.config({
            injection,
            internalAssetsRoot: root,
            internalPrefix: EXCELERATE_INTERNAL_PREFIX
        });

        const port = this.commandArgs.port || this.serverConfig.port || 3000;

        await this.httpServer.start('0.0.0.0', port);
    }

    private startNotifier() {
        const server = this.httpServer.getServer();

        this.notifier.initialize(server);
    }
}