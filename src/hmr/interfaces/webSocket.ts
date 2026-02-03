import { ReloadType } from "./reload";

export type TWSReloadMessage = {
    type: ReloadType;
    path: string;
}

export interface IWebSocket {
    connect(): void;
    onMessage(cb: (message: TWSReloadMessage) => void): void;
}