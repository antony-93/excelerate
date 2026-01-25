#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { ExcelerateApp } from './presentation';
import { TCommandArgs } from '@domain/config/interfaces/commandArgs';

const options = {
    port: { type: 'string', short: 'p' },
    live: { type: 'boolean', default: false }
} as const;

const { values } = parseArgs({ options });

const commandArgs: TCommandArgs = {
    live: values.live,
    port: values.port ? Number(values.port) : undefined
}

const app = new ExcelerateApp(commandArgs);

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