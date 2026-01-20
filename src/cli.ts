#!/usr/bin/env node
import { parseArgs } from 'node:util';
import app from './infra/http';

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
            live: values.live
        }

        await app.config(config);
        
        await app.start('0.0.0.0', Number(values.port));

        
    } catch (err: any) {
        console.error(err.message);
        process.exit(1);
    }
}

execute();