import fastify, { FastifyInstance } from "fastify";
import { apiPlugins } from "./plugins";
import { apiMiddlewares } from "./middlewares";
import { Injection } from "../../domain/strategies/reload/injection";

type ServerConfig = {
    logger: boolean;
    injection: Injection;
};

const server = fastify({ logger: false });

class AppServer {
    constructor(private app: FastifyInstance) { }

    start = (host: string, port: number) => {
        return this.app.listen({ host, port });
    };

    config = async ({ injection, logger }: ServerConfig) => {
        await this.app.register(app => {
            apiMiddlewares({ app, injection, logger });
        });

        await this.app.register(apiPlugins);
    };

    close = () => {
        this.app.close();
    };
}

const app = new AppServer(server);
export default app;