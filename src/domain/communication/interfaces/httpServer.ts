import { IInjection } from "@domain/reload/interfaces/injection";
import { TInternalAssetsConfig } from "./assetsConfig";

export type THttpServerConfig = TInternalAssetsConfig & {
    injection: IInjection;
};

export interface IHttpServer {
    config(config: THttpServerConfig): Promise<void>;
    start(host: string, port: number): Promise<string>;
    close(): Promise<void>;
    getServer(): any;
}