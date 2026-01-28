#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { ExcelerateApp } from './presentation';
import { TCommandArgs } from '@domain/config/interfaces/commandArgs';
import { FastifyHttpServer } from '@infra/http';
import { WSSocketServer } from '@infra/websocket';
import { ParcelWatcher } from '@infra/drivers/watcher';
import { NodeEventEmmiter } from '@infra/events';
import { ConfigRepository } from '@infra/repositories/configRepository';

const options = {
    port: { type: 'string', short: 'p' },
    live: { type: 'boolean', default: false }
} as const;

const { values } = parseArgs({ options });

const commandArgs: TCommandArgs = {
    live: values.live,
    port: values.port ? Number(values.port) : undefined
}

const eventBus = new NodeEventEmmiter();
const workingDir = process.cwd();

const app = new ExcelerateApp(
    commandArgs,
    new FastifyHttpServer(),
    new WSSocketServer(),
    eventBus,
    new ConfigRepository(workingDir),
    new ParcelWatcher(eventBus),
    workingDir
);

async function bootstrap() {
    try {
        await app.initialize();
        console.log('🚀 EXCELERATE ONLINE')
    } catch(error) {
        console.error('❌ Erro durante a inicialização:', error);
        shutdown(1);
    }
}

async function shutdown(code: number = 0) {
    try {
        await app.close();

        console.log('👋 Até logo!');
        
        process.exit(code);
    } catch (err) {
        console.error('❌ Erro durante o desligamento:', err);
        process.exit(1);
    }
}

process.on('SIGINT', () => shutdown());
process.on('SIGTERM', () => shutdown());
process.on('unhandledRejection', (reason) => {
    console.error('❌ Erro assíncrono não tratado:', reason);
    shutdown(1);
});

bootstrap();