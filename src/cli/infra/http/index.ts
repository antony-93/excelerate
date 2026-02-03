import fastify, { FastifyInstance } from "fastify";
import { IHttpServer, THttpServerConfig } from "@domain/communication/interfaces/httpServer";
import { apiMiddlewares } from "./middlewares";
import { apiPlugins } from "./plugins";

export class FastifyHttpServer implements IHttpServer {
    private retryStart: boolean = false;
    private readonly app: FastifyInstance;

    constructor() {
        this.app = fastify({ 
            logger: false,
            forceCloseConnections: true
        });
    }

    async start(host: string, port: number): Promise<string> {
        try {
            const url = await this.app.listen({ host, port });
            return url;
        } catch(err: any) {
            if (err?.code === 'EADDRINUSE' && !this.retryStart) {
                this.retryStart = true;
                return this.start(host, 0);
            }
            
            throw err;
        }
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