import fastifyStatic from "@fastify/static";
import { FastifyPluginAsync } from "fastify";

export const staticPlugin: FastifyPluginAsync = async (app) => {
    const workingDir = process.cwd();

    await app.register(fastifyStatic, {
        root: workingDir,
        wildcard: true
    });
};