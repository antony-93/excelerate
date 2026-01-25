import { IInjection } from "@domain/reload/interfaces/injection";

export type THttpServerConfig = {
    injection: IInjection;
};

export interface IHttpServer {
    config(config: THttpServerConfig): Promise<void>;
    start(host: string, port: number): Promise<void>;
    close(): Promise<void>;
    getServer(): any;
}