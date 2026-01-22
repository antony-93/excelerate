#!/usr/bin/env node
import { parseArgs } from 'node:util';
import app from './infra/http';
import { HotReloadInjection, LiveReloadInjection } from './domain/strategies/reload';

const options = {
    port: { type: 'string', short: 'p', default: '3000' },
    log: { type: 'boolean', default: false },
    live: { type: 'boolean', default: false }
} as const;

const execute = async () => {    
    try {
        const { values } = parseArgs({
            options
        });

        const config = {
            logger: values.log,
            injection: values.live ? new LiveReloadInjection() : new HotReloadInjection()
        }

        await app.config(config);
        
        await app.start('0.0.0.0', Number(values.port));
    } catch (err: any) {
        console.error(err.message);
        process.exit(1);
    }
}

execute();