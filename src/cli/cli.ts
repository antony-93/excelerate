#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { App } from './main';
import { TCommandArgs } from '@domain/config/interfaces/commandArgs';
import { makeApp } from './main/factories/appFactory';

const options = {
    port: { type: 'string', short: 'p' },
    live: { type: 'boolean', default: false }
} as const;

const { values } = parseArgs({ options });

const commandArgs: TCommandArgs = {
    live: values.live,
    port: values.port ? Number(values.port) : undefined
}

const workingDir = process.cwd();

let app: App | null = null;

async function bootstrap() {
    try {
        app = await makeApp(commandArgs, workingDir);

        await app.initialize();
    } catch(error) {
        console.error('❌ [Excelerate] Erro durante a inicialização:', error);
        shutdown(1);
    }
}

async function shutdown(code: number = 0) {
    try {
        await app?.close();

        console.log('👋 [Excelerate] Até logo!');
        
        process.exit(code);
    } catch (err) {
        console.error('❌ [Excelerate] Erro durante o desligamento:', err);
        process.exit(1);
    }
}

process.on('SIGINT', () => shutdown());
process.on('SIGTERM', () => shutdown());
process.on('unhandledRejection', (reason) => {
    console.error('❌ [Excelerate] Erro assíncrono não tratado:', reason);
    shutdown(1);
});

bootstrap();