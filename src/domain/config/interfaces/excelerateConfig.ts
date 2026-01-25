export type TWatcherConfig = {
    include: string[];
    exclude: string[];
}

export type TServerConfig = {
    port: number;
}

export interface IConfig {
    watcher: TWatcherConfig;
    server: TServerConfig
}

export interface IExcelerateConfig {
    getConfig(): Promise<IConfig>;
}