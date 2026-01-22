import { FastifyInstance } from "fastify";
import { staticPlugin } from "./static";
import fp from 'fastify-plugin'

const plugins = async (app: FastifyInstance) => {
    await app.register(staticPlugin);
};

export const apiPlugins = fp(plugins);