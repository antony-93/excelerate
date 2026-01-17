#!/usr/bin/env node

import express from 'express';
import loaders from './loaders';

async function main() {
    const app = express();
    
    await loaders(app);
}

main();