import fastify, { FastifyInstance } from "fastify";
import { IHttpServer, THttpServerConfig } from "@domain/communication/interfaces/httpServer";
import { apiMiddlewares } from "./middlewares";
import { apiPlugins } from "./plugins";

export class FastifyServer implements IHttpServer {
    private readonly app: FastifyInstance;

    constructor() {
        this.app = fastify({ 
            logger: false,
            forceCloseConnections: true
        });
    }

    start(host: string, port: number) {
        return this.app.listen({ host, port });
    };

    async config({ injection, internalAssetsRoot, internalPrefix }: THttpServerConfig) {
        await Promise.all([
            this.app.register(apiMiddlewares, {
                injection
            }),
            this.app.register(apiPlugins, {
                internalAssetsRoot,
                internalPrefix
            })
        ])
    };

    close() {
        return this.app.close();
    };

    getServer() {
        return this.app.server;
    }
}