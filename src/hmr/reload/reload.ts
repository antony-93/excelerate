export type TReloadOptions = {
    path: string;
}

export interface IReload {
    execute(options: TReloadOptions): void;
}