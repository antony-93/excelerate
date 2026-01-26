import fastifyStatic from "@fastify/static";
import { FastifyPluginAsync } from "fastify";
import fp from 'fastify-plugin';

type TAssetsOptions = {
    root: string;
    prefix: string;
}

const plugin : FastifyPluginAsync<TAssetsOptions> = async (app, { root, prefix }) => {
    await app.register(fastifyStatic, {
        root,
        prefix,
        decorateReply: false,
        wildcard: true
    });
};

export const injectionScriptsPlugin = fp(plugin);

