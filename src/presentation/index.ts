import { IHttpServer } from '@domain/communication/interfaces/httpServer';
import { INotifier } from '@domain/communication/interfaces/notifier';
import { TCommandArgs } from '@domain/config/interfaces/commandArgs';
import { IEventBus } from '@domain/events/interfaces/eventBus';
import { TServerConfig, TWatcherConfig } from '@domain/config/interfaces/config';
import { IWatcher } from '@domain/watcher/interfaces/watcher';
import { ReloadController } from './controllers/reloadController';
import { EXCELERATE_INTERNAL_PREFIX } from '@domain/communication/const/server';
import path from 'node:path';
import { InjectionScriptFactory } from '@infra/factories/InjectionScriptFactory';
import { IConfigRepository } from '@domain/config/repository/configRepository';
import { NodeEventEmmiter } from '@infra/events';

export class ExcelerateApp {
    constructor(
        private readonly commandArgs: TCommandArgs,
        private readonly httpServer: IHttpServer,
        private readonly notifier: INotifier,
        private readonly eventBus: IEventBus,
        private readonly configRepository: IConfigRepository,
        private readonly watcher: IWatcher,
        private readonly workingDir: string
    ) { }

    async initialize() {
        this.registerControllers();

        const { server, watcher } = await this.configRepository.getConfig();

        await Promise.all([
            this.startWatcher(watcher),
            this.startHttpServer(server)
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
        const reloadController = new ReloadController(this.notifier);
        NodeEventEmmiter.registerSubscriber(reloadController, this.eventBus);
    }

    private startWatcher(watcherConfig: TWatcherConfig) {
        this.watcher.config(watcherConfig);
        return this.watcher.start(this.workingDir);
    }

    private async startHttpServer(serverConfig: TServerConfig) {
        const live = Boolean(this.commandArgs.live);

        const injection = InjectionScriptFactory.create(live);

        const root = path.join(__dirname, 'assets');

        await this.httpServer.config({
            injection,
            internalAssetsRoot: root,
            internalPrefix: EXCELERATE_INTERNAL_PREFIX
        });

        const port = this.commandArgs.port || serverConfig.port || 3000;

        await this.httpServer.start('0.0.0.0', port);
    }

    private startNotifier() {
        const server = this.httpServer.getServer();

        this.notifier.initialize(server);
    }
}