import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/cli.ts'],
    format: ['esm'],
    clean: true,
    dts: false,
    minify: true,
    sourcemap: true,
    shims: true,
    external: ['@parcel/watcher']
});