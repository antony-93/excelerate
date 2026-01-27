import fastifyStatic from "@fastify/static";
import { FastifyPluginAsync } from "fastify";

export const publicPlugin: FastifyPluginAsync = async (app) => {
    const workingDir = process.cwd();

    await app.register(fastifyStatic, {
        root: workingDir,
        prefix: '/',
        index: 'index.html',
        wildcard: true
    });
};