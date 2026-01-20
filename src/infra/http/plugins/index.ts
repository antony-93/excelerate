import { FastifyInstance } from "fastify";
import { staticPlugin } from "./static";

export const apiPlugins = async (app: FastifyInstance) => {
    await app.register(staticPlugin);
};