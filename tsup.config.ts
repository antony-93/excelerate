import { defineConfig } from 'tsup';

export default defineConfig([{
    entry: ['src/cli/cli.ts'],
    format: ['esm'],
    outDir: 'dist',
    clean: true,
    dts: false,
    minify: true,
    sourcemap: true,
    shims: true,
    external: ['@parcel/watcher']
}, {
    entry: {
        hmr: 'src/hmr/index.ts' 
    },
    outDir: 'dist/assets',
    format: ['iife'],
    globalName: 'HMR',
    outExtension() {
        return { js: '.js' }
    },
    minify: true,
    clean: false,
    dts: false,
    platform: 'browser',
    noExternal: [/.*/],
}]);