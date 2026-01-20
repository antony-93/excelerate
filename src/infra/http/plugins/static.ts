import fastifyStatic from "@fastify/static";
import { FastifyPluginAsync } from "fastify";

export const staticPlugin: FastifyPluginAsync = async (app) => {
    await app.register(fastifyStatic, {
        root: './',
        wildcard: true
    });
};