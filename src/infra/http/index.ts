import fastify, { FastifyInstance } from "fastify";
import { IHttpServer, THttpServerConfig } from "@domain/communication/interfaces/httpServer";
import { apiMiddlewares } from "./middlewares";
import { apiPlugins } from "./plugins";

export class FastifyServer implements IHttpServer {
    private readonly app: FastifyInstance;

    constructor() {
        this.app = fastify({ logger: false })
    }

    async start (host: string, port: number) {
        await this.app.listen({ host, port });
    };

    async config({ injection }: THttpServerConfig) {
        await this.app.register(app => {
            apiMiddlewares({ app, injection });
        });

        await this.app.register(apiPlugins);
    };

    close() {
        return this.app.close();
    };

    getServer() {
        return this.app.server;
    }
}