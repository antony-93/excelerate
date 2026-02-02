import { FastifyPluginAsync } from "fastify";
import fp from 'fastify-plugin';
import { injectionScriptsPlugin } from "./assets";
import { publicPlugin } from "./public";
import { TInternalAssetsConfig } from "@domain/communication/interfaces/assetsConfig";

type TApiPluginsOptions = TInternalAssetsConfig;

const plugins: FastifyPluginAsync<TApiPluginsOptions> = async (app, opts) => {
    await app.register(injectionScriptsPlugin, {
        root: opts.internalAssetsRoot,
        prefix: opts.internalPrefix
    })

    await app.register(publicPlugin);
};

export const apiPlugins = fp(plugins);