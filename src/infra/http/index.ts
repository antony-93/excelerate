import fastify, { FastifyInstance } from "fastify";
import { apiPlugins } from "./plugins";

type ServerConfig = {
    logger: boolean
};

const server = fastify({ logger: false });

class AppServer {
    constructor(private app: FastifyInstance) { }

    start = (host: string, port: number) => {
        return this.app.listen({ host, port });
    };

    config = async ({ logger }: ServerConfig) => {
        await this.app.register(apiPlugins);
    };

    close = () => {
        this.app.close();
    };
}

const app = new AppServer(server);
export default app;